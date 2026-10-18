export interface WindowMenuOption {
  id:
    | 'home'
    | 'library'
    | 'dashboard'
    | 'quant-trading'
    | 'games'
    | 'analytics'
    | 'non-technical'
    | 'news'
    | 'contests'
    | 'forum'
    | 'scan-transfer'
    | 'summarizer'
    | 'collaborative-doc'
    | 'profile'
    | 'settings';
  title: string;
  labelKey: string;
  subtitle: string;
  group: 'Core Sanctuary' | 'Learning & Quant Labs' | 'Interactive & Community' | 'Personalization & System';
}

export const ALL_WINDOW_MENU_OPTIONS: WindowMenuOption[] = [
  {
    id: 'home',
    title: 'Home & Welcome',
    labelKey: 'home',
    subtitle: 'Clean welcome sanctuary & Futuristic Earth header',
    group: 'Core Sanctuary',
  },
  {
    id: 'library',
    title: '3D Voxel Library',
    labelKey: 'library',
    subtitle: '3D spatial archive & curated video lectures',
    group: 'Core Sanctuary',
  },
  {
    id: 'dashboard',
    title: 'Study Dashboard',
    labelKey: 'dashboard',
    subtitle: 'Step-by-step learning roadmaps & curriculum',
    group: 'Core Sanctuary',
  },
  {
    id: 'quant-trading',
    title: 'Quant Trading & Global Hub',
    labelKey: 'quantTrading',
    subtitle: 'Mathematical alpha models & global market centers',
    group: 'Learning & Quant Labs',
  },
  {
    id: 'non-technical',
    title: 'Non-Technical Track',
    labelKey: 'nonTechnical',
    subtitle: 'No-code AI strategy, ethics & executive workflows',
    group: 'Learning & Quant Labs',
  },
  {
    id: 'analytics',
    title: 'Learning Analytics',
    labelKey: 'analytics',
    subtitle: 'Mastery progression & topic retention insights',
    group: 'Learning & Quant Labs',
  },
  {
    id: 'summarizer',
    title: 'AI Summarizer & Notes',
    labelKey: 'aiSummarizer',
    subtitle: 'Transcript synthesis & structured study notes',
    group: 'Learning & Quant Labs',
  },
  {
    id: 'games',
    title: '2D & 3D AI Games',
    labelKey: 'aiGames',
    subtitle: 'Playable 2D Neural Runner & 3D Voxel Flight Arena',
    group: 'Interactive & Community',
  },
  {
    id: 'news',
    title: 'AI News & Daily Feed',
    labelKey: 'aiNews',
    subtitle: 'Breakthrough research papers & industry releases',
    group: 'Interactive & Community',
  },
  {
    id: 'contests',
    title: 'AI Contests & Hackathons',
    labelKey: 'aiContests',
    subtitle: 'India & global AI competitions & fellowships',
    group: 'Interactive & Community',
  },
  {
    id: 'forum',
    title: 'Community Forum',
    labelKey: 'forum',
    subtitle: 'Peer research discussions & study threads',
    group: 'Interactive & Community',
  },
  {
    id: 'scan-transfer',
    title: 'P2P Transfer & Chat',
    labelKey: 'scanTransfer',
    subtitle: 'QR code note sharing & peer messaging',
    group: 'Interactive & Community',
  },
  {
    id: 'collaborative-doc',
    title: 'Collab Workspace',
    labelKey: 'collaborativeDoc',
    subtitle: 'Multi-author research document canvas',
    group: 'Interactive & Community',
  },
  {
    id: 'profile',
    title: 'Profile & Theme Studio',
    labelKey: 'profile',
    subtitle: 'Achievements, @wix builder & 23 cultural/futuristic themes',
    group: 'Personalization & System',
  },
  {
    id: 'settings',
    title: 'Settings & Theme Preview',
    labelKey: 'settings',
    subtitle: 'Live hover theme preview gallery & preferences',
    group: 'Personalization & System',
  },
];

export function filterWindowMenuOptions(query: string): WindowMenuOption[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return ALL_WINDOW_MENU_OPTIONS;
  return ALL_WINDOW_MENU_OPTIONS.filter(
    opt =>
      opt.title.toLowerCase().includes(normalized) ||
      opt.subtitle.toLowerCase().includes(normalized) ||
      opt.group.toLowerCase().includes(normalized)
  );
}

