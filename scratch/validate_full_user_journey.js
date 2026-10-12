const fs = require('fs');
const assert = require('assert');

// Simple DOM element simulator
class JSDOMElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.innerText = '';
    this.innerHTML = '';
    this.value = '';
    this.checked = false;
    this.attributes = {};
    this.style = {};
    this.children = [];
    this.parentNode = null;
    this.classList = {
      _classes: new Set(className ? className.split(' ') : []),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c)
    };
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k] || null; }
  insertBefore(newNode, refNode) {
    this.children.push(newNode);
    newNode.parentNode = this;
  }
  remove() {
    if (this.parentNode) {
      const idx = this.parentNode.children.indexOf(this);
      if (idx !== -1) this.parentNode.children.splice(idx, 1);
      this.parentNode = null;
    }
  }
}

// Global environments
let registry = {};
let storageData = {};

global.localStorage = {
  getItem: (k) => storageData[k] || null,
  setItem: (k, v) => { storageData[k] = v; },
  clear: () => { storageData = {}; }
};

global.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

global.document = {
  title: '',
  addEventListener: () => {},
  getElementById: (id) => registry[id] || null,
  querySelector: (sel) => {
    if (sel.startsWith('#')) return registry[sel.slice(1)] || null;
    if (sel === '.details-main-card') return registry['detailsMainCard'] || null;
    if (sel === 'meta[name="description"]') return { setAttribute: () => {} };
    return null;
  },
  querySelectorAll: (sel) => {
    if (sel === '.user-chip span' || sel === '.avatar-circle') return [];
    if (sel === '[data-job-save-id]') return [];
    if (sel === 'a.edit-jump-link') return [];
    return [];
  },
  createElement: (tag) => new JSDOMElement(tag)
};

global.window = {
  location: { search: '', href: '' }
};

global.alert = () => {};

// Load app.js
const appCode = fs.readFileSync('js/app.js', 'utf8');
eval(appCode + `
  global.internshipsData = internshipsData;
  global.getJobById = getJobById;
  global.getAppState = getAppState;
  global.saveAppState = saveAppState;
  global.initDetailsPage = initDetailsPage;
  global.initStep1Form = initStep1Form;
  global.handleStep1Submit = handleStep1Submit;
  global.initStep2Form = initStep2Form;
  global.handleStep2Submit = handleStep2Submit;
  global.initReviewScreen = initReviewScreen;
  global.handleFinalSubmission = handleFinalSubmission;
  global.initConfirmationPage = initConfirmationPage;
  global.initDashboard = initDashboard;
`);

console.log('=== FULL USER JOURNEY SIMULATION ===');

// 1. Fresh state
global.localStorage.clear();
const s0 = global.getAppState();
assert.strictEqual(s0.appliedJobIds.length, 0);
console.log('[Step 1] Initial state verified: 0 applied jobs.');

// 2. Details Page for HarborWorks (Unapplied)
registry = {};
const detailsSplit = new JSDOMElement('div', 'detailsSplit');
const mainCard = new JSDOMElement('main', 'detailsMainCard');
detailsSplit.insertBefore(mainCard);
registry['detailsMainCard'] = mainCard;
registry['detailsTopBadge'] = new JSDOMElement('span', 'detailsTopBadge');
registry['detailsTitle'] = new JSDOMElement('h1', 'detailsTitle');
registry['detailsMeta'] = new JSDOMElement('p', 'detailsMeta');
registry['detailsAbout'] = new JSDOMElement('p', 'detailsAbout');
registry['detailsResponsibilities'] = new JSDOMElement('ul', 'detailsResponsibilities');
registry['detailsRequirements'] = new JSDOMElement('ul', 'detailsRequirements');
registry['detailsSidebarPaidBadge'] = new JSDOMElement('span', 'detailsSidebarPaidBadge');
registry['detailsSidebarTitle'] = new JSDOMElement('h3', 'detailsSidebarTitle');
registry['detailsSidebarCompany'] = new JSDOMElement('p', 'detailsSidebarCompany');
registry['detailsSidebarMeta'] = new JSDOMElement('div', 'detailsSidebarMeta');
registry['detailsSidebarDeadline'] = new JSDOMElement('div', 'detailsSidebarDeadline');
registry['detailsActionSlot'] = new JSDOMElement('div', 'detailsActionSlot');
registry['detailsSaveBtn'] = new JSDOMElement('button', 'detailsSaveBtn');
registry['detailsAboutCompanyTitle'] = new JSDOMElement('strong', 'detailsAboutCompanyTitle');
registry['detailsAboutCompanyDesc'] = new JSDOMElement('p', 'detailsAboutCompanyDesc');

global.window.location.search = '?id=harbor-fed-102';
global.initDetailsPage();

