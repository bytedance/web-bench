// Copyright (c) 2023-2024 Continue Dev, Inc.
// Copyright (c) 2025 Bytedance Ltd.
// SPDX-License-Identifier: Apache-2.0
//
// This file has been modified by Bytedance Ltd on AnthropicLLM
//
// Original file was released under Apache-2.0, with the full license text
// available at https://github.com/continuedev/continue?tab=Apache-2.0-1-ov-file.
//
// This modified file is released under the same license.

import { ChatMessage, CompletionOptions } from '@web-bench/evaluator-types'
import { streamSse } from '../utils/stream'
import { BaseLLM } from './base'
import { ScheduleTask } from '../type'
const extendThinkingModel = ['claude-3-7-sonnet-latest']

export class AnthropicLLM extends BaseLLM {
  provider = 'anthropic'

  option = {
    model: 'claude-3-5-sonnet-20240620',

    contextLength: 1_000_000,

    extendThinking: false,

    temperature: 1,

    maxTokens: 100 * 1024,

    apiBase: 'https://api.anthropic.com/v1/',
  }

  async chat(
    messages: ChatMessage[],
    options: CompletionOptions
  ): Promise<{
    request: string
    response: string
  }> {
    const option = {
      ...options,
      stream: false,
      maxTokens: this.option.maxTokens,
    }
    const system = messages.find((msg) => msg.role === 'system')
    const body = JSON.stringify({
      ...this.convertArgs(option),
      messages: messages.filter((r) => r.role !== 'system'),
      system: system?.content,
      thinking:
        this.info.extendThinking && extendThinkingModel.includes(option.model)
          ? {
              type: 'enabled',
              budget_tokens: Math.round((options.maxTokens || this.option.maxTokens) * 0.8),
            }
          : undefined,
    })

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': this.info.apiKey,
        //   ...(shouldCacheSystemMessage || this.cacheBehavior?.cacheConversation
        // 	? { "anthropic-beta": "prompt-caching-2024-07-31" }
        // 	: {}),
      },
      body,
    }

    const response = await this.fetch(new URL('messages', this.option.apiBase), request)

    if (option.stream === false) {
      const value = await response.json()

      return {
        request: body,
        response: value?.content?.pop()?.text || '',
      }
    }

    let res = ''

    for await (const value of streamSse(response)) {
      if (value.type == 'message_start') {
        continue
      }
      if (value.delta?.text) {
        res += value.delta.text
      }
    }

    return {
      request: body,
      response: res,
    }
  }

  public convertArgs(options: CompletionOptions): CompletionOptions {
    const finalOptions = {
      top_k: options.topK,
      top_p: options.topP,
      temperature: options.temperature || this.option.temperature,
      max_tokens: options.maxTokens ?? 100 * 1024,
      model: options.model === 'claude-2' ? 'claude-2.1' : options.model,
      stop_sequences: options.stop?.filter((x) => x.trim() !== ''),
      stream: options.stream ?? true,
    }

    return finalOptions
  }

  public countToken = async (messages: ChatMessage[]): Promise<number> => {
    const system = messages.find((msg) => msg.role === 'system')

    const response = await this.fetch(new URL('messages/count_tokens', this.option.apiBase), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': this.info.apiKey,
      },
      body: JSON.stringify({
        messages: messages.filter((r) => r.role !== 'system'),
        system: system?.content,
        model: this.info.model,
      }),
    })

    const json = await response.json()
    return json.input_tokens
  }

  public checkLimit = ({ runningTask }: { runningTask: ScheduleTask[] }): boolean => {
    // Leave 20% buffer
    const RPM = 2_000 * 0.8
    const ITPM = 160_000 * 0.8
    const OTPM = 32000 * 0.8

    const now = +Date.now()

    // Tasks requested in the past minute
    const recentTasks = runningTask.filter((t) => now - t.requestTime <= 1000 * 60)

    if (recentTasks.length > RPM) {
      return false
    }

    const inputTokens = recentTasks.reduce((pre, cur) => {
      return pre + cur.inputTokens
    }, 0)

    const outputTokens = recentTasks.reduce((pre, cur) => {
      return pre + cur.outputTokens
    }, 0)

    return inputTokens < ITPM && outputTokens < OTPM
  }
}
