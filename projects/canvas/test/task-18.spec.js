const { test, expect, defineConfig } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/index.html');
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    window.store.mode = 'debug';
  });
  await page.click('canvas');
});

test('boss spawns after 10 seconds', async ({ page }) => {
  // Wait for boss spawn time
  await page.waitForTimeout(10000);
  
  // Check if boss exists and is active
  const bossState = await page.evaluate(() => {
    return window.store.boss;
  });
  
  expect(bossState.lives).toBe(10);
});


test('boss takes damage from bullets', async ({ page }) => {
  // Wait for boss to spawn
  await page.waitForTimeout(10000);
  
  // Get initial boss lives
  const initialLives = await page.evaluate(() => window.store.boss.lives);
  
  // Shoot boss
  await page.keyboard.press('k');

  const result = await page.evaluate(async () => {
    const boss =  window.store.boss;
    const bullet =  window.store.bullets[0];
    bullet.x = boss.x + 1;
    bullet.y = boss.y + 1;
   
    await new Promise(resolve => setTimeout(resolve, 100));

    const bossLives = window.store.boss.lives;
    return {
      bossLives,
    };
 });
  
  expect(result.bossLives).toBe(initialLives - 1);
});


test('boss bullets are properly generated', async ({ page }) => {
  // Wait for boss spawn
  await page.waitForTimeout(10000);
  
  // Wait for bullet cooldown
  await page.waitForTimeout(200);
  
  // Check if boss bullets exist
  const bulletCount = await page.evaluate(() => window.store.bossBullets.length);
  
  expect(bulletCount).toBeGreaterThan(0);
});
