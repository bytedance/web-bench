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

import { Shape } from './shape/Shape'
import { Toolkit } from './Toolkit'
import { EventEmitter, getTransform, isTouchSupported, Point, Transform } from './util'

export class Canvas extends EventEmitter {
  /**
   * @param {string} selector
   * @param {Toolkit} toolkit
   */
  constructor(selector, toolkit) {
    super()

    // @ts-ignore
    this.canvas = document.querySelector(selector)
    this.toolkit = toolkit
    this.canvasRect = this.canvas.getBoundingClientRect()

    this.bindEvents()
  }

  bindEvents() {
    const { canvas } = this

    if (isTouchSupported) {
      canvas.addEventListener('touchstart', this.onDrawStart.bind(this))
      canvas.addEventListener('touchmove', this.onDrawMove.bind(this))
      canvas.addEventListener('touchend', this.onDrawEnd.bind(this))
      canvas.addEventListener('touchcancel', this.onDrawEnd.bind(this))
    } else {
      canvas.addEventListener('mousedown', this.onDrawStart.bind(this))
      canvas.addEventListener('mousemove', this.onDrawMove.bind(this))
      canvas.addEventListener('mouseup', this.onDrawEnd.bind(this))
      canvas.addEventListener('mouseleave', this.onDrawEnd.bind(this))
    }
  }

  /** @param {MouseEvent | TouchEvent} e */
  async onDrawStart(e) {
    const { canvas, toolkit, cursorP0, transform0 } = this
    const { operation, color, lineWidth } = toolkit
    if (!operation) return

    /** @type {SVGElement} */
    // @ts-ignore
    const target = e.target

    this.shape = null
    Object.assign(cursorP0, this.getOffsetPoint(e))
    Object.assign(transform0, getTransform(target))
    console.log(`[onDrawStart]`, { operation, target, color, lineWidth, cursorP0, transform0 })

    if (Shape.registeredShapes.includes(operation)) {
      this.shape = await Shape.create(operation, { color, lineWidth, origin: cursorP0 })
      canvas.append(this.shape.element)
    } else
      switch (operation) {
        case 'move':
        case 'zoom':
        case 'rotate':
          // Can not operate canvas
          if (target === canvas) return
          this.shape = Shape.findByElement(target)
          break
        case 'copy':
          if (target === canvas) return
          const newShape = Shape.findByElement(target)?.clone()
          if (newShape) canvas.append(newShape.element)
          break
        case 'delete':
          if (target === canvas) return
          Shape.findByElement(target)?.remove()
          break
        case 'fill':
          if (target === canvas) return
          target.setAttribute('fill', color)
          break
      }
  }

  /** @param {MouseEvent | TouchEvent} e */
  onDrawMove(e) {
    const { shape, cursorP0, transform0, toolkit } = this
    const { operation, lineWidth } = toolkit
    if (!shape || !operation) return

    const cursorP1 = this.getOffsetPoint(e)
    // console.log(`[onDrawMove]`, { cursorP0, cursorP1, transform0 })

    if (Shape.registeredShapes.includes(operation)) {
      shape.onCreateMove({ cursorP0, cursorP1, lineWidth })
    } else
      switch (operation) {
        case 'move':
          shape.onMove({ cursorP0, cursorP1, transform0 })
          break
        case 'rotate':
          shape.onRotate({ cursorP0, cursorP1, transform0 })
          break
        case 'zoom':
          shape.onZoom({ cursorP0, cursorP1, transform0 })
          break
        // Do Nothing
        // case 'copy':
        // case 'delete':
        // case 'fill':
      }
  }

  /** @param {MouseEvent} e */
  onDrawEnd(e) {
    this.shape = null
    this.emit('done', { operation: this.toolkit.operation })
  }

  /** @param {MouseEvent | TouchEvent} e */
  getOffsetPoint(e) {
    const { canvasRect } = this
    return e instanceof MouseEvent
      ? { x: e.offsetX, y: e.offsetY }
      : { x: e.touches[0].clientX - canvasRect.left, y: e.touches[0].clientY - canvasRect.top }
  }

  /** @type {Toolkit} */
  toolkit
  /** @type {SVGElement} */
  canvas

  //////////////////////////////////////////////////////////////////////////////
  // Temp Vars
  //////////////////////////////////////////////////////////////////////////////
  /**
   * Selected Shape
   * @type {Shape | null | undefined}
   */
  shape = null
  /** @type {Point} */
  cursorP0 = { x: 0, y: 0 }
  transform0 = new Transform()
}
