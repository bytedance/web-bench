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

import path from 'node:path';
import fs from 'node:fs/promises';

// Modification: Helper function to clean paths added handling for null characters
function cleanModulePath(modulePath) {
  // Remove null characters and query parameters
  return modulePath
    .replace(/\0/g, '') // Remove null characters \0 or \x00
    .split('?')[0];     // Remove query parameters
}

// Modify to async function
async function findPackageJson(modulePath) {
  // Ensure cleaned path is used
  let dir = path.dirname(cleanModulePath(modulePath));
  const root = path.parse(dir).root;
  
  while (dir !== root) {
    const pkgPath = path.join(dir, 'package.json');
    try {
      await fs.access(pkgPath);
      const stat = await fs.stat(pkgPath);
      if (stat.isFile()) {
        return pkgPath;
      }
    } catch (e) {}
    dir = path.dirname(dir);
  }
  return null;
}

async function getLicenseInfo(modulePath) {
  try {
    // Clean path
    const cleanPath = cleanModulePath(modulePath);
    
    // Get package.json path from module path
    const pkgPath = await findPackageJson(cleanPath);

    if (!pkgPath) {
      // Use cleaned path for matching
      const matches = cleanPath.match(/node_modules\/(@[^/]+\/[^/]+|[^/]+)/);
      if (matches) {
        const packageName = matches[1];
        const altPkgPath = path.join(path.dirname(cleanPath), '..', packageName, 'package.json');
        try {
          await fs.access(altPkgPath);
          return getLicenseInfo(path.dirname(altPkgPath));
        } catch (e) {
          throw new Error(`Cannot find package.json for ${packageName}`);
        }
      }
      throw new Error('Cannot find package.json');
    }

    const packageJson = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
    const license = packageJson.license || 'Unknown';
    let licenseText = '';

    const possibleFiles = [
      'LICENSE',
      'LICENSE.md',
      'LICENSE.txt',
      'license',
      'license.md',
      'license.txt'
    ];

    const packageDir = path.dirname(pkgPath);

    for (const file of possibleFiles) {
      try {
        licenseText = await fs.readFile(path.join(packageDir, file), 'utf8');
        break;
      } catch (e) {}
    }

    return {
      name: packageJson.name,
      version: packageJson.version,
      license,
      licenseText
    };
  } catch (e) {
    console.warn(`Warning: Could not read license info for ${modulePath}:`, e.message);
    return {
      name: path.basename(cleanModulePath(modulePath)),
      version: 'unknown',
      license: 'Unknown',
      licenseText: ''
    };
  }
}

export default function licenseExtractor() {
  let deps = new Set();
  
  return {
    name: 'license-extractor',
    
    moduleParsed(moduleInfo) {
      // Only process real node_modules modules
      if (moduleInfo.id.includes('node_modules') && !moduleInfo.id.startsWith('\0')) {
        deps.add(moduleInfo.id);
      }
    },

    async closeBundle() {
      if (deps.size === 0) {
        console.log('No dependencies found to extract licenses from');
        return;
      }

      const licenses = await Promise.all(Array.from(deps).map(getLicenseInfo));

      // Deduplicate (multiple files may come from the same package)
      const uniqueLicenses = Array.from(
        new Map(licenses.map(l => [l.name, l])).values()
      );

      let output = '# Third Party Licenses\n\n';
      for (const {name, version, license, licenseText} of uniqueLicenses) {
        output += `## ${name}@${version}\n`;
        output += `License: ${license}\n\n`;
        if (licenseText) {
          output += `${licenseText}\n\n`;
        }
      }

      // Ensure output directory exists
      try {
        await fs.mkdir('dist', { recursive: true });
      } catch (e) {
        if (e.code !== 'EEXIST') {
          throw e;
        }
      }

      try {
        await fs.writeFile('dist/vendor-licenses.txt', output);
        console.log('Successfully generated vendor-licenses.txt');
      } catch (e) {
        console.error('Failed to write vendor-licenses.txt:', e);
      }
    }
  };
}