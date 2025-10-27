// Copyright (c) 2023-2024 Continue Dev, Inc.
// Copyright (c) 2025 Bytedance Ltd.
// SPDX-License-Identifier: Apache-2.0
//
// This file has been modified by OpenAILLM Ltd on AnthropicLLM
//
// Original file was released under Apache-2.0, with the full license text
// available at https://github.com/continuedev/continue?tab=Apache-2.0-1-ov-file.
//
// This modified file is released under the same license.

import { ChatMessage, CompletionOptions, MessageContent } from '@web-bench/evaluator-types'
import { Model, ScheduleTask } from '../type'
import { streamSse, streamSseArray } from '../utils/stream'
import { BaseLLM, LLMOption } from './base'

export function stripImages(content: MessageContent): string {
  if (Array.isArray(content)) {
    return content
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n')
  }
  return content
}

const CHAT_ONLY_MODELS = [
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k',
  'gpt-4',
  'gpt-4-turbo',
  'gpt-4o',
  'gpt-35-turbo-16k',
  'gpt-35-turbo-0613',
  'gpt-35-turbo',
  'gpt-4-32k',
  'gpt-4-turbo-preview',
  'gpt-4-vision',
  'gpt-4-0125-preview',
  'gpt-4-1106-preview',
  'gpt-4o-mini',
]

const NON_CHAT_MODELS = [
  'text-davinci-002',
  'text-davinci-003',
  'code-davinci-002',
  'text-ada-001',
  'text-babbage-001',
  'text-curie-001',
  'davinci',
  'curie',
  'babbage',
  'ada',
]

export class OpenAILLM extends BaseLLM {
  maxStopWords?: number
  apiType?: string

  public useLegacyCompletionsEndpoint: boolean | undefined = undefined
  option: LLMOption = {
    contextLength: 1_000_000,
    maxTokens: 1024 * 100,
    temperature: 0.4,
    apiBase: 'https://openrouter.ai/api/v1/',
  }

  provider: string = 'openai'

  apiVersion: string
  constructor(info: Model) {
    super(info)
    this.apiVersion = '2023-07-01-preview'
  }

  supportsCompletions(): boolean {
    if (['openai', 'azure'].includes(this.provider)) {
      if (
        this.apiBase?.includes('api.groq.com') ||
        this.apiBase?.includes('api.mistral.ai') ||
        this.apiBase?.includes(':1337') ||
        this.apiBase?.includes('integrate.api.nvidia.com') ||
        this.useLegacyCompletionsEndpoint?.valueOf() === false
      ) {
        // Jan + Groq + Mistral don't support completions : (
        // Seems to be going out of style...
        return false
      }
    }
    if (['groq', 'mistral', 'deepseek'].includes(this.provider)) {
      return false
    }
    return true
  }

  protected async *_legacystreamComplete(
    prompt: string,
    options: CompletionOptions
  ): AsyncGenerator<string> {
    const args: any = this._convertArgs(options, [])
    args.prompt = prompt
    args.messages = undefined

    const response = await this.fetch(this._getEndpoint('completions'), {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify({
        ...args,
        stream: true,
      }),
    })

    for await (const value of streamSse(response)) {
      if (value.choices?.[0]?.text && value.finish_reason !== 'eos') {
        yield value.choices[0].text
      }
    }
  }

  async chat(
    messages: ChatMessage[],
    originOptions: CompletionOptions
  ): Promise<{
    request: string
    response: string
    error?: string
  }> {
    const options = {
      ...originOptions,
      maxTokens: this.option.maxTokens,
      model: this.info.model,
      stream: this.info.stream || false,
    }
    if (
      !CHAT_ONLY_MODELS.includes(this.info.model) &&
      this.supportsCompletions() &&
      (NON_CHAT_MODELS.includes(this.info.model) || this.useLegacyCompletionsEndpoint)
    ) {
      let res = ''
      for await (const content of this._legacystreamComplete(
        stripImages(messages[messages.length - 1]?.content || ''),
        options
      )) {
        res += content
      }
      return {
        request: '',
        response: res,
      }
    }

    const body = this._convertArgs(options, messages)

    const response = await this.fetch(this._getEndpoint('chat/completions'), {
      method: 'POST',
      headers: this._getHeaders(),
      body: JSON.stringify(body, undefined, 2),
    })

    if (body.stream === false) {
      const data = await response.json()

      if (data.error?.message) {
        throw new Error(data.error?.message)
      }

      const res = data.choices?.[0]?.message?.content

      return {
        request: JSON.stringify(body),
        response: res,
      }
    }

    const { content, error } = await streamSseArray(
      response,
      (value) => value.choices?.[0]?.delta?.content
    )
    // console.log('content', content)

    return {
      request: JSON.stringify(body),
      response: content,
      error: error,
    }
  }

