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

import { AgentEvent, AgentRequest, AgentResponse, IAgent } from '@web-bench/evaluator-types'
import EventEmitter from 'events'
import { HTTPLimit } from './limit'

export class HttpAgent implements IAgent {
  public endpoint: string

  public emitter = new EventEmitter<AgentEvent>()

  constructor(api: string) {
    this.endpoint = api
  }

  public get key() {
    return this.endpoint
  }

  public  async fetch(req: AgentRequest) {
    return await HTTPLimit.limit(() => fetch(new URL(this.endpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    })) 
  }

  async request(req: AgentRequest): Promise<AgentResponse> {
    let res: Response | undefined

    try {
      res = await fetch(new URL(this.endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req),
      })
    } catch (error) {
      console.log('error', error)
    }

    if (res) {
      if (res.status !== 200) {
        throw Error(
          `HTTP client error: error code: ${res.status}, error message: ${res.statusText}`
        )
      }

      const data: AgentResponse = await res.json()
      this.emitter.emit('onRequest', JSON.stringify(req), JSON.stringify(data))

      return data
    }

    return {
      files: {},
    }
  }

  clone = () => {
    return new HttpAgent(this.endpoint)
  }
}
