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

import { Component, inject } from '@angular/core'
import { ToastService } from '../../services/toast.service'
import { NgFor, NgIf } from '@angular/common'
import { Router } from '@angular/router'
import { BlogService } from '../../services/blog.service'

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="game-container">
      <div>Hello Game</div>
      
      <div class="turn-indicator">
        {{ isBlackTurn ? "Black's Turn" : "White's Turn"}}
      </div>

      <div>
        {{ winner ? winner + " Wins!" : "" }}
      </div>

      <div class="board">
        <div class="grid">
          <ng-container *ngFor="let row of board; let i = index">
            <div 
              *ngFor="let cell of row; let j = index" 
              class="cell chess-pos-{{i}}-{{j}}"
              [class.chess-white]="cell === 'white'"
              [class.chess-black]="cell === 'black'"
              (click)="makeMove(i, j)"
            ></div>
          </ng-container>
        </div>
      </div>

      <button *ngIf="gameEnded" class="post-btn" (click)="postGameRecord()">Post Game Records</button>
    </div>
  `,
  styles: `
    .game-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
    }

    .turn-indicator {
      font-size: 24px;
      margin: 20px 0;
      font-weight: bold;
      color: #333;
    }

    .board {
      background: #DCB35C;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(15, 40px);
      grid-template-rows: repeat(15, 40px);
      gap: 0px;
      background-image: linear-gradient(#000 1px, transparent 1px),
                        linear-gradient(90deg, #000 1px, transparent 1px);
      background-size: 40px 40px;
    }

    .cell {
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      position: relative;
    }

    .cell:hover:not(.chess-white):not(.chess-black)::before {
      content: '';
      position: absolute;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(0,0,0,0.2);
    }

    .chess-white::after,
    .chess-black::after {
      content: '';
      position: absolute;
      width: 34px;
      height: 34px;
      border-radius: 50%;
    }

    .chess-white::after {
      background: white;
      box-shadow: inset -4px -4px 8px rgba(0,0,0,0.3);
    }

    .chess-black::after {
      background: black;
      box-shadow: inset -4px -4px 8px rgba(255,255,255,0.3);
    }

    .post-btn {
      margin-top: 20px;
      background: #4CAF50;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .post-btn:hover {
      background: #45a049;
    }
  `
})
export class GameComponent {
  board: string[][] = Array(15).fill(null).map(() => Array(15).fill(null))
  isBlackTurn = true
  gameEnded = false
  moves: string[] = []
  winner: string = ''

  private router = inject(Router)
  private blogService = inject(BlogService)
  private toastService = inject(ToastService)

  makeMove(row: number, col: number) {
    if (this.gameEnded || this.board[row][col]) return

    const currentPlayer = this.isBlackTurn ? 'Black' : 'White'
    this.moves.push(`${currentPlayer}(${row},${col});`)
    
    this.board[row][col] = this.isBlackTurn ? 'black' : 'white'
    
    if (this.checkWin(row, col)) {
      this.winner = this.isBlackTurn ? 'Black' : 'White'
      this.toastService.show(`${this.winner} Wins!`)
      setTimeout(() => {
        this.toastService.show('Congratulations!', true)
      }, 200)
      this.gameEnded = true
      return
    }

    this.isBlackTurn = !this.isBlackTurn
  }

  postGameRecord() {
    const now = new Date()
    const date = now.toLocaleDateString().replace(/\//g, '-')
    const time = now.toLocaleTimeString().replace(/:/g, '-')
    
    const title = `Game-${date}-${time}`
    const detail = `# ${this.winner} is Winner!\n\`\`\`game\n${this.moves.join('\n')}\n\`\`\``

    this.blogService.addBlog({ title, detail })
    this.router.navigate(['/'])
  }

  private checkWin(row: number, col: number): boolean {
    const directions = [
      [[0, 1], [0, -1]], // horizontal
      [[1, 0], [-1, 0]], // vertical
      [[1, 1], [-1, -1]], // diagonal
      [[1, -1], [-1, 1]] // anti-diagonal
    ]

    const currentColor = this.board[row][col]

    for (const [dir1, dir2] of directions) {
      let count = 1
      
      // Check in first direction
      let r = row + dir1[0]
      let c = col + dir1[1]
      while (
        r >= 0 && r < 15 && 
        c >= 0 && c < 15 && 
        this.board[r][c] === currentColor
      ) {
        count++
        r += dir1[0]
        c += dir1[1]
      }

      // Check in opposite direction
      r = row + dir2[0]
      c = col + dir2[1]
      while (
        r >= 0 && r < 15 && 
        c >= 0 && c < 15 && 
        this.board[r][c] === currentColor
      ) {
        count++
        r += dir2[0]
        c += dir2[1]
      }

      if (count >= 5) return true
    }

    return false
  }
}