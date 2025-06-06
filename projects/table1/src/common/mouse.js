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

import { Table } from './table.js'

export class TableMouse {
  /** @type {Table} */
  table

  isMouseDown = false
  /** @type {HTMLTableCellElement} */
  mousedownCell

  /** @param {Table} table */
  constructor(table) {
    this.table = table
    const { tableEl } = table

    tableEl.addEventListener('mousedown', (event) => {
      if (!(event.target instanceof HTMLTableCellElement)) return

      this.isMouseDown = true
      this.mousedownCell = event.target
      // console.log('mousedown', event.target)
    })

    tableEl.addEventListener('mousemove', (event) => {
      if (!this.isMouseDown) return
      // console.log('mousemove', { isMouseDown: this.isMouseDown, target: event.target })

      if (!(event.target instanceof HTMLTableCellElement)) return
      const start = table.getCellIndex(this.mousedownCell)
      const end = table.getCellIndex(event.target)
      if (start.row !== end.row || start.col !== end.col) {
        table.selectedCells = table.getRectCellsBy(start, end)
      }
    })

    tableEl.addEventListener('mouseup', (event) => {
      this.isMouseDown = false
      // console.log('mouseup', { isMouseDown: this.isMouseDown })
    })

    tableEl.addEventListener('mouseleave', (event) => {
      this.isMouseDown = false
      // console.log('mouseleave', { isMouseDown: this.isMouseDown })
    })
  }
}
