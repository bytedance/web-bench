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
import { getShortcut } from './key.js'

export class TableMenu {
  /** @type {Table} */
  table
  /** @type {HTMLElement} */
  contextMenu
  // let isCut = false

  /** @param {Table} table */
  constructor(table) {
    this.table = table
    const contextMenu = document.createElement('div')
    this.contextMenu = contextMenu
    contextMenu.className = 'menu'
    document.body.appendChild(contextMenu)
    document.addEventListener('click', () => {
      if (contextMenu) contextMenu.style.display = 'none'
    })

    table.tableEl.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      if (!(event.target instanceof HTMLTableCellElement)) return
      this.showContextMenu(event.target, event.pageX, event.pageY)
    })
  }

  /**
   *
   * @param {HTMLTableCellElement} cell
   * @param {number} x
   * @param {number} y
   * @returns
   */
  showContextMenu(cell, x, y) {
    const { contextMenu } = this

    contextMenu.innerHTML = ''
    if (cell.tagName === 'TD') {
      this.registerMenuitem('Insert Row Above', cell)
      this.registerMenuitem('Insert Row Below', cell)
      this.registerMenuitem('Select Row', cell)
      this.registerMenuitem('Delete Row', cell)
    } else if (cell.tagName === 'TH') {
      this.registerMenuitem('Insert Col Left', cell)
      this.registerMenuitem('Insert Col Right', cell)
      this.registerMenuitem('Select Col', cell)
      this.registerMenuitem('Filter', cell)
      this.registerMenuitem('Sort', cell)
      this.registerMenuitem('Delete Col', cell)
    }

    contextMenu.style.left = `${x}px`
    contextMenu.style.top = `${y}px`
    contextMenu.style.display = 'block'
  }

  /**
   * @param {string} command
   * @param {HTMLTableCellElement} cell
   */
  registerMenuitem(command, cell) {
    const { contextMenu, table } = this
    const menuitem = document.createElement('div')
    menuitem.className = `menu-item menu-item-${command.toLowerCase().replace(/\s+?/g, '-')}`
    menuitem.textContent = command + getShortcut(command)
    contextMenu.appendChild(menuitem)

    switch (command.toLowerCase()) {
      case 'filter':
        const oldKeywords = cell.getAttribute('data-keywords')
        if (oldKeywords) {
          menuitem.textContent += ` (${oldKeywords})`
        }
        break
      case 'sort':
        const ascending = cell.getAttribute('data-ascending') === 'true'
        menuitem.textContent += ` (to ${ascending ? 'asc' : 'desc'})`
        break
    }

    menuitem.addEventListener('click', (e) => {
      const row = table.getRow(cell)
      const { row: rowIndex, col: colIndex } = table.getCellIndex(cell)
      console.log(`[menuitem] ${command}`, { cell, colIndex, row, rowIndex })

      switch (command.toLowerCase()) {
        case 'insert row above':
          table.insertRow(rowIndex, { above: true })
          break
        case 'insert row below':
          table.insertRow(rowIndex, { above: false })
          break
        case 'select row':
          table.selectRow(row)
          break
        case 'delete row':
          table.deleteRow(row)
          break
        case 'insert col left':
          table.insertCol(colIndex, { left: true })
          break
        case 'insert col right':
          table.insertCol(colIndex, { left: false })
          break
        case 'select col':
          table.selectCol(colIndex)
          break
        case 'filter':
          const oldKeywords = cell.getAttribute('data-keywords')
          const keywords = window.prompt('Keywords:', oldKeywords ?? '')
          if (keywords !== null) {
            cell.setAttribute('data-keywords', keywords)
            table.filterRows(colIndex, keywords)
          }
          break
        case 'sort':
          const ascending = cell.getAttribute('data-ascending') === 'true'
          cell.setAttribute('data-ascending', ascending ? 'false' : 'true')
          table.sortRows(colIndex, ascending)
          break
        case 'delete col':
          table.deleteCol(colIndex)
          break
      }
    })
  }
}
