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

import { defineConfig } from 'vite'
import IstanbulPlugin from 'vite-plugin-istanbul'

const PROJECT_DIR = process.env.EVAL_PROJECT_ROOT || 'src'
const PORT = process.env.EVAL_PROJECT_PORT || 3211

// https://vite.dev/config/
export default defineConfig({
  root: PROJECT_DIR,
  server: {
    port: +PORT,
    host: 'localhost',
    watch: process.env.EVAL ? null : undefined,
  },
  build: {
    rollupOptions: {
      input: PROJECT_DIR + '/index.html',
    },
  },
  plugins: [
    IstanbulPlugin({
      include: 'src/**/*.{js,ts,jsx,tsx}',
      exclude: ['node_modules', 'test/'],
      extension: [ '.js', '.ts', '.vue', '.jsx', '.tsx' ],
      cypress: false,
      requireEnv: false, // 插桩总是启用（也可只在特定 env 启用）
    }),
  ],
})
