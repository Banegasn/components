#!/usr/bin/env node
/**
 * screenshot-packages.js
 *
 * Extracts the CDN HTML example from each package README, serves it via a
 * local HTTP server, and screenshots the rendered result with Playwright.
 * Components load from the real jsDelivr CDN — no Angular app needed.
 *
 * Usage:
 *   node scripts/screenshot-packages.js [options]
 *
 * Options:
 *   --out <dir>       Output dir inside each package (default: images)
 *   --width <px>      Viewport width  (default: 860)
 *   --packages <list> Comma-separated package names to capture (default: all)
 *   --delay <ms>      Wait after page load in ms (default: 1500)
 *   --no-headless     Run browser headed (useful for debugging)
 *   --debug           Headed mode + keeps the tab open after each screenshot
 *                     so you can inspect the page. Press Enter in the terminal
 *                     to advance to the next package.
 *
 * Examples:
 *   node scripts/screenshot-packages.js
 *   node scripts/screenshot-packages.js --packages m3-button,m3-card
 *   node scripts/screenshot-packages.js --no-headless --packages m3-badge
 *
 * Adding a new package:
 *   Add its name to the PACKAGES array — the script reads the README
 *   automatically. No other changes needed.
 */

const { chromium } = require('playwright');
const http = require('http');
const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Package registry
// Per-package optional `postLoad` runs in the page after components render,
// before the screenshot is taken. Use it to open menus, show tooltips, etc.
// ---------------------------------------------------------------------------
const PACKAGES = [
  { name: 'm3-badge' },
  { name: 'm3-button' },
  { name: 'm3-card' },
  { name: 'm3-checkbox' },
  { name: 'm3-chip' },
  { name: 'm3-dialog' },
  { name: 'm3-fab-menu' },
  { name: 'm3-loading-indicator' },
  {
    name: 'm3-menu',
    // menu is already open via `open` attribute in the README example
  },
  { name: 'm3-navigation-bar' },
  { name: 'm3-navigation-rail' },
  { name: 'm3-progress' },
  { name: 'm3-radio-button' },
  { name: 'm3-search-bar' },
  { name: 'm3-slider' },
  { name: 'm3-split-button' },
  { name: 'm3-switch' },
  { name: 'm3-tabs' },
  { name: 'm3-text-field' },
  {
    name: 'm3-tooltip',
    // Set _visible directly on each tooltip instance and trigger a re-render
    postLoad: () => {
      document.querySelectorAll('m3-tooltip').forEach((el) => {
        el._visible = true;
        if (el.requestUpdate) el.requestUpdate();
      });
    },
  },
  // svelte-components has no CDN HTML example — skipped
];

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith('--')) {
      const key  = arg.slice(2);
      const next = argv[i + 1];
      args[key]  = (!next || next.startsWith('--')) ? true : (i++, next);
    }
  }
  return args;
}

const args      = parseArgs(process.argv);
const OUT_DIR   = args.out   || 'images';
const W         = parseInt(args.width  || '860',  10);
const DELAY_MS  = parseInt(args.delay  || '1500', 10);
const DEBUG     = args['debug'] === true;
const HEADLESS  = DEBUG ? false : args['no-headless'] !== true;
const REPO_ROOT = path.resolve(__dirname, '..');

const filterList = args.packages
  ? args.packages.split(',').map(s => s.trim())
  : null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const log  = m => console.log(`  ${m}`);
const ok   = m => console.log(`  ✓ ${m}`);
const warn = m => console.warn(`  ⚠ ${m}`);
const err  = m => console.error(`  ✗ ${m}`);

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

/**
 * In --debug mode: print the page URL and wait for the user to press Enter
 * before moving to the next package. The browser tab stays open so you can
 * inspect the rendered result in DevTools.
 */
function waitForEnter(label) {
  return new Promise(resolve => {
    process.stdout.write(`\n  🔍 Debug pause after [${label}] — press Enter to continue... `);
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', () => resolve());
  });
}

/**
 * Extract the first ```html block containing a full <!DOCTYPE html> document.
 */
function extractCdnExample(markdown) {
  const re = /```html\s*([\s\S]*?)```/g;
  let match;
  while ((match = re.exec(markdown)) !== null) {
    const block = match[1].trim();
    if (block.toLowerCase().startsWith('<!doctype html')) return block;
  }
  return null;
}

/**
 * Inject screenshot-friendly styles:
 * - White background (overrides any coloured bg in the example)
 * - Consistent padding, no extra margin
 */
function injectScreenshotStyles(html) {
  const style = `<style data-screenshot>
  html, body {
    background: #ffffff !important;
    margin: 0 !important;
    padding: 24px !important;
    box-sizing: border-box !important;
  }
</style>`;
  return html.replace('</head>', `${style}\n</head>`);
}

/**
 * Inject a screenshot reference into the README after the first heading,
 * only if not already present.
 */
