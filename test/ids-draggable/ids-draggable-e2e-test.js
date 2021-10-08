describe('Ids Draggable e2e Tests', () => {
  const exampleUrl = 'http://localhost:4444/ids-draggable';

  beforeAll(async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
  });

  it('should not have errors', async () => {
    await expect(page.title()).resolves.toMatch('IDS Draggable Component');
  });

  it('can drag with no axis', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#no-axis');
    let rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(24);
    expect(rects.y).toBeCloseTo(91.5);
    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(126, 19);
    await page.mouse.up();
    rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(93);
    expect(rects.y).toBeCloseTo(-13.5);
  });

  it('can drag on y axis', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#axis-y');
    let rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(212);
    expect(rects.y).toBeCloseTo(91.5);
    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-300, -200);
    await page.mouse.up();
    rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(212); // x didnt change
    expect(rects.y).toBeCloseTo(-232.5);
  });

  it('can drag on x axis', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#axis-x');
    let rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(400);
    expect(rects.y).toBeCloseTo(91.5);
    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-300, -200);
    await page.mouse.up();
    rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(-333);
    expect(rects.y).toBeCloseTo(91.5); // y didnt change
  });

  it('can drag with limits', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#limits');
    let rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(588);
    expect(rects.y).toBeCloseTo(91.5);
    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-300, -200);
    await page.mouse.up();
    rects = await example.boundingBox();

    // will max out at a limit
    expect(rects.x).toBeCloseTo(568);
    expect(rects.y).toBeCloseTo(11.5);

    await page.mouse.down();
    await page.mouse.move(-300, -200);
    await page.mouse.up();

    // will max out at a limit
    rects = await example.boundingBox();
    expect(rects.x).toBeCloseTo(568);
    expect(rects.y).toBeCloseTo(11.5);
  });

  it('can drag with containment', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#contained');
    let rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(24);
    expect(rects.y).toBeCloseTo(205);
    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-300, 300);
    await page.mouse.up();
    rects = await example.boundingBox();

    // will max out at a limit
    expect(rects.x).toBeCloseTo(24);
    expect(rects.y).toBeCloseTo(267);
  });

  it('can drag with containment on axis x', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#contained-y');
    let rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(90);
    expect(rects.y).toBeCloseTo(205);
    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-300, 300);
    await page.mouse.up();
    rects = await example.boundingBox();

    // will max out at the container limits
    expect(rects.x).toBeCloseTo(90);
    expect(rects.y).toBeCloseTo(267);
  });

  it('can drag with containment on axis y', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    const example = await page.$('#contained-x');
    let rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(156);
    expect(rects.y).toBeCloseTo(205);
    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(-300, 300);
    await page.mouse.up();
    rects = await example.boundingBox();

    // will max out at the container limits
    expect(rects.x).toBeCloseTo(24);
    expect(rects.y).toBeCloseTo(205);
  });

  it('will not drag when disabled', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("#no-axis").disabled = true');
    const example = await page.$('#no-axis');
    let rects = await example.boundingBox();
    expect(rects.x).toBeCloseTo(24);
    expect(rects.y).toBeCloseTo(91.5);

    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(126, 19);
    await page.mouse.up();
    rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(24);
    expect(rects.y).toBeCloseTo(91.5);
  });

  it('will not re-drag when isDragging is true', async () => {
    await page.goto(exampleUrl, { waitUntil: ['networkidle2', 'load'] });
    await page.evaluate('document.querySelector("#no-axis").isDragging = true');
    const example = await page.$('#no-axis');
    let rects = await example.boundingBox();
    expect(rects.x).toBeCloseTo(24);
    expect(rects.y).toBeCloseTo(91.5);

    await page.mouse.move(rects.x + rects.width / 2, rects.y + rects.height / 2);
    await page.mouse.down();
    await page.mouse.move(126, 19);
    await page.mouse.up();
    rects = await example.boundingBox();

    expect(rects.x).toBeCloseTo(93);
    expect(rects.y).toBeCloseTo(-13.5);
  });

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(exampleUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'region'] });
  });
});

describe('Ids Draggable Sandbox e2e Tests', () => {
  const sandboxUrl = 'http://localhost:4444/ids-draggable/sandbox.html';

  it('should pass Axe accessibility tests', async () => {
    await page.setBypassCSP(true);
    await page.goto(sandboxUrl, { waitUntil: ['domcontentloaded', 'networkidle0'] });
    await expect(page).toPassAxeTests({ disabledRules: ['color-contrast', 'region'] });
  });
});
