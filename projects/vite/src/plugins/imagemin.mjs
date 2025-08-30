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

import imagemin from 'imagemin'
import imageminGifsicle from 'imagemin-gifsicle'
import imageminMozjpeg from 'imagemin-mozjpeg'
import imageminPngquant from 'imagemin-pngquant'
import imageminSvgo from 'imagemin-svgo'
import { createFilter } from '@rollup/pluginutils'

export default function imageminPlugin(options = {}) {
  const {
    include = /\.(png|jpg|jpeg|gif|svg)$/,
    exclude,
    quality = 75,
  } = options

  const filter = createFilter(include, exclude)

  return {
    name: 'vite-plugin-imagemin',
    apply: 'build', // Only run during build
    enforce: 'post', // Run after build

    async generateBundle(options, bundle) {
      for (const fileName in bundle) {
        if (!filter(fileName)) continue;
        
        const file = bundle[fileName];
        if (file.type !== 'asset') continue;

        const buffer = file.source;
        const optimizedBuffer = await imagemin.buffer(buffer, {
          plugins: [
            imageminGifsicle({
              optimizationLevel: 3
            }),
            imageminMozjpeg({
              quality
            }),
            imageminPngquant({
              quality: [quality / 100, 0.9]
            }),
            imageminSvgo({
              plugins: [
                {
                  name: 'removeViewBox',
                  active: false
                }
              ]
            })
          ]
        });

        file.source = optimizedBuffer;
      }
    }
  }
}