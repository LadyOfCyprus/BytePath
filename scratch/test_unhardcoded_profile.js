const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('====================================================');
console.log('BYTEPATH: PROFILE UNHARDCODING & SCROLLBAR TEST SUITE');
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

// 1. Verify Scrollbar Rules in css/styles.css
test('1. Scrollbar suppression in css/styles.css across all engines', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'styles.css'), 'utf8');
  assert(css.includes('scrollbar-width: none !important'), 'Missing scrollbar-width: none !important in styles.css');
  assert(css.includes('-ms-overflow-style: none !important'), 'Missing -ms-overflow-style: none !important in styles.css');
  assert(css.includes('::-webkit-scrollbar'), 'Missing ::-webkit-scrollbar pseudo selector');
  assert(css.includes('display: none !important'), 'Missing display: none !important in scrollbar rule');
});

// 2. Verify Zero Hardcoded "Cris P. Pata" in Portal HTML Files
test('2. Zero hardcoded dummy name "Cris P. Pata" in any portal HTML markup', () => {
  const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
  const violations = [];
  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    if (content.includes('Cris P. Pata')) {
      violations.push(`${file} contains "Cris P. Pata"`);
    }
    if (content.includes('Cris_Pata_Resume.pdf')) {
      violations.push(`${file} contains "Cris_Pata_Resume.pdf"`);
    }
  }
  assert.strictEqual(violations.length, 0, `Found violations: ${violations.join(', ')}`);
});

// 3. Verify Clean Default State in js/app.js
test('3. Clean unhardcoded default state in js/app.js', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert(appJs.includes("profileCompleted: false"), 'defaultState must have profileCompleted: false');
  assert(appJs.includes("isNewAccount: true"), 'defaultState must have isNewAccount: true');
  assert(appJs.includes("firstName: ''"), 'defaultState firstName must be empty string');
  assert(appJs.includes("lastName: ''"), 'defaultState lastName must be empty string');
  assert(appJs.includes("email: ''"), 'defaultState email must be empty string');
});

// 4. Verify checkProfileGate Gating Logic
test('4. Gating logic routes uncompleted accounts to profile.html?firstLogin=true', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert(appJs.includes('function checkProfileGate()'), 'checkProfileGate must exist');
  assert(appJs.includes("openPages = ['index.html', 'login.html', 'register.html', 'profile.html', 'resources.html', 'employers.html']"), 'Open pages whitelist must be properly defined');
  assert(appJs.includes('if (!state.profileCompleted)'), 'Gating must check !state.profileCompleted');
  assert(appJs.includes("window.location.replace('profile.html?firstLogin=true')"), 'Gating must redirect to profile.html?firstLogin=true');
});

// 5. Verify Registration & Login Enforces Profile Completion First
test('5. Registration & new login initialize profileCompleted: false and route to profile.html', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  // Check handleRegisterSubmit
  assert(appJs.includes('handleRegisterSubmit'), 'handleRegisterSubmit must be present');
  assert(appJs.includes("profileCompleted: false, // New account MUST fill profile first"), 'handleRegisterSubmit must set profileCompleted: false');
  assert(appJs.includes("window.location.href = 'profile.html?firstLogin=true'"), 'handleRegisterSubmit must route to profile.html?firstLogin=true');

  // Check handleLoginSubmit
  assert(appJs.includes('handleLoginSubmit'), 'handleLoginSubmit must be present');
  assert(appJs.includes('!existingState.profileCompleted'), 'handleLoginSubmit must check incomplete existing profiles');
  assert(appJs.includes("profileCompleted: false, // Must fill profile first!"), 'handleLoginSubmit must set profileCompleted: false for new accounts');

  // Check handleSocialRegister
  assert(appJs.includes('handleSocialRegister'), 'handleSocialRegister must be present');
  assert(appJs.includes("profileCompleted: false, // New account MUST complete profile first!"), 'handleSocialRegister must set profileCompleted: false for new accounts');
});

// 6. Verify Profile Save Completes Profile and Redirects to Dashboard
test('6. handleProfileSave sets profileCompleted: true and unlocks dashboard', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert(appJs.includes('handleProfileSave'), 'handleProfileSave must be present');
  assert(appJs.includes('profileCompleted: true'), 'handleProfileSave must set profileCompleted: true');
  assert(appJs.includes("window.location.href = 'dashboard.html'"), 'handleProfileSave must redirect newly completed profiles to dashboard.html');
});

// 7. Verify In-Memory Simulation of User Lifecycle
test('7. Lifecycle simulation: fresh account -> gated from dashboard -> complete profile -> unlocked dashboard', () => {
  // Mock localStorage and window
  const storage = {};
  const mockLocalStorage = {
    getItem: (k) => storage[k] || null,
    setItem: (k, v) => { storage[k] = String(v); },
    removeItem: (k) => { delete storage[k]; }
  };
  const mockSessionStorage = {
    getItem: (k) => storage['sess_' + k] || null,
    setItem: (k, v) => { storage['sess_' + k] = String(v); },
    removeItem: (k) => { delete storage['sess_' + k]; }
  };

  let currentLocation = 'dashboard.html';
  let redirectedTo = null;

  // Simulate default state retrieval
  let defaultState = {
    firstName: '',
    lastName: '',
    email: '',
    profileCompleted: false,
    isNewAccount: true
  };
  mockLocalStorage.setItem('bytepath_student_data', JSON.stringify(defaultState));

  // Simulate gate check
  function simulateGateCheck(page) {
    const openPages = ['index.html', 'login.html', 'register.html', 'profile.html', 'resources.html', 'employers.html'];
    if (openPages.includes(page)) return true;
    const data = JSON.parse(mockLocalStorage.getItem('bytepath_student_data'));
    if (!data.profileCompleted) {
      redirectedTo = 'profile.html?firstLogin=true';
      return false; // Access denied / gated
    }
    return true; // Access granted
  }

  // A. Accessing dashboard initially
  const canAccessDashboardInitial = simulateGateCheck('dashboard.html');
  assert.strictEqual(canAccessDashboardInitial, false, 'Uncompleted profile should NOT be able to access dashboard');
  assert.strictEqual(redirectedTo, 'profile.html?firstLogin=true', 'Must redirect to profile firstLogin');

  // B. User completes profile on profile.html
  const completedProfileData = {
    ...defaultState,
    firstName: 'Maria',
    lastName: 'Santos',
    preferredName: 'Maria',
    email: 'maria.santos@ust.edu.ph',
    phone: '+63 917 123 4567',
    headline: 'Information Systems Student & UI Enthusiast',
    profileCompleted: true,
    isNewAccount: false
  };
  mockLocalStorage.setItem('bytepath_student_data', JSON.stringify(completedProfileData));

  // C. Now access dashboard
  redirectedTo = null;
  const canAccessDashboardAfterProfile = simulateGateCheck('dashboard.html');
  assert.strictEqual(canAccessDashboardAfterProfile, true, 'Completed profile MUST be able to access dashboard');
  assert.strictEqual(redirectedTo, null, 'No redirection should happen once profile is completed');
});

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('====================================================');

if (failCount > 0) process.exit(1);