  protected _getEndpoint(endpoint: 'chat/completions' | 'completions' | 'models') {
    // if (this.apiType === "azure") {
    //   return new URL(
    //     `openai/deployments/${this.engine}/${endpoint}?api-version=${this.apiVersion}`,
    //     this.apiBase
    //   );
    // }
    if (!this.apiBase) {
      throw new Error("No API base URL provided. Please set the 'apiBase' option in config.json")
    }

    return new URL(endpoint, this.apiBase)
  }

  protected _convertMessage(message: ChatMessage) {
    if (typeof message.content === 'string') {
      return message
    } else if (!message.content.some((item) => item.type !== 'text')) {
      // If no multi-media is in the message, just send as text
      // for compatibility with OpenAI "compatible" servers
      // that don't support multi-media format
      return {
        ...message,
        content: message.content.map((item) => item.text).join(''),
      }
    }

    const parts = message.content.map((part) => {
      const msg: any = {
        type: part.type,
        text: part.text,
      }
      if (part.type === 'imageUrl') {
        msg.image_url = { ...part.imageUrl, detail: 'low' }
        msg.type = 'image_url'
      }
      return msg
    })
    return {
      ...message,
      content: parts,
    }
  }

  protected _convertModelName(model: string): string {
    return model
  }

  private isO1Model(model?: string): boolean {
    return !!model && (model.indexOf('o1-preview') !== -1 || model.indexOf('o1-mini') !== -1)
  }

  protected _convertArgs(options: any, messages: ChatMessage[]) {
    const url = new URL(this.info.apiBase || this.option.apiBase)
    const finalOptions: any = {
      messages: messages.map(this._convertMessage),
      model: this._convertModelName(options.model),
      max_tokens: options.maxTokens,
      temperature: options.temperature || this.option.temperature,
      top_p: options.topP,
      frequency_penalty: options.frequencyPenalty,
      presence_penalty: options.presencePenalty,
      stream: options.stream ?? true,
      stop:
        // Jan + Azure OpenAI don't truncate and will throw an error
        this.maxStopWords !== undefined
          ? options.stop?.slice(0, this.maxStopWords)
          : url.host === 'api.deepseek.com'
            ? options.stop?.slice(0, 16)
            : url.port === '1337' ||
                url.host === 'api.openai.com' ||
                url.host === 'api.groq.com' ||
                this.apiType === 'azure'
              ? options.stop?.slice(0, 4)
              : options.stop,
    }

    // OpenAI o1-preview and o1-mini:
    if (this.isO1Model(options.model)) {
      // a) use max_completion_tokens instead of max_tokens
      finalOptions.max_completion_tokens = options.maxTokens
      finalOptions.max_tokens = undefined

      // b) don't support streaming currently
      finalOptions.stream = false

      // c) don't support system message
      finalOptions.messages = finalOptions.messages?.filter(
        (message: any) => message?.role !== 'system'
      )
    }

    return finalOptions
  }

  protected _getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.info.apiKey}`,
      'api-key': this.info.apiKey ?? '', // For Azure
    }
  }

  public checkLimit: (_: { runningTask: ScheduleTask[] }) => boolean = ({ runningTask }) => {
    // Set the maximum number of parallel tasks to 15. This value is currently a placeholder and can be adjusted as needed.
    return runningTask.length <= 15
  }
}
