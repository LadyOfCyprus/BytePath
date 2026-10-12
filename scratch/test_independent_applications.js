const fs = require('fs');
const assert = require('assert');

// Setup mock browser DOM environment
class MockElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.innerText = '';
    this.innerHTML = '';
    this.value = '';
    this.checked = false;
    this.attributes = {};
    this.classList = {
      _classes: new Set(className ? className.split(' ') : []),
      add: (c) => this.classList._classes.add(c),
      remove: (c) => this.classList._classes.delete(c),
      contains: (c) => this.classList._classes.has(c)
    };
    this.children = [];
    this.parentNode = null;
    this.style = {};
  }
  setAttribute(k, v) { this.attributes[k] = v; }
  getAttribute(k) { return this.attributes[k] || null; }
  querySelector(sel) {
    if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || null;
    if (sel.startsWith('.')) {
      const cls = sel.slice(1);
      return this.children.find(c => c.classList.contains(cls)) || null;
    }
    return null;
  }
  querySelectorAll(sel) { return []; }
  insertBefore(newNode, refNode) {
    this.children.push(newNode);
    newNode.parentNode = this;
  }
  remove() {
    if (this.id && elementsMap[this.id]) delete elementsMap[this.id];
  }
}

const elementsMap = {};
let mockStorage = {};

global.localStorage = {
  getItem: (k) => mockStorage[k] || null,
  setItem: (k, v) => { mockStorage[k] = v; },
  clear: () => { mockStorage = {}; }
};

global.sessionStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

global.document = {
  title: '',
  addEventListener: () => {},
  getElementById: (id) => elementsMap[id] || null,
  querySelector: (sel) => {
    if (sel.startsWith('#')) return elementsMap[sel.slice(1)] || null;
    if (sel === '.details-main-card') return elementsMap['detailsMainCard'] || null;
    if (sel === 'meta[name="description"]') return { setAttribute: () => {} };
    return null;
  },
  querySelectorAll: (sel) => [],
  createElement: (tag) => new MockElement(tag)
};

global.window = {
  location: { search: '', href: '' }
};

global.alert = (msg) => console.log('[Alert]:', msg);

// Load app.js
const appJsCode = fs.readFileSync('js/app.js', 'utf8');
eval(appJsCode + `
  global.internshipsData = internshipsData;
  global.getJobById = getJobById;
  global.getAppState = getAppState;
  global.saveAppState = saveAppState;
  global.initDetailsPage = initDetailsPage;
  global.handleFinalSubmission = handleFinalSubmission;
  global.initDashboard = initDashboard;
  global.renderBrowseJobs = renderBrowseJobs;
`);

console.log('--- TEST 1: CATALOG VERIFICATION ---');
console.log('Total internships:', global.internshipsData.length);
assert.strictEqual(global.internshipsData.length, 24, 'Must have exactly 24 internships');
const ids = global.internshipsData.map(j => j.id);
const uniqueIds = new Set(ids);
assert.strictEqual(uniqueIds.size, 24, 'All 24 job IDs must be unique');
console.log('PASS: 24 unique internships loaded.');

console.log('\n--- TEST 2: DEFAULT INITIAL STATE ---');
global.localStorage.clear();
const initialState = global.getAppState();
assert.deepStrictEqual(initialState.appliedJobIds, [], 'Initial appliedJobIds must be empty array');
assert.strictEqual(initialState.submittedApplicationsCount, 0, 'Initial submitted count must be 0');
console.log('PASS: Initial application state is clean and unapplied.');

console.log('\n--- TEST 3: APPLYING TO HARBORWORKS (harbor-fed-102) ONLY ---');
global.window.location.search = '?id=harbor-fed-102';
elementsMap['consentCheckbox'] = { checked: true };
global.handleFinalSubmission();

const stateAfterApply = global.getAppState();
console.log('Applied jobs after applying to harbor-fed-102:', stateAfterApply.appliedJobIds);
assert.strictEqual(stateAfterApply.appliedJobIds.length, 1, 'Exactly 1 job should be applied');
assert.strictEqual(stateAfterApply.appliedJobIds[0], 'harbor-fed-102', 'Applied job must be harbor-fed-102');
assert.strictEqual(stateAfterApply.appliedJobIds.includes('northstar-pdi'), false, 'Northstar must NOT be applied!');
assert.strictEqual(stateAfterApply.appliedJobIds.includes('stratos-flutter-104'), false, 'Stratos must NOT be applied!');
console.log('PASS: Only harbor-fed-102 is recorded in appliedJobIds!');

