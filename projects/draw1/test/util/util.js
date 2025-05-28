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
 * @see https://playwright.dev/docs/touch-events
 * @param {import('@playwright/test').Locator} locator
 * @param {object} opts
 * @param {number} [opts.x]
 * @param {number} [opts.y]
 * @param {number} [opts.deltaX]
 * @param {number} [opts.deltaY]
 * @param {number} [opts.steps]
 * @param {boolean} [opts.debug]
 */
async function pan(locator, opts) {
  const { x0, y0, logs } = await locator.evaluate((target, arg) => {
    const logs = []
    const targetB = target.getBoundingClientRect()
    const x0 = typeof arg.x === 'number' ? arg.x + targetB.x : targetB.width / 2 + targetB.x
    const y0 = typeof arg.y === 'number' ? arg.y + targetB.y : targetB.height / 2 + targetB.y

    const touches = [new Touch({ identifier: Date.now(), target, clientX: x0, clientY: y0 })]
    logs.push({ target: target.tagName, x0, y0, targetBound: targetB })
    // MUST SET bubbles !!!
    target.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches }))
    return { x0, y0, logs }
  }, opts)
  if (opts.debug) console.log(locator, 'touchstart', logs)

  const { logs: logs1 } = await locator.evaluate(
    (target, arg) => {
      const logs = []
      const deltaX = arg.deltaX ?? 0
      const deltaY = arg.deltaY ?? 0
      const steps = arg.steps ?? 5
      let id = Date.now()
      logs.push({ target: target.tagName, deltaX, deltaY, steps })

      for (let i = 1; i <= steps; i++) {
        const x1 = arg.x0 + (deltaX * i) / steps
        const y1 = arg.y0 + (deltaY * i) / steps
        const touches = [new Touch({ identifier: ++id, target, clientX: x1, clientY: y1 })]
        logs.push({ id, x1, y1 })
        target.dispatchEvent(new TouchEvent('touchmove', { bubbles: true, touches }))
        logs.push({ hitTarget: localStorage.target })
      }
      return { logs }
    },
    { ...opts, x0, y0 }
  )
  if (opts.debug) console.log(locator, 'touchmove', logs1)

  await locator.evaluate((target, arg) => {
    const touches = [new Touch({ identifier: Date.now(), target })]
    target.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches }))
  }, opts)
  // if (opts.debug) console.log(locator, 'touchmove', logs1)
}

async function isTouch(page) {
  return await page.evaluate(() => 'ontouchstart' in window)
}

module.exports = {
  isTouch,
  pan,
}

/** @type {SVGElement} */
// @ts-ignore
// const canvas = document.querySelector('.canvas')
