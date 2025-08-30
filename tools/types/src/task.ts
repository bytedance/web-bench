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

import { IRunner } from './runner'

export interface Task {
  /**
   * task ID
   */
  id: string
  /**
   * index, range (0, tasks.length in tasks.jsonl)
   */
  index: number
  /**
   * task description
   */
  description: string
  /**
   * date, format "YYYY-MM-DD"
   * example: 2024-10-25
   */
  date: string
  /**
   * level
   */
  level: 'easy' | 'challenging' | 'moderate'
  /**
   * task context
   */
  context?: string[]
  /**
   * validate by test case
   */
  testcase?: string[]
  /**
   * is init task
   */
  isInit: boolean
}

export interface TaskResultSnippet {
  /**
   * is success
   */
  success: boolean
  /**
   * request
   */
  request?: string
  /**
   * screenshot
   */
  screenshot?: string
  /**
   * response
   */
  response?: Record<string, string>
  /**
   * input token
   */
  inputTokens?: number
  /**
   * output token
   */
  outputTokens?: number
  /**
   * errorMessage
   */
  errorMessage?: string
  /**
   * trajectory
   */
  trajectory?: string
}

export interface TaskSnippet {
  /**
   * task ID
   */
  id: string
  /**
   * description
   */
  description: string
  /**
   * input token
   */
  inputTokens?: number
  /**
   * output token
   */
  outputTokens?: number
  /**
     * Snapshot of each execution result (may execute multiple times)
     */
  result: TaskResultSnippet[]
}

/**
 * Task runner definition
 */
export interface ITaskRunner extends IRunner {
  /**
   * value
   */
  task: Task
  /**
     * Current execution information
     */
  executeInfo?: {
    /**
       * Execution count
       */
    times: number
  }
}
