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

const { test, expect } = require('@playwright/test')
const { parseTransform, Point, Rect } = require('./util')

test('parseTransform', async ({}) => {
  await expect(parseTransform('')).toEqual({
    translate: { x: 0, y: 0 },
    rotate: { value: 0 },
    scale: { x: 1, y: 1 },
  })
})

test('parseTransform translate', async ({}) => {
  await expect(parseTransform('transform: translate(1px,2px)')).toEqual({
    translate: { x: 1, y: 2 },
    rotate: { value: 0 },
    scale: { x: 1, y: 1 },
  })
})

test('parseTransform rotate', async ({}) => {
  await expect(parseTransform('transform: rotate(1deg)')).toEqual({
    translate: { x: 0, y: 0 },
    rotate: { value: 1},
    scale: { x: 1, y: 1 },
  })
})

test('parseTransform scale', async ({}) => {
  await expect(parseTransform('transform: scale(2 3)')).toEqual({
    translate: { x: 0, y: 0 },
    rotate: { value: 0 },
    scale: { x: 2, y: 3 },
  })
})

test('parseTransform complex', async ({}) => {
  await expect(
    parseTransform('translate(0px, 0px) rotate(14.118592186352135deg) scale(1, 1)')
  ).toEqual({
    translate: { x: 0, y: 0 },
    rotate: { value: 14.118592186352135},
    scale: { x: 1, y: 1 },
  })
})

test('Point.isInRect', async ({}) => {
  await expect(Point.isInRect({ x: 1, y: 1 }, { x: 1, y: 1, width: 1, height: 1 })).toBeTruthy()
  await expect(Point.isInRect({ x: 1, y: 1 }, { x: 2, y: 2, width: 1, height: 1 })).toBeFalsy()
})
