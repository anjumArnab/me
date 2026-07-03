// Single source of truth for all portfolio content.
// Curated from Sakib Anjum Arnab's CV + verified GitHub repos.

export const profile = {
  name: 'Sakib Anjum Arnab',
  role: 'Mobile Application Developer',
  focus: 'Flutter',
  location: 'Dhaka, Bangladesh',
  // Terminal-style status line shown in the hero (the signature motif).
  statusLine: '~/dhaka · flutter developer',
  available: false,
  tagline:
    'I build cross-platform apps with Flutter — shipping real features on a live multi-vendor e-commerce platform, and building side projects across real-time location, auth, and local-first data.',
  summary:
    'Flutter developer with practical experience building and maintaining cross-platform mobile and web applications. I contributed to a live multi-vendor e-commerce platform used by real customers, with project work spanning real-time location systems, Firebase authentication, real-time databases, push notifications, and deep linking. Comfortable with clean architecture, state management, and API integration — and steadily deepening my backend skills with Laravel and Node.js.',
}

export const links = {
  email: 'anjumarnab050@gmail.com',
  phone: '+8801818-447232',
  phoneHref: '+8801818447232',
  github: 'https://github.com/anjumArnab',
  linkedin: 'https://www.linkedin.com/in/anjumarnab/',
}

export const skills = [
  { group: 'Languages', items: ['Dart', 'JavaScript', 'PHP (Laravel)'] },
  { group: 'Backend', items: ['Firebase', 'Laravel', 'Node.js'] },
  { group: 'State management', items: ['Provider', 'GetX'] },
  { group: 'Architecture', items: ['Feature-based', 'Clean Architecture'] },
  { group: 'Local database', items: ['Hive', 'SQFLite', 'Drift'] },
  { group: 'Networking', items: ['REST (HTTP, Dio)', 'Socket.IO'] },
  { group: 'Navigation', items: ['GoRouter'] },
  {
    group: 'Tools',
    items: [
      'Android Studio',
      'VS Code',
      'Flutter DevTools',
      'Postman',
      'Firebase Console',
      'Git',
    ],
  },
]

export const experience = [
  {
    role: 'Junior Software Engineer',
    company: '6amTech',
    period: 'May 2025 – Present',
    project: 'SixValley — Multi-Vendor E-Commerce (User, Vendor & Delivery apps)',
    highlights: [
      'Built the Auction feature across the SixValley ecosystem, turning Figma designs into production-ready Flutter and coordinating backend integration across multiple apps.',
      'Resolved 100+ bugs in the Auction module, improving stability and user experience.',
      'Integrated REST APIs and worked with backend engineers through the full feature lifecycle.',
      'Implemented payment gateways, push notifications, and deep linking for auction workflows.',
      'Collaborated with UI/UX designers, backend engineers, QA, and project managers to ship features.',
    ],
    stack: ['Flutter', 'GoRouter', 'Provider', 'GetX', 'HTTP', 'Dio', 'Firebase'],
  },
  {
    role: 'Flutter Developer Intern',
    company: '6amTech',
    period: '4-month internship',
    project: 'SixValley, Hexacom & GroFresh',
    highlights: [
      'Resolved 75+ bugs across three apps (user, vendor, delivery) from assigned backlogs.',
      'Worked with Google Tag Manager, Meta Pixel, and Google Analytics for tracking and performance monitoring.',
      'Delivered 30+ bug fixes and enhancements for Hexacom and GroFresh across mobile and web.',
      'Gained exposure to eFood (food delivery) and Demandium (service marketplace).',
    ],
    stack: [
      'Flutter (Mobile & Web)',
      'Provider',
      'GetX',
      'Firebase',
      'REST',
      'Google Analytics',
    ],
  },
]

