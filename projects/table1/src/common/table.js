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

import { clamp } from './util.js'
import { TableRowDragmove } from './drag.js'
import { createColResizer, createRowResizer } from './layout.js'

/** @typedef {{row:number, col:number}} CellIndex */

export class Table {
  /** @type {HTMLTableElement} */
  tableEl

  /** @param {HTMLTableElement} tableEl */
  constructor(tableEl) {
    this.tableEl = tableEl

    this.initBlockingKeys()
    this.initClick()
    this.initDoubleClick()
  }

  /** @returns {HTMLTableSectionElement} */
  get tbody() {
    return this.tableEl.tBodies[0]
  }

  /** @returns {HTMLTableRowElement} */
  get theadRow() {
    // @ts-ignore
    return this.tableEl.tHead?.rows[0]
  }

  /**
   * Stop propagate keydown events from 'table *[contenteditable="true"]'
   */
  initBlockingKeys() {
    this.tableEl.addEventListener('keydown', (e) => {
      const WHITELIST = ['escape']
      const key = e.key.toLowerCase()
      if (WHITELIST.includes(key)) {
        // console.log('table not block:', { key, focusedElement: document.activeElement })
      } else {
        e.stopPropagation()
      }
    })
  }

  initClick() {
    this.tableEl.addEventListener('click', (e) => {
      const cell = e.target
      if (!cell || !(cell instanceof HTMLTableCellElement)) return

      if (this.isSelected(cell)) {
        this.editedCell = cell
      } else {
        if (e.shiftKey && this.selectedCell) {
          const start = this.getCellIndex(this.selectedCell)
          const end = this.getCellIndex(cell)
          const cells = this.getRectCellsBy(start, end)
          this.selectedCells = cells.flat()
        } else {
          this.selectedCell = cell
        }
      }
    })
  }

  initDoubleClick() {
    this.tableEl.addEventListener('dblclick', (e) => {
      const cell = e.target
      if (!cell || !(cell instanceof HTMLTableCellElement)) return

      this.editedCell = cell
    })
  }

  /** @param {HTMLTableCellElement} cell */
  set editedCell(cell) {
    this.selectedCell = cell
    cell.setAttribute('contenteditable', 'true')
    cell.focus()
  }

  /** @param {HTMLTableCellElement} cell */
  set selectedCell(cell) {
    this.selectedCells = [cell]
  }