assert.strictEqual(registry['detailsTitle'].innerText, 'Front-End Development Intern');
assert.strictEqual(registry['detailsActionSlot'].innerHTML.includes('apply-step1.html?id=harbor-fed-102'), true);
assert.strictEqual(registry['detailsTopBadge'].className, 'badge-paid');
console.log('[Step 2] HarborWorks details page is NOT applied, links to apply-step1.html?id=harbor-fed-102.');

// 3. Step 1 Personal Details
registry = {};
registry['step1JobSubtitle'] = new JSDOMElement('p', 'step1JobSubtitle');
registry['backToJobDetails'] = new JSDOMElement('a', 'backToJobDetails');
registry['appFirstName'] = { value: 'Alex' };
registry['appLastName'] = { value: 'Santos' };
registry['appEmail'] = { value: 'alex@example.edu' };
registry['appPhone'] = { value: '09171234567' };
registry['appLocation'] = { value: 'Taguig City' };
registry['appPortfolio'] = { value: 'github.com/alex' };
registry['appLinkedIn'] = { value: 'linkedin.com/in/alex' };

global.initStep1Form();
assert.strictEqual(registry['step1JobSubtitle'].innerText.includes('Front-End Development Intern'), true);
assert.strictEqual(registry['backToJobDetails'].href, 'details.html?id=harbor-fed-102');

// User inputs their details
registry['appFirstName'].value = 'Alex';
registry['appLastName'].value = 'Santos';
registry['appEmail'].value = 'alex@example.edu';
registry['appPhone'].value = '09171234567';
registry['appLocation'].value = 'Taguig City';
registry['appPortfolio'].value = 'github.com/alex';
registry['appLinkedIn'].value = 'linkedin.com/in/alex';

global.handleStep1Submit();
assert.strictEqual(global.window.location.href, 'apply-step2.html?id=harbor-fed-102');
console.log('[Step 3] Step 1 successfully submitted, forwarded to apply-step2.html?id=harbor-fed-102.');

// 4. Step 2 Experience
registry = {};
registry['step2JobSubtitle'] = new JSDOMElement('p', 'step2JobSubtitle');
registry['backToStep1'] = new JSDOMElement('a', 'backToStep1');
registry['step2BackBtn'] = new JSDOMElement('a', 'step2BackBtn');
registry['appUniversity'] = { value: 'UP Diliman' };
registry['appDegree'] = { value: 'BS Computer Science' };
registry['appYear'] = { value: 'Third year' };
registry['appStart'] = { value: 'June 7, 2027' };
registry['appEnd'] = { value: 'September 30, 2027' };
registry['appHours'] = { value: '32 hours / week' };
registry['appProject'] = { value: 'React Component Library' };
registry['appStatement'] = { value: 'Eager to build accessible web UI.' };

global.window.location.search = '?id=harbor-fed-102';
global.initStep2Form();
assert.strictEqual(registry['step2JobSubtitle'].innerText.includes('HarborWorks Technologies'), true);
assert.strictEqual(registry['backToStep1'].href, 'apply-step1.html?id=harbor-fed-102');

global.handleStep2Submit();
assert.strictEqual(global.window.location.href, 'apply-review.html?id=harbor-fed-102');
console.log('[Step 4] Step 2 successfully submitted, forwarded to apply-review.html?id=harbor-fed-102.');

// 5. Step 3 Review & Final Submit
registry = {};
registry['reviewJobSubtitle'] = new JSDOMElement('p', 'reviewJobSubtitle');
registry['consentLabel'] = new JSDOMElement('label', 'consentLabel');
registry['backToStep2'] = new JSDOMElement('a', 'backToStep2');
registry['reviewBackBtn'] = new JSDOMElement('a', 'reviewBackBtn');
registry['revFullName'] = new JSDOMElement('strong', 'revFullName');
registry['consentCheckbox'] = { checked: true };

global.window.location.search = '?id=harbor-fed-102';
global.initReviewScreen();
assert.strictEqual(registry['reviewJobSubtitle'].innerText.includes('HarborWorks Technologies'), true);
assert.strictEqual(registry['consentLabel'].innerText.includes('HarborWorks Technologies'), true);
assert.strictEqual(registry['revFullName'].innerText, 'Alex Santos');

global.handleFinalSubmission();
assert.strictEqual(global.window.location.href, 'confirmation.html?id=harbor-fed-102');

const sApplied = global.getAppState();
assert.deepStrictEqual(sApplied.appliedJobIds, ['harbor-fed-102']);
assert.strictEqual(sApplied.submittedApplicationsCount, 1);
console.log('[Step 5] Final submission succeeded! appliedJobIds = [harbor-fed-102].');

// 6. Confirmation Receipt Page
registry = {};
registry['confirmationSubtitle'] = new JSDOMElement('p', 'confirmationSubtitle');
registry['receiptJobTitle'] = new JSDOMElement('h3', 'receiptJobTitle');
registry['receiptCompanyMeta'] = new JSDOMElement('p', 'receiptCompanyMeta');
registry['receiptApplicantName'] = new JSDOMElement('strong', 'receiptApplicantName');
registry['receiptRef'] = new JSDOMElement('strong', 'receiptRef');
registry['timelineCompanyDesc'] = new JSDOMElement('p', 'timelineCompanyDesc');

