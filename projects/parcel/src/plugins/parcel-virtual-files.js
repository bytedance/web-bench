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

const { Resolver } = require('@parcel/plugin');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

module.exports = new Resolver({
  async resolve({specifier, dependency, options}) {
    // Only handle ~files imports
    if (specifier !== '~files') {
      return null;
    }

    const cwd = options.projectRoot
    const files = glob.sync('src/files/**/*.ts', {cwd, absolute: true});

    const filePath = path.join(options.projectRoot, 'src/virtual-files.js')

    const imports = files.map((file, i) => 
      `import * as file${i} from './${path.relative(path.dirname(filePath), file)}';`
    ).join('\n');
    
    const exports = files.map((file, i) => 
      `  "${path.basename(file)}": file${i},`
    ).join('\n');

    const code = `${imports}
    
export default {
${exports}
};`;

    // Create virtual module
    return {
      filePath,
      code,
      invalidateOnFileChange: files
    };
  }
});