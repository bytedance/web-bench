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

  // count input tokens and output tokens
  inputTokens?: number
  outputTokens?: number

  // [filePath:string]: string  Poor Extension

  // Return the trajectory of the agent
   
  trajectory?: string
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
   * Evaluation event parameter definition
   * key is event name, value is callback parameter
   */
export interface AgentEvent {
  /**
     * LLM network request, first callback parameter is request, second is response
     */
  onRequest: [string, string]
  /**
     * Log event
     */
  log: ['info' | 'warn' | 'error' | 'debug', string]
}

export interface IAgent {
  /**
     * Agent unique index
     */
  key?: string
  /**
     * Associated model
     */
  model?: Model

  /**
     * Event emit
     */
  emitter?: EventEmitter<AgentEvent>

  /**
   * endpoint
   */
  endpoint?: string

  /**
     * Request interface
     */
  request: (req: AgentRequest) => Promise<AgentResponse>
  /**
   * clone agent
   */
  clone?: () => IAgent
}
