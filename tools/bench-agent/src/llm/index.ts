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

import { Model } from '../type'
import { Aliyun } from './aliyun'
import { AnthropicLLM } from './anthropic'
import { BaseLLM } from './base'
import { DeepseekLLM } from './deepseek'
import { Doubao } from './doubao'
import { Ollama } from './ollama'
import { OpenAILLM } from './openai'
import { OpenRouter } from './openrouter'

export class LLMFactory {
  static createLLM(info: Model): BaseLLM {
    switch (info.provider) {
      case 'anthropic': {
        return new AnthropicLLM(info)
      }
      case 'openrouter': {
        return new OpenRouter(info)
      }
      case 'openai': {
        return new OpenAILLM(info)
      }
      case 'deepseek': {
        return new DeepseekLLM(info)
      }
      case 'doubao': {
        return new Doubao(info)
      }
      case 'aliyun': {
        return new Aliyun(info)
      }
      case 'ollama': {
        return new Ollama(info)
      }
      default:
        throw Error(`Unknown provider: ${info.provider}`)
    }
  }
}
