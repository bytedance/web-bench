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

const path = require('path');
const fs = require('fs');

class LicenseExtractorPlugin {
  constructor(options = {}) {
    this.filename = options.filename || 'vendor-licenses.txt';
  }

  apply(compiler) {
    compiler.hooks.done.tap('LicenseExtractorPlugin', (stats) => {
      const modules = stats.compilation.modules;
      const licenses = new Map();

      // Iterate through all modules
      modules.forEach(module => {
        if (module.resource && module.resource.includes('node_modules')) {
          const packagePath = this.findPackageJson(module.resource);
          if (packagePath) {
            try {
              const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
              const packageInfo = {
                name: packageJson.name,
                version: packageJson.version,
                license: packageJson.license || 'Unknown',
                author: packageJson.author ? 
                  (typeof packageJson.author === 'string' ? packageJson.author : packageJson.author.name)
                  : 'Unknown'
              };
              // Use package@version as unique identifier
              const packageKey = `${packageJson.name}@${packageJson.version}`;
              licenses.set(packageKey, packageInfo);
            } catch (error) {
              console.warn(`Failed to read package information: ${packagePath}`);
            }
          }
        }
      });

      // Generate license text
      let licenseText = '# Third Party Licenses\n\n';
      // Sort by package name to ensure stable output
      const sortedEntries = Array.from(licenses.entries()).sort(([keyA], [keyB]) => keyA.localeCompare(keyB));
      
      sortedEntries.forEach(([packageKey, pkg]) => {
        licenseText += `## ${packageKey}\n`;
        licenseText += `- License: ${pkg.license}\n`;
        licenseText += `- Author: ${pkg.author}\n\n`;
      });

      // Write to file
      const outputPath = path.join(compiler.options.output.path, this.filename);
      fs.mkdirSync(compiler.options.output.path, { recursive: true });
      fs.writeFileSync(outputPath, licenseText);
    });
  }

  findPackageJson(modulePath) {
    let currentDir = path.dirname(modulePath);
    const rootDir = path.parse(currentDir).root;

    while (currentDir !== rootDir) {
      const packagePath = path.join(currentDir, 'package.json');
      if (fs.existsSync(packagePath)) {
        return packagePath;
      }
      currentDir = path.dirname(currentDir);
    }
    return null;
  }
}

module.exports = LicenseExtractorPlugin;