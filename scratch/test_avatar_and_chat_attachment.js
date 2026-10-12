const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('===========================================================');
console.log('TEST SUITE: Profile Avatar Upload & Messaging Picture Attachment');
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

// 1. Profile Avatar Controls in profile.html
test('1. profile.html has interactive avatar upload elements', () => {
  const html = fs.readFileSync(path.join(rootDir, 'profile.html'), 'utf8');
  assert(html.includes('id="profAvatarInput"'), 'Missing #profAvatarInput in profile.html');
  assert(html.includes('accept="image/*"'), 'Missing accept="image/*" on avatar input in profile.html');
  assert(html.includes('id="profAvatarLarge"'), 'Missing #profAvatarLarge in profile.html');
  assert(html.includes('id="removeAvatarBtn"'), 'Missing #removeAvatarBtn in profile.html');
  assert(html.includes('Change photo'), 'Missing Change photo text/button in profile.html');
});

// 2. Profile Avatar Logic in js/app.js
test('2. js/app.js implements avatarDataUrl state and upload/removal handlers', () => {
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert(appJs.includes("avatarDataUrl: ''"), 'Missing avatarDataUrl in defaultState');
  assert(appJs.includes('function renderProfileAvatar()'), 'Missing renderProfileAvatar() function');
  assert(appJs.includes('function handleAvatarFileChange(e)'), 'Missing handleAvatarFileChange() function');
  assert(appJs.includes('function handleRemoveAvatar()'), 'Missing handleRemoveAvatar() function');
  assert(appJs.includes('state.avatarDataUrl'), 'syncHeaderUser must check state.avatarDataUrl');
  assert(appJs.includes('FileReader'), 'handleAvatarFileChange must use FileReader');
});

// 3. Settings Avatar Integration
test('3. settings.html syncs with profile avatar', () => {
  const html = fs.readFileSync(path.join(rootDir, 'settings.html'), 'utf8');
  assert(html.includes('id="settingsAvatarLarge"'), 'Missing #settingsAvatarLarge in settings.html');
  const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
  assert(appJs.includes("document.getElementById('settingsAvatarLarge')"), 'syncHeaderUser must update settingsAvatarLarge');
});

// 4. Messaging Picture Attachment Controls in messages.html
test('4. messages.html contains picture attachment controls and preview tray', () => {
  const html = fs.readFileSync(path.join(rootDir, 'messages.html'), 'utf8');
  assert(html.includes('id="chatAttachmentInput"'), 'Missing #chatAttachmentInput in messages.html');
  assert(html.includes('accept="image/*"'), 'Missing accept="image/*" on chat attachment input');
  assert(html.includes('id="chatAttachmentTray"'), 'Missing #chatAttachmentTray in messages.html');
  assert(html.includes('id="chatAttachedThumb"'), 'Missing #chatAttachedThumb in messages.html');
  assert(html.includes('id="chatAttachedName"'), 'Missing #chatAttachedName in messages.html');
  assert(html.includes('id="imageModal"'), 'Missing #imageModal for image preview');
});

// 5. Messaging Picture Attachment Logic in messages.html
test('5. messages.html handles file selection, sending image bubbles, and lightbox preview', () => {
  const html = fs.readFileSync(path.join(rootDir, 'messages.html'), 'utf8');
  assert(html.includes('function handleChatFileSelect(event)'), 'Missing handleChatFileSelect() in messages.html');
  assert(html.includes('function clearChatAttachment()'), 'Missing clearChatAttachment() in messages.html');
  assert(html.includes('function handleSendMessage(e)'), 'Missing handleSendMessage() in messages.html');
  assert(html.includes('function openFullImage(src)'), 'Missing openFullImage() in messages.html');
  assert(html.includes('currentAttachment'), 'handleSendMessage must check currentAttachment');
});

// 6. CSS Styles for Avatars and Attachments
test('6. css/styles.css includes styling for avatar photos and chat attachments', () => {
  const css = fs.readFileSync(path.join(rootDir, 'css', 'styles.css'), 'utf8');
  assert(css.includes('.avatar-photo'), 'Missing .avatar-photo in css/styles.css');
  assert(css.includes('.chat-attachment-img'), 'Missing .chat-attachment-img in css/styles.css');
  assert(css.includes('.avatar-circle img'), 'Missing .avatar-circle img in css/styles.css');
});

console.log('\n===========================================================');
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log('===========================================================');

if (failCount > 0) process.exit(1);
