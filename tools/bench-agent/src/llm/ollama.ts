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

import { ChatMessage, CompletionOptions } from '@web-bench/evaluator-types'
import { ScheduleTask } from '../type'
import { LLMOption } from './base'
import { BaseLLM } from './base'
import { stripImages } from './openai'

/**
 * Visit https://bailian.console.aliyun.com/#/model-market to get more models.
 */
export class Ollama extends BaseLLM {
  provider = 'ollama'

  option: LLMOption = {
    contextLength: 10_000_000,
    maxTokens: 1024 * 100,
    apiBase: 'http://localhost:11434/api/chat',
  }

  public checkLimit: (_: { runningTask: ScheduleTask[] }) => boolean = ({ runningTask }) => {
    return runningTask.length < 10
  }

  public countToken = async (compiledMessages: ChatMessage[]): Promise<number> => {
    return 0
  }

  public async chat(
    messages: ChatMessage[],
    options: CompletionOptions
  ): Promise<{ request: string; error?: string; response: string }> {
    const option = {
      ...options,
      maxTokens: this.option.maxTokens,
    }
    const body = JSON.stringify({
      messages: messages.map((r) => {
        return { role: r.role, content: stripImages(r.content) }
      }),
      stream: false,
      model: this.info.model,
      option: option,
    })

    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body,
    }

    const response = await this.fetch(new URL(this.info.apiBase || this.option.apiBase), request)

    const value = await response.json()

    return {
      request: body,
      response: value.message.content,
    }
  }
}
