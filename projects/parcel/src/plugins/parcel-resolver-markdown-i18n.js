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

module.exports = new Resolver({
  async resolve({ specifier, options, dependency }) {
    // Only handle .md files
    if (!specifier.endsWith('.md')) {
      return null;
    }

    // Get language setting, default to 'zh'
    const language = options.env.language || 'zh';
    
    // Build possible localized file paths
    const dir = path.dirname(dependency.resolveFrom);
    const basename = path.basename(specifier, '.md');
    const localizedPath = path.join(dir, `${basename}.${language}.md`);
    
    // Check if localized file exists
    try {
      await fs.promises.access(localizedPath);
      // If localized file exists, return the file path
      return {
        filePath: localizedPath,
      };
    } catch (err) {
      // If localized file doesn't exists, return the original file path
      return {
        filePath: path.join(dir, specifier),
      };
    }
  }
});