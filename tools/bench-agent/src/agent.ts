// Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import { EventEmitter } from 'events'
import { appendFile } from 'node:fs/promises'
import path from 'node:path'
import {
  AgentEvent,
  AgentRequest,
  AgentResponse,
  ChatMessage,
  IAgent,
  MessagePart,
} from '@web-bench/evaluator-types'
import { LLMFactory } from './llm'
import { getSystemMessage } from './prompt'
import { Model, BenchAgentConfig } from './type'
import { MarkdownParser } from './utils/markdown'
import { compileChatMessages, stripImages } from './utils/token'
import { schedule } from './schedule'

export class BenchAgent implements IAgent {
  public model: Model

  public config: BenchAgentConfig

  public emitter = new EventEmitter<AgentEvent>()

  constructor(model: Model, config: Partial<BenchAgentConfig> = {}) {
    this.model = model
    this.config = { model: model.model, ...config }
  }

  public get key() {
    return this.model.title
  }

  public getMessages(req: AgentRequest): ChatMessage[] {
    const res: MessagePart[] = []

    const { files = {}, error, task } = req

    for (const filePath of Object.keys(files)) {
      res.push({
        type: 'text',
        text: '```' + filePath + '\n' + files[filePath] + '\n' + '```',
      })
    }

    res.push({
      type: 'text',
      text: `${task} \n Do not compress the original code in file and return full file.`,
    })

    if (error) {
      res.push({
        type: 'text',
        text: `I got the following error, please help me to fix error and apply changes to origin files, return the full files about  ${Object.keys(files).join()} for me. And always include filename with the absolute path in any code block you generate based on that file. \n${error}`,
      })
    } else {
      res.push({
        type: 'text',
        text: 'I only want the returned results to contain code, without any explanations.',
      })
    }

    return [
      {
        role: 'user',
        content: res,
      },
    ]
  }

  public async request(req: AgentRequest): Promise<AgentResponse> {
    const model = this.model

    const messages = this.getMessages(req)

    if (!model) {
      throw new Error(`Model ${this.config.model} not found, please check config.json`)
    }

    const llm = LLMFactory.createLLM(model)

    // 出错再试 3 次
    let requestTimes = 3

    let agentRes

    const compiledMessages: ChatMessage[] = [
      {
        role: 'system',
        content: getSystemMessage(),
      },
      ...compileChatMessages(
        model.model,
        messages,
        llm.option.contextLength,
        llm.option.maxTokens,
        true
      ),
    ]

    const inputToken = await llm.countToken(compiledMessages)

    this.emitter.emit('log', 'debug', 'inputTokenCount: ' + inputToken)

    while (requestTimes > 0) {
      try {
        this.emitter.emit('log', 'debug', 'scheduleTask start')
        await schedule.scheduleTask(
          {
            llm,
            inputToken,
            outputToken: llm.option.maxTokens,
            run: async () => {
              agentRes = await llm.chat(compiledMessages, this.config)
            },
          },
          (messages: string) => {
            this.emitter.emit('log', 'debug', messages)
          }
        )

        break
      } catch (error) {
        requestTimes--

        if (requestTimes === 0) {
          throw new Error(error as string)
        }
        console.error('Request error', error)
      }
    }

    if (agentRes) {
      const { request, error, response } = agentRes
      await appendFile(
        path.join(__dirname, 'request.log'),
        [JSON.stringify(request), JSON.stringify(response)].join('\n'),
        {
          encoding: 'utf-8',
        }
      )

      if (error) {
        throw new Error(`Error in BenchAgent: ${error}`)
      }

      this.emitter.emit('onRequest', request, response)

      const snippets = MarkdownParser.parseMarkdownCodeBlocks(response)

      const files: Record<string, string> = {}

      snippets.forEach((snippet) => {
        files[snippet.filename] = snippet.code
      })
      return {
        files,
      }
    }
    return {
      files: {},
    }
  }

  public getCompiledMessages(
    ctx: {
      model: string
      contextLength: number
      maxTokens: number
    } & AgentRequest
  ): ChatMessage[] {
    const { model, contextLength, maxTokens } = ctx

    const messages = this.getMessages(ctx)

    return [
      {
        role: 'system',
        content: getSystemMessage(),
      },
      {
        role: 'user',
        content: compileChatMessages(model, messages, contextLength, maxTokens, true)
          .map((item) => stripImages(item.content))
          .join(''),
      },
    ]
  }

  public clone: () => IAgent = () => {
    return new BenchAgent(this.model, this.config)
  }
}
