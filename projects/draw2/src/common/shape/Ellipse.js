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

export class Ellipse extends Shape {
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
    const element = document.createElementNS(SVG_NS, 'ellipse')
    this.element = element
    element.setAttribute('fill', 'white')
    element.setAttribute('stroke', color)
    element.setAttribute('stroke-width', `${lineWidth}`)
    const r = lineWidth / 2
    element.setAttribute('cx', `${origin.x + r}`)
    element.setAttribute('cy', `${origin.y + r}`)
    element.setAttribute('rx', `${r}`)
    element.setAttribute('ry', `${r}`)
    Object.assign(this.center, { x: origin.x, y: origin.y })
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

    const rx = Math.max(Math.abs(cursorP1.x - cursorP0.x), opts.lineWidth) / 2
    const ry = Math.max(Math.abs(cursorP1.y - cursorP0.y), opts.lineWidth) / 2
    const cx = cursorP0.x + rx * (cursorP1.x - cursorP0.x < 0 ? -1 : 1)
    const cy = cursorP0.y + ry * (cursorP1.y - cursorP0.y < 0 ? -1 : 1)
    element.setAttribute('cx', `${cx}`)
    element.setAttribute('cy', `${cy}`)
    element.setAttribute('rx', `${rx}`)
    element.setAttribute('ry', `${ry}`)
    Object.assign(center, { x: cx, y: cy })
    element.style.transformOrigin = `${center.x}px ${center.y}px`
  }

  /**
   * @return {Ellipse}
   */
  clone() {
    /** @type {SVGElement} */
    // @ts-ignore
    const el = this.element.cloneNode(true)
    el.setAttribute('cx', `${parseFloat(el.getAttribute('cx') ?? '0') + Shape.offset.x}`)
    el.setAttribute('cy', `${parseFloat(el.getAttribute('cy') ?? '0') + Shape.offset.y}`)

    const ellipse = new Ellipse()
    ellipse.element = el
    Object.assign(ellipse.center, this.center)

    return ellipse
  }
}
