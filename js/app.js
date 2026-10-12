/**
 * Bytepath Application State, Data Engine & Navigation Manager
 * Handles multi-page state persistence via localStorage,
 * live search & filtering across 12 internship listings,
 * dynamic "Applied" status badges, "Save opportunity" shortlist toggles,
 * two-way synced Profile & Settings, and unified header actions.
 */

const STORAGE_KEY = 'bytepath_student_data';

// Default initial state (clean unhardcoded state for fresh visitors and new accounts)
const defaultState = {
  firstName: '',
  lastName: '',
  preferredName: '',
  avatarDataUrl: '', // Persisted profile picture
  email: '',
  phone: '',
  location: '',
  studentId: '',
  institution: '',
  headline: '',
  degree: '',
  year: 'Third year',
  resumeName: 'Student_Resume.pdf',
  resumeSize: '1.2 MB',
  resumeDate: 'Not uploaded yet',
  portfolio: '',
  linkedin: '',
  targetRole: '',
  ojtSetup: 'Hybrid',
  skills: [],
  startDate: 'June 7, 2027',
  endDate: 'September 30, 2027',
  weeklyHours: '32 hours / week',
  relevantProject: '',
  statement: '',
  consent: false,
  profileCompleted: false, // New accounts must complete their profile first
  isNewAccount: true,
  submittedApplicationsCount: 0,
  draftApplicationsCount: 0,
  savedInternshipsCount: 0,
  savedJobIds: [],
  appliedJobIds: [],
  applicationReference: 'BP-2026-01428',
  submissionDate: 'October 12, 2026',
  isSubmitted: false,
  emailNotifications: true,
  matchingDigest: true
};

