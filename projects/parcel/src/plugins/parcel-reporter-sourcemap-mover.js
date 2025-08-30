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

const { Reporter } = require('@parcel/plugin');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const copyFile = promisify(fs.copyFile);
const unlink = promisify(fs.unlink);

module.exports = new Reporter({
  async report({ event, options }) {
    // Only execute after production build is complete
    if (event.type !== 'buildSuccess' || options.mode !== 'production') {
      return;
    }

    const { bundleGraph } = event;
    const bundles = bundleGraph.getBundles();
    
    // Create sourcemaps directory
    const projectRoot = options.projectRoot;
    const sourcemapsDir = path.join(projectRoot, 'sourcemaps');
    
    try {
      await mkdir(sourcemapsDir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') {
        console.error('Failed to create sourcemaps directory:', err);
        throw err;
      }
    }

    // Process each bundle containing source maps
    for (const bundle of bundles) {
      const filePath = bundle.filePath;
      const mapPath = `${filePath}.map`;
      
      // Check if source map file exists
      try {
        await fs.promises.access(mapPath, fs.constants.F_OK);
      } catch (err) {
        // No source map file, skip
        continue;
      }

      const distDir = path.join(projectRoot, 'dist')

      const relativePath = path.relative(distDir, filePath);
      const targetMapDir = path.join(sourcemapsDir, path.dirname(relativePath));
      const targetMapPath = path.join(sourcemapsDir, relativePath) + '.map';

      // Ensure target directory exists
      await mkdir(targetMapDir, { recursive: true });
      
      // Copy source map file to new location
      await copyFile(mapPath, targetMapPath);
      
      // Delete original source map file
      await unlink(mapPath);
      
      // Update sourceMappingURL comments in JS/CSS files
      if (bundle.type === 'js' || bundle.type === 'css') {
        let content = await readFile(filePath, 'utf8');
        
        // Remove existing sourceMappingURL comment based on file type
        if (bundle.type === 'js') {
          content = content.replace(/\/\/# sourceMappingURL=.*$/m, '');
        } else if (bundle.type === 'css') {
          content = content.replace(/\/\*# sourceMappingURL=.*\*\/$/m, '');
        }
        
        // Add new sourceMappingURL comment
        const sourcemapRelativePath = relativePath + '.map';
        const sourcemapUrl = `https://internal.com/sourcemaps/${sourcemapRelativePath.replace(/\\/g, '/')}`;
        
        // According to file type add appropriate comment
        if (bundle.type === 'js') {
          content += `\n//# sourceMappingURL=${sourcemapUrl}\n`;
        } else if (bundle.type === 'css') {
          content += `\n/*# sourceMappingURL=${sourcemapUrl} */\n`;
        }
        
        // Write back to file
        await writeFile(filePath, content);
      }
    }
    
    console.log('Source map files have been moved to sourcemaps directory and reference links have been updated.');
  }
});