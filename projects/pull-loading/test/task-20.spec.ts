import { test, expect, devices, type Locator } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

async function pinch(locator: Locator,
    arg: { deltaX?: number, deltaY?: number, steps?: number, direction?: 'in' | 'out' }) {
    const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {
        const bounds = target.getBoundingClientRect();
        const centerX = bounds.left + bounds.width / 2;
        const centerY = bounds.top + bounds.height / 2;
        return { centerX, centerY };
    });

    const deltaX = arg.deltaX ?? 50;
    const steps = arg.steps ?? 5;
    const stepDeltaX = deltaX / (steps + 1);

    // Two touch points equally distant from the center of the element.
    const touches = [
        {
            identifier: 0,
            clientX: centerX - (arg.direction === 'in' ? deltaX : stepDeltaX),
            clientY: centerY,
        },
        {
            identifier: 1,
            clientX: centerX + (arg.direction === 'in' ? deltaX : stepDeltaX),
            clientY: centerY,
        },
    ];
    await locator.dispatchEvent('touchstart',
        { touches, changedTouches: touches, targetTouches: touches });

    // Move the touch points towards or away from each other.
    for (let i = 1; i <= steps; i++) {
        const offset = (arg.direction === 'in' ? (deltaX - i * stepDeltaX) : (stepDeltaX * (i + 1)));
        const touches = [
            {
                identifier: 0,
                clientX: centerX - offset,
                clientY: centerY,
            },
            {
                identifier: 0,
                clientX: centerX + offset,
                clientY: centerY,
            },
        ];
        await locator.dispatchEvent('touchmove',
            { touches, changedTouches: touches, targetTouches: touches });
    }

    await locator.dispatchEvent('touchend', { touches: [], changedTouches: [], targetTouches: [] });
}

test(`pinch in gesture to zoom out the map`, async ({ page }) => {
    await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z',
        { waitUntil: 'commit' });
    await page.getByRole('button', { name: 'Keep using web' }).click();
    await expect(page.getByRole('button', { name: 'Keep using web' })).not.toBeVisible();
    // Get the map element.
    const met = page.locator('[data-test-id="met"]');
    for (let i = 0; i < 5; i++)
        await pinch(met, { deltaX: 40, direction: 'in' });
    // Ensure the map has been zoomed out.
    await expect(met).toHaveScreenshot();
});