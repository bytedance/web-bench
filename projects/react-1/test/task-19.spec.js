// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Task 19 - Tic-Tac-Toe Game', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application and go to the Game page
    await page.goto('/');
    await page.locator('header button:has-text("🎮")').click();
    await expect(page).toHaveURL(/\/game$/);
  });

  test('should display a 3x3 grid for Tic-Tac-Toe', async ({ page }) => {
    // Check if the game board exists
    const gameBoard = page.locator('.game-board');
    await expect(gameBoard).toBeVisible();
    
    // Check if there are 9 cells in the grid
    const cells = page.locator('.cell');
    await expect(cells).toHaveCount(9);
    
    // Check if the cells are arranged in a grid layout
    const boardStyle = await gameBoard.evaluate(el => {
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns,
        gridTemplateRows: style.gridTemplateRows
      };
    });
    
    expect(boardStyle.display).toBe('grid');
    expect(boardStyle.gridTemplateColumns.split(' ').length).toBe(3);
    expect(boardStyle.gridTemplateRows.split(' ').length).toBe(3);
  });

  test('should place X when a cell is clicked', async ({ page }) => {
    // Click on the first cell
    await page.locator('.cell').first().click();
    
    // Check if X is placed in the cell
    await expect(page.locator('.cell').first()).toContainText('X');
  });

  test('should alternate between X and O', async ({ page }) => {
    // Click on the first cell (should place X)
    await page.locator('.cell').nth(0).click();
    await expect(page.locator('.cell').nth(0)).toContainText('X');
    
    // Click on the second cell (should place O)
    await page.locator('.cell').nth(1).click();
    await expect(page.locator('.cell').nth(1)).toContainText('O');
    
    // Click on the third cell (should place X again)
    await page.locator('.cell').nth(2).click();
    await expect(page.locator('.cell').nth(2)).toContainText('X');
  });

  test('should not allow clicking on an already filled cell', async ({ page }) => {
    // Click on the first cell
    await page.locator('.cell').first().click();
    const firstCellText = await page.locator('.cell').first().textContent();
    
    // Try to click on the same cell again
    await page.locator('.cell').first().click();
    
    // Check if the cell content remains the same
    await expect(page.locator('.cell').first()).toHaveText(firstCellText);
    
    // Check if the next player's turn is still active by clicking another cell
    await page.locator('.cell').nth(1).click();
    await expect(page.locator('.cell').nth(1)).toContainText(firstCellText === 'X' ? 'O' : 'X');
  });

  test('should detect a win when three in a row', async ({ page }) => {
    // Create a winning pattern for X (first row)
    await page.locator('.cell').nth(0).click(); // X
    await page.locator('.cell').nth(3).click(); // O
    await page.locator('.cell').nth(1).click(); // X
    await page.locator('.cell').nth(4).click(); // O
    await page.locator('.cell').nth(2).click(); // X
    
    // Check if the game displays a win message
    await expect(page.locator('.game-status')).toContainText('Winner: X');
    
    // Check if the game board is disabled after a win
    // Try to click on an empty cell
    await page.locator('.cell').nth(5).click();
    await expect(page.locator('.cell').nth(5)).toBeEmpty();
  });

  test('should detect a draw when all cells are filled without a winner', async ({ page }) => {
    // Play a game that results in a draw
    // X | O | X
    // X | O | O
    // O | X | X
    const moves = [0, 1, 2, 4, 6, 3, 7, 5, 8];
    
    for (const move of moves) {
      await page.locator('.cell').nth(move).click();
    }
    
    // Check if the game displays a draw message
    await expect(page.locator('.game-status')).toContainText('Draw');
  });

  test('should have a reset button that clears the board', async ({ page }) => {
    // Play a few moves
    await page.locator('.cell').nth(0).click();
    await page.locator('.cell').nth(1).click();
    await page.locator('.cell').nth(2).click();
    
    // Click the reset button
    await page.locator('button:has-text("Reset")').click();
    
    // Check if all cells are empty
    const cells = page.locator('.cell');
    for (let i = 0; i < 9; i++) {
      await expect(cells.nth(i)).toBeEmpty();
    }
    
    // Check if the game status is reset
    await expect(page.locator('.game-status')).toContainText('Next player: X');
  });
});