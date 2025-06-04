const fs = require('fs');
const path = require('path');

const coverage = async ({ page }, testInfo) => {
    const coverage = await page.evaluate(() => window.__coverage__) || {};
    fs.mkdirSync('.nyc_output', { recursive: true });
    const safeTitle = testInfo.title.replace(/[^\w]/g, '_');
    const safeFile = testInfo.file?.replace(/[^\w]/g, '_') || 'unknown';
    const fileName = `coverage-${safeFile}-${safeTitle}-${Date.now()}.json`;
    const filePath = path.join('.nyc_output', fileName);
    fs.writeFileSync(filePath, JSON.stringify(coverage));
}

module.exports = coverage;
