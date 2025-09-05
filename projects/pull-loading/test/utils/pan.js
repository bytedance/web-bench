
async function pan(locator, deltaX, deltaY, steps) {
  const { centerX, centerY } = await locator.evaluate((target) => {
    const bounds = target.getBoundingClientRect();
    const centerX = bounds.left + bounds.width / 2;
    const centerY = bounds.top + bounds.height / 2;
    return { centerX, centerY };
  });

  // Providing only clientX and clientY as the app only cares about those.
  const touches = [{
    identifier: 0,
    clientX: centerX,
    clientY: centerY,
    pageX: centerX,  // need
    pageY: centerY // need
  }];
  await locator.dispatchEvent('touchstart', { touches, changedTouches: touches, targetTouches: touches });

  let _steps = steps; // straange and sb error for infinite affects event init

  const x1 = parseInt(isFinite(centerX + deltaX) ? parseInt(centerX + deltaX) : centerX);
  const y1 = parseInt(isFinite(centerY + deltaY) ? parseInt(centerY + deltaY) : centerY);

  // console.log("centerY+deltaY :"+ centerY+deltaY);
  // If the element you're trying to interact with hasn't fully loaded when Selenium attempts to interact with it, its dimensions might be undefined or have non-finite values. 

  for (let i = 1; i <= _steps; i++) {
    const touchesm = [{
      identifier: Date.now(),
      clientX: x1,
      clientY: y1,
      pageX: x1,
      pageY: y1
    }];

    await locator.dispatchEvent('touchmove', { touchesm, changedTouches: touchesm, targetTouches: touchesm })
  }

  await locator.dispatchEvent('touchend');
}


  async function isTouch(page) {
    return await page.evaluate(() => 'ontouchstart' in window)
  }

  async function readNum(str) {
    const match = str.match(/^[1-9]\d*/g)
    console.log(match)
    if (match) {
      return parseInt(match[0])
    }
  }
  
  module.exports = {
    isTouch,
    pan,
    readNum
  }