global.window.location.search = '?id=harbor-fed-102';
global.initConfirmationPage();
assert.strictEqual(registry['receiptJobTitle'].innerText, 'Front-End Development Intern');
assert.strictEqual(registry['receiptCompanyMeta'].innerHTML.includes('HarborWorks Technologies'), true);
assert.strictEqual(registry['receiptApplicantName'].innerText, 'Alex Santos');
console.log('[Step 6] Confirmation receipt dynamically bound to HarborWorks Technologies and Alex Santos.');

// 7. Verify HarborWorks Details Page (Now Applied)
registry = {};
const detailsSplitH = new JSDOMElement('div', 'detailsSplit');
const mainCardH = new JSDOMElement('main', 'detailsMainCard');
detailsSplitH.insertBefore(mainCardH);
registry['detailsMainCard'] = mainCardH;
registry['detailsTopBadge'] = new JSDOMElement('span', 'detailsTopBadge');
registry['detailsTitle'] = new JSDOMElement('h1', 'detailsTitle');
registry['detailsMeta'] = new JSDOMElement('p', 'detailsMeta');
registry['detailsActionSlot'] = new JSDOMElement('div', 'detailsActionSlot');
registry['detailsSaveBtn'] = new JSDOMElement('button', 'detailsSaveBtn');
registry['detailsSidebarMeta'] = new JSDOMElement('div', 'detailsSidebarMeta');

global.window.location.search = '?id=harbor-fed-102';
global.initDetailsPage();
assert.strictEqual(registry['detailsTopBadge'].className, 'badge-applied');
assert.strictEqual(registry['detailsActionSlot'].innerHTML.includes('confirmation.html?id=harbor-fed-102'), true);
console.log('[Step 7] HarborWorks details page now shows APPLIED with receipt link.');

// 8. Verify Other Jobs (Northstar, Stratos, Aegis) are NOT Applied
registry = {};
const detailsSplitN = new JSDOMElement('div', 'detailsSplit');
const mainCardN = new JSDOMElement('main', 'detailsMainCard');
detailsSplitN.insertBefore(mainCardN);
registry['detailsMainCard'] = mainCardN;
registry['detailsTopBadge'] = new JSDOMElement('span', 'detailsTopBadge');
registry['detailsTitle'] = new JSDOMElement('h1', 'detailsTitle');
registry['detailsMeta'] = new JSDOMElement('p', 'detailsMeta');
registry['detailsActionSlot'] = new JSDOMElement('div', 'detailsActionSlot');
registry['detailsSaveBtn'] = new JSDOMElement('button', 'detailsSaveBtn');
registry['detailsSidebarMeta'] = new JSDOMElement('div', 'detailsSidebarMeta');

global.window.location.search = '?id=northstar-pdi';
global.initDetailsPage();
assert.strictEqual(registry['detailsTitle'].innerText, 'Product Design Intern');
assert.strictEqual(registry['detailsTopBadge'].className, 'badge-paid');
assert.strictEqual(registry['detailsActionSlot'].innerHTML.includes('apply-step1.html?id=northstar-pdi'), true);
console.log('[Step 8] Northstar details page is completely UNAPPLIED with active Apply button.');

global.window.location.search = '?id=stratos-flutter-104';
global.initDetailsPage();
assert.strictEqual(registry['detailsTitle'].innerText, 'Mobile App Developer Intern (Flutter)');
assert.strictEqual(registry['detailsTopBadge'].className, 'badge-paid');
assert.strictEqual(registry['detailsActionSlot'].innerHTML.includes('apply-step1.html?id=stratos-flutter-104'), true);
console.log('[Step 8b] Stratos Flutter details page is completely UNAPPLIED with active Apply button.');

// 9. Dashboard Integration
registry = {};
registry['dashboardSubmittedCount'] = new JSDOMElement('div', 'dashboardSubmittedCount');
registry['dashboardDraftsCount'] = new JSDOMElement('div', 'dashboardDraftsCount');
registry['dashboardSavedCount'] = new JSDOMElement('div', 'dashboardSavedCount');
registry['draftApplicationCard'] = new JSDOMElement('div', 'draftApplicationCard');
registry['recentSubmissionsList'] = new JSDOMElement('div', 'recentSubmissionsList');

global.initDashboard();
assert.strictEqual(registry['dashboardSubmittedCount'].innerText, 1);
assert.strictEqual(registry['recentSubmissionsList'].innerHTML.includes('Front-End Development Intern'), true);
assert.strictEqual(registry['recentSubmissionsList'].innerHTML.includes('Northstar'), false);
console.log('[Step 9] Dashboard accurately reports 1 submitted application for Front-End Development Intern.');

console.log('\n>>> COMPLETE END-TO-END VERIFICATION SUCCESSFUL! <<<');
