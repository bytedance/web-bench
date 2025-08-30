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

const marked = require('marked');
const matter = require('gray-matter');

module.exports = function(source) {
  // Store found image paths and corresponding variable names
  const images = new Map();
  let imageCount = 0;
  
  // Custom renderer to capture and process images
  const renderer = new marked.Renderer();
  renderer.image = function({ href, title, text }) {
    if (href && !href.startsWith('http')) {
      // Generate unique variable name for each local image
      const varName = `img${imageCount}`;
      images.set(href, varName);
      imageCount++;
      // Directly return image tag using variable
      return `<img src="\${${varName}}" alt="${text}"${title ? ` title="${title}"` : ''}>`;
    }
    // For external images, keep as original
    return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''}>`;
  };

  // Use gray-matter to parse frontmatter and content
  const { data: frontmatter, content } = matter(source);
  const html = marked.parse(content, { renderer });

  // Generate image imports
  const imports = Array.from(images.entries())
    .map(([path, varName]) => `import ${varName} from ${JSON.stringify(path)};`)
    .join('\n');

  // Export processed content
  return `
    ${imports}
    const html = \`${html}\`;
    export const frontmatter = ${JSON.stringify(frontmatter)};
    export default html;
  `;
}