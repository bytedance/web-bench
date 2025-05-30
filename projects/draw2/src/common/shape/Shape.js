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

import { calculateRotationAngleDeg, calculateScale, Point, setTransform, Transform } from '../util'

const registeredShapes = ['rect', 'ellipse', 'line']

export class Shape {
  /** @type {SVGElement} */
  element
  /** @type {Point} */
  center = { x: 0, y: 0 }

  /**
   * @param {object} [opts]
   * @param {string} opts.color
   * @param {number} opts.lineWidth
   * @param {Point} opts.origin
   */
  constructor(opts) {
    console.log(`[${this.constructor.name}.create]`, opts, this)
    Shape.shapes.push(this)
  }

  /**
   * @param {object} opts
   * @param {Point} opts.cursorP0
   * @param {Point} opts.cursorP1
   * @param {number} opts.lineWidth
   */
  onCreateMove(opts) {
    throw new Error('NOT IMPLEMENTED!')
  }

  /**
   * @param {object} opts
   * @param {Point} opts.cursorP0
   * @param {Point} opts.cursorP1
   * @param {Transform} opts.transform0
   */
  onMove(opts) {
    const {
      cursorP0,
      cursorP1,
      transform0,
      transform0: { translate: translate0, rotate: rotate0, scale: scale0 },
    } = opts

    const diff = { x: cursorP1.x - cursorP0.x, y: cursorP1.y - cursorP0.y }
    const translate1 = { x: translate0.x + diff.x, y: translate0.y + diff.y }
    setTransform(this.element, { ...transform0, translate: translate1 })
  }

  /**
   * @param {object} opts
   * @param {Point} opts.cursorP0
   * @param {Point} opts.cursorP1
   * @param {Transform} opts.transform0
   */
  onRotate(opts) {
    const {
      cursorP0,
      cursorP1,
      transform0,
      transform0: { translate: translate0, rotate: rotate0, scale: scale0 },
    } = opts

    const rotate1 = { value: 0, x: this.center.x, y: this.center.y }
    rotate1.value =
      rotate0.value +
      calculateRotationAngleDeg(
        this.center,
        { x: cursorP0.x - translate0.x, y: cursorP0.y - translate0.y },
        { x: cursorP1.x - translate0.x, y: cursorP1.y - translate0.y }
      )
    // console.log(rotate1)
    setTransform(this.element, { ...transform0, rotate: rotate1 })
  }

  /**
   * @param {object} opts
   * @param {Point} opts.cursorP0
   * @param {Point} opts.cursorP1
   * @param {Transform} opts.transform0
   */
  onZoom(opts) {
    const {
      cursorP0,
      cursorP1,
      transform0,
      transform0: { translate: translate0, rotate: rotate0, scale: scale0 },
    } = opts

    const s = calculateScale(
      this.center,
      { x: cursorP0.x - translate0.x, y: cursorP0.y - translate0.y },
      { x: cursorP1.x - translate0.x, y: cursorP1.y - translate0.y }
    )
    const scale1 = { x: scale0.x * s, y: scale0.y * s }
    setTransform(this.element, { ...transform0, scale: scale1 })
  }

  /**
   * @return {Shape}
   */
  clone() {
    throw new Error('NOT IMPLEMENTED!')
  }

  remove() {
    Shape.shapes.splice(
      Shape.shapes.findIndex((shape) => this === shape),
      1
    )
    this.element.remove()
  }

  //////////////////////////////////////////////////////////////////////////////
  // Static
  //////////////////////////////////////////////////////////////////////////////
  /** @type {Shape[]} */
  static shapes = []

  /**
   * @param {string} type
   * @param {object} opts
   * @param {string} opts.color
   * @param {number} opts.lineWidth
   * @param {Point} opts.origin
   * @returns {Promise<Shape>}
   */
  static async create(type, opts) {
    const className = type[0].toUpperCase() + type.slice(1)
    const ShapeClass = (await import(/* @vite-ignore */ `./${className}.js`))[className]

    const shape = new ShapeClass(opts)

    return shape
  }

  /**
   * @param {SVGElement} element
   * @returns {Shape | undefined}
   */
  static findByElement(element) {
    return Shape.shapes.find((shape) => element === shape.element)
  }

  static offset = { x: 20, y: 20 }

  static registeredShapes = registeredShapes
}
