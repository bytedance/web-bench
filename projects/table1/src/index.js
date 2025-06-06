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

import { Table } from './common/table.js'
import { TableMenu } from './common/menu.js'
import { TableKeyboard } from './common/key.js'
import { TableMouse } from './common/mouse.js'
import { TableRowResizer, TableColResizer } from './common/layout.js'
import { initTableDragEvents } from './common/drag.js'

document.addEventListener('DOMContentLoaded', () => {
  /** @type {HTMLTableElement | null} */
  const tableElement = document.querySelector('.table')
  if (!tableElement) return

  const table = new Table(tableElement)

  new TableMenu(table)
  new TableKeyboard(table)
  new TableRowResizer(table)
  new TableColResizer(table)
  new TableMouse(table)
  initTableDragEvents(table)
})