const FUTURISTIC_EARTH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 640" width="1600" height="640">
  <defs>
    <linearGradient id="spaceBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#020617" />
      <stop offset="45%" stop-color="#07142b" />
      <stop offset="80%" stop-color="#0c2444" />
      <stop offset="100%" stop-color="#040b1a" />
    </linearGradient>
    <radialGradient id="atmosphereHalo" cx="50%" cy="92%" r="72%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.55" />
      <stop offset="42%" stop-color="#0284c7" stop-opacity="0.32" />
      <stop offset="68%" stop-color="#6366f1" stop-opacity="0.14" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="earthSphere" cx="50%" cy="95%" r="65%">
      <stop offset="0%" stop-color="#082f49" />
      <stop offset="52%" stop-color="#051e34" />
      <stop offset="84%" stop-color="#093859" />
      <stop offset="96%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#bae6fd" />
    </radialGradient>
    <radialGradient id="sunriseFlare" cx="68%" cy="46%" r="34%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="0.95" />
      <stop offset="22%" stop-color="#fbbf24" stop-opacity="0.65" />
      <stop offset="55%" stop-color="#38bdf8" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#020617" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="orbitalRingCyan" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.05" />
      <stop offset="25%" stop-color="#38bdf8" stop-opacity="0.75" />
      <stop offset="50%" stop-color="#facc15" stop-opacity="0.9" />
      <stop offset="75%" stop-color="#22d3ee" stop-opacity="0.75" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.05" />
    </linearGradient>
    <linearGradient id="continentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.35" />
      <stop offset="50%" stop-color="#14b8a6" stop-opacity="0.28" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0.35" />
    </linearGradient>
  </defs>

  <!-- Deep Space Canvas -->
  <rect width="1600" height="640" fill="url(#spaceBg)" />

  <!-- Subtle Starfield -->
  <g fill="#e2e8f0" opacity="0.65">
    <circle cx="120" cy="78" r="1.4" />
    <circle cx="245" cy="140" r="1" />
    <circle cx="380" cy="64" r="1.8" fill="#bae6fd" />
    <circle cx="515" cy="112" r="1.1" />
    <circle cx="690" cy="52" r="1.5" />
    <circle cx="860" cy="84" r="1.2" fill="#fde047" />
    <circle cx="1040" cy="60" r="1.6" />
    <circle cx="1190" cy="118" r="1.2" />
    <circle cx="1345" cy="72" r="1.9" fill="#7dd3fc" />
    <circle cx="1490" cy="135" r="1.3" />
    <circle cx="170" cy="220" r="1.2" />
    <circle cx="1420" cy="210" r="1.5" />
    <circle cx="95" cy="310" r="1.1" />
    <circle cx="1515" cy="295" r="1.2" />
  </g>

  <!-- Atmospheric Rayleigh Scattering Halo -->
  <ellipse cx="800" cy="620" rx="920" ry="440" fill="url(#atmosphereHalo)" />

  <!-- Back Orbital Megastructure Ring -->
  <path d="M 110 470 C 430 220, 1170 220, 1490 470" fill="none" stroke="url(#orbitalRingCyan)" stroke-width="2.5" stroke-dasharray="10 6" opacity="0.7" />
  <path d="M 40 530 C 420 170, 1180 170, 1560 530" fill="none" stroke="#38bdf8" stroke-width="1.2" opacity="0.35" />

  <!-- Sunrise Terminator Flare on Eastern Limb -->
  <circle cx="1090" cy="295" r="240" fill="url(#sunriseFlare)" />

  <!-- Futuristic Earth Planetary Body -->
  <ellipse cx="800" cy="650" rx="780" ry="420" fill="url(#earthSphere)" stroke="#7dd3fc" stroke-width="3" />

  <!-- Planetary Latitude / Longitude Geodesic Grid -->
  <g fill="none" stroke="#38bdf8" stroke-opacity="0.16" stroke-width="1">
    <ellipse cx="800" cy="650" rx="680" ry="355" />
    <ellipse cx="800" cy="650" rx="540" ry="285" />
    <ellipse cx="800" cy="650" rx="380" ry="205" />
    <path d="M 240 440 Q 800 310 1360 440" />
    <path d="M 160 520 Q 800 390 1440 520" />
    <path d="M 800 230 L 800 640" />
    <path d="M 540 255 Q 650 450 610 640" />
    <path d="M 1060 255 Q 950 450 990 640" />
  </g>

  <!-- Continental Landmass Silhouettes & Illuminated Neural Grids -->
  <g fill="url(#continentGlow)" stroke="#38bdf8" stroke-width="1.2" stroke-opacity="0.55">
    <!-- Eurasia & Indian Subcontinent (Center-Right Prominence) -->
    <path d="M 640 350 L 715 322 L 825 318 L 930 335 L 1035 372 L 1080 425 L 1015 462 L 945 450 L 895 525 L 855 535 L 825 458 L 765 445 L 720 475 L 675 430 Z" />
    <!-- Africa / Middle East Silhouette (Center-Left) -->
    <path d="M 455 415 L 565 385 L 645 415 L 665 495 L 610 585 L 515 575 L 470 495 Z" />
    <!-- Americas / Atlantic Limb (Far Left) -->
    <path d="M 210 475 L 315 435 L 375 470 L 355 565 L 255 595 Z" />
    <!-- Indo-Pacific Archipelagos & Orbital Sea Platforms (Far Right) -->
    <path d="M 1115 445 L 1210 430 L 1275 480 L 1220 535 L 1135 510 Z" />
  </g>

  <!-- Futuristic Planetary Neural Network & Illuminated Megacity Nodes -->
  <g stroke="#fde047" stroke-width="1.4" stroke-opacity="0.78" fill="none">
    <path d="M 555 435 L 695 385 L 875 475 L 985 395 L 1165 465" />
    <path d="M 695 385 L 810 355 L 985 395" />
    <path d="M 555 435 L 745 445 L 875 475" />
    <path d="M 295 485 L 555 435" stroke-dasharray="5 5" stroke="#38bdf8" />
  </g>

  <!-- Glowing Planetary Hub Beacons (Kolkata, Zurich, Tokyo, New York, Singapore) -->
  <g>
    <!-- Kolkata / South Asia Orbital Elevator Node -->
    <circle cx="875" cy="475" r="9" fill="#f43f5e" opacity="0.35" />
    <circle cx="875" cy="475" r="4.5" fill="#fde047" stroke="#ffffff" stroke-width="1.5" />
    <line x1="875" y1="475" x2="875" y2="335" stroke="#fde047" stroke-width="1.5" stroke-dasharray="3 3" />
    <circle cx="875" cy="335" r="3.5" fill="#38bdf8" />

    <!-- Europe / Zurich Node -->
    <circle cx="695" cy="385" r="7" fill="#38bdf8" opacity="0.3" />
    <circle cx="695" cy="385" r="3.5" fill="#bae6fd" />

    <!-- East Asia / Tokyo Node -->
    <circle cx="985" cy="395" r="8" fill="#38bdf8" opacity="0.35" />
    <circle cx="985" cy="395" r="4" fill="#fde047" />

    <!-- Afro-Mediterranean Solar Hub -->
    <circle cx="555" cy="435" r="3.5" fill="#fde047" />

    <!-- Indo-Pacific Quantum Array -->
    <circle cx="1165" cy="465" r="3.5" fill="#38bdf8" />

    <!-- Atlantic / Americas Hub -->
    <circle cx="295" cy="485" r="3.5" fill="#38bdf8" />
  </g>

  <!-- Foreground High-Orbit Dyson Ring & Telemetry Arc -->
  <path d="M 60 555 C 450 265, 1150 265, 1540 555" fill="none" stroke="url(#orbitalRingCyan)" stroke-width="3.5" />
  <circle cx="800" cy="338" r="5" fill="#fde047" stroke="#0284c7" stroke-width="2" />
  <circle cx="520" cy="378" r="3.5" fill="#38bdf8" />
  <circle cx="1080" cy="378" r="3.5" fill="#38bdf8" />
</svg>`;

export const FUTURISTIC_EARTH_HEADER_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  FUTURISTIC_EARTH_SVG
)}`;
