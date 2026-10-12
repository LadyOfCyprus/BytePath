const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('BYTEPATH: INITIAL LANDING PAGE REDIRECT TEST SUITE');
console.log('====================================================\n');

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

// 1. Verify index.html head contains landing redirect script
test('1. index.html head contains landing redirect script', () => {
  const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
  assert(indexHtml.includes("window.location.replace('login.html')"), 'Must redirect fresh visitors to login.html');
  assert(indexHtml.includes("window.location.search.includes('preview=true')"), 'Must support ?preview=true bypass');
  assert(indexHtml.includes("state.isLoggedIn && state.profileCompleted"), 'Must verify authenticated state');
  assert(indexHtml.includes("window.location.replace('dashboard.html')"), 'Must route authenticated completed profiles to dashboard.html');
});

// 2. Verify login.html and register.html brand logo targets
test('2. login.html and register.html brand logos link to login.html', () => {
  const loginHtml = fs.readFileSync(path.join(rootDir, 'login.html'), 'utf8');
  const registerHtml = fs.readFileSync(path.join(rootDir, 'register.html'), 'utf8');

  assert(loginHtml.includes('href="login.html" class="brand-logo"'), 'login.html brand logo must point to login.html');
  assert(registerHtml.includes('href="login.html" class="brand-logo"'), 'register.html brand logo must point to login.html');
});

// 3. Verify js/app.js defaultState and auth state tracking
test('3. js/app.js tracks isLoggedIn in defaultState, login, register, and logout', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert(appJs.includes('isLoggedIn: false'), 'defaultState must have isLoggedIn: false');
  assert(appJs.includes('saveAppState({ isLoggedIn: false })'), 'handleLogout must set isLoggedIn: false');
  assert(appJs.includes('isLoggedIn: true'), 'Login and register must set isLoggedIn: true');
});

// 4. Simulate landing redirect logic across all user conditions
test('4. Simulation of landing page redirect logic across user scenarios', () => {
  function simulateLandingRedirect(localStorageData, search = '') {
    let redirectedUrl = null;
    const window = {
      location: {
        search: search,
        replace: (url) => { redirectedUrl = url; }
      }
    };

    // Exactly replicate the script inside index.html head
    (function() {
      if (window.location.search.includes('preview=true')) return;
      try {
        const raw = localStorageData ? JSON.stringify(localStorageData) : null;
        if (raw) {
          const state = JSON.parse(raw);
          if (state && state.isLoggedIn && state.profileCompleted) {
            window.location.replace('dashboard.html');
            return;
          }
        }
      } catch (e) {}
      window.location.replace('login.html');
    })();

    return redirectedUrl;
  }

  // A. Fresh visitor opening website for the first time
  const freshRedirect = simulateLandingRedirect(null);
  assert.strictEqual(freshRedirect, 'login.html', 'Fresh visitor must land directly on login.html');

  // B. Visitor with empty default state
  const defaultStateRedirect = simulateLandingRedirect({
    isLoggedIn: false,
    profileCompleted: false
  });
  assert.strictEqual(defaultStateRedirect, 'login.html', 'Unauthenticated visitor must land on login.html');

  // C. Visitor logged in but profile not yet completed
  const incompleteProfileRedirect = simulateLandingRedirect({
    isLoggedIn: true,
    profileCompleted: false
  });
  assert.strictEqual(incompleteProfileRedirect, 'login.html', 'Incomplete profile before entering must route through login');

  // D. Active logged-in student with completed profile
  const loggedInRedirect = simulateLandingRedirect({
    isLoggedIn: true,
    profileCompleted: true
  });
  assert.strictEqual(loggedInRedirect, 'dashboard.html', 'Logged-in user with completed profile goes straight to dashboard.html');

  // E. Explicit preview mode (?preview=true)
  const previewRedirect = simulateLandingRedirect(null, '?preview=true');
  assert.strictEqual(previewRedirect, null, 'Preview mode (?preview=true) must not trigger redirect');
});

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('====================================================');

if (failCount > 0) process.exit(1);
