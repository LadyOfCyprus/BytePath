const fs = require('fs');

// Read scratch/generate_catalog.js
const catalogContent = fs.readFileSync('scratch/generate_catalog.js', 'utf8');
const catalogMatch = catalogContent.match(/const catalog = (\[[\s\S]*?\n\]);/);
if (!catalogMatch) {
  console.error('Could not find catalog array in scratch/generate_catalog.js');
  process.exit(1);
}
const catalogArrayCode = catalogMatch[1];

let appJs = fs.readFileSync('js/app.js', 'utf8');

// 1. Replace internshipsData with 24 items and add getJobById
const startInternships = appJs.indexOf('const internshipsData = [');
if (startInternships === -1) {
  console.error('Could not find internshipsData in app.js');
  process.exit(1);
}

const endInternships = appJs.indexOf('// Retrieve state from localStorage or initialize with defaults');
if (endInternships === -1) {
  console.error('Could not find end of internshipsData in app.js');
  process.exit(1);
}

const newInternshipsCode = `// 24 Comprehensive IT & CS Internship Listings
const internshipsData = ${catalogArrayCode};

// Helper: Retrieve internship listing by ID
function getJobById(id) {
  if (!id) return internshipsData[0];
  const found = internshipsData.find(j => j.id === id);
  return found || internshipsData[0];
}

`;

appJs = appJs.slice(0, startInternships) + newInternshipsCode + appJs.slice(endInternships);

// 2. Fix getAppState - remove the forced northstar-pdi push
const bugPush = `    if (parsed.isSubmitted && !parsed.appliedJobIds.includes('northstar-pdi')) {
      parsed.appliedJobIds.push('northstar-pdi');
    }`;
if (appJs.includes(bugPush)) {
  appJs = appJs.replace(bugPush, '');
  console.log('Removed forced northstar-pdi push in getAppState');
} else {
  console.log('bugPush snippet not found directly, checking regex');
  appJs = appJs.replace(/if\s*\(parsed\.isSubmitted\s*&&[\s\S]*?northstar-pdi[\s\S]*?\}/, '');
}

// 3. Replace &#128269; emoji in renderBrowseJobs with SVG
appJs = appJs.replace(
  '<div class="empty-jobs-icon">&#128269;</div>',
  `<div class="empty-jobs-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>`
);

// 4. Replace initDetailsPage
const detailsPageStart = appJs.indexOf('function initDetailsPage() {');
const detailsPageEnd = appJs.indexOf('// PROFILE PAGE: TWO-WAY LOCALSTORAGE SYNC');
if (detailsPageStart === -1 || detailsPageEnd === -1) {
  console.error('Could not find initDetailsPage bounds');
  process.exit(1);
}

