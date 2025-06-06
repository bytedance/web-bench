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
import { getOffset } from './util.js'

export class TableRowDragmove {
  /** @type {Table} */
  table

  /**
   * @param {DragEvent} e
   * @param {HTMLTableRowElement} row
   */
  start(e, row) {
    e.stopPropagation()
    row.classList.add('dragging')
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', row.rowIndex + '')
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  /**
   * @param {DragEvent} e
   * @param {HTMLTableRowElement} row
   */
  end(e, row) {
    e.stopPropagation()
    row.classList.remove('dragging')
    Array.from(this.table.tbody.rows).forEach((r) => {
      r.classList.remove('dragover', 'dragover-above')
    })
  }

  /**
   * @param {DragEvent} e
   * @param {HTMLTableRowElement} row
   */
  over(e, row) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }

    const offset = getOffset(row)
    if (e.clientY < offset.centerY) {
      row.classList.remove('dragover')
      row.classList.add('dragover-above')
    } else {
      row.classList.remove('dragover-above')
      row.classList.add('dragover')
    }
  }

  /**
   * @param {DragEvent} e
   * @param {HTMLTableRowElement} row
   */
  leave(e, row) {
    e.stopPropagation()
    row.classList.remove('dragover', 'dragover-above')
  }

  /**
   * @param {DragEvent} e
   * @param {HTMLTableRowElement} dropRow
   */
  drop(e, dropRow) {
    e.preventDefault()
    e.stopPropagation()

    const dragRowIndex = parseInt(e.dataTransfer?.getData('text/plain') ?? '0', 10)
    const dragRow = this.table.tableEl.rows[dragRowIndex]

    console.log({ dragRow, dropRow })

    const offset = getOffset(dropRow)
    if (e.clientY < offset.centerY) {
      dropRow.before(dragRow)
    } else {
      dropRow.after(dragRow)
    }
  }

  /**
   * @param {Table} table
   * @param {HTMLTableRowElement} row
   */
  constructor(table, row) {
    this.table = table

    row.draggable = true
    row.addEventListener('dragstart', (e) => this.start.call(this, e, row))
    row.addEventListener('dragend', (e) => this.end.call(this, e, row))
    row.addEventListener('dragover', (e) => this.over.call(this, e, row))
    row.addEventListener('dragleave', (e) => this.leave.call(this, e, row))
    row.addEventListener('drop', (e) => this.drop.call(this, e, row))
  }
}

export class TableColDragmove {
  /** @type {Table} */
  table

  /**
   * @param {DragEvent} e
   * @param {HTMLTableCellElement} cell
   */
  start(e, cell) {
    e.stopPropagation()
    cell.classList.add('dragging')
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', cell.cellIndex + '')
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  /**
   * @param {DragEvent} e
   * @param {HTMLTableCellElement} cell
   */
  end(e, cell) {
    e.stopPropagation()
    cell.classList.remove('dragging')
    Array.from(this.table.theadRow.cells).forEach((c) => {
      c.classList.remove('dragover', 'dragover-above')
    })
  }

  /**
   * @param {DragEvent} e
   * @param {HTMLTableCellElement} cell
   */
  over(e, cell) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move'
    }

    const offset = getOffset(cell)
    if (e.clientX < offset.centerX) {
      cell.classList.remove('dragover')
      cell.classList.add('dragover-above')
    } else {
      cell.classList.remove('dragover-above')
      cell.classList.add('dragover')
    }
  }

  /**
   * @param {DragEvent} e
   * @param {HTMLTableCellElement} row
   */
  leave(e, row) {
    e.stopPropagation()
    row.classList.remove('dragover', 'dragover-above')
  }

  /**
   * @param {DragEvent} e
   * @param {HTMLTableCellElement} dropCell
   */
  drop(e, dropCell) {
    e.preventDefault()
    e.stopPropagation()

    const dragColIndex = parseInt(e.dataTransfer?.getData('text/plain') ?? '0', 10)
    const dragCell = this.table.theadRow.cells[dragColIndex]
    const { col: dropColIndex } = this.table.getCellIndex(dropCell)

    console.log({ dragCell, dropCell })

    const offset = getOffset(dropCell)
    if (e.clientX < offset.centerX) {
      dropCell.before(dragCell)
      Array.from(this.table.tbody.rows).forEach((row) =>
        row.cells[dropColIndex].before(row.cells[dragColIndex])
      )
    } else {
      dropCell.after(dragCell)
      Array.from(this.table.tbody.rows).forEach((row) =>
        row.cells[dropColIndex].after(row.cells[dragColIndex])
      )
    }
  }

  /**
   * @param {Table} table
   * @param {HTMLTableCellElement} cell
   */
  constructor(table, cell) {
    this.table = table

    cell.draggable = true
    cell.addEventListener('dragstart', (e) => this.start.call(this, e, cell))
    cell.addEventListener('dragend', (e) => this.end.call(this, e, cell))
    cell.addEventListener('dragover', (e) => this.over.call(this, e, cell))
    cell.addEventListener('dragleave', (e) => this.leave.call(this, e, cell))
    cell.addEventListener('drop', (e) => this.drop.call(this, e, cell))
  }
}

/**
 * @param {Table} table
 */
export function initTableDragEvents(table) {
  Array.from(table.tbody.rows).forEach((row) => {
    new TableRowDragmove(table, row)
  })
  Array.from(table.theadRow.cells).forEach((cell) => {
    new TableColDragmove(table, cell)
  })

  table.updateDraggable()
}
