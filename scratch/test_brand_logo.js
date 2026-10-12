const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('===========================================================');
console.log('BYTEPATH: B LOGO REPLACEMENT TEST SUITE');
console.log('===========================================================\n');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`[PASS] ${description}`);
    passCount++;
  } catch (err) {
    console.error(`[FAIL] ${description}`);
    console.error(`       Error: ${err.message}`);
    failCount++;
  }
}

const rootDir = path.resolve(__dirname, '..');

// 1. Verify CSS styles for .brand-circle
test('1. css/styles.css defines centered bold B logo styling for .brand-circle', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'styles.css'), 'utf8');
  assert(css.includes('.brand-circle'), 'Missing .brand-circle class');
  assert(css.includes('display: flex'), 'Must have flex centering');
  assert(css.includes('align-items: center'), 'Must align-items: center');
  assert(css.includes('justify-content: center'), 'Must justify-content: center');
  assert(css.includes('.brand-circle:empty::before'), 'Must have fallback B for empty circles');
});

// 2. Verify all HTML files have B inside .brand-circle
test('2. All HTML files contain "B" inside brand-circle', () => {
  const files = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
  files.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    const match = content.match(/<div class="brand-circle"[^>]*>([\s\S]*?)<\/div>/);
    assert(match, `${file} is missing brand-circle`);
    assert.strictEqual(match[1].trim(), 'B', `${file} does not have "B" inside brand-circle (found: "${match[1]}")`);
  });
});

console.log('\n===========================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('===========================================================');

if (failCount > 0) process.exit(1);