const newInitDetailsPage = `function initDetailsPage() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || 'northstar-pdi';
  const job = getJobById(jobId);

  // Update document title and description
  document.title = \`Bytepath · \${job.title} at \${job.company}\`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', \`\${job.title} internship details at \${job.company} in \${job.location}. \${job.term}.\`);
  }

  // Populate Main Card
  const topBadge = document.getElementById('detailsTopBadge') || document.querySelector('.details-main-card .badge-paid');
  const titleEl = document.getElementById('detailsTitle') || document.querySelector('.details-main-card h1');
  const metaEl = document.getElementById('detailsMeta') || document.querySelector('.details-main-card p');
  const aboutEl = document.getElementById('detailsAbout');
  const respEl = document.getElementById('detailsResponsibilities');
  const reqEl = document.getElementById('detailsRequirements');

  if (titleEl) titleEl.innerText = job.title;
  if (metaEl) metaEl.innerHTML = \`\${job.company} &middot; \${job.location} &middot; \${job.setup}\`;
  if (aboutEl) aboutEl.innerText = job.about || job.description;

  if (respEl && Array.isArray(job.responsibilities)) {
    respEl.innerHTML = job.responsibilities.map(r => \`<li>\${r}</li>\`).join('');
  }
  if (reqEl && Array.isArray(job.requirements)) {
    reqEl.innerHTML = job.requirements.map(r => \`<li>\${r}</li>\`).join('');
  }

  // Populate Sidebar Card
  const sidePaidBadge = document.getElementById('detailsSidebarPaidBadge');
  const sideTitle = document.getElementById('detailsSidebarTitle');
  const sideCompany = document.getElementById('detailsSidebarCompany');
  const sideMeta = document.getElementById('detailsSidebarMeta');
  const sideDeadline = document.getElementById('detailsSidebarDeadline');
  const sideAboutTitle = document.getElementById('detailsAboutCompanyTitle');
  const sideAboutDesc = document.getElementById('detailsAboutCompanyDesc');

  if (sidePaidBadge) {
    sidePaidBadge.innerText = job.isPaid ? 'Paid Internship' : 'Unpaid Internship';
  }
  if (sideTitle) sideTitle.innerText = job.title;
  if (sideCompany) sideCompany.innerText = job.company;

  if (sideMeta) {
    sideMeta.innerHTML = \`
      <div>&#10003; \${job.location} &middot; \${job.setup}</div>
      <div>&#10003; <strong>\${job.allowance}</strong></div>
      <div>&#10003; \${job.term}</div>
      <div>&#10003; Posted \${job.postedDate || 'October 10, 2026'}</div>
    \`;
  }

  if (sideDeadline) {
    sideDeadline.innerHTML = \`
      <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; display: block; opacity: 0.85;">Application Deadline</span>
      \${job.deadline || 'October 30, 2026'} &middot; <strong>\${job.daysLeft || '18 days left'}</strong>
    \`;
  }

  if (sideAboutTitle) sideAboutTitle.innerText = \`Meet \${job.company}\`;
  if (sideAboutDesc) {
    sideAboutDesc.innerText = \`An established organization in \${job.category} offering mentored, project-based learning and hands-on industry experience.\`;
  }

  // Save button in details sidebar
  const saveBtn = document.getElementById('detailsSaveBtn');
  if (saveBtn) {
    const isSaved = state.savedJobIds && state.savedJobIds.includes(job.id);
    saveBtn.setAttribute('data-job-save-id', job.id);
    saveBtn.onclick = (e) => toggleSaveJob(job.id, e);
    if (isSaved) {
      saveBtn.classList.add('saved');
      saveBtn.innerHTML = \`&#9733; Saved to shortlist\`;
    } else {
      saveBtn.classList.remove('saved');
      saveBtn.innerHTML = \`&#9734; Save opportunity\`;
    }
  }

  // Applied status check - ONLY for THIS SPECIFIC JOB
  const isApplied = Array.isArray(state.appliedJobIds) && state.appliedJobIds.includes(job.id);
  const actionSlot = document.getElementById('detailsActionSlot');
  const mainCard = document.querySelector('.details-main-card');
  let existingBanner = document.getElementById('detailsAppliedBanner');

  if (isApplied) {
    // 1. Inset Applied Status Banner above main card
    if (mainCard && !existingBanner) {
      const banner = document.createElement('div');
      banner.id = 'detailsAppliedBanner';
      banner.className = 'applied-status-banner';
      banner.innerHTML = \`
        <div class="applied-status-left">
          <div class="applied-check-icon">&#10003;</div>
          <div>
            <div class="applied-status-title">You have applied for this internship</div>
            <div class="applied-status-desc">
              Submitted on \${state.submissionDate || 'October 12, 2026'} &middot; Application Reference: <strong>\${state.applicationReference || 'BP-2026-01428'}</strong>
            </div>
          </div>
        </div>
        <a href="confirmation.html?id=\${job.id}" class="btn-primary" style="font-size: 0.88rem; padding: 0.5rem 1rem; white-space: nowrap;">
          View receipt &rarr;
        </a>
      \`;
      mainCard.parentNode.insertBefore(banner, mainCard);
    }

    // 2. Update badge on job details
    if (topBadge) {
      topBadge.className = 'badge-applied';
      topBadge.innerHTML = \`&#10003; Submitted &middot; Under Review\`;
    }

    // 3. Update right sidebar action button
    if (actionSlot) {
      actionSlot.innerHTML = \`
        <div style="margin-bottom: 0.75rem;">
          <div class="badge-applied" style="width: 100%; justify-content: center; height: 42px; font-size: 0.88rem; margin-bottom: 0.6rem;">
            &#10003; Applied on \${state.submissionDate || 'October 12, 2026'}
          </div>
          <a href="confirmation.html?id=\${job.id}" class="btn-primary" style="width: 100%; justify-content: center; height: 48px; font-size: 0.95rem;">
            View application receipt &rarr;
          </a>
        </div>
      \`;
    }
  } else {
    // Not applied: ensure banner is removed if present
    if (existingBanner) {
      existingBanner.remove();
    }

    // Reset top badge
    if (topBadge) {
      topBadge.className = 'badge-paid';
      topBadge.innerHTML = \`\${job.category} &middot; \${job.isPaid ? 'Paid Internship' : 'Unpaid'}\`;
    }

    // Reset action slot to standard Apply Now button
    if (actionSlot) {
      actionSlot.innerHTML = \`
        <a href="apply-step1.html?id=\${job.id}" class="btn-primary" id="detailsApplyBtn" style="width: 100%; justify-content: center; height: 48px; font-size: 1rem;">
          Apply now &rarr;
        </a>
      \`;
    }
  }
}

`;

