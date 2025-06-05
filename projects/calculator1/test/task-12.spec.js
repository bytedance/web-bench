const { test, expect } = require('@playwright/test');

test.describe('Task 12: Info Panels in Scientific Mode', () => {
  test('Test case 1: Info panels should be hidden when not in scientific mode', async ({ page }) => {
    await page.goto('/index.html');
    
    // Remove scientific class
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.remove('scientific');
    });
    
    // Check if info panels are hidden
    const infoPanelsVisible = await page.evaluate(() => {
      const infoPanels = document.querySelector('.info-panels');
      const styles = window.getComputedStyle(infoPanels);
      return styles.display !== 'none';
    });
    
    expect(infoPanelsVisible).toBe(false);
  });

  test('Test case 2: Info panels should be visible in scientific mode with proper structure', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check if info panels are visible and have correct structure
    const panelsInfo = await page.evaluate(() => {
      const infoPanels = document.querySelector('.info-panels');
      const memoryPanel = document.querySelector('.memory-panel');
      const clicksPanel = document.querySelector('.clicks-panel');
      const memoryLabel = memoryPanel?.querySelector('span')?.textContent;
      const historyLabel = clicksPanel?.querySelector('span')?.textContent;
      
      return {
        infoPanelsVisible: window.getComputedStyle(infoPanels).display !== 'none',
        hasMemoryPanel: !!memoryPanel,
        hasClicksPanel: !!clicksPanel,
        memoryLabel,
        historyLabel,
        hasMemoryElement: !!document.getElementById('memory'),
        hasClicksElement: !!document.getElementById('clicks')
      };
    });
    
    expect(panelsInfo.infoPanelsVisible).toBe(true);
    expect(panelsInfo.hasMemoryPanel).toBe(true);
    expect(panelsInfo.hasClicksPanel).toBe(true);
    expect(panelsInfo.memoryLabel).toBe('Memory');
    expect(panelsInfo.historyLabel).toBe('History');
    expect(panelsInfo.hasMemoryElement).toBe(true);
    expect(panelsInfo.hasClicksElement).toBe(true);
  });

  test('Test case 3: Info panels should have proper styling and layout', async ({ page }) => {
    await page.goto('/index.html');
    
    // Ensure scientific mode is active
    await page.evaluate(() => {
      document.querySelector('.calculator').classList.add('scientific');
    });
    
    // Check styling of panels
    const panelsStyles = await page.evaluate(() => {
      const memoryPanel = document.querySelector('.memory-panel');
      const clicksPanel = document.querySelector('.clicks-panel');
      const memoryStyles = window.getComputedStyle(memoryPanel);
      const clicksStyles = window.getComputedStyle(clicksPanel);
      
      return {
        memoryDisplay: memoryStyles.display,
        memoryJustifyContent: memoryStyles.justifyContent,
        memoryAlignItems: memoryStyles.alignItems,
        clicksDisplay: clicksStyles.display,
        clicksJustifyContent: clicksStyles.justifyContent,
        clicksAlignItems: clicksStyles.alignItems
      };
    });
    
    expect(panelsStyles.memoryDisplay).toBe('flex');
    expect(panelsStyles.memoryJustifyContent).toBe('space-between');
    expect(panelsStyles.memoryAlignItems).toBe('center');
    expect(panelsStyles.clicksDisplay).toBe('flex');
    expect(panelsStyles.clicksJustifyContent).toBe('space-between');
    expect(panelsStyles.clicksAlignItems).toBe('center');
  });
});
