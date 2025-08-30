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
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

module.exports = new Reporter({
  async report({ event, options }) {
    // Only run on successful production builds
    if (event.type !== 'buildSuccess' || options.mode !== 'production') {
      return;
    }

    const bundleGraph = event.bundleGraph;
    const bundles = bundleGraph.getBundles();
    
    const seenPackages = new Set();
    const licenses = new Map();

    const promises = [];

    for (const bundle of bundles) {
      bundle.traverseAssets(asset => {
        if (!asset.filePath.includes('node_modules')) {
          return;
        }

        const parts = asset.filePath.split('node_modules/');
        const pathParts = parts[1].split('/');
        const packagePath = pathParts[0].startsWith('@') 
          ? `${pathParts[0]}/${pathParts[1]}`
          : pathParts[0];
        
        if (seenPackages.has(packagePath)) {
          return;
        }
        seenPackages.add(packagePath);

        const pkgJsonPath = path.join(
          options.projectRoot,
          'node_modules',
          packagePath,
          'package.json'
        );

        // Collect Promises
        promises.push((async () => {
          try {
            const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf8'));
            
            if (pkgJson.license) {
              let licenseText = '';
              
              const possibleLicenseFiles = [
                'LICENSE',
                'LICENSE.md',
                'LICENSE.txt',
                'license',
                'license.md',
                'license.txt'
              ];

              for (const filename of possibleLicenseFiles) {
                try {
                  const licensePath = path.join(
                    path.dirname(pkgJsonPath),
                    filename
                  );
                  licenseText = await readFile(licensePath, 'utf8');
                  break;
                } catch (e) {
                  continue;
                }
              }

              licenses.set(packagePath, {
                name: pkgJson.name,
                version: pkgJson.version,
                license: pkgJson.license,
                licenseText
              });
            }
          } catch (err) {
            console.error(`Error processing ${packagePath}:`, err);
          }
        })());
      });
    }

    // Wait for all license processing to complete
    await Promise.all(promises);

    const licenseText = Array.from(licenses.values())
      .map(({ name, version, license, licenseText }) => {
        return `
Package: ${name}@${version}
License: ${license}
${licenseText ? '\n' + licenseText : ''}
----------------------------------------`;
      })
      .join('\n');

    // Ensure dist directory exists
    await mkdir(path.join(options.projectRoot, 'dist'), { recursive: true });

    const outputPath = path.join(options.projectRoot, 'dist', 'vendor-licenses.txt');
    await writeFile(outputPath, licenseText);
  }
});