// 12 Comprehensive IT & CS Internship Listings
// 24 Comprehensive IT & CS Internship Listings
const internshipsData = [
  {
    id: 'northstar-pdi',
    title: 'Product Design Intern',
    company: 'Northstar Digital Labs',
    companyInitial: 'N',
    companyAvatarBg: '#155E4E',
    companyAvatarColor: '#FFFFFF',
    category: 'UI/UX & Product Design',
    location: 'Makati City',
    locationGroup: 'Makati City',
    setup: 'Hybrid',
    allowance: '₱10,000 per month',
    allowanceValue: 10000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 10, 2026',
    deadline: 'October 30, 2026',
    daysLeft: '18 days left',
    description: 'Turn user insights into clear, accessible interfaces with a collaborative product team.',
    about: 'Work with our product team to research user needs and design clear, accessible interfaces for web-based services. Learn through real product work, thoughtful feedback, and close collaboration with designers and developers.',
    responsibilities: [
      'Create wireframes and high-fidelity interfaces in Figma.',
      'Support usability testing and summarize peer research findings.',
      'Maintain reusable Figma patterns and design system components.',
      'Collaborate with developers on front-end handoff specifications.'
    ],
    requirements: [
      'Enrolled in IT, Computer Science, Multimedia Arts, or a related undergraduate program.',
      'Familiar with Figma and user-centered design principles.',
      'Able to explain design decisions and wireframes clearly.',
      'Available for the four-month OJT internship, June–September 2027.'
    ],
    tags: ['Figma', 'User research', 'Prototyping'],
    detailsUrl: 'details.html?id=northstar-pdi'
  },
  {
    id: 'harbor-fed-102',
    title: 'Front-End Development Intern',
    company: 'HarborWorks Technologies',
    companyInitial: 'H',
    companyAvatarBg: '#E0F2FE',
    companyAvatarColor: '#0369A1',
    category: 'Web & Mobile Development',
    location: 'Taguig City',
    locationGroup: 'Taguig / BGC',
    setup: 'Hybrid',
    allowance: '₱12,000 per month',
    allowanceValue: 12000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 11, 2026',
    deadline: 'November 5, 2026',
    daysLeft: '24 days left',
    description: 'Build responsive web experiences and learn component-based development alongside engineers.',
    about: 'Join our software engineering squad to build performant, accessible web components and customer dashboards using modern HTML, CSS, and modern JavaScript frameworks.',
    responsibilities: [
      'Implement responsive layouts using Semantic HTML5 and CSS Grid/Flexbox.',
      'Develop interactive UI widgets and state-driven form components in JavaScript.',
      'Participate in Git pull request reviews and learn CI/CD pipelines.',
      'Test web performance and cross-browser compatibility.'
    ],
    requirements: [
      'Pursuing BS Computer Science, Information Technology, or Computer Engineering.',
      'Strong fundamental understanding of JavaScript (ES6+), HTML, and CSS.',
      'Familiarity with Git version control and GitHub repositories.',
      'Passionate about writing clean, well-commented code.'
    ],
    tags: ['HTML & CSS', 'JavaScript', 'React'],
    detailsUrl: 'details.html?id=harbor-fed-102'
  },
  {
    id: 'cedarline-it-103',
    title: 'IT Support Intern',
    company: 'Cedarline Services',
    companyInitial: 'C',
    companyAvatarBg: '#FEF3C7',
    companyAvatarColor: '#B45309',
    category: 'IT Support & Networking',
    location: 'Quezon City',
    locationGroup: 'Quezon City',
    setup: 'On-site',
    allowance: '₱8,000 per month',
    allowanceValue: 8000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 8, 2026',
    deadline: 'October 28, 2026',
    daysLeft: '16 days left',
    description: 'Help teams resolve technical issues, maintain devices, and document everyday IT solutions.',
    about: 'Cedarline Services provides managed operations for regional business centers. As an IT Support Intern, you will gain hands-on technical diagnostic experience and support corporate infrastructure.',
    responsibilities: [
      'Diagnose hardware, operating system, and office application issues.',
      'Configure workstations, network printers, and peripheral devices.',
      'Log and update support service tickets in the Jira service desk.',
      'Assist with routine network cable tracing and workstation connectivity.'
    ],
    requirements: [
      'BSIT, BS Computer Engineering, or Associate Degree in Network Systems.',
      'Basic hardware troubleshooting and Windows 10/11 administration knowledge.',
      'Excellent customer service orientation and clear communication.',
      'Ready for on-site immersion in our Quezon City operations hub.'
    ],
    tags: ['Troubleshooting', 'Networking', 'Hardware Support'],
    detailsUrl: 'details.html?id=cedarline-it-103'
  },
  {
    id: 'stratos-flutter-104',
    title: 'Mobile App Developer Intern (Flutter)',
    company: 'Stratos Mobile Innovations',
    companyInitial: 'S',
    companyAvatarBg: '#EDE9FE',
    companyAvatarColor: '#6D28D9',
    category: 'Web & Mobile Development',
    location: 'Pasig / Ortigas',
    locationGroup: 'Pasig / Ortigas',
    setup: 'Remote',
    allowance: '₱14,000 per month',
    allowanceValue: 14000,
    isPaid: true,
    term: 'July–October 2027',
    postedDate: 'October 9, 2026',
    deadline: 'November 10, 2026',
    daysLeft: '29 days left',
    description: 'Create cross-platform student productivity modules and test seamless UI animations in Flutter.',
    about: 'Build cross-platform mobile apps for iOS and Android using Flutter & Dart. You will collaborate with product designers and backend engineers to deploy real features to beta testers.',
    responsibilities: [
      'Build reusable Flutter UI widgets matching mobile design specifications.',
      'Integrate RESTful JSON endpoints with asynchronous Dart state handlers.',
      'Perform manual device testing and debug layout responsiveness on Android/iOS.',
      'Participate in bi-weekly agile sprint demos and backlog grooming.'
    ],
    requirements: [
      'Enrolled in Computer Science, Information Technology, or Software Engineering.',
      'Experience with Flutter/Dart or native mobile development.',
      'Understanding of MVC/MVVM architectures and HTTP client integration.',
      'Self-driven learner capable of collaborating in a remote-first team.'
    ],
    tags: ['Flutter', 'Dart', 'REST APIs'],
    detailsUrl: 'details.html?id=stratos-flutter-104'
  },
  {
    id: 'aster-uxr-105',
    title: 'UX Researcher Intern',
    company: 'Aster Studio',
    companyInitial: 'A',
    companyAvatarBg: '#FCE7F3',
    companyAvatarColor: '#BE185D',
    category: 'UI/UX & Product Design',
    location: 'Makati City',
    locationGroup: 'Makati City',
    setup: 'Remote',
    allowance: '₱11,000 per month',
    allowanceValue: 11000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 7, 2026',
    deadline: 'October 27, 2026',
    daysLeft: '15 days left',
    description: 'Conduct moderated usability testing, summarize feedback transcripts, and map user personas.',
    about: 'Aster Studio is a design consultancy specializing in public services and fintech. You will facilitate user feedback interviews, conduct heuristic evaluations, and synthesize actionable design insights.',
    responsibilities: [
      'Assist in preparing usability test scripts and interview guides.',
      'Observe live user testing sessions and organize raw qualitative notes.',
      'Synthesize affinity diagrams and document UX heuristic violations.',
      'Present research key takeaways to design and engineering stakeholders.'
    ],
    requirements: [
      'Undergraduate in Human-Computer Interaction, Information Systems, or Psychology.',
      'Familiarity with qualitative research methodologies and usability testing.',
      'Strong analytical writing and objective note-taking abilities.',
      'Knowledge of Miro, Notion, and Figma is a plus.'
    ],
    tags: ['User Interviews', 'Usability Testing', 'Heuristic Evaluation'],
    detailsUrl: 'details.html?id=aster-uxr-105'
  },
  {
    id: 'nimbus-devops-106',
    title: 'Cloud & DevOps Engineer Intern',
    company: 'Nimbus Cloud Solutions',
    companyInitial: 'N',
    companyAvatarBg: '#ECFDF5',
    companyAvatarColor: '#047857',
    category: 'Cloud & DevOps',
    location: 'Taguig / BGC',
    locationGroup: 'Taguig / BGC',
    setup: 'Hybrid',
    allowance: '₱15,000 per month',
    allowanceValue: 15000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 10, 2026',
    deadline: 'November 2, 2026',
    daysLeft: '21 days left',
    description: 'Learn infrastructure as code, automate CI/CD GitHub Actions, and monitor AWS server health.',
    about: 'Work with cloud architects to maintain high-availability infrastructure on AWS and GCP. Learn automated deployment pipelines, Docker containerization, and Prometheus/Grafana system monitoring.',
    responsibilities: [
      'Help write Dockerfiles and containerize development services.',
      'Maintain GitHub Actions workflows for continuous integration testing.',
      'Configure cloud monitoring dashboards and log alerts using Grafana.',
      'Assist in documenting server provisioning and backup recovery procedures.'
    ],
    requirements: [
      'Pursuing BS Computer Science, IT, or Computer Engineering.',
      'Basic familiarity with Linux command line, Bash scripting, and Git.',
      'Fundamental understanding of cloud concepts (IaaS, PaaS, VPC, Docker).',
      'Eager to learn DevOps automation culture and best practices.'
    ],
    tags: ['AWS', 'Docker', 'CI/CD Pipelines', 'Linux'],
    detailsUrl: 'details.html?id=nimbus-devops-106'
  },
  {
    id: 'pixelforge-fullstack-107',
    title: 'Full-Stack Game Tools Developer Intern',
    company: 'PixelForge Games',
    companyInitial: 'P',
    companyAvatarBg: '#FFF7ED',
    companyAvatarColor: '#C2410C',
    category: 'Web & Mobile Development',
    location: 'Mandaluyong City',
    locationGroup: 'Metro Manila',
    setup: 'Hybrid',
    allowance: '₱13,000 per month',
    allowanceValue: 13000,
    isPaid: true,
    term: 'July–October 2027',
    postedDate: 'October 9, 2026',
    deadline: 'November 8, 2026',
    daysLeft: '27 days left',
    description: 'Develop internal web dashboards for game analytics, live game events, and community telemetry.',
    about: 'Build high-performance web tooling and analytics consoles for indie game developers. Integrate real-time WebSockets and SQL telemetry databases into responsive web applications.',
    responsibilities: [
      'Develop administrative web interfaces with modern JavaScript and Node.js.',
      'Write SQL queries to aggregate game event metrics and player session reports.',
      'Implement real-time notification alerts using WebSockets.',
      'Test internal developer tools and collect usability feedback from producers.'
    ],
    requirements: [
      'Enrolled in BS Computer Science, Game Development, or BSIT.',
      'Proficiency in JavaScript, Node.js, and SQL fundamentals.',
      'Familiarity with REST APIs and asynchronous programming.',
      'Interest in game production pipelines and developer tools.'
    ],
    tags: ['Node.js', 'PostgreSQL', 'WebSockets', 'REST APIs'],
    detailsUrl: 'details.html?id=pixelforge-fullstack-107'
  },
  {
    id: 'aegis-cyber-108',
    title: 'Cybersecurity & SOC Analyst Intern',
    company: 'Aegis Cybersecurity Labs',
    companyInitial: 'A',
    companyAvatarBg: '#FEE2E2',
    companyAvatarColor: '#B91C1C',
    category: 'Cybersecurity',
    location: 'Pasig / Ortigas',
    locationGroup: 'Pasig / Ortigas',
    setup: 'On-site',
    allowance: '₱13,500 per month',
    allowanceValue: 13500,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 11, 2026',
    deadline: 'October 29, 2026',
    daysLeft: '17 days left',
    description: 'Monitor threat telemetry, triage SIEM security alerts, and practice incident response workflows.',
    about: 'Join our 24/7 Security Operations Center (SOC) to safeguard critical client enterprise data. Analyze suspicious traffic, study malware indicators of compromise (IoCs), and audit security compliance.',
    responsibilities: [
      'Review and triage real-time alerts in SIEM platforms (Splunk / Elastic).',
      'Analyze network traffic logs and phishing email submissions.',
      'Assist in drafting initial incident response triage summaries.',
      'Participate in simulated red/blue team tabletop exercises.'
    ],
    requirements: [
      'Enrolled in BS Cybersecurity, Computer Science, or Information Technology.',
      'Solid grounding in TCP/IP networking, firewalls, and operating systems.',
      'Basic knowledge of common vulnerabilities (OWASP Top 10).',
      'Strong ethical mindset and commitment to data confidentiality.'
    ],
    tags: ['Network Security', 'SIEM Logs', 'Incident Response', 'Wireshark'],
    detailsUrl: 'details.html?id=aegis-cyber-108'
  },
  {
    id: 'metricpulse-data-109',
    title: 'Data Analytics & Business Intelligence Intern',
    company: 'MetricPulse Insights',
    companyInitial: 'M',
    companyAvatarBg: '#EFF6FF',
    companyAvatarColor: '#1D4ED8',
    category: 'Data Analytics',
    location: 'Makati City',
    locationGroup: 'Makati City',
    setup: 'Remote',
    allowance: '₱12,500 per month',
    allowanceValue: 12500,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 8, 2026',
    deadline: 'November 4, 2026',
    daysLeft: '23 days left',
    description: 'Clean raw dataset records, model automated Tableau charts, and present business performance KPIs.',
    about: 'MetricPulse helps enterprise retail and logistics partners make informed decisions. You will clean datasets, create automated dashboards, and present exploratory data insights to senior consultants.',
    responsibilities: [
      'Write Python (Pandas) and SQL scripts to clean and transform raw datasets.',
      'Build dynamic visual dashboards in Tableau and Power BI.',
      'Document metric definitions and maintain data dictionary catalogs.',
      'Prepare summary presentation decks for management reporting.'
    ],
    requirements: [
      'Undergraduate student in Data Science, Statistics, Computer Science, or BSIT.',
      'Proficiency in SQL query writing and basic Python/R data analysis.',
      'Experience building charts or dashboards in Tableau or Power BI.',
      'Attention to detail and numerical accuracy.'
    ],
    tags: ['Python', 'SQL', 'Tableau', 'Power BI'],
    detailsUrl: 'details.html?id=metricpulse-data-109'
  },
  {
    id: 'canvascraft-design-110',
    title: 'Design Systems & Accessibility Intern',
    company: 'CanvasCraft Enterprise',
    companyInitial: 'C',
    companyAvatarBg: '#FDF4FF',
    companyAvatarColor: '#A21CAF',
    category: 'UI/UX & Product Design',
    location: 'Taguig / BGC',
    locationGroup: 'Taguig / BGC',
    setup: 'Hybrid',
    allowance: '₱10,500 per month',
    allowanceValue: 10500,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 10, 2026',
    deadline: 'November 1, 2026',
    daysLeft: '20 days left',
    description: 'Help audit typography, contrast ratios, and component documentation for accessible enterprise apps.',
    about: 'Contribute to building and scaling design tokens, reusable UI component libraries, and WCAG accessibility standards across web and mobile platforms.',
    responsibilities: [
      'Audit color contrast, keyboard navigation, and focus indicators for WCAG 2.1 AA compliance.',
      'Organize and document UI component variants and token states in Figma.',
      'Collaborate with developers to ensure design tokens match CSS custom properties.',
      'Create design guideline documentation for engineering teams.'
    ],
    requirements: [
      'Enrolled in IT, HCI, Multimedia Arts, or Computer Science.',
      'Strong grasp of Figma component variants, auto layout, and styles.',
      'Understanding of digital accessibility (WCAG) principles.',
      'High attention to pixel alignment and visual consistency.'
    ],
    tags: ['Figma Tokens', 'Accessibility WCAG', 'Micro-interactions'],
    detailsUrl: 'details.html?id=canvascraft-design-110'
  },
  {
    id: 'testcraft-qa-111',
    title: 'QA Automation & Software Testing Intern',
    company: 'TestCraft Solutions',
    companyInitial: 'T',
    companyAvatarBg: '#CFFAFE',
    companyAvatarColor: '#0E7490',
    category: 'Web & Mobile Development',
    location: 'Quezon City',
    locationGroup: 'Quezon City',
    setup: 'Remote',
    allowance: '₱11,500 per month',
    allowanceValue: 11500,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 9, 2026',
    deadline: 'November 6, 2026',
    daysLeft: '25 days left',
    description: 'Write regression test cases, execute automated Cypress/Playwright tests, and track Jira bugs.',
    about: 'Learn enterprise software quality assurance by designing comprehensive test cases, executing end-to-end automation scripts, and collaborating with developers in agile release cycles.',
    responsibilities: [
      'Draft detailed test cases covering positive, negative, and edge scenarios.',
      'Execute manual functional testing across desktop and mobile browsers.',
      'Write automated end-to-end regression tests using Cypress or Playwright.',
      'Document and track bug reproduction steps in Jira.'
    ],
    requirements: [
      'Enrolled in Computer Science, Information Technology, or Computer Engineering.',
      'Understanding of software testing lifecycle (STLC) concepts.',
      'Basic JavaScript programming skills for test automation.',
      'Methodical mindset with an eye for detecting software flaws.'
    ],
    tags: ['Cypress', 'Playwright', 'Test Case Design', 'Jira'],
    detailsUrl: 'details.html?id=testcraft-qa-111'
  },
  {
    id: 'nexus-sysadmin-112',
    title: 'Systems Administrator Intern',
    company: 'Nexus Core Technologies',
    companyInitial: 'N',
    companyAvatarBg: '#F3F4F6',
    companyAvatarColor: '#1F2937',
    category: 'IT Support & Networking',
    location: 'Mandaluyong City',
    locationGroup: 'Metro Manila',
    setup: 'On-site',
    allowance: '₱9,000 per month',
    allowanceValue: 9000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 7, 2026',
    deadline: 'October 26, 2026',
    daysLeft: '14 days left',
    description: 'Support active directory accounts, virtual machine deployments, and automated backup routines.',
    about: 'Assist senior systems administrators in maintaining server uptime, virtualized clusters, Active Directory group policies, and offsite automated backups for commercial clients.',
    responsibilities: [
      'Provision user accounts and permission groups in Active Directory.',
      'Monitor server resources, CPU usage, and storage thresholds on VMware/Hyper-V.',
      'Verify execution of nightly incremental backup scripts.',
      'Install security updates and patch operating systems during maintenance windows.'
    ],
    requirements: [
      'BS in Information Technology, Computer Engineering, or Network Administration.',
      'Familiarity with Windows Server, Active Directory, and basic Linux.',
      'Understanding of virtualization and RAID storage configurations.',
      'Available for on-site shift operations in Mandaluyong City.'
    ],
    tags: ['Active Directory', 'Windows Server', 'Virtualization'],
    detailsUrl: 'details.html?id=nexus-sysadmin-112'
  },
  {
    id: 'synapse-ai-113',
    title: 'AI & Machine Learning Intern',
    company: 'Synapse Intelligence Labs',
    companyInitial: 'S',
    companyAvatarBg: '#F5F3FF',
    companyAvatarColor: '#5B21B6',
    category: 'Data Analytics',
    location: 'Makati City',
    locationGroup: 'Makati City',
    setup: 'Remote',
    allowance: '₱16,000 per month',
    allowanceValue: 16000,
    isPaid: true,
    term: 'July–October 2027',
    postedDate: 'October 11, 2026',
    deadline: 'November 12, 2026',
    daysLeft: '31 days left',
    description: 'Train NLP classification models, fine-tune open-source LLMs, and build evaluation pipelines in Python.',
    about: 'Join an applied AI research laboratory building intelligent search and document summarization systems. Work with senior ML engineers on data labeling, model fine-tuning, and RAG architectures.',
    responsibilities: [
      'Preprocess text corpora and clean training dataset annotations.',
      'Fine-tune small language models and evaluate accuracy benchmarks.',
      'Build API wrappers in FastAPI to serve machine learning inference requests.',
      'Document model performance metrics and error analysis findings.'
    ],
    requirements: [
      'BS Computer Science, Data Science, or Applied Mathematics.',
      'Strong programming proficiency in Python, NumPy, and PyTorch.',
      'Familiarity with NLP transformers and prompt engineering principles.',
      'Passion for machine learning research and applied AI engineering.'
    ],
    tags: ['Python', 'PyTorch', 'FastAPI', 'Machine Learning'],
    detailsUrl: 'details.html?id=synapse-ai-113'
  },
  {
    id: 'vertex-backend-114',
    title: 'Backend API Developer Intern',
    company: 'Vertex Cloud Systems',
    companyInitial: 'V',
    companyAvatarBg: '#ECFEFF',
    companyAvatarColor: '#155E75',
    category: 'Web & Mobile Development',
    location: 'Taguig / BGC',
    locationGroup: 'Taguig / BGC',
    setup: 'Hybrid',
    allowance: '₱13,500 per month',
    allowanceValue: 13500,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 10, 2026',
    deadline: 'November 4, 2026',
    daysLeft: '23 days left',
    description: 'Design microservice REST APIs, optimize PostgreSQL queries, and write Redis caching layers.',
    about: 'Build scalable backend services powering high-volume logistics and transaction processing. Learn architectural patterns, database indexing, and authentication security in production.',
    responsibilities: [
      'Implement RESTful endpoints in Node.js (Express / NestJS) and Go.',
      'Write optimized SQL schema migrations and stored procedures in PostgreSQL.',
      'Implement Redis caching layers to reduce database query latency.',
      'Write unit tests using Jest and document endpoints using OpenAPI/Swagger.'
    ],
    requirements: [
      'Pursuing BS Computer Science, Information Technology, or Software Engineering.',
      'Solid programming foundations in Node.js, TypeScript, or Go.',
      'Understanding of relational database modeling and SQL normalization.',
      'Knowledge of JWT authentication and API security practices.'
    ],
    tags: ['Node.js', 'PostgreSQL', 'Redis', 'REST APIs'],
    detailsUrl: 'details.html?id=vertex-backend-114'
  },
  {
    id: 'databound-dba-115',
    title: 'Database Administrator & SQL Intern',
    company: 'DataBound Solutions',
    companyInitial: 'D',
    companyAvatarBg: '#FEF2F2',
    companyAvatarColor: '#991B1B',
    category: 'Data Analytics',
    location: 'Quezon City',
    locationGroup: 'Quezon City',
    setup: 'Hybrid',
    allowance: '₱11,000 per month',
    allowanceValue: 11000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 8, 2026',
    deadline: 'October 29, 2026',
    daysLeft: '17 days left',
    description: 'Monitor database performance, write automated maintenance scripts, and audit table indexes.',
    about: 'Support enterprise relational databases hosting healthcare and education records. Learn high-volume indexing strategies, disaster recovery testing, and replication monitoring.',
    responsibilities: [
      'Analyze slow query logs and suggest composite index optimizations.',
      'Automate database snapshot backups and test recovery restores.',
      'Audit user role privileges to maintain least-privilege compliance.',
      'Assist in database schema migrations across development and staging environments.'
    ],
    requirements: [
      'BS in Information Technology, Computer Science, or Information Systems.',
      'Strong command of SQL syntax (DDL, DML) in MySQL or PostgreSQL.',
      'Understanding of ACID transactions, primary/foreign keys, and indexes.',
      'Methodical approach to data safety and integrity.'
    ],
    tags: ['PostgreSQL', 'MySQL', 'Database Indexing', 'SQL'],
    detailsUrl: 'details.html?id=databound-dba-115'
  },
  {
    id: 'quantum-ios-116',
    title: 'iOS Swift Developer Intern',
    company: 'Quantum Leap Mobile',
    companyInitial: 'Q',
    companyAvatarBg: '#F0FDF4',
    companyAvatarColor: '#166534',
    category: 'Web & Mobile Development',
    location: 'Pasig / Ortigas',
    locationGroup: 'Pasig / Ortigas',
    setup: 'Remote',
    allowance: '₱14,500 per month',
    allowanceValue: 14500,
    isPaid: true,
    term: 'July–October 2027',
    postedDate: 'October 11, 2026',
    deadline: 'November 15, 2026',
    daysLeft: '34 days left',
    description: 'Build native iOS interfaces in SwiftUI, implement Core Data storage, and integrate Apple APIs.',
    about: 'Develop native Apple iOS consumer applications. You will work in Xcode with modern SwiftUI, learn Combine reactive patterns, and package builds for TestFlight distribution.',
    responsibilities: [
      'Develop dynamic screens using SwiftUI and Apple Human Interface Guidelines.',
      'Implement local caching and offline persistence using SwiftData or Core Data.',
      'Integrate third-party REST endpoints and handle JSON decoding.',
      'Debug memory leaks and optimize smooth 60fps animations.'
    ],
    requirements: [
      'Enrolled in BS Computer Science, BSIT, or Computer Engineering.',
      'Experience developing in Swift with Xcode on macOS.',
      'Familiarity with SwiftUI views, state management, and navigation.',
      'Understanding of Apple design standards and mobile UX.'
    ],
    tags: ['Swift', 'SwiftUI', 'iOS SDK', 'Xcode'],
    detailsUrl: 'details.html?id=quantum-ios-116'
  },
  {
    id: 'sentinel-net-117',
    title: 'Network Operations Intern',
    company: 'Sentinel Networks',
    companyInitial: 'S',
    companyAvatarBg: '#F8FAFC',
    companyAvatarColor: '#334155',
    category: 'IT Support & Networking',
    location: 'Makati City',
    locationGroup: 'Makati City',
    setup: 'On-site',
    allowance: '₱9,500 per month',
    allowanceValue: 9500,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 9, 2026',
    deadline: 'October 30, 2026',
    daysLeft: '18 days left',
    description: 'Configure Cisco switches, analyze Wireshark packet captures, and map enterprise VLAN topology.',
    about: 'Gain physical and logical network engineering experience in our Makati data center. Learn routing protocols, switch configurations, firewall ACLs, and enterprise Wi-Fi management.',
    responsibilities: [
      'Assist in configuring Cisco Catalyst switches and access points.',
      'Document IP address allocations, patch panel ports, and rack topologies.',
      'Monitor network bandwidth utilization and packet loss using PRTG/Nagios.',
      'Perform structured cabling terminations (Cat6 RJ45) and testing.'
    ],
    requirements: [
      'Pursuing BS Electronics Engineering, Computer Engineering, or BSIT.',
      'Strong grasp of the OSI model, IP subnetting, VLANs, and routing.',
      'Familiarity with Cisco IOS commands (CCNA coursework preferred).',
      'Willingness to learn in an active enterprise data center environment.'
    ],
    tags: ['Cisco Switching', 'VLANs', 'Wireshark', 'Subnetting'],
    detailsUrl: 'details.html?id=sentinel-net-117'
  },
  {
    id: 'byteforge-java-118',
    title: 'Enterprise Java Software Engineer Intern',
    company: 'ByteForge Solutions',
    companyInitial: 'B',
    companyAvatarBg: '#FFFBEB',
    companyAvatarColor: '#92400E',
    category: 'Web & Mobile Development',
    location: 'Taguig / BGC',
    locationGroup: 'Taguig / BGC',
    setup: 'Hybrid',
    allowance: '₱12,000 per month',
    allowanceValue: 12000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 10, 2026',
    deadline: 'November 3, 2026',
    daysLeft: '22 days left',
    description: 'Develop Spring Boot microservices, write JUnit tests, and integrate enterprise message queues.',
    about: 'Join a fintech engineering team building robust, enterprise-grade banking and payment modules using Java 21, Spring Boot, and Apache Kafka.',
    responsibilities: [
      'Develop backend service layers and controllers using Spring Boot.',
      'Write object-relational mapping entities with Hibernate and Spring Data JPA.',
      'Ensure code coverage by writing unit and integration tests with JUnit and Mockito.',
      'Participate in agile ceremonies, daily standups, and code reviews.'
    ],
    requirements: [
      'BS in Computer Science, Software Engineering, or Information Technology.',
      'Solid object-oriented programming (OOP) principles in Java.',
      'Familiarity with Spring Boot and dependency injection concepts.',
      'Experience with Maven/Gradle build tools and Git.'
    ],
    tags: ['Java', 'Spring Boot', 'JUnit', 'Microservices'],
    detailsUrl: 'details.html?id=byteforge-java-118'
  },
  {
    id: 'cloudguard-infosec-119',
    title: 'Information Security Governance Intern',
    company: 'CloudGuard Philippines',
    companyInitial: 'C',
    companyAvatarBg: '#F1F5F9',
    companyAvatarColor: '#0F172A',
    category: 'Cybersecurity',
    location: 'Mandaluyong City',
    locationGroup: 'Metro Manila',
    setup: 'Remote',
    allowance: '₱12,000 per month',
    allowanceValue: 12000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 8, 2026',
    deadline: 'October 31, 2026',
    daysLeft: '19 days left',
    description: 'Audit cloud access policies, conduct risk assessments, and draft security awareness training.',
    about: 'Work with information security officers to ensure compliance with data privacy regulations (GDPR, Philippine Data Privacy Act) and ISO 27001 standards.',
    responsibilities: [
      'Review access permissions and audit multi-factor authentication enrollment.',
      'Conduct vendor security risk assessments and questionnaire evaluations.',
      'Develop interactive security awareness materials for employee phishing defense.',
      'Assist in documenting internal IT security policy exceptions.'
    ],
    requirements: [
      'Enrolled in Information Assurance, Cybersecurity, Information Systems, or BSIT.',
      'Knowledge of basic security governance frameworks and the Data Privacy Act.',
      'Strong research, technical writing, and communication skills.',
      'Discreet and ethical conduct in handling sensitive audit information.'
    ],
    tags: ['ISO 27001', 'Data Privacy', 'Risk Assessment', 'Compliance'],
    detailsUrl: 'details.html?id=cloudguard-infosec-119'
  },
  {
    id: 'docuware-writer-120',
    title: 'Technical Documentation & API Writer Intern',
    company: 'DocuWare Software',
    companyInitial: 'D',
    companyAvatarBg: '#FAF5FF',
    companyAvatarColor: '#7E22CE',
    category: 'IT Support & Networking',
    location: 'Quezon City',
    locationGroup: 'Quezon City',
    setup: 'Remote',
    allowance: '₱10,000 per month',
    allowanceValue: 10000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 7, 2026',
    deadline: 'October 27, 2026',
    daysLeft: '15 days left',
    description: 'Author developer guides, document REST API schemas in Swagger, and maintain knowledge bases.',
    about: 'Bridge the gap between complex software engineering and clear developer documentation. You will write onboarding guides, API reference docs, and release notes for open-source developer tools.',
    responsibilities: [
      'Write clear, concise API endpoint references using Swagger/OpenAPI.',
      'Create step-by-step developer tutorial walkthroughs with code snippets.',
      'Maintain team knowledge bases in Notion, Markdown, and GitBook.',
      'Review developer feedback to identify ambiguous or outdated documentation.'
    ],
    requirements: [
      'Pursuing BSIT, Computer Science, Technical Writing, or English Studies.',
      'Ability to understand code snippets in JavaScript, Python, or curl.',
      'Exceptional written English skills with a knack for clarifying complex topics.',
      'Experience with Markdown and GitHub documentation repositories.'
    ],
    tags: ['Markdown', 'OpenAPI', 'Developer Guides', 'GitBook'],
    detailsUrl: 'details.html?id=docuware-writer-120'
  },
  {
    id: 'aurora-bi-121',
    title: 'Power BI & Data Visualization Intern',
    company: 'Aurora Analytics',
    companyInitial: 'A',
    companyAvatarBg: '#FEFCE8',
    companyAvatarColor: '#854D0E',
    category: 'Data Analytics',
    location: 'Pasig / Ortigas',
    locationGroup: 'Pasig / Ortigas',
    setup: 'Hybrid',
    allowance: '₱11,500 per month',
    allowanceValue: 11500,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 11, 2026',
    deadline: 'November 7, 2026',
    daysLeft: '26 days left',
    description: 'Design executive Power BI dashboards, model DAX calculations, and automate scheduled refreshes.',
    about: 'Transform complex organizational spreadsheets into interactive, real-time Power BI reporting dashboards for FMCG and retail enterprise clients.',
    responsibilities: [
      'Connect Power BI reports to SQL databases, Excel, and cloud endpoints.',
      'Write DAX measures for year-over-year revenue and operational efficiency KPIs.',
      'Design clean, accessible report canvases following corporate branding.',
      'Schedule automated dataset refresh gateways and manage user workspaces.'
    ],
    requirements: [
      'Enrolled in Information Systems, Industrial Engineering, BSIT, or Computer Science.',
      'Hands-on experience creating reports in Microsoft Power BI Desktop.',
      'Understanding of relational star-schema data modeling.',
      'Good eye for data visualization design and dashboard aesthetics.'
    ],
    tags: ['Power BI', 'DAX', 'Data Modeling', 'ETL'],
    detailsUrl: 'details.html?id=aurora-bi-121'
  },
  {
    id: 'corelogic-csharp-122',
    title: '.NET Core Software Developer Intern',
    company: 'CoreLogic Enterprise',
    companyInitial: 'C',
    companyAvatarBg: '#F0FDFA',
    companyAvatarColor: '#0F766E',
    category: 'Web & Mobile Development',
    location: 'Taguig City',
    locationGroup: 'Taguig / BGC',
    setup: 'On-site',
    allowance: '₱13,000 per month',
    allowanceValue: 13000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 9, 2026',
    deadline: 'October 30, 2026',
    daysLeft: '18 days left',
    description: 'Develop C# backend controllers, configure Entity Framework, and write SQL Server procedures.',
    about: 'Join a seasoned enterprise software consulting group building high-security commercial portals using modern C# .NET Core, Azure Cloud, and Microsoft SQL Server.',
    responsibilities: [
      'Build clean REST API endpoints in ASP.NET Core.',
      'Model database entities and manage migrations using Entity Framework Core.',
      'Write optimized T-SQL stored procedures and triggers in SQL Server.',
      'Participate in code reviews and automate unit testing with xUnit.'
    ],
    requirements: [
      'BS in Computer Science, Computer Engineering, or Information Technology.',
      'Knowledge of C# and object-oriented programming principles.',
      'Familiarity with relational databases and SQL Server.',
      'Eager to learn enterprise software engineering methodologies.'
    ],
    tags: ['C#', '.NET Core', 'SQL Server', 'Entity Framework'],
    detailsUrl: 'details.html?id=corelogic-csharp-122'
  },
  {
    id: 'helios-iot-123',
    title: 'Embedded Systems & IoT Developer Intern',
    company: 'Helios Tech Labs',
    companyInitial: 'H',
    companyAvatarBg: '#FEF9C3',
    companyAvatarColor: '#713F12',
    category: 'Web & Mobile Development',
    location: 'Quezon City',
    locationGroup: 'Quezon City',
    setup: 'On-site',
    allowance: '₱11,000 per month',
    allowanceValue: 11000,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 8, 2026',
    deadline: 'October 29, 2026',
    daysLeft: '17 days left',
    description: 'Program ESP32 microcontrollers in C++, test MQTT telemetry streams, and solder sensor prototypes.',
    about: 'Work on smart-building IoT sensors, environmental telemetry loggers, and hardware prototypes. You will code firmware, test Wi-Fi/Bluetooth protocols, and bridge device data to web cloud dashboards.',
    responsibilities: [
      'Write and debug firmware code in C/C++ on ESP32 and Arduino boards.',
      'Configure MQTT broker streams to relay sensor metrics to web servers.',
      'Solder prototyping breadboards and test analog/digital sensor readings.',
      'Document hardware schematics and serial communication protocols.'
    ],
    requirements: [
      'BS Computer Engineering, Electronics Engineering, or Computer Science.',
      'Proficiency in C/C++ programming for microcontrollers.',
      'Hands-on experience with Arduino, ESP32, or Raspberry Pi projects.',
      'Available for on-site hardware laboratory testing in Quezon City.'
    ],
    tags: ['C/C++', 'Arduino', 'ESP32', 'IoT Telemetry'],
    detailsUrl: 'details.html?id=helios-iot-123'
  },
  {
    id: 'vanguard-linux-124',
    title: 'Linux Systems Support Intern',
    company: 'Vanguard Infrastructure',
    companyInitial: 'V',
    companyAvatarBg: '#F3F4F6',
    companyAvatarColor: '#374151',
    category: 'IT Support & Networking',
    location: 'Makati City',
    locationGroup: 'Makati City',
    setup: 'Hybrid',
    allowance: '₱10,500 per month',
    allowanceValue: 10500,
    isPaid: true,
    term: 'June–September 2027',
    postedDate: 'October 10, 2026',
    deadline: 'November 2, 2026',
    daysLeft: '21 days left',
    description: 'Maintain Ubuntu servers, automate backup cron jobs, and inspect system log events with Bash.',
    about: 'Assist infrastructure engineers in administering Linux server instances (Ubuntu/Debian), managing user shell accounts, configuring SSH keys, and automating routine operational tasks with shell scripts.',
    responsibilities: [
      'Manage user accounts, file permissions, and SSH access on Ubuntu servers.',
      'Write Bash shell scripts to automate repetitive log archiving and backups.',
      'Inspect system logs (systemd journalctl, syslog) for service failures.',
      'Assist in configuring Apache/Nginx reverse proxy virtual hosts.'
    ],
    requirements: [
      'Undergraduate in Information Technology, Computer Science, or Computer Engineering.',
      'Familiarity with Linux terminal commands, package managers, and text editors (Vim/Nano).',
      'Basic Bash shell scripting capabilities.',
      'Enthusiastic about open-source operating systems and server management.'
    ],
    tags: ['Linux', 'Ubuntu Server', 'Bash Scripting', 'Nginx'],
    detailsUrl: 'details.html?id=vanguard-linux-124'
  }
];

