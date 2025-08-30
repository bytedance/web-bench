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
import { marked } from 'marked'
import matter from 'gray-matter'

function markdown(options = {}) {
  const { language } = options
  
  return {
    name: 'vite:markdown',
    enforce: 'pre',
    
    async resolveId(source, importer, options) {
      // Only process .md files
      if (!source.endsWith('.md')) return null
      
      // If no language is set, use original path
      if (!language) return null
      
      if (!importer) return null
      
      // Get absolute path of original file
      let originalPath
      if (path.isAbsolute(source)) {
        originalPath = source
      } else {
        originalPath = path.resolve(path.dirname(importer), source)
      }
      
      // Construct language-specific path
      const dir = path.dirname(originalPath)
      const basename = path.basename(originalPath)
      const languagePath = path.join(dir, basename.replace('.md', `.${language}.md`))
      
      console.log('languagePath', languagePath)
      
      // Check if language-specific file exists
      try {
        await fs.promises.access(languagePath)
        return languagePath
      } catch {
        // If language-specific file does not exist, return original path
        try {
          await fs.promises.access(originalPath)
          return null // Return null to allow other plugins to continue processing
        } catch {
          return null
        }
      }
    },
    
    // Add handleHotUpdate hook to support HMR
    handleHotUpdate({ file, server }) {
      if (file.endsWith('.md')) {
        server.ws.send({
          type: 'full-reload'
        })
        return []
      }
    },

    transform(code, id) {
      if (id.endsWith('.md')) {
        const dir = path.dirname(id)
        const fileContent = fs.readFileSync(id, 'utf-8')
        
        // Parse frontmatter
        const { data: frontmatter, content } = matter(fileContent)
        
        const imports = new Set()
        let importIndex = 0
        
        const renderer = new marked.Renderer()
        renderer.image = (href, title, text) => {
          if (href.startsWith('http')) {
            return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''}>`
          } else {
            const varName = `_img${importIndex++}`
            const imagePath = path.join(dir, href)
            console.log('md path', imagePath, dir, href)
            imports.add(`import ${varName} from "${imagePath}";`)
            return `<img src="\${${varName}}" alt="${text}"${title ? ` title="${title}"` : ''}>`
          }
        }

        // Use parsed content instead of original fileContent
        const html = marked.parse(content, { renderer })
        
        // Generate final code including frontmatter export
        const code = `
          ${Array.from(imports).join('\n')}
          const html = \`${html}\`;
          export const frontmatter = ${JSON.stringify(frontmatter)};
          export default html;
        `
        
        return {
          code: code
        }
      }
    }
  }
}

export default markdown