// Each project links out via typed links: 'play' (Play Store), 'pub' (pub.dev), 'github'.
// `badge` highlights something shipped (a store listing, a published package).
export const projects = [
  {
    name: 'Dino Dash',
    badge: 'Live on Play Store',
    blurb:
      'An endless-runner game inspired by the Chrome dino — jump the obstacles, chase a high score. Built in Flutter with a custom game loop, sound, and persistent best scores. Published to Google Play.',
    highlights: [
      'Hand-rolled game loop and collision detection in Flutter.',
      'Persistent high scores with shared_preferences and in-game audio.',
      'Shipped end-to-end: built, signed, and published to the Play Store.',
    ],
    stack: ['Flutter', 'shared_preferences', 'audioplayers'],
    links: [
      // TODO: confirm real Play Store URL — placeholder from applicationId (returns 404).
      { type: 'play', url: 'https://play.google.com/store/apps/details?id=com.app.dino_dash' },
    ],
  },
  {
    name: 'Contrib Grid',
    badge: 'Published package',
    blurb:
      'A Flutter package on pub.dev that renders a GitHub-style contribution heatmap: pass in date/value pairs, get a calendar-aligned colored grid out.',
    highlights: [
      'Published open-source on pub.dev (v0.1.1, MIT).',
      'Customizable colors, cell sizing, and activity grids.',
      'Calendar-aligned rendering from simple date/value data.',
    ],
    stack: ['Flutter', 'Dart', 'pub.dev'],
    links: [
      { type: 'pub', url: 'https://pub.dev/packages/contrib_grid' },
      { type: 'github', url: 'https://github.com/anjumArnab/Contrib-Grid' },
    ],
  },
  {
    name: 'Here We Go',
    blurb:
      'Real-time location tracking and navigation with integrated chat. Synchronizes live positions across concurrent users over WebSockets and recalculates routes when a user goes off-track.',
    highlights: [
      'Room-based architecture for multi-user location broadcasting with minimal latency.',
      'Live routing between users via OpenStreetMap + OSRM, auto-recalculated off-track.',
      'Real-time chat with history, unread counters, and background-only notifications.',
    ],
    stack: ['Flutter', 'Node.js', 'Socket.IO', 'OSRM', 'Provider'],
    links: [{ type: 'github', url: 'https://github.com/anjumArnab/Here-We-Go' }],
  },
  {
    name: 'Auth Sync',
    blurb:
      'Multi-account Firebase authentication. Supports email/password, Google, Facebook, and phone sign-in, and switches securely between multiple Firebase accounts.',
    highlights: [
      'Node.js + Firebase Admin SDK service to mint custom tokens, beating the single-account limit.',
      'Secure account switching via token-based auth and encrypted local storage.',
      'Full flows: registration, password reset, email verification, account deletion.',
    ],
    stack: ['Flutter', 'Firebase', 'Firebase Admin SDK', 'Node.js', 'flutter_secure_storage'],
    links: [{ type: 'github', url: 'https://github.com/anjumArnab/AuthSync' }],
  },
  {
    name: 'Tasbih',
    blurb:
      'An Islamic dhikr counter with preloaded and custom dhikrs, scheduled reminders, streak visualization, and a gamified achievement system.',
    highlights: [
      'Streak visualization with dynamic color coding that intensifies with daily sessions.',
      'Gamified points and achievements for repetitions, streaks, and total counts.',
      'Custom dhikrs with scheduled local notifications.',
    ],
    stack: ['Flutter', 'Hive', 'flutter_local_notifications'],
    links: [{ type: 'github', url: 'https://github.com/anjumArnab/Tasbih' }],
  },
]

// "Currently leveling up" — growth areas backed by real repos, framed as momentum.
export const learning = {
  intro:
    'Flutter is my home base — and I am actively expanding my range: backend services and native platform work, each backed by real shipped code, not just tutorials.',
  items: [
    {
      area: 'Native Android',
      note: 'Bridging Flutter to platform APIs over MethodChannel.',
      repos: [{ label: 'Ping-Thing', url: 'https://github.com/anjumArnab/Ping-Thing' }],
    },
    {
      area: 'Laravel',
      note: 'Auth endpoints and an error-logging backend service.',
      repos: [
        { label: 'Try-Catch', url: 'https://github.com/anjumArnab/Try-Catch' },
        { label: 'Opps-Wrong-Password', url: 'https://github.com/anjumArnab/Opps-Wrong-Password' },
      ],
    },
    {
      area: 'Node.js',
      note: 'Token services and a payment-gateway backend behind my Flutter apps.',
      repos: [
        { label: 'AuthSync token server', url: 'https://github.com/anjumArnab/AuthSync' },
        { label: 'Easy-Pay-SSL', url: 'https://github.com/anjumArnab/Easy-Pay-SSL' },
      ],
    },
    {
      area: 'APIs & integration',
      note: 'REST/CRUD practice and third-party API integration across many builds.',
      repos: [
        { label: 'BizCRUD', url: 'https://github.com/anjumArnab/BizCRUD' },
        { label: 'Write-Right', url: 'https://github.com/anjumArnab/Write-Right' },
      ],
    },
  ],
}

export const education = {
  degree: 'BSc in Textile Engineering',
  school: 'Textile Engineering College, Zorargonj, Chattagram',
  period: 'Mar 2020 – Oct 2025',
  cgpa: 'CGPA 3.35 / 4.00',
}

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'learning', label: 'Learning' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]
