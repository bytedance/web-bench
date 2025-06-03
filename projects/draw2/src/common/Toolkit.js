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

import { EventEmitter } from './util'

export class Toolkit extends EventEmitter {
  /**
   * @param {string} toolkitSelector
   */
  constructor(toolkitSelector) {
    super()

    // @ts-ignore
    this.root = document.querySelector(toolkitSelector)

    this.bindEvents()
  }

  bindEvents() {
    const { root } = this
    root.querySelectorAll('input[name="operation"]').forEach((el) => {
      el.addEventListener('change', () => {
        console.log('[change]', el)

        // @ts-ignore
        this.operationInput = el
        this.emit('operation-change', this.operation)
      })
    })

    const moveLabel = root.querySelector('.move')
    let prevLabel = null
    let isPressingBlankspace = false
    document.addEventListener('keydown', (e) => {
      if (!isPressingBlankspace && e.key === ' ') {
        isPressingBlankspace = true
        prevLabel = this.operationInput?.parentElement
        console.log({ isPressingBlankspace, prevLabel })
        // @ts-ignore
        moveLabel?.click()
      }
    })

    document.addEventListener('keyup', (e) => {
      if (e.key === ' ') {
        isPressingBlankspace = false
        console.log({ isPressingBlankspace, prevLabel })
        prevLabel?.click()
      }
    })
  }

  /** @type {HTMLElement} */
  root

  /** @return {string | null | undefined} */
  get operation() {
    return this.operationInput?.value
  }

  /** @return {number} */
  get lineWidth() {
    return parseFloat(this.lineWidthInput.value)
  }

  /** @return {string} */
  get color() {
    return this.colorInput.value
  }

  //////////////////////////////////////////////////////////////////////////////
  // Controls
  //////////////////////////////////////////////////////////////////////////////
  /** @return {HTMLInputElement | null} */
  get operationInput() {
    // @ts-ignore
    return this._operationInput
  }

  /** @param {HTMLInputElement} _operationInput */
  set operationInput(_operationInput) {
    this._operationInput = _operationInput
  }

  /** @return {HTMLInputElement} */
  get lineWidthInput() {
    if (!this._lineWidthInput) this._lineWidthInput = this.root.querySelector('.line-width')
    // @ts-ignore
    return this._lineWidthInput
  }

  /** @return {HTMLInputElement} */
  get colorInput() {
    if (!this._colorInput) this._colorInput = this.root.querySelector('.color')
    // @ts-ignore
    return this._colorInput
  }
}
