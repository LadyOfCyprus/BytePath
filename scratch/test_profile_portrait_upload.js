const fs = require('fs');
const assert = require('assert');

console.log('=== TEST SUITE: Profile Portrait Picture Upload in Resume Builder ===');

// 1. Static HTML check on resume-builder.html
const resumeHtml = fs.readFileSync('resume-builder.html', 'utf8');
assert(resumeHtml.includes('id="resAvatarLarge"'), 'Missing #resAvatarLarge in resume-builder.html');
assert(resumeHtml.includes('id="resAvatarInput"'), 'Missing #resAvatarInput file input in resume-builder.html');
assert(resumeHtml.includes('id="resUploadBtn"'), 'Missing #resUploadBtn in resume-builder.html');
assert(resumeHtml.includes('id="resRemoveAvatarBtn"'), 'Missing #resRemoveAvatarBtn in resume-builder.html');
assert(resumeHtml.includes('Profile Portrait'), 'Missing "Profile Portrait" section title in resume-builder.html');
assert(resumeHtml.includes('triggerResumeAvatarUpload()'), 'Missing triggerResumeAvatarUpload call in resume-builder.html');
assert(resumeHtml.includes('handleRemoveResumeAvatar()'), 'Missing handleRemoveResumeAvatar call in resume-builder.html');
console.log('[PASS] 1. resume-builder.html has complete interactive Profile Portrait markup.');

// 2. Mock environment to test logic
class MockElement {
  constructor(tag, id = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.innerText = '';
    this.innerHTML = '';
    this.value = '';
    this.style = {};
    this.classList = { add: () => {}, remove: () => {} };
    this.clicked = false;
  }
  click() { this.clicked = true; }
}

const elements = {};
let storage = {};

global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = v; },
  clear: () => { storage = {}; }
};

global.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

global.document = {
  title: '',
  addEventListener: () => {},
  getElementById: (id) => elements[id] || null,
  querySelectorAll: () => [],
  querySelector: () => null,
  createElement: (tag) => new MockElement(tag),
  body: { appendChild: () => {} }
};

global.window = {
  location: { search: '' }
};

global.alert = (msg) => console.log('[Alert]:', msg);
global.showToast = (msg) => console.log('[Toast]:', msg);

// Mock FileReader
global.FileReader = class {
  readAsDataURL(file) {
    setTimeout(() => {
      if (this.onload) {
        this.onload({ target: { result: 'data:image/png;base64,mockPortraitPhotoData12345' } });
      }
    }, 10);
  }
};

// Load app.js
const appCode = fs.readFileSync('js/app.js', 'utf8');
eval(appCode + `
  global.getAppState = getAppState;
  global.saveAppState = saveAppState;
  global.initResumeBuilderPage = initResumeBuilderPage;
  global.renderProfileAvatar = renderProfileAvatar;
  global.triggerResumeAvatarUpload = triggerResumeAvatarUpload;
  global.handleAvatarFileChange = handleAvatarFileChange;
  global.handleRemoveResumeAvatar = handleRemoveResumeAvatar;
`);

elements['resAvatarLarge'] = new MockElement('div', 'resAvatarLarge');
elements['resAvatarInput'] = new MockElement('input', 'resAvatarInput');
elements['resUploadBtn'] = new MockElement('button', 'resUploadBtn');
elements['resRemoveAvatarBtn'] = new MockElement('button', 'resRemoveAvatarBtn');
elements['profAvatarLarge'] = new MockElement('div', 'profAvatarLarge');
elements['settingsAvatarLarge'] = new MockElement('div', 'settingsAvatarLarge');

// Initialize with empty state
global.localStorage.clear();
global.initResumeBuilderPage();

assert.strictEqual(elements['resRemoveAvatarBtn'].style.display, 'none');
assert.strictEqual(elements['resUploadBtn'].innerText, 'Upload picture');
assert.strictEqual(elements['resAvatarLarge'].innerHTML.includes('avatar-badge-icon'), true);
console.log('[PASS] 2. initResumeBuilderPage renders clean initials with upload button.');

// Test clicking upload button
global.triggerResumeAvatarUpload();
assert.strictEqual(elements['resAvatarInput'].clicked, true);
console.log('[PASS] 3. triggerResumeAvatarUpload triggers file input click.');

// Test file upload handling
const mockFile = {
  name: 'portrait_headshot.jpg',
  type: 'image/jpeg',
  size: 1024 * 500
};

global.handleAvatarFileChange({ target: { files: [mockFile] } });

setTimeout(() => {
  const state = global.getAppState();
  assert.strictEqual(state.avatarDataUrl, 'data:image/png;base64,mockPortraitPhotoData12345');
  assert.strictEqual(elements['resAvatarLarge'].innerHTML.includes('mockPortraitPhotoData12345'), true);
  assert.strictEqual(elements['resAvatarLarge'].innerHTML.includes('class="avatar-photo"'), true);
  assert.strictEqual(elements['resUploadBtn'].innerText, 'Change photo');
  assert.strictEqual(elements['resRemoveAvatarBtn'].style.display, 'inline-flex');
  console.log('[PASS] 4. handleAvatarFileChange uploaded portrait, saved to state, and updated Profile Portrait avatar.');

  // Test removing photo
  global.handleRemoveResumeAvatar();
  const stateAfterRemove = global.getAppState();
  assert.strictEqual(stateAfterRemove.avatarDataUrl, '');
  assert.strictEqual(elements['resRemoveAvatarBtn'].style.display, 'none');
  assert.strictEqual(elements['resUploadBtn'].innerText, 'Upload picture');
  assert.strictEqual(elements['resAvatarLarge'].innerHTML.includes('mockPortraitPhotoData12345'), false);
  console.log('[PASS] 5. handleRemoveResumeAvatar successfully removes portrait photo and resets state.');

  console.log('\nALL PROFILE PORTRAIT UPLOAD TESTS PASSED (5/5)!');
}, 50);
