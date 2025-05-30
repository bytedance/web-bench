import { test, expect } from '@playwright/test';

test.describe('Task 1: Basic HTML structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('should have a toolkit div inside root', async ({ page }) => {
    const toolkit = await page.$('.root .toolkit');
    expect(toolkit).toBeTruthy();
  });

  test('should have an SVG canvas inside root', async ({ page }) => {
    const canvas = await page.$('.root .canvas');
    expect(canvas).toBeTruthy();
    const tagName = await canvas.evaluate(el => el.tagName.toLowerCase());
    expect(tagName).toBe('svg');
  });

  test('SVG should have proper namespace', async ({ page }) => {
    const canvas = await page.$('.canvas');
    const xmlns = await canvas.getAttribute('xmlns');
    expect(xmlns).toBe('http://www.w3.org/2000/svg');
  });

  test('SVG should have version attribute', async ({ page }) => {
    const canvas = await page.$('.canvas');
    const version = await canvas.getAttribute('version');
    expect(version).toBe('1.1');
  });
});