// Helper: Retrieve internship listing by ID
function getJobById(id) {
  if (!id) return internshipsData[0];
  const found = internshipsData.find(j => j.id === id);
  return found || internshipsData[0];
}

// Retrieve state from localStorage or initialize with defaults
function getAppState() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return defaultState;
  }
  try {
    const parsed = JSON.parse(data);
    // Ensure all critical arrays exist
    if (!Array.isArray(parsed.savedJobIds)) parsed.savedJobIds = [];
    if (!Array.isArray(parsed.appliedJobIds)) parsed.appliedJobIds = [];
    if (!Array.isArray(parsed.skills)) parsed.skills = [];

    return parsed;
  } catch (e) {
    return defaultState;
  }
}

// Save updated state to localStorage
function saveAppState(updates) {
  const current = getAppState();
  const updated = { ...current, ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  syncHeaderUser();
  return updated;
}

// Synchronize user chip name and avatar across all pages
function syncHeaderUser() {
  const state = getAppState();
  const hasName = state.firstName || state.lastName;
  const fullName = hasName ? `${state.firstName || ''} ${state.lastName || ''}`.trim() : (state.email ? state.email.split('@')[0] : 'Student Profile');
  const firstInitial = (state.firstName || fullName || 'S')[0] || 'S';
  const lastInitial = (state.lastName || '')[0] || (fullName[1] || 'P');
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();

  // Update header chips
  document.querySelectorAll('.user-chip span').forEach(el => {
    el.innerText = fullName;
  });
  document.querySelectorAll('.avatar-circle').forEach(el => {
    if (state.avatarDataUrl) {
      el.innerHTML = `<img src="${state.avatarDataUrl}" alt="${fullName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
    } else {
      el.innerText = initials;
    }
  });

  // Update settings avatar card if on settings page
  const settingsAvatarEl = document.getElementById('settingsAvatarLarge');
  if (settingsAvatarEl) {
    if (state.avatarDataUrl) {
      settingsAvatarEl.innerHTML = `<img src="${state.avatarDataUrl}" alt="${fullName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
    } else {
      settingsAvatarEl.innerText = initials;
    }
  }

  // Update greetings if on dashboard
  const greetingEl = document.querySelector('.greeting-h1');
  if (greetingEl) {
    const greetName = state.preferredName || state.firstName || fullName;
    greetingEl.innerText = `Good morning, ${greetName}.`;
  }
  const sideNameEl = document.querySelector('.sidebar-user-name');
  if (sideNameEl) {
    sideNameEl.innerText = fullName;
  }
  const sideSubEl = document.querySelector('.sidebar-user-sub');
  if (sideSubEl) {
    sideSubEl.innerText = state.degree || state.institution || (state.profileCompleted ? 'Student Workspace' : 'Profile Incomplete');
  }

  // Update receipt applicant name if on confirmation page
  const receiptAppEl = document.getElementById('receiptApplicantName');
  if (receiptAppEl) {
    receiptAppEl.innerText = fullName || 'Student Applicant';
  }

  // Update personalized chat greeting in messages
  document.querySelectorAll('.student-chat-name').forEach(el => {
    el.innerText = state.preferredName || state.firstName || 'there';
  });
}

// Gating function: redirects new accounts to fill out their profile first
function checkProfileGate() {
  const path = window.location.pathname;
  const page = path.split('/').pop() || 'index.html';
  const openPages = ['index.html', 'login.html', 'register.html', 'profile.html', 'resources.html', 'employers.html'];
  if (openPages.includes(page)) return;

  const state = getAppState();
  if (!state.profileCompleted) {
    sessionStorage.setItem('bytepath_profile_notice', 'Please complete your student profile first before accessing other portal features.');
    window.location.replace('profile.html?firstLogin=true');
  }
}

// Toast notification helper
function showToast(message, type = 'success') {
  let toast = document.getElementById('globalToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'globalToast';
    toast.className = 'global-toast';
    document.body.appendChild(toast);
  }
  const statusIcon = type === 'success' ? '✓' : (type === 'warning' ? '!' : 'i');
  toast.innerHTML = `
    <span style="font-weight: 700;">${statusIcon}</span>
    <span>${message}</span>
  `;
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// Shortlist toggle handler
function toggleSaveJob(jobId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const state = getAppState();
  const savedIds = new Set(state.savedJobIds || []);
  let isSaved = false;

  if (savedIds.has(jobId)) {
    savedIds.delete(jobId);
    isSaved = false;
    showToast('Opportunity removed from shortlist.', 'info');
  } else {
    savedIds.add(jobId);
    isSaved = true;
    showToast('Opportunity saved to your shortlist!', 'success');
  }

  const updatedSavedList = Array.from(savedIds);
  saveAppState({
    savedJobIds: updatedSavedList,
    savedInternshipsCount: updatedSavedList.length
  });

  // Update button in DOM
  const btn = event ? event.currentTarget : document.querySelector(`[data-job-save-id="${jobId}"]`);
  if (btn) {
    if (isSaved) {
      btn.classList.add('saved');
      btn.innerHTML = `&#9733; Saved`;
    } else {
      btn.classList.remove('saved');
      btn.innerHTML = `&#9734; Save opportunity`;
    }
  }

  // Update dashboard stat card if present
  const dashSaved = document.getElementById('dashboardSavedCount');
  if (dashSaved) dashSaved.innerText = updatedSavedList.length;

  // If in browse page, re-sync button states
  document.querySelectorAll(`[data-job-save-id="${jobId}"]`).forEach(b => {
    if (isSaved) {
      b.classList.add('saved');
      b.innerHTML = `&#9733; Saved`;
    } else {
      b.classList.remove('saved');
      b.innerHTML = `&#9734; Save opportunity`;
    }
  });
}

// Global Logout Handler
function handleLogout(e) {
  if (e) e.preventDefault();
  if (confirm('Are you sure you want to log out of your student workspace?')) {
    showToast('Logging out...', 'info');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 400);
  }
}

// Global Password Visibility Toggle Utility
function togglePassVisibility(inputId, btnEl, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const input = typeof inputId === 'string' ? document.getElementById(inputId) : inputId;
  if (!input) return;

  const btn = btnEl || (inputId === 'regPassword' ? document.getElementById('regPassToggleBtn') : (inputId === 'regConfirmPassword' ? document.getElementById('regConfirmToggleBtn') : document.getElementById('showPassBtn')));

  const eyeSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
  const eyeOffSvg = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;

  if (input.type === 'password') {
    input.type = 'text';
    if (btn) {
      const iconSpan = btn.querySelector('.toggle-icon');
      const textSpan = btn.querySelector('.toggle-text');
      if (iconSpan && textSpan) {
        iconSpan.innerHTML = eyeOffSvg;
        textSpan.innerText = 'Hide';
      } else {
        btn.innerHTML = `${eyeOffSvg} <span class="toggle-text">Hide</span>`;
      }
      btn.setAttribute('aria-label', 'Hide password');
    }
  } else {
    input.type = 'password';
    if (btn) {
      const iconSpan = btn.querySelector('.toggle-icon');
      const textSpan = btn.querySelector('.toggle-text');
      if (iconSpan && textSpan) {
        iconSpan.innerHTML = eyeSvg;
        textSpan.innerText = 'Show';
      } else {
        btn.innerHTML = `${eyeSvg} <span class="toggle-text">Show</span>`;
      }
      btn.setAttribute('aria-label', 'Show password');
    }
  }
}

// Global Login Password Toggle Wrapper
function togglePasswordVisibility(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  togglePassVisibility('loginPassword', document.getElementById('showPassBtn'), event);
}

// Student Registration Form Handler
function handleRegisterSubmit(e) {
  if (e) e.preventDefault();
  const fName = document.getElementById('regFirstName')?.value.trim();
  const lName = document.getElementById('regLastName')?.value.trim();
  const email = document.getElementById('regEmail')?.value.trim();
  const institution = document.getElementById('regInstitution')?.value.trim();
  const degree = document.getElementById('regDegree')?.value.trim();
  const pass = document.getElementById('regPassword')?.value;
  const confirmPass = document.getElementById('regConfirmPassword')?.value;
  const terms = document.getElementById('regTerms');

  if (!fName || !lName || !email) {
    alert('Please enter your name and student email address.');
    return;
  }

  if (pass && confirmPass && pass !== confirmPass) {
    alert('Passwords do not match. Please verify your password.');
    return;
  }

  if (terms && !terms.checked) {
    alert('Please agree to the Terms of Service and Privacy Policy.');
    return;
  }

  // Save new user profile state (initial state: profileCompleted = false)
  saveAppState({
    firstName: fName,
    lastName: lName,
    preferredName: fName,
    email: email,
    institution: institution || '',
    degree: degree || '',
    phone: '',
    location: '',
    studentId: '',
    headline: degree ? `Aspiring ${degree} Student` : '',
    bio: '',
    portfolio: '',
    linkedin: '',
    targetRole: degree ? `${degree} Intern` : '',
    ojtSetup: 'Hybrid',
    skills: [],
    statement: '',
    resumeName: `${fName}_${lName}_Resume.pdf`,
    resumeSize: '1.2 MB',
    resumeDate: 'Not uploaded yet',
    profileCompleted: false, // New account MUST fill profile first
    isNewAccount: true,
    isSubmitted: false,
    appliedJobIds: [],
    submittedApplicationsCount: 0,
    draftApplicationsCount: 0,
    savedInternshipsCount: 0,
    savedJobIds: []
  });

  showToast(`Account created! Welcome, ${fName}. Please complete your student profile first.`, 'success');
  setTimeout(() => {
    window.location.href = 'profile.html?firstLogin=true';
  }, 500);
}

// Global Student Login Form Handler
function handleLoginSubmit(e) {
  if (e) e.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const email = emailInput ? emailInput.value.trim() : '';

  if (!email) {
    alert('Please enter your student email address.');
    return;
  }

  const existingState = getAppState();

  // If user matches existing state and profile is already completed, go to dashboard
  if (existingState.email && existingState.email.toLowerCase() === email.toLowerCase() && existingState.profileCompleted) {
    showToast(`Welcome back, ${existingState.firstName || 'Student'}! Loading your workspace...`, 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 400);
    return;
  }

  // If user matches existing state but profile is incomplete, send to profile
  if (existingState.email && existingState.email.toLowerCase() === email.toLowerCase() && !existingState.profileCompleted) {
    showToast(`Welcome back! Please complete your student profile first.`, 'info');
    setTimeout(() => {
      window.location.href = 'profile.html?firstLogin=true';
    }, 400);
    return;
  }

  // Otherwise, it's a new account: initialize clean unhardcoded state with profileCompleted = false
  const userHandle = email.split('@')[0] || '';
  const parts = userHandle.split(/[._-]/);
  const inferredFirst = parts[0] ? (parts[0].charAt(0).toUpperCase() + parts[0].slice(1)) : 'Student';
  const inferredLast = parts[1] ? (parts[1].charAt(0).toUpperCase() + parts[1].slice(1)) : '';

  saveAppState({
    firstName: inferredFirst,
    lastName: inferredLast,
    preferredName: inferredFirst,
    email: email,
    institution: '',
    degree: '',
    phone: '',
    location: '',
    studentId: '',
    headline: '',
    bio: '',
    portfolio: '',
    linkedin: '',
    targetRole: '',
    ojtSetup: 'Hybrid',
    skills: [],
    statement: '',
    resumeName: `${inferredFirst}_Resume.pdf`,
    resumeSize: '1.2 MB',
    resumeDate: 'Not uploaded yet',
    profileCompleted: false, // Must fill profile first!
    isNewAccount: true,
    isSubmitted: false,
    appliedJobIds: [],
    submittedApplicationsCount: 0,
    draftApplicationsCount: 0,
    savedInternshipsCount: 0,
    savedJobIds: []
  });

  showToast(`Signed in! Please complete your student profile first.`, 'info');
  setTimeout(() => {
    window.location.href = 'profile.html?firstLogin=true';
  }, 400);
}

// Social Authentication Handler (Google / LinkedIn)
function handleSocialRegister(provider) {
  const fName = provider === 'Google' ? 'Alex' : 'Jordan';
  const lName = provider === 'Google' ? 'Cruz' : 'Reyes';
  const email = `${fName.toLowerCase()}.${lName.toLowerCase()}@student.edu.ph`;
  const existingState = getAppState();

  // If user matches existing state and profile is already completed, go to dashboard
  if (existingState.email && existingState.email.toLowerCase() === email.toLowerCase() && existingState.profileCompleted) {
    showToast(`Welcome back, ${existingState.firstName || fName}! Loading your workspace...`, 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 400);
    return;
  }

  // Otherwise initialize new account with profileCompleted = false
  saveAppState({
    firstName: fName,
    lastName: lName,
    preferredName: fName,
    email: email,
    institution: '',
    degree: '',
    phone: '',
    location: '',
    studentId: '',
    headline: '',
    bio: '',
    portfolio: '',
    linkedin: '',
    targetRole: '',
    ojtSetup: 'Hybrid',
    skills: [],
    statement: '',
    resumeName: `${fName}_${lName}_Resume.pdf`,
    resumeSize: '1.2 MB',
    resumeDate: 'Not uploaded yet',
    profileCompleted: false, // New account MUST complete profile first!
    isNewAccount: true,
    isSubmitted: false,
    appliedJobIds: [],
    submittedApplicationsCount: 0,
    draftApplicationsCount: 0,
    savedInternshipsCount: 0,
    savedJobIds: []
  });

  showToast(`Signed in with ${provider}! Please complete your student profile first.`, 'info');
  setTimeout(() => {
    window.location.href = 'profile.html?firstLogin=true';
  }, 400);
}

// ==========================================
// BROWSE PAGE: LIVE SEARCH & FILTER ENGINE
// ==========================================

function initBrowsePage() {
  const searchInput = document.getElementById('browseSearchInput');
  const locSelect = document.getElementById('browseLocationSelect');
  const catSelect = document.getElementById('browseCategorySelect');
  const setupSelect = document.getElementById('browseSetupSelect');
  const paidCheck = document.getElementById('browsePaidCheck');
  const sortSelect = document.getElementById('browseSortSelect');

  // Event listeners for real-time reactivity
  if (searchInput) searchInput.addEventListener('input', renderBrowseJobs);
  if (locSelect) locSelect.addEventListener('change', renderBrowseJobs);
  if (catSelect) catSelect.addEventListener('change', renderBrowseJobs);
  if (setupSelect) setupSelect.addEventListener('change', renderBrowseJobs);
  if (paidCheck) paidCheck.addEventListener('change', renderBrowseJobs);
  if (sortSelect) sortSelect.addEventListener('change', renderBrowseJobs);

  renderBrowseJobs();
}

function clearAllFilters() {
  const searchInput = document.getElementById('browseSearchInput');
  const locSelect = document.getElementById('browseLocationSelect');
  const catSelect = document.getElementById('browseCategorySelect');
  const setupSelect = document.getElementById('browseSetupSelect');
  const paidCheck = document.getElementById('browsePaidCheck');

  if (searchInput) searchInput.value = '';
  if (locSelect) locSelect.value = 'All locations';
  if (catSelect) catSelect.value = 'All categories';
  if (setupSelect) setupSelect.value = 'Any work setup';
  if (paidCheck) paidCheck.checked = true;

  renderBrowseJobs();
  showToast('Filters cleared to default.', 'info');
}

function renderBrowseJobs() {
  const container = document.getElementById('jobsListContainer');
  const countEl = document.getElementById('browseMatchCount');
  if (!container) return;

  const state = getAppState();
  const searchVal = (document.getElementById('browseSearchInput')?.value || '').toLowerCase().trim();
  const locVal = document.getElementById('browseLocationSelect')?.value || 'All locations';
  const catVal = document.getElementById('browseCategorySelect')?.value || 'All categories';
  const setupVal = document.getElementById('browseSetupSelect')?.value || 'Any work setup';
  const paidOnly = document.getElementById('browsePaidCheck')?.checked ?? true;
  const sortVal = document.getElementById('browseSortSelect')?.value || 'Most relevant';

  // Filter dataset
  let results = internshipsData.filter(job => {
    // Keyword match (title, company, description, tags)
    if (searchVal) {
      const matchTitle = job.title.toLowerCase().includes(searchVal);
      const matchComp = job.company.toLowerCase().includes(searchVal);
      const matchDesc = job.description.toLowerCase().includes(searchVal);
      const matchTags = job.tags.some(t => t.toLowerCase().includes(searchVal));
      if (!matchTitle && !matchComp && !matchDesc && !matchTags) return false;
    }

    // Category match
    if (catVal !== 'All categories' && job.category !== catVal) {
      return false;
    }

    // Location match
    if (locVal !== 'All locations' && locVal !== 'Metro Manila') {
      if (!job.location.includes(locVal) && job.locationGroup !== locVal) {
        return false;
      }
    }

    // Setup match
    if (setupVal !== 'Any work setup' && job.setup !== setupVal) {
      return false;
    }

    // Paid filter
    if (paidOnly && !job.isPaid) {
      return false;
    }

    return true;
  });

  // Sorting
  if (sortVal === 'Highest allowance') {
    results.sort((a, b) => b.allowanceValue - a.allowanceValue);
  } else if (sortVal === 'Alphabetical') {
    results.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Update match counter
  if (countEl) {
    countEl.innerText = `${results.length} internship${results.length === 1 ? '' : 's'} match your search`;
  }

  // Handle empty state
  if (results.length === 0) {
    container.innerHTML = `
      <div class="empty-jobs-state">
        <div class="empty-jobs-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary);"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        </div>
        <h3 class="empty-jobs-title">No internships found matching your filters</h3>
        <p class="empty-jobs-desc">Try widening your search keyword, selecting "All categories", or checking "Any work setup".</p>
        <button type="button" class="btn-primary" onclick="clearAllFilters()">Clear all filters</button>
      </div>
    `;
    return;
  }

  // Render job cards
  const savedSet = new Set(state.savedJobIds || []);
  const appliedSet = new Set(state.appliedJobIds || []);

  container.innerHTML = results.map(job => {
    const isSaved = savedSet.has(job.id);
    const isApplied = appliedSet.has(job.id);

    return `
      <div class="job-card panel-card" style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div class="company-header">
            <div class="company-avatar" style="background: ${job.companyAvatarBg}; color: ${job.companyAvatarColor};">
              ${job.companyInitial}
            </div>
            <div>
              <strong style="font-size: 0.95rem;">${job.company}</strong>
              <div style="font-size: 0.78rem; color: var(--color-text-muted);">${job.category} &middot; ${job.term}</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            ${isApplied ? `<span class="badge-applied">&#10003; Applied</span>` : ''}
            <span class="badge-paid">${job.setup} &middot; ${job.isPaid ? 'Paid' : 'Unpaid'}</span>
          </div>
        </div>

        <h2 style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 600; margin: 0.5rem 0 0.25rem;">
          ${job.title}
        </h2>
        <div style="font-size: 0.88rem; color: var(--color-text-muted); margin-bottom: 0.75rem;">
          ${job.location} &middot; ${job.setup}
        </div>
        <p style="font-size: 0.92rem; color: var(--color-text-body); margin-bottom: 0.85rem;">
          ${job.description}
        </p>
        <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.85rem;">
          ${job.allowance}
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
          <div class="tag-cluster" style="margin-top: 0;">
            ${job.tags.map(t => `<span class="skill-tag">${t}</span>`).join('')}
          </div>
          <div style="display: flex; gap: 0.75rem;">
            <a href="${job.detailsUrl}" class="btn-primary" style="padding: 0 1.25rem;">
              ${isApplied ? 'View details (Applied)' : 'View details'}
            </a>
            <button 
              type="button" 
              class="btn-secondary btn-save-toggle ${isSaved ? 'saved' : ''}" 
              data-job-save-id="${job.id}"
              onclick="toggleSaveJob('${job.id}', event)">
              ${isSaved ? '&#9733; Saved' : '&#9734; Save opportunity'}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================
// DETAILS PAGE: APPLIED STATUS CHECKER
// ==========================================

function initDetailsPage() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || 'northstar-pdi';
  const job = getJobById(jobId);

  // Update document title and description
  document.title = `Bytepath · ${job.title} at ${job.company}`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', `${job.title} internship details at ${job.company} in ${job.location}. ${job.term}.`);
  }

  // Populate Main Card
  const topBadge = document.getElementById('detailsTopBadge') || document.querySelector('.details-main-card .badge-paid');
  const titleEl = document.getElementById('detailsTitle') || document.querySelector('.details-main-card h1');
  const metaEl = document.getElementById('detailsMeta') || document.querySelector('.details-main-card p');
  const aboutEl = document.getElementById('detailsAbout');
  const respEl = document.getElementById('detailsResponsibilities');
  const reqEl = document.getElementById('detailsRequirements');

  if (titleEl) titleEl.innerText = job.title;
  if (metaEl) metaEl.innerHTML = `${job.company} &middot; ${job.location} &middot; ${job.setup}`;
  if (aboutEl) aboutEl.innerText = job.about || job.description;

  if (respEl && Array.isArray(job.responsibilities)) {
    respEl.innerHTML = job.responsibilities.map(r => `<li>${r}</li>`).join('');
  }
  if (reqEl && Array.isArray(job.requirements)) {
    reqEl.innerHTML = job.requirements.map(r => `<li>${r}</li>`).join('');
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
    sideMeta.innerHTML = `
      <div>&#10003; ${job.location} &middot; ${job.setup}</div>
      <div>&#10003; <strong>${job.allowance}</strong></div>
      <div>&#10003; ${job.term}</div>
      <div>&#10003; Posted ${job.postedDate || 'October 10, 2026'}</div>
    `;
  }

  if (sideDeadline) {
    sideDeadline.innerHTML = `
      <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; display: block; opacity: 0.85;">Application Deadline</span>
      ${job.deadline || 'October 30, 2026'} &middot; <strong>${job.daysLeft || '18 days left'}</strong>
    `;
  }

  if (sideAboutTitle) sideAboutTitle.innerText = `Meet ${job.company}`;
  if (sideAboutDesc) {
    sideAboutDesc.innerText = `An established organization in ${job.category} offering mentored, project-based learning and hands-on industry experience.`;
  }

  // Save button in details sidebar
  const saveBtn = document.getElementById('detailsSaveBtn');
  if (saveBtn) {
    const isSaved = state.savedJobIds && state.savedJobIds.includes(job.id);
    saveBtn.setAttribute('data-job-save-id', job.id);
    saveBtn.onclick = (e) => toggleSaveJob(job.id, e);
    if (isSaved) {
      saveBtn.classList.add('saved');
      saveBtn.innerHTML = `&#9733; Saved to shortlist`;
    } else {
      saveBtn.classList.remove('saved');
      saveBtn.innerHTML = `&#9734; Save opportunity`;
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
      banner.innerHTML = `
        <div class="applied-status-left">
          <div class="applied-check-icon">&#10003;</div>
          <div>
            <div class="applied-status-title">You have applied for this internship</div>
            <div class="applied-status-desc">
              Submitted on ${state.submissionDate || 'October 12, 2026'} &middot; Application Reference: <strong>${state.applicationReference || 'BP-2026-01428'}</strong>
            </div>
          </div>
        </div>
        <a href="confirmation.html?id=${job.id}" class="btn-primary" style="font-size: 0.88rem; padding: 0.5rem 1rem; white-space: nowrap;">
          View receipt &rarr;
        </a>
      `;
      mainCard.parentNode.insertBefore(banner, mainCard);
    }

    // 2. Update badge on job details
    if (topBadge) {
      topBadge.className = 'badge-applied';
      topBadge.innerHTML = `&#10003; Submitted &middot; Under Review`;
    }

    // 3. Update right sidebar action button
    if (actionSlot) {
      actionSlot.innerHTML = `
        <div style="margin-bottom: 0.75rem;">
          <div class="badge-applied" style="width: 100%; justify-content: center; height: 42px; font-size: 0.88rem; margin-bottom: 0.6rem;">
            &#10003; Applied on ${state.submissionDate || 'October 12, 2026'}
          </div>
          <a href="confirmation.html?id=${job.id}" class="btn-primary" style="width: 100%; justify-content: center; height: 48px; font-size: 0.95rem;">
            View application receipt &rarr;
          </a>
        </div>
      `;
    }
  } else {
    // Not applied: ensure banner is removed if present
    if (existingBanner) {
      existingBanner.remove();
    }

    // Reset top badge
    if (topBadge) {
      topBadge.className = 'badge-paid';
      topBadge.innerHTML = `${job.category} &middot; ${job.isPaid ? 'Paid Internship' : 'Unpaid'}`;
    }

    // Reset action slot to standard Apply Now button
    if (actionSlot) {
      actionSlot.innerHTML = `
        <a href="apply-step1.html?id=${job.id}" class="btn-primary" id="detailsApplyBtn" style="width: 100%; justify-content: center; height: 48px; font-size: 1rem;">
          Apply now &rarr;
        </a>
      `;
    }
  }
}

// PROFILE PAGE: TWO-WAY LOCALSTORAGE SYNC
// ==========================================

function initProfilePage() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const isFirstLogin = urlParams.get('firstLogin') === 'true' || !state.profileCompleted;

  // Show notice toast if redirected from a gated screen
  const noticeMsg = sessionStorage.getItem('bytepath_profile_notice');
  if (noticeMsg) {
    sessionStorage.removeItem('bytepath_profile_notice');
    showToast(noticeMsg, 'warning');
  }

  // Toggle visibility of back to dashboard button based on profile completion
  const backBtn = document.querySelector('.back-btn-link');
  if (backBtn) {
    backBtn.style.display = !state.profileCompleted ? 'none' : '';
  }

  // Onboarding banner for new account profile completion
  let banner = document.getElementById('profileOnboardingNotice');
  if (isFirstLogin) {
    if (!banner) {
      banner = document.createElement('div');
      banner.id = 'profileOnboardingNotice';
      banner.className = 'panel-card';
      banner.style.cssText = 'background: #E6F4EA; border: 1.5px solid #155E4E; padding: 1.5rem; margin-bottom: 1.5rem; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: space-between;';
      banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 44px; height: 44px; background: #155E4E; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
          </div>
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: #155E4E; margin: 0 0 0.2rem;">Complete Your Student Profile</h3>
            <p style="font-size: 0.88rem; color: #374151; margin: 0;">Welcome! As a new student account, please fill in your details below before accessing internships and applications.</p>
          </div>
        </div>
        <span class="badge-status-neutral" style="background: #FFFFFF; border: 1.5px solid #155E4E; color: #155E4E; font-weight: 700; white-space: nowrap;">Required First Step</span>
      `;
      const mainCol = document.querySelector('main');
      if (mainCol) mainCol.insertBefore(banner, mainCol.firstChild);
    }

    // Change submit button text
    const saveBtn = document.querySelector('form button[type="submit"]');
    if (saveBtn) {
      saveBtn.innerText = 'Complete Profile & Continue to Dashboard →';
    }
  } else if (banner) {
    banner.remove();
  }

  const fullNameInput = document.getElementById('profFullName');
  const headlineInput = document.getElementById('profHeadline');
  const emailInput = document.getElementById('profEmail');
  const phoneInput = document.getElementById('profPhone');
  const portfolioInput = document.getElementById('profPortfolio');
  const linkedinInput = document.getElementById('profLinkedIn');
  const targetRoleInput = document.getElementById('profTargetRole');
  const ojtSetupInput = document.getElementById('profOjtSetup');
  const bioInput = document.getElementById('profBio');

  const fullName = `${state.firstName || ''} ${state.lastName || ''}`.trim();
  if (fullNameInput) fullNameInput.value = fullName;
  if (headlineInput) headlineInput.value = state.headline || '';
  if (emailInput) emailInput.value = state.email || '';
  if (phoneInput) phoneInput.value = state.phone || '';
  if (portfolioInput) portfolioInput.value = state.portfolio || '';
  if (linkedinInput) linkedinInput.value = state.linkedin || '';
  if (targetRoleInput) targetRoleInput.value = state.targetRole || '';
  if (ojtSetupInput) ojtSetupInput.value = state.ojtSetup || 'Hybrid (Manila, PH) or Fully Remote';
  if (bioInput) bioInput.value = state.bio || state.statement || '';

  // Update in-page hero display
  const heroName = document.getElementById('profDisplayFullName');
  if (heroName) heroName.innerText = fullName || 'Student Profile';
  const heroHeadline = document.getElementById('profDisplayHeadline');
  if (heroHeadline) heroHeadline.innerText = state.headline || (state.profileCompleted ? 'Student' : 'Profile Incomplete · Fill details below');

  // Render profile avatar
  renderProfileAvatar();

  // Render skill tags
  renderProfileSkillTags();
}

function renderProfileAvatar() {
  const state = getAppState();
  const avatarLarge = document.getElementById('profAvatarLarge');
  if (!avatarLarge) return;

  const hasName = state.firstName || state.lastName;
  const fullName = hasName ? `${state.firstName || ''} ${state.lastName || ''}`.trim() : (state.email ? state.email.split('@')[0] : 'Student Profile');
  const firstInitial = (state.firstName || fullName || 'S')[0] || 'S';
  const lastInitial = (state.lastName || '')[0] || (fullName[1] || 'P');
  const initials = `${firstInitial}${lastInitial}`.toUpperCase();

  if (state.avatarDataUrl) {
    avatarLarge.innerHTML = `
      <img src="${state.avatarDataUrl}" class="avatar-photo" alt="${fullName}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">
      <button type="button" class="avatar-badge-icon" onclick="document.getElementById('profAvatarInput').click()" title="Change profile picture" aria-label="Change photo" style="cursor: pointer; border: none; outline: none; background: var(--color-primary); color: white;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
      </button>
    `;
  } else {
    avatarLarge.innerHTML = `
      <span>${initials}</span>
      <button type="button" class="avatar-badge-icon" onclick="document.getElementById('profAvatarInput').click()" title="Upload profile picture" aria-label="Upload photo" style="cursor: pointer; border: none; outline: none; background: var(--color-primary); color: white;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
      </button>
    `;
  }

  const removeBtn = document.getElementById('removeAvatarBtn');
  if (removeBtn) {
    removeBtn.style.display = state.avatarDataUrl ? 'inline-flex' : 'none';
  }
}

function handleAvatarFileChange(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please choose an image file (e.g. JPG, PNG, WEBP, GIF).');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image file is too large. Please select a picture under 5MB.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const dataUrl = event.target.result;
    saveAppState({ avatarDataUrl: dataUrl });
    renderProfileAvatar();
    syncHeaderUser();
    showToast('Profile picture updated successfully!', 'success');
  };
  reader.readAsDataURL(file);
}

function handleRemoveAvatar() {
  saveAppState({ avatarDataUrl: '' });
  renderProfileAvatar();
  syncHeaderUser();
  const input = document.getElementById('profAvatarInput');
  if (input) input.value = '';
  showToast('Profile picture removed. Reverted to initials.', 'info');
}

function renderProfileSkillTags() {
  const container = document.getElementById('profileSkillsContainer');
  if (!container) return;
  const state = getAppState();
  const skills = state.skills || [];

  if (skills.length === 0) {
    container.innerHTML = `<span style="font-size: 0.85rem; color: var(--color-text-muted); font-style: italic;">No skills added yet. Click "+ Add Skill Tag" above to list your abilities.</span>`;
    return;
  }

  container.innerHTML = skills.map(skill => `
    <span class="filter-chip" style="padding: 0.4rem 0.9rem; display: inline-flex; align-items: center; gap: 0.4rem;">
      ${skill}
      <span style="cursor: pointer; opacity: 0.7; font-weight: bold;" onclick="removeSkillTag('${skill}')">&times;</span>
    </span>
  `).join('');
}

function promptAddSkillTag() {
  const skill = prompt('Enter a new skill or proficiency tag (e.g., Python, Usability Testing, Docker):');
  if (skill && skill.trim()) {
    const state = getAppState();
    const skills = state.skills || [];
    if (!skills.includes(skill.trim())) {
      skills.push(skill.trim());
      saveAppState({ skills });
      renderProfileSkillTags();
      showToast(`Skill tag "${skill.trim()}" added!`);
    }
  }
}

function removeSkillTag(skillToRemove) {
  const state = getAppState();
  const skills = (state.skills || []).filter(s => s !== skillToRemove);
  saveAppState({ skills });
  renderProfileSkillTags();
  showToast(`Skill tag removed.`);
}

function handleProfileSave(e) {
  if (e) e.preventDefault();
  const fullName = document.getElementById('profFullName')?.value.trim() || '';
  const headline = document.getElementById('profHeadline')?.value.trim() || '';
  const email = document.getElementById('profEmail')?.value.trim() || '';
  const phone = document.getElementById('profPhone')?.value.trim() || '';
  const portfolio = document.getElementById('profPortfolio')?.value.trim() || '';
  const linkedin = document.getElementById('profLinkedIn')?.value.trim() || '';
  const targetRole = document.getElementById('profTargetRole')?.value.trim() || '';
  const ojtSetup = document.getElementById('profOjtSetup')?.value.trim() || '';
  const bio = document.getElementById('profBio')?.value.trim() || '';

  if (!fullName || !headline || !email || !phone) {
    alert('Please fill in all required fields: Full Name, Headline, Student Email, and Phone Number.');
    return;
  }

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || fullName;
  const lastName = nameParts.slice(1).join(' ') || '';

  const prevState = getAppState();
  const wasIncomplete = !prevState.profileCompleted;

  const updates = {
    firstName,
    lastName,
    preferredName: firstName,
    headline,
    email,
    phone,
    portfolio,
    linkedin,
    targetRole,
    ojtSetup,
    bio,
    statement: bio,
    profileCompleted: true, // Mark profile completed!
    isNewAccount: false
  };

  saveAppState(updates);
  syncHeaderUser();

  if (wasIncomplete) {
    showToast('Profile completed successfully! Welcome to Bytepath.', 'success');
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 500);
  } else {
    // Update in-page header display if present
    const heroName = document.getElementById('profDisplayFullName');
    if (heroName) heroName.innerText = fullName;
    const heroHeadline = document.getElementById('profDisplayHeadline');
    if (heroHeadline) heroHeadline.innerText = headline;

    showToast('Profile changes saved successfully!', 'success');
  }
}

// ==========================================
// SETTINGS PAGE: TWO-WAY LOCALSTORAGE SYNC
// ==========================================

function initSettingsPage() {
  const state = getAppState();

  const fullName = `${state.firstName || ''} ${state.lastName || ''}`.trim();
  const fullNameInput = document.getElementById('settingsFullName');
  const prefNameInput = document.getElementById('settingsPreferredName');
  const studentIdInput = document.getElementById('settingsStudentId');
  const institutionInput = document.getElementById('settingsInstitution');
  const emailInput = document.getElementById('settingsEmail');
  const emailToggle = document.getElementById('settingsEmailToggle');
  const digestToggle = document.getElementById('settingsDigestToggle');

  if (fullNameInput) fullNameInput.value = fullName;
  if (prefNameInput) prefNameInput.value = state.preferredName || state.firstName || '';
  if (studentIdInput) studentIdInput.value = state.studentId || '';
  if (institutionInput) institutionInput.value = state.institution || '';
  if (emailInput) emailInput.value = state.email || '';
  if (emailToggle) emailToggle.checked = state.emailNotifications ?? true;
  if (digestToggle) digestToggle.checked = state.matchingDigest ?? true;

  // Header display in card
  const cardName = document.getElementById('settingsDisplayName');
  if (cardName) cardName.innerText = fullName || 'Student Profile';
  const cardEmail = document.getElementById('settingsDisplayEmail');
  if (cardEmail) cardEmail.innerText = state.email || '';
}

function handleSettingsSave(e) {
  if (e) e.preventDefault();
  const fullName = document.getElementById('settingsFullName')?.value.trim() || '';
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || fullName;
  const lastName = nameParts.slice(1).join(' ') || '';

  const updates = {
    firstName,
    lastName,
    preferredName: document.getElementById('settingsPreferredName')?.value.trim() || firstName,
    studentId: document.getElementById('settingsStudentId')?.value.trim() || '',
    institution: document.getElementById('settingsInstitution')?.value.trim() || '',
    email: document.getElementById('settingsEmail')?.value.trim() || '',
    emailNotifications: document.getElementById('settingsEmailToggle')?.checked ?? true,
    matchingDigest: document.getElementById('settingsDigestToggle')?.checked ?? true
  };

  saveAppState(updates);
  syncHeaderUser();

  // Update in-page header display if present
  const cardName = document.getElementById('settingsDisplayName');
  if (cardName) cardName.innerText = fullName;
  const cardEmail = document.getElementById('settingsDisplayEmail');
  if (cardEmail) cardEmail.innerText = updates.email;

  showToast('Account settings saved successfully!', 'success');
}

// ==========================================
// APPLICATION MULTI-STEP WIZARD LOGIC
// ==========================================

function initStep1Form() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || state.activeApplicationJobId || 'northstar-pdi';
  const job = getJobById(jobId);

  // Update subtitle & back link
  const subEl = document.getElementById('step1JobSubtitle');
  if (subEl) {
    subEl.innerText = `You're applying for ${job.title} at ${job.company}. Check your details before continuing.`;
  }
  const backJobLink = document.getElementById('backToJobDetails');
  if (backJobLink) {
    backJobLink.href = `details.html?id=${job.id}`;
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
  window.location.href = `apply-step2.html?id=${jobId}`;
}

function initStep2Form() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || state.activeApplicationJobId || 'northstar-pdi';
  const job = getJobById(jobId);

  // Update subtitle & back links
  const subEl = document.getElementById('step2JobSubtitle');
  if (subEl) {
    subEl.innerText = `Tell ${job.company} what you're learning, what you can bring, and when you're available.`;
  }
  const backStep1 = document.getElementById('backToStep1');
  if (backStep1) {
    backStep1.href = `apply-step1.html?id=${job.id}`;
  }
  const step2Back = document.getElementById('step2BackBtn');
  if (step2Back) {
    step2Back.href = `apply-step1.html?id=${job.id}`;
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
  window.location.href = `apply-review.html?id=${jobId}`;
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
    subEl.innerText = `Check your information before sending it to ${job.company}.`;
  }
  const consentLabel = document.getElementById('consentLabel');
  if (consentLabel) {
    consentLabel.innerText = `I confirm that this information is accurate and consent to sharing this application with ${job.company} for recruitment purposes.`;
  }
  const backStep2 = document.getElementById('backToStep2');
  if (backStep2) backStep2.href = `apply-step2.html?id=${job.id}`;
  const reviewBack = document.getElementById('reviewBackBtn');
  if (reviewBack) reviewBack.href = `apply-step2.html?id=${job.id}`;

  // Update edit jump links in review blocks
  document.querySelectorAll('a.edit-jump-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('apply-step1.html')) {
      link.href = `apply-step1.html?id=${job.id}`;
    } else if (href.startsWith('apply-step2.html')) {
      link.href = `apply-step2.html?id=${job.id}`;
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

  if (revFullName) revFullName.innerText = `${state.firstName || ''} ${state.lastName || ''}`.trim() || 'Student Applicant';
  if (revLocation) revLocation.innerText = state.location || 'Metro Manila, Philippines';
  if (revEmail) revEmail.innerText = state.email || '';
  if (revPhone) revPhone.innerText = state.phone || '';
  if (revUniversity) revUniversity.innerText = state.institution || state.university || '';
  if (revDegreeYear) revDegreeYear.innerText = `${state.degree || ''} ${state.year ? '· ' + state.year : ''}`.trim() || 'Student';
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

  window.location.href = `confirmation.html?id=${jobId}`;
}

function initConfirmationPage() {
  const state = getAppState();
  const urlParams = new URLSearchParams(window.location.search);
  const jobId = urlParams.get('id') || state.activeApplicationJobId || (state.appliedJobIds && state.appliedJobIds[state.appliedJobIds.length - 1]) || 'northstar-pdi';
  const job = getJobById(jobId);

  document.title = `Bytepath · Application Submitted · ${job.title}`;

  const subEl = document.getElementById('confirmationSubtitle');
  if (subEl) {
    subEl.innerText = `Your application for ${job.title} at ${job.company} has been received.`;
  }

  const roleTitle = document.getElementById('receiptJobTitle');
  if (roleTitle) roleTitle.innerText = job.title;

  const roleMeta = document.getElementById('receiptCompanyMeta');
  if (roleMeta) roleMeta.innerHTML = `${job.company} &middot; ${job.location} &middot; ${job.setup}`;

  const applicant = document.getElementById('receiptApplicantName');
  if (applicant) {
    applicant.innerText = `${state.firstName || ''} ${state.lastName || ''}`.trim() || 'Student Applicant';
  }

  const refEl = document.getElementById('receiptRef');
  if (refEl) refEl.innerText = state.applicationReference || 'BP-2026-01428';

  const dateEl = document.getElementById('receiptDate');
  if (dateEl) dateEl.innerText = state.submissionDate || 'October 12, 2026';

  const timelineDesc = document.getElementById('timelineCompanyDesc');
  if (timelineDesc) {
    timelineDesc.innerText = `${job.company} will assess your experience, interests, and availability.`;
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
      btn.innerHTML = `&#9733; Saved`;
    }
  });

  // Dynamically populate recent submissions list
  if (recentSubmissionsList) {
    if (appliedIds.length > 0) {
      recentSubmissionsList.innerHTML = appliedIds.map(id => {
        const job = getJobById(id);
        return `
          <div class="activity-item" style="display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 0; border-bottom: 1px solid var(--color-border);">
            <div>
              <a href="details.html?id=${job.id}" style="font-weight: 700; color: var(--color-text-body); text-decoration: none;">${job.title}</a>
              <div style="font-size: 0.82rem; color: var(--color-text-muted);">${job.company} &middot; Submitted ${state.submissionDate || 'October 12, 2026'}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <span class="badge-applied">&#10003; Submitted</span>
              <a href="confirmation.html?id=${job.id}" class="btn-secondary" style="font-size: 0.78rem; padding: 0.25rem 0.65rem;">Receipt</a>
            </div>
          </div>
        `;
      }).join('');
    } else {
      recentSubmissionsList.innerHTML = `
        <div style="padding: 1rem 0; color: var(--color-text-muted); font-size: 0.88rem;">
          No submitted applications yet. <a href="browse.html" style="color: var(--color-primary); font-weight: 600;">Find an internship &rarr;</a>
        </div>
      `;
    }
  }

  // If user has applied to any jobs, update draft application card to show the most recent submission
  if (draftCard && appliedIds.length > 0) {
    const latestId = appliedIds[appliedIds.length - 1];
    const latestJob = getJobById(latestId);
    draftCard.innerHTML = `
      <div>
        <span class="badge-applied" style="margin-bottom: 0.5rem;">Application Active &middot; Submitted</span>
        <h4 style="font-family: var(--font-serif); font-size: 1.35rem; margin: 0.6rem 0 0.25rem;">${latestJob.title}</h4>
        <p style="font-size: 0.85rem; color: var(--color-text-muted);">${latestJob.company}</p>
        <p style="font-size: 0.82rem; color: var(--color-primary); font-weight: 600; margin-top: 0.4rem;">Submitted ${state.submissionDate || 'October 12, 2026'} &middot; Ref: ${state.applicationReference || 'BP-2026-01428'}</p>
      </div>
      <div style="display: flex; gap: 0.5rem; margin-top: 1.25rem;">
        <a href="confirmation.html?id=${latestJob.id}" class="btn-primary" style="flex: 1; justify-content: center;">
          View receipt &rarr;
        </a>
        <a href="details.html?id=${latestJob.id}" class="btn-secondary" style="font-size: 0.85rem;">
          Details
        </a>
      </div>
    `;
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