appJs = appJs.slice(0, detailsPageStart) + newInitDetailsPage + appJs.slice(detailsPageEnd);

// 5. Replace Stepper & Submission functions (initStep1Form, handleStep1Submit, initStep2Form, handleStep2Submit, initReviewScreen, handleFinalSubmission, initConfirmationPage, initDashboard)
const stepperStart = appJs.indexOf('function initStep1Form() {');
if (stepperStart === -1) {
  console.error('Could not find initStep1Form bounds');
  process.exit(1);
}

const newStepperCode = `function initStep1Form() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || state.activeApplicationJobId || 'northstar-pdi';
  const job = getJobById(jobId);

  // Update subtitle & back link
  const subEl = document.getElementById('step1JobSubtitle');
  if (subEl) {
    subEl.innerText = \`You're applying for \${job.title} at \${job.company}. Check your details before continuing.\`;
  }
  const backJobLink = document.getElementById('backToJobDetails');
  if (backJobLink) {
    backJobLink.href = \`details.html?id=\${job.id}\`;
  }

  const fName = document.getElementById('appFirstName');
  const lName = document.getElementById('appLastName');
  const email = document.getElementById('appEmail');
  const phone = document.getElementById('appPhone');
  const location = document.getElementById('appLocation');
  const portfolio = document.getElementById('appPortfolio');
  const linkedin = document.getElementById('appLinkedIn');
  const resumeTitle = document.getElementById('resumeFileNameDisplay');

  if (fName) fName.value = state.firstName || '';
  if (lName) lName.value = state.lastName || '';
  if (email) email.value = state.email || '';
  if (phone) phone.value = state.phone || '';
  if (location) location.value = state.location || '';
  if (portfolio) portfolio.value = state.portfolio || '';
  if (linkedin) linkedin.value = state.linkedin || '';
  if (resumeTitle && state.resumeName) resumeTitle.innerText = state.resumeName;
}

function handleStep1Submit(e) {
  if (e) e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const state = getAppState();
  const jobId = urlParams.get('id') || state.activeApplicationJobId || 'northstar-pdi';

  const updates = {
    firstName: document.getElementById('appFirstName')?.value.trim() || '',
    lastName: document.getElementById('appLastName')?.value.trim() || '',
    email: document.getElementById('appEmail')?.value.trim() || '',
    phone: document.getElementById('appPhone')?.value.trim() || '',
    location: document.getElementById('appLocation')?.value.trim() || '',
    portfolio: document.getElementById('appPortfolio')?.value.trim() || '',
    linkedin: document.getElementById('appLinkedIn')?.value.trim() || '',
    activeApplicationJobId: jobId
  };
  saveAppState(updates);
  window.location.href = \`apply-step2.html?id=\${jobId}\`;
}

function initStep2Form() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || state.activeApplicationJobId || 'northstar-pdi';
  const job = getJobById(jobId);

  // Update subtitle & back links
  const subEl = document.getElementById('step2JobSubtitle');
  if (subEl) {
    subEl.innerText = \`Tell \${job.company} what you're learning, what you can bring, and when you're available.\`;
  }
  const backStep1 = document.getElementById('backToStep1');
  if (backStep1) {
    backStep1.href = \`apply-step1.html?id=\${job.id}\`;
  }
  const step2Back = document.getElementById('step2BackBtn');
  if (step2Back) {
    step2Back.href = \`apply-step1.html?id=\${job.id}\`;
  }

  const university = document.getElementById('appUniversity');
  const degree = document.getElementById('appDegree');
  const year = document.getElementById('appYear');
  const start = document.getElementById('appStart');
  const end = document.getElementById('appEnd');
  const hours = document.getElementById('appHours');
  const project = document.getElementById('appProject');
  const statement = document.getElementById('appStatement');

  if (university) university.value = state.institution || '';
  if (degree) degree.value = state.degree || '';
  if (year && state.year) year.value = state.year;
  if (start) start.value = state.startDate || 'June 7, 2027';
  if (end) end.value = state.endDate || 'September 30, 2027';
  if (hours) hours.value = state.weeklyHours || '32 hours / week';
  if (project) project.value = state.relevantProject || '';
  if (statement) statement.value = state.statement || state.bio || '';
}

function handleStep2Submit(e) {
  if (e) e.preventDefault();
  const urlParams = new URLSearchParams(window.location.search);
  const state = getAppState();
  const jobId = urlParams.get('id') || state.activeApplicationJobId || 'northstar-pdi';

  const updates = {
    institution: document.getElementById('appUniversity')?.value.trim() || '',
    degree: document.getElementById('appDegree')?.value.trim() || '',
    year: document.getElementById('appYear')?.value || 'Third year',
    startDate: document.getElementById('appStart')?.value || 'June 7, 2027',
    endDate: document.getElementById('appEnd')?.value || 'September 30, 2027',
    weeklyHours: document.getElementById('appHours')?.value || '32 hours / week',
    relevantProject: document.getElementById('appProject')?.value.trim() || '',
    statement: document.getElementById('appStatement')?.value.trim() || '',
    activeApplicationJobId: jobId
  };
  saveAppState(updates);
  window.location.href = \`apply-review.html?id=\${jobId}\`;
}

function initResumeBuilderPage() {
  const state = getAppState();
  const fName = document.getElementById('resFirstName');
  const lName = document.getElementById('resLastName');
  const email = document.getElementById('resEmail');
  const phone = document.getElementById('resPhone');
  const headline = document.getElementById('resHeadline');
  const bio = document.getElementById('resBio');
  const portfolio = document.getElementById('resPortfolio');
  const linkedin = document.getElementById('resLinkedIn');

  if (fName) fName.value = state.firstName || '';
  if (lName) lName.value = state.lastName || '';
  if (email) email.value = state.email || '';
  if (phone) phone.value = state.phone || '';
  if (headline) headline.value = state.headline || '';
  if (bio) bio.value = state.bio || state.statement || '';
  if (portfolio) portfolio.value = state.portfolio || '';
  if (linkedin) linkedin.value = state.linkedin || '';
}

function initReviewScreen() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || state.activeApplicationJobId || 'northstar-pdi';
  const job = getJobById(jobId);

  // Update subtitle & edit links
  const subEl = document.getElementById('reviewJobSubtitle');
  if (subEl) {
    subEl.innerText = \`Check your information before sending it to \${job.company}.\`;
  }
  const consentLabel = document.getElementById('consentLabel');
  if (consentLabel) {
    consentLabel.innerText = \`I confirm that this information is accurate and consent to sharing this application with \${job.company} for recruitment purposes.\`;
  }
  const backStep2 = document.getElementById('backToStep2');
  if (backStep2) backStep2.href = \`apply-step2.html?id=\${job.id}\`;
  const reviewBack = document.getElementById('reviewBackBtn');
  if (reviewBack) reviewBack.href = \`apply-step2.html?id=\${job.id}\`;

  // Update edit jump links in review blocks
  document.querySelectorAll('a.edit-jump-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('apply-step1.html')) {
      link.href = \`apply-step1.html?id=\${job.id}\`;
    } else if (href.startsWith('apply-step2.html')) {
      link.href = \`apply-step2.html?id=\${job.id}\`;
    }
  });

  const revFullName = document.getElementById('revFullName');
  const revLocation = document.getElementById('revLocation');
  const revEmail = document.getElementById('revEmail');
  const revPhone = document.getElementById('revPhone');
  const revUniversity = document.getElementById('revUniversity');
  const revDegreeYear = document.getElementById('revDegreeYear');
  const revStart = document.getElementById('revStart');
  const revEnd = document.getElementById('revEnd');
  const revHours = document.getElementById('revHours');
  const revProject = document.getElementById('revProject');
  const revStatement = document.getElementById('revStatement');
  const consentBox = document.getElementById('consentCheckbox');

  if (revFullName) revFullName.innerText = \`\${state.firstName || ''} \${state.lastName || ''}\`.trim() || 'Student Applicant';
  if (revLocation) revLocation.innerText = state.location || 'Metro Manila, Philippines';
  if (revEmail) revEmail.innerText = state.email || '';
  if (revPhone) revPhone.innerText = state.phone || '';
  if (revUniversity) revUniversity.innerText = state.institution || state.university || '';
  if (revDegreeYear) revDegreeYear.innerText = \`\${state.degree || ''} \${state.year ? '· ' + state.year : ''}\`.trim() || 'Student';
  if (revStart) revStart.innerText = state.startDate || 'June 7, 2027';
  if (revEnd) revEnd.innerText = state.endDate || 'September 30, 2027';
  if (revHours) revHours.innerText = state.weeklyHours || '32 hours / week';
  if (revProject) revProject.innerText = state.relevantProject || '';
  if (revStatement) revStatement.innerText = state.statement || '';
  const revResumeName = document.getElementById('revResumeName');
  if (revResumeName) revResumeName.innerText = state.resumeName || 'Student_Resume.pdf';
  if (consentBox) consentBox.checked = state.consent ?? true;
}

function handleFinalSubmission() {
  const consent = document.getElementById('consentCheckbox');
  if (consent && !consent.checked) {
    alert('Please confirm that your information is accurate and check the consent box.');
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const state = getAppState();
  const jobId = urlParams.get('id') || state.activeApplicationJobId || 'northstar-pdi';

  const appliedList = Array.isArray(state.appliedJobIds) ? [...state.appliedJobIds] : [];
  if (!appliedList.includes(jobId)) {
    appliedList.push(jobId);
  }

  // Update application state
  saveAppState({
    isSubmitted: true,
    appliedJobIds: appliedList,
    activeApplicationJobId: jobId,
    submittedApplicationsCount: appliedList.length,
    draftApplicationsCount: 0,
    submissionDate: 'October 12, 2026'
  });

  window.location.href = \`confirmation.html?id=\${jobId}\`;
}

function initConfirmationPage() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || state.activeApplicationJobId || (state.appliedJobIds && state.appliedJobIds[state.appliedJobIds.length - 1]) || 'northstar-pdi';
  const job = getJobById(jobId);

  document.title = \`Bytepath · Application Submitted · \${job.title}\`;

  const subEl = document.getElementById('confirmationSubtitle');
  if (subEl) {
    subEl.innerText = \`Your application for \${job.title} at \${job.company} has been received.\`;
  }

  const roleTitle = document.getElementById('receiptJobTitle');
  if (roleTitle) roleTitle.innerText = job.title;

  const roleMeta = document.getElementById('receiptCompanyMeta');
  if (roleMeta) roleMeta.innerHTML = \`\${job.company} &middot; \${job.location} &middot; \${job.setup}\`;

  const applicant = document.getElementById('receiptApplicantName');
  if (applicant) {
    applicant.innerText = \`\${state.firstName || ''} \${state.lastName || ''}\`.trim() || 'Student Applicant';
  }

  const refEl = document.getElementById('receiptRef');
  if (refEl) refEl.innerText = state.applicationReference || 'BP-2026-01428';

  const dateEl = document.getElementById('receiptDate');
  if (dateEl) dateEl.innerText = state.submissionDate || 'October 12, 2026';

  const timelineDesc = document.getElementById('timelineCompanyDesc');
  if (timelineDesc) {
    timelineDesc.innerText = \`\${job.company} will assess your experience, interests, and availability.\`;
  }
}

// ==========================================
// DASHBOARD INITIALIZATION
// ==========================================

function initDashboard() {
  const state = getAppState();
  const subCount = document.getElementById('dashboardSubmittedCount');
  const draftCount = document.getElementById('dashboardDraftsCount');
  const savedCount = document.getElementById('dashboardSavedCount');
  const draftCard = document.getElementById('draftApplicationCard');
  const recentSubmissionsList = document.getElementById('recentSubmissionsList');

  const appliedIds = state.appliedJobIds || [];
  if (subCount) subCount.innerText = appliedIds.length;
  if (draftCount) draftCount.innerText = state.draftApplicationsCount;
  if (savedCount) savedCount.innerText = (state.savedJobIds || []).length;

  // Sync saved buttons on recommended cards
  document.querySelectorAll('[data-job-save-id]').forEach(btn => {
    const id = btn.getAttribute('data-job-save-id');
    if ((state.savedJobIds || []).includes(id)) {
      btn.classList.add('saved');
      btn.innerHTML = \`&#9733; Saved\`;
    }
  });

  // Dynamically populate recent submissions list
  if (recentSubmissionsList) {
    if (appliedIds.length > 0) {
      recentSubmissionsList.innerHTML = appliedIds.map(id => {
        const job = getJobById(id);
        return \`
          <div class="activity-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid var(--color-border);">
            <div>
              <a href="details.html?id=\${job.id}" style="font-weight: 700; color: var(--color-text-body); text-decoration: none;">\${job.title}</a>
              <div style="font-size: 0.82rem; color: var(--color-text-muted);">\${job.company} &middot; Submitted \${state.submissionDate || 'October 12, 2026'}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge-applied">&#10003; Submitted</span>
              <a href="confirmation.html?id=\${job.id}" class="btn-secondary" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;">Receipt</a>
            </div>
          </div>
        \`;
      }).join('');
    } else {
      recentSubmissionsList.innerHTML = \`
        <div style="padding: 1rem 0; color: var(--color-text-muted); font-size: 0.88rem;">
          No submitted applications yet. <a href="browse.html" style="color: var(--color-primary); font-weight: 600;">Find an internship &rarr;</a>
        </div>
      \`;
    }
  }

  // If user has applied to any jobs, update draft application card to show the most recent submission
  if (draftCard && appliedIds.length > 0) {
    const latestId = appliedIds[appliedIds.length - 1];
    const latestJob = getJobById(latestId);
    draftCard.innerHTML = \`
      <div>
        <span class="badge-applied" style="margin-bottom: 0.5rem;">Application Active &middot; Submitted</span>
        <h4 style="font-family: var(--font-serif); font-size: 1.35rem; margin: 0.6rem 0 0.25rem;">\${latestJob.title}</h4>
        <p style="font-size: 0.85rem; color: var(--color-text-muted);">\${latestJob.company}</p>
        <p style="font-size: 0.82rem; color: var(--color-primary); font-weight: 600; margin-top: 0.4rem;">Submitted \${state.submissionDate || 'October 12, 2026'} &middot; Ref: \${state.applicationReference || 'BP-2026-01428'}</p>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 1.25rem;">
        <a href="confirmation.html?id=\${latestJob.id}" class="btn-primary" style="flex: 1; justify-content: center;">
          View receipt &rarr;
        </a>
        <a href="details.html?id=\${latestJob.id}" class="btn-secondary" style="font-size: 0.85rem;">
          Details
        </a>
      </div>
    \`;
  }
}

// Global Notification Dropdown Toggle
function toggleNotifDropdown(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const dropdown = document.getElementById('notifDropdown');
  if (dropdown) {
    const isShown = dropdown.style.display === 'block';
    dropdown.style.display = isShown ? 'none' : 'block';
  }
}

// Global Document Load Setup
document.addEventListener('DOMContentLoaded', () => {
  syncHeaderUser();
  checkProfileGate();

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    const notifDropdown = document.getElementById('notifDropdown');
    const notifBtn = document.getElementById('notifBellBtn');
    if (notifDropdown && notifBtn && !notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
      notifDropdown.style.display = 'none';
    }
  });
});
`;

appJs = appJs.slice(0, stepperStart) + newStepperCode;

fs.writeFileSync('js/app.js', appJs, 'utf8');
console.log('Successfully updated js/app.js!');
