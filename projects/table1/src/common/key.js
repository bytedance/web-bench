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

export class TableKeyboard {
  /** @type {Table} */
  table

  /** @param {Table} table */
  constructor(table) {
    this.table = table

    // Setup global keydown listener for shortcuts
    document.addEventListener('keydown', this.handleShortcuts.bind(this))
  }

  /**
   * @param {KeyboardEvent} e
   */
  handleShortcuts(e) {
    const table = this.table
    const selectedCell = table.selectedCell
    const selectedCells = table.selectedCells

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
    const cmdKey = isMac ? e.metaKey : e.ctrlKey
    const shiftKey = e.shiftKey
    const altKey = e.altKey
    const key = e.key.toLowerCase()

    console.log(`[key] ${key}`, {
      cell: selectedCell,
      // index: table.getCellIndex(selectedCell),
      cells: selectedCells,
      cmdKey,
      shiftKey,
      altKey,
      isMac,
    })

    let hit = false
    if (cmdKey) {
      switch (key) {
        case 'a': // Cmd/Ctrl + A
          hit = true
          const size = table.tableSize
          table.selectedCells = table.getRectCellsBy(
            { row: 0, col: 0 },
            { row: size.rowCount - 1, col: size.colCount - 1 }
          )
          break
        case 'c': // Cmd/Ctrl + C
          hit = true
          table.copiedCells = table.selectedCells
          break
        case 'v': // Cmd/Ctrl + V
          hit = true
          if (table.copiedCells.length && table.selectedCells.length) {
            table.pasteTo(table.selectedCells)
          }
          break
      }
    } else {
      let newCell
      switch (key) {
        case 'enter':
          hit = true
          // console.log('hit');
          if (!selectedCell) return
          table.editedCell = selectedCell
          break
        case 'escape':
          hit = true
          if (!selectedCell) return
          const isEditedCell = table.isEdited(selectedCell)
          table.clearSelectedCells()
          if (isEditedCell) {
            table.selectedCell = selectedCell
          }
          break
        case 'tab':
          hit = true
          if (!selectedCell) {
            if (table.firstCell) table.selectedCell = table.firstCell
          } else if (shiftKey) {
            table.selectedCell = table.getPrevCell(selectedCell)
          } else {
            table.selectedCell = table.getNextCell(selectedCell)
          }
          break
        case 'arrowleft':
          hit = true
          if (!selectedCell) {
            if (table.firstCell) table.selectedCell = table.firstCell
          } else if (shiftKey) {
            table.selectedCells = table.getExtendedCellsBy('left')
          } else {
            newCell = table.getCellByOffset(selectedCell, { row: 0, col: -1 })
            if (newCell) table.selectedCell = newCell
          }
          break
        case 'arrowright':
          hit = true
          if (!selectedCell) {
            if (table.firstCell) table.selectedCell = table.firstCell
          } else if (shiftKey) {
            table.selectedCells = table.getExtendedCellsBy('right')
          } else {
            newCell = table.getCellByOffset(selectedCell, { row: 0, col: 1 })
            if (newCell) table.selectedCell = newCell
          }
          break
        case 'arrowup':
          hit = true
          if (!selectedCell) {
            if (table.firstCell) table.selectedCell = table.firstCell
          } else if (shiftKey) {
            table.selectedCells = table.getExtendedCellsBy('up')
          } else {
            newCell = table.getCellByOffset(selectedCell, { row: -1, col: 0 })
            if (newCell) table.selectedCell = newCell
          }
          break
        case 'arrowdown':
          hit = true
          if (!selectedCell) {
            if (table.firstCell) table.selectedCell = table.firstCell
          } else if (shiftKey) {
            table.selectedCells = table.getExtendedCellsBy('down')
          } else {
            newCell = table.getCellByOffset(selectedCell, { row: 1, col: 0 })
            if (newCell) table.selectedCell = newCell
          }
          break

        case 'delete':
        case 'backspace':
          hit = true
          selectedCells.forEach((cell) => {
            cell.innerHTML = ''
          })
          break
      }
    }

    if (hit) e.preventDefault()
  }
}

export function getShortcut(command) {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
  const cmdKey = isMac ? 'Cmd' : 'Ctrl'
  switch (command.toLowerCase()) {
    case 'cut':
      return ` (${cmdKey}+X)`
    case 'add file':
      return ` (${cmdKey}+J)`
    case 'add dir':
      return ` (${cmdKey}+K)`
    case 'delete':
      return ' (Delete|Backspace)'
    case 'copy':
      return ` (${cmdKey}+C)`
    case 'paste':
      return ` (${cmdKey}+V)`
    default:
      return ''
  }
}