console.log('\n--- TEST 4: DETAILS PAGE FOR APPLIED JOB (harbor-fed-102) ---');
elementsMap['detailsMainCard'] = new MockElement('main', 'detailsMainCard');
const parentWrap = new MockElement('div', 'detailsSplit');
parentWrap.children.push(elementsMap['detailsMainCard']);
elementsMap['detailsMainCard'].parentNode = parentWrap;
elementsMap['detailsTopBadge'] = new MockElement('span', 'detailsTopBadge');
elementsMap['detailsTitle'] = new MockElement('h1', 'detailsTitle');
elementsMap['detailsMeta'] = new MockElement('p', 'detailsMeta');
elementsMap['detailsActionSlot'] = new MockElement('div', 'detailsActionSlot');
elementsMap['detailsSaveBtn'] = new MockElement('button', 'detailsSaveBtn');
elementsMap['detailsSidebarPaidBadge'] = new MockElement('span', 'detailsSidebarPaidBadge');
elementsMap['detailsSidebarTitle'] = new MockElement('h3', 'detailsSidebarTitle');
elementsMap['detailsSidebarCompany'] = new MockElement('p', 'detailsSidebarCompany');
elementsMap['detailsSidebarMeta'] = new MockElement('div', 'detailsSidebarMeta');
elementsMap['detailsSidebarDeadline'] = new MockElement('div', 'detailsSidebarDeadline');
elementsMap['detailsAboutCompanyTitle'] = new MockElement('strong', 'detailsAboutCompanyTitle');
elementsMap['detailsAboutCompanyDesc'] = new MockElement('p', 'detailsAboutCompanyDesc');

global.window.location.search = '?id=harbor-fed-102';
global.initDetailsPage();

assert.strictEqual(elementsMap['detailsTitle'].innerText, 'Front-End Development Intern');
assert.strictEqual(elementsMap['detailsTopBadge'].className, 'badge-applied');
assert.strictEqual(elementsMap['detailsTopBadge'].innerHTML.includes('Submitted'), true);
assert.strictEqual(elementsMap['detailsActionSlot'].innerHTML.includes('Applied on'), true);
console.log('PASS: harbor-fed-102 details page shows APPLIED status!');

console.log('\n--- TEST 5: DETAILS PAGE FOR UNAPPLIED JOBS ---');
global.window.location.search = '?id=northstar-pdi';
global.initDetailsPage();

assert.strictEqual(elementsMap['detailsTitle'].innerText, 'Product Design Intern');
assert.strictEqual(elementsMap['detailsTopBadge'].className, 'badge-paid');
assert.strictEqual(elementsMap['detailsTopBadge'].innerHTML.includes('Paid Internship'), true);
assert.strictEqual(elementsMap['detailsActionSlot'].innerHTML.includes('Apply now &rarr;'), true);
assert.strictEqual(elementsMap['detailsAppliedBanner'], undefined, 'No banner should exist for unapplied Northstar!');
console.log('PASS: northstar-pdi details page shows UNAPPLIED status with active "Apply now" button!');

global.window.location.search = '?id=aegis-cyber-108';
global.initDetailsPage();
assert.strictEqual(elementsMap['detailsTitle'].innerText, 'Cybersecurity & SOC Analyst Intern');
assert.strictEqual(elementsMap['detailsTopBadge'].className, 'badge-paid');
assert.strictEqual(elementsMap['detailsActionSlot'].innerHTML.includes('Apply now &rarr;'), true);
console.log('PASS: aegis-cyber-108 details page shows UNAPPLIED status!');

console.log('\n--- TEST 6: APPLYING TO A SECOND JOB (aegis-cyber-108) ---');
global.window.location.search = '?id=aegis-cyber-108';
elementsMap['consentCheckbox'] = { checked: true };
global.handleFinalSubmission();

const stateAfterSecondApply = global.getAppState();
console.log('Applied jobs after applying to aegis-cyber-108:', stateAfterSecondApply.appliedJobIds);
assert.strictEqual(stateAfterSecondApply.appliedJobIds.length, 2, 'Exactly 2 jobs should be applied');
assert.deepStrictEqual(stateAfterSecondApply.appliedJobIds, ['harbor-fed-102', 'aegis-cyber-108']);
assert.strictEqual(stateAfterSecondApply.appliedJobIds.includes('northstar-pdi'), false, 'Northstar must STILL NOT be applied!');
console.log('PASS: Both applied jobs are distinct and all 22 other jobs remain unapplied!');

console.log('\n--- TEST 7: DASHBOARD RECENT SUBMISSIONS RENDERING ---');
elementsMap['dashboardSubmittedCount'] = new MockElement('div', 'dashboardSubmittedCount');
elementsMap['dashboardDraftsCount'] = new MockElement('div', 'dashboardDraftsCount');
elementsMap['dashboardSavedCount'] = new MockElement('div', 'dashboardSavedCount');
elementsMap['draftApplicationCard'] = new MockElement('div', 'draftApplicationCard');
elementsMap['recentSubmissionsList'] = new MockElement('div', 'recentSubmissionsList');

global.initDashboard();
assert.strictEqual(elementsMap['dashboardSubmittedCount'].innerText, 2);
assert.strictEqual(elementsMap['recentSubmissionsList'].innerHTML.includes('Front-End Development Intern'), true);
assert.strictEqual(elementsMap['recentSubmissionsList'].innerHTML.includes('Cybersecurity & SOC Analyst Intern'), true);
assert.strictEqual(elementsMap['recentSubmissionsList'].innerHTML.includes('Product Design Intern'), false);
console.log('PASS: Dashboard accurately lists ONLY the 2 submitted applications and displays count = 2!');

console.log('\nALL INDEPENDENT APPLICATION TESTS PASSED PERFECTLY!');
