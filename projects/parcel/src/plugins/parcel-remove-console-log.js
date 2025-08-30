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

const { Transformer } = require('@parcel/plugin');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

module.exports = new Transformer({
  async transform({ asset }) {
    if (asset.type !== 'js') return [asset];

    if (asset.filePath.includes('node_modules')) {
      return [asset]
    }

    let code = await asset.getCode();
    
    // Parse code to generate AST
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'] // Support JSX and TypeScript
    });

    // Traverse AST to find and remove console.log
    traverse(ast, {
      CallExpression(path) {
        if (
          path.node.callee.type === 'MemberExpression' &&
          path.node.callee.object.name === 'console' &&
          path.node.callee.property.name === 'log'
        ) {
          path.remove();
        }
      }
    });

    // Generate code
    const output = generate(ast, {}, code);
    asset.setCode(output.code);
    
    return [asset];
  }
});