function updateReadme(pkgDir, filename) {
  const readmePath = path.join(pkgDir, 'README.md');
  if (!fs.existsSync(readmePath)) return;
  let content = fs.readFileSync(readmePath, 'utf8');
  if (content.includes(filename)) return;
  const imgTag = `\n![Preview](${OUT_DIR}/${filename})\n`;
  content = content.replace(/^(#[^\n]+\n)/, `$1${imgTag}`);
  fs.writeFileSync(readmePath, content, 'utf8');
  ok('Updated README with image reference');
}

// ---------------------------------------------------------------------------
// Local HTTP server — serves the current HTML at GET /page
// Components load from the real jsDelivr CDN URLs embedded in the HTML.
// ---------------------------------------------------------------------------
function createServer(getHtml) {
  return http.createServer((req, res) => {
    if (req.url === '/page') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(getHtml());
    }
    res.writeHead(404);
    res.end('Not found');
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const targets = filterList
    ? PACKAGES.filter(p => filterList.includes(p.name))
    : PACKAGES;

  if (!targets.length) {
    err('No matching packages. Check --packages filter.');
    process.exit(1);
  }

  console.log(`\n📸 README screenshot capture`);
  console.log(`   Viewport : ${W}px wide (auto-height)`);
  console.log(`   Packages : ${targets.map(p => p.name).join(', ')}\n`);

  // Shared HTML slot mutated per package
  let currentHtml = '';
  const server = createServer(() => currentHtml);
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  const pageUrl  = `http://127.0.0.1:${port}/page`;

  const browser = await chromium.launch({ headless: HEADLESS });
  const context = await browser.newContext({
    viewport: { width: W, height: 800 },
    deviceScaleFactor: 1,
  });
  const page    = await context.newPage();

  // Silence app console noise (disabled in --debug mode)
  if (!DEBUG) {
    page.on('console', () => {});
    page.on('pageerror', () => {});
  }

  const results = { ok: [], failed: [] };

  for (const pkg of targets) {
    const pkgName = pkg.name;
    console.log(`\n📦 ${pkgName}`);
    const pkgDir   = path.join(REPO_ROOT, 'packages', pkgName);
    const readmePath = path.join(pkgDir, 'README.md');

    if (!fs.existsSync(readmePath)) {
      warn('No README.md — skipping');
      results.failed.push(pkgName);
      continue;
    }

    const raw = extractCdnExample(fs.readFileSync(readmePath, 'utf8'));
    if (!raw) {
      warn('No <!DOCTYPE html> CDN example found — skipping');
      results.failed.push(pkgName);
      continue;
    }

    log(`Extracted CDN example (${raw.length} chars)`);
    currentHtml = injectScreenshotStyles(raw);

    const outDir  = path.join(pkgDir, OUT_DIR);
    ensureDir(outDir);
    const outPath = path.join(outDir, 'preview.png');

    try {
      // Navigate — networkidle waits for CDN scripts to finish loading
      await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 45_000 });

      // Extra settle time for web component rendering & animations
      await page.waitForTimeout(DELAY_MS);

      // Run any package-specific setup (open menus, show tooltips, etc.)
      if (pkg.postLoad) {
        await page.evaluate(pkg.postLoad);
        await page.waitForTimeout(400); // let the state change render
      }

      // Step 1: measure natural content width (capped at 820px)
      const contentW = await page.evaluate(() => {
        document.body.style.display  = 'inline-block';
        document.body.style.width    = 'max-content';
        document.body.style.maxWidth = '820px';
        return Math.ceil(document.body.scrollWidth + 48);
      });

      // Step 2: set viewport to that width so layout reflows correctly
      await page.setViewportSize({ width: contentW, height: 800 });

      // Step 3: reset body display so height is natural again, then measure
      const contentH = await page.evaluate(() => {
        document.body.style.display = '';
        document.body.style.width   = '';
        return Math.ceil(document.body.scrollHeight + 48);
      });

      // Step 4: set final viewport and screenshot
      await page.setViewportSize({ width: contentW, height: contentH });
      await page.screenshot({ path: outPath, fullPage: false, animations: 'disabled' });

      ok(`Saved ${path.relative(REPO_ROOT, outPath)}`);
      if (DEBUG) {
        log(`Page URL: ${pageUrl}`);
        await waitForEnter(pkgName);
      }
      updateReadme(pkgDir, 'preview.png');
      results.ok.push(pkgName);
    } catch (e) {
      err(`Failed: ${e.message}`);
      results.failed.push(pkgName);
    }
  }

  await browser.close();
  server.close();

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✓ ${results.ok.length} captured`);
  if (results.failed.length) {
    console.log(`✗ ${results.failed.length} failed: ${results.failed.join(', ')}`);
    process.exit(1);
  }
  console.log('');
}

main().catch(e => {
  console.error('\nFatal:', e.message);
  process.exit(1);
});
