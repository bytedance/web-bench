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

export const SVG_NS = 'http://www.w3.org/2000/svg'

export class Point {
  /** @type {number} */
  x
  /** @type {number} */
  y

  /**
   * @param {Point} point
   * @param {Rect} rect
   */
  static isInRect(point, rect) {
    return (
      point.x >= rect.x &&
      point.x <= rect.x + rect.width &&
      point.y >= rect.y &&
      point.y <= rect.y + rect.height
    )
  }
}

export class Rect {
  /** @type {number} */
  x
  /** @type {number} */
  y
  /** @type {number} */
  width
  /** @type {number} */
  height
}

export class Transform {
  /** @type {Point} */
  translate = { x: 0, y: 0 }
  /** @type {Rotate} */
  rotate = { value: 0 }
  /** @type {Point} */
  scale = { x: 1, y: 1 }
}

export class Rotate {
  /** @type {number} */
  value
}

export class EventEmitter {
  constructor() {
    this.events = new Map()
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }
    this.events.get(event).push(callback)
    return this
  }

  /**
   * @param {string} event
   * @param {any[]} args
   */
  emit(event, ...args) {
    if (!this.events.has(event)) {
      return false
    }

    this.events.get(event).forEach((callback) => {
      callback.apply(this, args)
    })
    return true
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  once(event, callback) {
    const wrapper = (...args) => {
      callback.apply(this, args)
      this.off(event, wrapper)
    }
    return this.on(event, wrapper)
  }

  /**
   * @param {string} event
   * @param {any} callback
   */
  off(event, callback) {
    if (!this.events.has(event)) {
      return this
    }

    if (!callback) {
      this.events.delete(event)
      return this
    }

    const listeners = this.events.get(event)
    const filteredListeners = listeners.filter((cb) => cb !== callback)

    if (filteredListeners.length) {
      this.events.set(event, filteredListeners)
    } else {
      this.events.delete(event)
    }

    return this
  }

  listenerCount(event) {
    if (!this.events.has(event)) {
      return 0
    }
    return this.events.get(event).length
  }

  rawListeners(event) {
    return this.events.get(event) || []
  }
}

/**
 * @param {SVGElement} element
 * @param {DOMRect} parentBound
 */
export function getOffsetRect(element, parentBound) {
  const b1 = element.getBoundingClientRect()
  const x = b1.x - parentBound.x
  const y = b1.y - parentBound.y
  const width = b1.width
  const height = b1.height
  return {
    x,
    y,
    width,
    height,
    bottom: y + height,
    left: x,
    right: x + width,
    top: y,
    centerX: x + width / 2,
    centerY: y + height / 2,
  }
}

const translateRegex = /translate\(([\d.-]+)px[, ]*([\d.-]*)px\)/
const rotateRegex = /rotate\(([\d.-]+)deg\)/
const scaleRegex = /scale\(([\d.-]+)[, ]*([\d.-]*)\)/

/**
 * @param {SVGElement} element
 * @returns {Transform}
 */
export function getTransform(element) {
  return parseTransform(element.style.transform)
}

/**
 * @param {string} transform
 * @returns {Transform}
 */
export function parseTransform(transform) {
  /** @type {Transform} */
  const attrs = new Transform()

  const matchTranslate = transform?.match(translateRegex)
  if (matchTranslate) {
    attrs.translate.x = parseFloat(matchTranslate[1])
    attrs.translate.y = parseFloat(matchTranslate[2]) || 0
  }

  const matchRotate = transform?.match(rotateRegex)
  if (matchRotate) {
    attrs.rotate.value = parseFloat(matchRotate[1])
  }

  const matchScale = transform?.match(scaleRegex)
  if (matchScale) {
    attrs.scale.x = parseFloat(matchScale[1])
    attrs.scale.y = parseFloat(matchScale[2]) || 0
  }

  return attrs
}

/**
 * @param {SVGElement} element
 * @param {object} opts
 * @param {Point | undefined} opts.translate
 * @param {Rotate | undefined} opts.rotate
 * @param {Point | undefined} opts.scale
 */
export function setTransform(element, opts) {
  const { translate, rotate, scale } = opts
  // console.log('[setTransform]', opts)

  element.style.transform = [
    translate ? `translate(${translate.x}px, ${translate.y}px)` : '',
    rotate ? `rotate(${rotate.value}deg)` : '',
    scale ? `scale(${scale.x}, ${scale.y})` : '',
  ].join(' ')
}

/**
 * Calculates the rotation angle in degrees between two points relative to an origin
 * @param {Point} origin - The origin point
 * @param {Point} p0 - The first point
 * @param {Point} p1 - The second point
 * @returns {number} - The rotation angle in degrees
 */
export function calculateRotationAngleDeg(origin, p0, p1) {
  const v1 = { x: p0.x - origin.x, y: p0.y - origin.y }
  const v2 = { x: p1.x - origin.x, y: p1.y - origin.y }

  const dotProduct = v1.x * v2.x + v1.y * v2.y
  const magnitudeV1 = Math.sqrt(v1.x ** 2 + v1.y ** 2)
  const magnitudeV2 = Math.sqrt(v2.x ** 2 + v2.y ** 2)

  // Handle zero magnitude cases
  if (magnitudeV1 === 0 || magnitudeV2 === 0) {
    return 0
  }

  // Ensure cosTheta is within valid range [-1, 1]
  const cosTheta = Math.max(-1, Math.min(1, dotProduct / (magnitudeV1 * magnitudeV2)))

  // Calculate angle in radians
  let angle = Math.acos(cosTheta)

  // Determine rotation direction using cross product
  const crossProduct = v1.x * v2.y - v1.y * v2.x
  if (crossProduct < 0) {
    angle = -angle // Clockwise rotation
  }

  // Convert to degrees
  return (angle * 180) / Math.PI
}

/**
 * Calculates the scale between two points relative to an origin
 * @param {Point} origin - The origin point
 * @param {Point} p0 - The first point
 * @param {Point} p1 - The second point
 * @returns {number} - The rotation angle in degrees
 */
export function calculateScale(origin, p0, p1) {
  const v1 = { x: p0.x - origin.x, y: p0.y - origin.y }
  const v2 = { x: p1.x - origin.x, y: p1.y - origin.y }

  const magnitudeV1 = Math.sqrt(v1.x ** 2 + v1.y ** 2)
  const magnitudeV2 = Math.sqrt(v2.x ** 2 + v2.y ** 2)

  // Handle zero magnitude cases
  if (magnitudeV1 === 0) {
    return 1
  }

  return magnitudeV2 / magnitudeV1
}


export const isTouchSupported = 'ontouchstart' in globalThis