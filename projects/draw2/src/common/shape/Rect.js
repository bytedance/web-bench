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

import { Shape } from './Shape'
import { Point, SVG_NS } from '../util'

export class Rect extends Shape {
  /**
   * @param {object} [opts]
   * @param {string} opts.color
   * @param {number} opts.lineWidth
   * @param {Point} opts.origin
   */
  constructor(opts) {
    super(opts)

    if (!opts) return
    const { color, lineWidth, origin } = opts
    const element = document.createElementNS(SVG_NS, 'rect')
    this.element = element
    element.setAttribute('fill', 'white')
    element.setAttribute('stroke', color)
    element.setAttribute('stroke-width', `${lineWidth}`)
    element.setAttribute('width', `${lineWidth}`)
    element.setAttribute('height', `${lineWidth}`)
    element.setAttribute('x', `${origin.x}`)
    element.setAttribute('y', `${origin.y}`)
    Object.assign(this.center, { x: origin.x + lineWidth / 2, y: origin.y + lineWidth / 2 })
  }

  /**
   * @param {object} opts
   * @param {Point} opts.cursorP0
   * @param {Point} opts.cursorP1
   * @param {number} opts.lineWidth
   */
  onCreateMove(opts) {
    const { element, center } = this
    const { cursorP0, cursorP1 } = opts

    const x = Math.min(cursorP1.x, cursorP0.x)
    const y = Math.min(cursorP1.y, cursorP0.y)
    const width = Math.max(Math.abs(cursorP1.x - cursorP0.x), opts.lineWidth)
    const height = Math.max(Math.abs(cursorP1.y - cursorP0.y), opts.lineWidth)

    element.setAttribute('x', `${x}`)
    element.setAttribute('y', `${y}`)
    element.setAttribute('width', `${width}`)
    element.setAttribute('height', `${height}`)
    Object.assign(center, { x: x + width / 2, y: y + height / 2 })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
  }

  /**
   * @return {Rect}
   */
  clone() {
    /** @type {SVGElement} */
    // @ts-ignore
    const el = this.element.cloneNode(true)
    el.setAttribute('x', `${parseFloat(el.getAttribute('x') ?? '0') + Shape.offset.x}`)
    el.setAttribute('y', `${parseFloat(el.getAttribute('y') ?? '0') + Shape.offset.y}`)

    const rect = new Rect()
    rect.element = el
    Object.assign(rect.center, this.center)

    return rect
  }
}
