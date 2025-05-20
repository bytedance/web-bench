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

export type ModelProvider = 'anthropic' | 'openrouter' | 'openai' | 'doubao' | 'deepseek' | 'aliyun' | 'ollama'

export interface Model {
  model: string
  provider: ModelProvider
  apiKey: string
  title: string
  apiBase?: string
  stream?: boolean
  extendThinking?: boolean
  useLegacyCompletionsEndpoint?: boolean
}

export interface AgentResponse {
  // Code files, key is filePath, value is fileContent
  files: Record<string, string>

  // [filePath:string]: string  Poor Extension
}

export interface AgentRequest {
  type: 'normal' | 'init'

  task: string

  // Code files, key is filePath, value is fileContent
  files?: Record<string, string>

  // Error context
  error?: string
}

/**
 * evaluation 事件参数定义
 * key 为事件名，value 为回调参数
 */
export interface AgentEvent {
  /**
   * llm，网络请求，回调第一参数为 request, 第二参数为 response
   */
  onRequest: [string, string]
  /**
   * log 事件
   */
  log: ['info' | 'warn' | 'error' | 'debug', string]
}

export interface IAgent {
  /**
   * Agent 唯一索引
   */
  key?: string
  /**
   * 关联的 model
   */
  model?: Model

  /**
   * 事件 emit
   */
  emitter?: EventEmitter<AgentEvent>

  /**
   * endpoint
   */
  endpoint?: string

  /**
   * 请求接口
   */
  request: (req: AgentRequest) => Promise<AgentResponse>
  /**
   * clone agent
   */
  clone?: () => IAgent
}
