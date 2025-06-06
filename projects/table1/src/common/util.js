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

/**
 *
 * @param {number} raw
 * @param {number} min
 * @param {number} max
 */
export function clamp(raw, min, max) {
  if (min > max) [min, max] = [max, min]

  if (raw < min) return min
  else if (raw > max) return max
  else return raw
}

/**
 * @param {HTMLElement | SVGElement} el
 * @see https://stackoverflow.com/a/28222246/1835843
 */
export function getOffset(el) {
  const rect = el.getBoundingClientRect()
  const left = rect.left + window.scrollX
  const top = rect.top + window.scrollY
  const width = rect.width
  const height = rect.height

  return {
    left,
    top,
    width,
    height,
    centerX: left + width / 2,
    centerY: top + height / 2,
    right: left + width,
    bottom: top + height,
  }
}
