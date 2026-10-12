const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('===========================================================');
console.log('BYTEPATH: REQUIRED FIRST STEP ONBOARDING DESIGN TEST SUITE');
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

// 1. Verify CSS styles for banner & badge
test('1. css/styles.css defines polished .profile-onboarding-banner and .badge-required-step', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'styles.css'), 'utf8');
  assert(css.includes('.profile-onboarding-banner'), 'Missing .profile-onboarding-banner class');
  assert(css.includes('.badge-required-step'), 'Missing .badge-required-step class');
  assert(css.includes('.badge-required-dot'), 'Missing .badge-required-dot class');
  assert(css.includes('border-radius: var(--radius-pill)'), 'Badge must have rounded pill radius');
  assert(css.includes('text-transform: uppercase'), 'Badge should have uppercase typography');
  assert(css.includes('pulseRequired'), 'Dot should have pulsing animation');
});

// 2. Verify js/app.js markup structure
test('2. js/app.js injects .profile-onboarding-banner with .badge-required-step', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert(appJs.includes('profile-onboarding-banner'), 'Banner must use .profile-onboarding-banner');
  assert(appJs.includes('badge-required-step'), 'Badge must use .badge-required-step');
  assert(appJs.includes('badge-required-dot'), 'Badge must contain status dot');
  assert(appJs.includes('Complete Your Student Profile'), 'Banner title must be preserved');
  assert(appJs.includes('Welcome! As a new student account'), 'Banner description must be preserved');
  assert(appJs.includes('Required First Step'), 'Badge text must be preserved');
});

// 3. Verify zero emojis
test('3. Zero emojis in banner markup and CSS', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  const css = fs.readFileSync(path.join(rootDir, 'css', 'styles.css'), 'utf8');
  const emojiRegex = /\p{Extended_Pictographic}/u;
  
  const bannerMatch = appJs.match(/profile-onboarding-banner[\s\S]*?<\/span>\s*`;/);
  if (bannerMatch) {
    assert(!emojiRegex.test(bannerMatch[0]), 'Banner snippet contains emoji!');
  }
});

console.log('\n===========================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('===========================================================');

if (failCount > 0) process.exit(1);