  /** @returns {HTMLTableCellElement | null} */
  get firstCell() {
    return this.tableEl.querySelector('thead tr th')
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @returns {HTMLTableCellElement}
   */
  getNextCell(cell) {
    const index = this.getCellIndex(cell)
    const size = this.tableSize
    let { row, col } = index
    col += 1
    if (col >= size.colCount) {
      col = 0
      row += 1
      if (row >= size.rowCount) row = 0
    }
    // @ts-ignore
    return this.getCellByIndex({ row, col })
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @returns {HTMLTableCellElement}
   */
  getPrevCell(cell) {
    const index = this.getCellIndex(cell)
    const size = this.tableSize
    let { row, col } = index
    col -= 1
    if (col < 0) {
      col = size.colCount - 1
      row -= 1
      if (row < 0) row = size.rowCount - 1
    }
    // @ts-ignore
    return this.getCellByIndex({ row, col })
  }

  /** @param {HTMLTableCellElement[] | HTMLTableCellElement[][]} cells */
  set selectedCells(cells) {
    this.clearSelectedCells()
    if (cells.length && Array.isArray(cells[0])) cells = cells.flat()
    cells.forEach((cell) => cell.classList.add('selected'))

    this.updateDraggable()
  }

  clearSelectedCells() {
    const cells = this.selectedCells
    cells.forEach((cell) => {
      cell?.classList.remove('selected')
    })

    const oldEditedEl = this.editedCell
    if (oldEditedEl) oldEditedEl.setAttribute('contenteditable', 'false')
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @returns {CellIndex}
   */
  getCellIndex(cell) {
    return { row: this.getRow(cell).rowIndex, col: cell.cellIndex }
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @returns {HTMLTableRowElement}
   */
  getRow(cell) {
    // @ts-ignore
    return cell.parentElement
  }

  /** @returns {HTMLTableCellElement | null} */
  get selectedCell() {
    return this.tableEl.querySelector('.selected')
  }

  /** @returns {HTMLTableCellElement[]} */
  get selectedCells() {
    return Array.from(this.tableEl.querySelectorAll('.selected'))
  }

  /** @returns {HTMLTableCellElement | null} */
  get editedCell() {
    return this.tableEl.querySelector('*[contenteditable="true"]')
  }

  /** @param {HTMLTableCellElement} cell */
  isEdited(cell) {
    return cell.getAttribute('contenteditable') === 'true'
  }

  /** @param {HTMLTableCellElement} cell */
  isSelected(cell) {
    return cell.classList.contains('selected')
  }

  /** @type {HTMLTableCellElement[]} */
  _copiedCells = []

  /** @returns {HTMLTableCellElement[]} */
  get copiedCells() {
    return this._copiedCells
  }

  /** @param {HTMLTableCellElement[]} cells */
  set copiedCells(cells) {
    this._copiedCells = cells
  }

  /** @param {HTMLTableCellElement[]} targetCells */
  pasteTo(targetCells) {
    console.assert(this.copiedCells.length > 0 && targetCells.length > 0)
    const source = this.getSizeIndex(this.copiedCells)
    const target = this.getSizeIndex(targetCells)

    // different size
    if (source.rowCount !== target.rowCount || source.colCount !== target.colCount) {
      const targetStart = this.getCellIndex(targetCells[0])
      /** @type {HTMLTableCellElement[]} */
      const newTargetCells = []
      for (let i = 0; i < source.rowCount; i++) {
        if (targetStart.row + i >= this.tableSize.rowCount) {
          this.insertRow(this.tableSize.rowCount - 1)
        }

        for (let j = 0; j < source.colCount; j++) {
          if (targetStart.col + j >= this.tableSize.colCount) {
            this.insertCol(this.tableSize.colCount - 1)
          }

          const newTargetCell = this.getCellByIndex({
            row: targetStart.row + i,
            col: targetStart.col + j,
          })
          // @ts-ignore
          newTargetCells.push(newTargetCell)
        }
      }
      targetCells = newTargetCells
    }

    // save original contents
    const contents = this._copiedCells.map((cell) => cell.innerHTML)
    targetCells.forEach((cell, i) => {
      // console.log('pasteTo', cell, i)
      cell.innerHTML = contents[i]
    })
  }

  /**
   * @param {HTMLTableCellElement[]} cells
   * @returns { {start:CellIndex, end:CellIndex, rowCount:number, colCount:number} }
   */
  getSizeIndex(cells) {
    const start = this.getCellIndex(cells[0])
    const end = this.getCellIndex(cells[cells.length - 1])
    return { rowCount: end.row - start.row + 1, colCount: end.col - start.col + 1, start, end }
  }

  /**
   * @param {HTMLTableCellElement} cell
   * @param { CellIndex } offset
   * @returns {HTMLTableCellElement | undefined}
   */
  getCellByOffset(cell, offset = { row: 0, col: 0 }) {
    const { row, col } = this.getCellIndex(cell)
    return this.getCellByIndex({ row: row + offset.row, col: col + offset.col })
  }

  /**
   * @param { CellIndex } index
   * @returns {HTMLTableCellElement | undefined}
   */
  getCellByIndex(index = { row: 0, col: 0 }) {
    const size = this.tableSize
    const newRow = this.tableEl.rows[clamp(index.row, 0, size.rowCount - 1)]
    return newRow.cells[clamp(index.col, 0, size.colCount - 1)]
  }

  get tableSize() {
    const rows = this.tableEl.rows
    return {
      rowCount: rows.length,
      colCount: rows.length > 0 ? rows[0].cells.length : 0,
    }
  }

  /**
   * @param { 'left' | 'right' | 'up' | 'down' } direction
   * @param { number } offset
   * @returns {HTMLTableCellElement[][]}
   */
  getExtendedCellsBy(direction, offset = 1) {
    const cells = this.selectedCells
    if (cells.length === 0) return []

    const start = this.getCellIndex(cells[0])
    const end = this.getCellIndex(cells[cells.length - 1])
    console.log('getExtendedCellsBy', JSON.stringify({ start, end }))

    switch (direction) {
      case 'left':
        return this.getRectCellsBy({ row: start.row, col: start.col - offset }, end)
      case 'right':
        return this.getRectCellsBy(start, { row: end.row, col: end.col + offset })
      case 'up':
        return this.getRectCellsBy({ row: start.row - offset, col: start.col }, end)
      case 'down':
        return this.getRectCellsBy(start, { row: end.row + offset, col: end.col })

      default:
        return []
    }
  }

  /**
   * @param { CellIndex } start
   * @param { CellIndex } end
   * @returns {HTMLTableCellElement[][]}
   */
  getRectCellsBy(start, end) {
    const { tableEl } = this

    // console.log('getRectCellsBy', JSON.stringify({ start, end }))

    /** @type {HTMLTableCellElement[][]} */
    const rectCells = []
    const size = this.tableSize

    let rowIndex0 = Math.min(start.row, end.row)
    let rowIndex1 = Math.max(start.row, end.row)
    let colIndex0 = Math.min(start.col, end.col)
    let colIndex1 = Math.max(start.col, end.col)
    if (rowIndex0 < 0) rowIndex0 = 0
    if (rowIndex1 > size.rowCount - 1) rowIndex1 = size.rowCount - 1
    if (colIndex0 < 0) colIndex0 = 0
    if (colIndex1 > size.colCount - 1) colIndex1 = size.colCount - 1

    for (let rowIndex = rowIndex0; rowIndex <= rowIndex1; rowIndex++) {
      const row = tableEl.rows[rowIndex]
      /** @type {HTMLTableCellElement[]} */
      const rowCells = []
      rectCells.push(rowCells)
      for (let colIndex = colIndex0; colIndex <= colIndex1; colIndex++) {
        rowCells.push(row.cells[colIndex])
      }
    }

    return rectCells
  }

  updateDraggable() {
    // TODO need decoupling, split to change event
    ;[...this.tbody.rows].forEach((row) => {
      row.draggable = this.isRowSelected(row)
    })

    Array.from(this.theadRow.cells).forEach((cell) => {
      cell.draggable = this.isColSelected(cell.cellIndex)
    })
  }

  //
  // Row
  //

  /**
   * @param {number} rowIndex
   * @param {object} options
   * @param {boolean} options.above
   */
  insertRow(rowIndex, options = { above: false }) {
    const newRow = this.tableEl.insertRow(options.above ? rowIndex : rowIndex + 1)
    for (let i = 0; i < this.tableSize.colCount; i++) {
      newRow.insertCell()
    }

    newRow.appendChild(createRowResizer())
    new TableRowDragmove(this, newRow)
  }

  /** @param {HTMLTableRowElement} row */
  deleteRow(row) {
    row.remove()
  }

  /** @param {HTMLTableRowElement} row */
  selectRow(row) {
    this.selectedCells = [...row.cells]
  }

  /**
   * @param {number} colIndex
   * @param {string} keywords
   */
  filterRows(colIndex, keywords) {
    if (typeof keywords !== 'string') return

    keywords = keywords.trim()
    Array.from(this.tbody.rows).forEach((row) => {
      const cell = row.cells[colIndex]
      const matched = keywords === '' ? true : cell.textContent?.includes(keywords)
      row.style.display = matched ? '' : 'none'
    })
  }

  /**
   * @param {number} colIndex
   * @param {boolean} ascending
   */
  sortRows(colIndex, ascending = true) {
    const rows = Array.from(this.tbody.rows)
    const newRows = rows.sort((row1, row2) => {
      const cell1 = row1.cells[colIndex]
      const cell2 = row2.cells[colIndex]
      return ascending
        ? cell1.textContent?.localeCompare(cell2.textContent ?? '') ?? 0
        : cell2.textContent?.localeCompare(cell1.textContent ?? '') ?? 0
    })

    newRows.forEach((row) => this.tbody.append(row))
  }

  /** @param {HTMLTableRowElement} row */
  isRowSelected(row) {
    return [...row.cells].every((cell) => cell.classList.contains('selected'))
  }

  //
  // Col
  //

  /** @param {number} colIndex */
  isColSelected(colIndex) {
    for (let i = 0; i < this.tableEl.rows.length; i++) {
      const cell = this.tableEl.rows[i].cells[colIndex]
      if (!cell.classList.contains('selected')) return false
    }
    return true
  }

  /**
   * @param {number} colIndex
   * @param {object} options
   * @param {boolean} options.left
   */
  insertCol(colIndex, options = { left: false }) {
    const { tableEl } = this
    /** @type {HTMLTableCellElement[]}  */
    const colCells = []

    for (let i = 0; i < tableEl.rows.length; i++) {
      const row = tableEl.rows[i]
      const cell = row.cells[colIndex]
      const isHeaderRow = row.parentElement?.tagName === 'THEAD'
      const newCell = document.createElement(isHeaderRow ? 'th' : 'td')
      colCells.push(newCell)
      options.left ? cell.before(newCell) : cell.after(newCell)

      if (isHeaderRow) {
        newCell.appendChild(createColResizer())
      }
    }

    return colCells
  }

  /**
   * @param {number} colIndex
   */
  deleteCol(colIndex) {
    const { tableEl } = this
    /** @type {HTMLTableCellElement[]}  */
    const colCells = []

    for (let i = 0; i < tableEl.rows.length; i++) {
      const row = tableEl.rows[i]
      const cellToDelete = row.cells[colIndex]
      if (cellToDelete) {
        colCells.push(cellToDelete)
        cellToDelete.remove()
      }
    }

    return colCells
  }

  /** @param {number} colIndex */
  selectCol(colIndex) {
    const { tableEl } = this
    const colCells = []

    for (let i = 0; i < tableEl.rows.length; i++) {
      const row = tableEl.rows[i]
      const cell = row.cells[colIndex]
      colCells.push(cell)
    }
    this.selectedCells = colCells
  }

  /**
   * @param {number} colIndex
   * @returns {HTMLTableColElement | null}
   */
  getCol(colIndex) {
    return this.tableEl.querySelector(`colgroup > col:nth-child(${colIndex + 1})`)
  }
}
