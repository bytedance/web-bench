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

import fs from 'node:fs'
import path from 'node:path'

const VIRTUAL_MODULE_ID = '~files'
const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

export default function virtualFiles() {
  return {
    name: 'virtual-files',
    
    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        const filesDir = path.resolve(process.cwd(), 'src/files')
        
        // Ensure directory exists
        if (!fs.existsSync(filesDir)) {
          return 'export default {}'
        }

        const files = fs.readdirSync(filesDir)
        const imports = []
        const exports = []

        files.forEach((file, index) => {
          if (file.endsWith('.ts') || file.endsWith('.js')) {
            const absFilePath = path.join(filesDir, file)
            const name = path.basename(file, path.extname(file))
            imports.push(`import * as file${index} from '${absFilePath}'`)
            exports.push(`  ${name}: file${index}`)
          }
        })

        return `${imports.join('\n')}\n\nexport default {\n${exports.join(',\n')}\n}`
      }
    }
  }
}