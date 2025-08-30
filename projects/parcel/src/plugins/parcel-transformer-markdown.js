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
const marked = require('marked');
const matter = require('gray-matter');
const path = require('path')

exports.default = new Transformer({
  async transform({ asset }) {
    // Only process .md files
    if (asset.type !== 'md') {
      return [asset];
    }

    const dir = path.dirname(asset.filePath)

    // Get markdown content
    const source = await asset.getCode();
    
    // Parse frontmatter
    const { data: frontmatter, content } = matter(source);
    
    const imports = new Set()
    let importIndex = 0
    
    const renderer = new marked.Renderer()
    renderer.image = (href, title, text) => {
        if (href.startsWith('http')) {
        return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''}>`
        } else {
        const varName = `_img${importIndex++}`
        imports.add(`import ${varName} from "${href}";`)
        return `<img src="\${${varName}}" alt="${text}"${title ? ` title="${title}"` : ''}>`
        }
    }

    // Use parsed content instead of original fileContent
    const html = marked.parse(content, { renderer })
    
    // Generate final code, including frontmatter export
    const code = `
        ${Array.from(imports).join('\n')}
        const html = \`${html}\`;
        export const frontmatter = ${JSON.stringify(frontmatter)};
        export default html;
    `

    // Set new code and type
    asset.type = 'js';
    asset.setCode(code);

    return [asset];
  }
});