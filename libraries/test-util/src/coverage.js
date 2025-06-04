const { test } = require('@playwright/test')
const fs = require('fs');
const path = require('path');
let coverageIndex = 0;

test.afterEach(async ({ page }) => {
  const coverage = await page.evaluate(() => window.__coverage__);
  if (coverage) {
    fs.mkdirSync('.nyc_output', { recursive: true });
    const filePath = path.join('.nyc_output', `coverage-${++coverageIndex}.json`);
    fs.writeFileSync(filePath, JSON.stringify(coverage));
  }
});