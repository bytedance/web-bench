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

import { Response } from 'node-fetch'
import { ScheduleTask } from '../type'
import { LLMOption } from './base'
import { OpenAILLM } from './openai'
import axios, { AxiosRequestConfig } from 'axios'
import axiosRetry from 'axios-retry'

export class Doubao extends OpenAILLM {
  provider = 'doubao'

  option: LLMOption = {
    contextLength: 10_000,
    maxTokens: 1024 * 4,
    apiBase: 'https://ark.cn-beijing.volces.com/api/v3/',
  }

  public checkLimit: (_: { runningTask: ScheduleTask[] }) => boolean = ({ runningTask }) => {
    return runningTask.length < 10
  }

  public async fetch(url: RequestInfo | URL, originInit: RequestInit = {}): Promise<Response> {
    const client = axios.create()

    // Configure retry mechanism
    axiosRetry(client, {
      retries: 3, // Number of retries
      retryDelay: (retryCount) => {
        return retryCount * 1000 // Retry delay time
      },
      retryCondition: (error) => {
        // Retry only on network or TLS errors
        return (
          axiosRetry.isNetworkOrIdempotentRequestError(error) ||
          error.message.includes('Client network socket disconnected')
        )
      },
    })

    const res = await client.post(url.toString(), JSON.parse(originInit.body?.toString() || '{}'), {
      headers: originInit.headers as AxiosRequestConfig['headers'],
    })

    return {
      async json() {
        return res.data
      },
    } as Response
  }
}
