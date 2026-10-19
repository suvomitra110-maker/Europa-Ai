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
    subtitle: "Human Being's hand touching Robot Hand welcome sanctuary",
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

const HUMAN_ROBOT_HAND_TOUCH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 840" width="1600" height="840">
  <defs>
    <!-- Deep Studio Backdrop -->
    <linearGradient id="bgCanvas" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811" />
      <stop offset="38%" stop-color="#0a1122" />
      <stop offset="62%" stop-color="#09152b" />
      <stop offset="100%" stop-color="#04070f" />
    </linearGradient>

    <!-- Warm Human Side Ambient Glow (Left) -->
    <radialGradient id="humanWarmGlow" cx="32%" cy="48%" r="48%">
      <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.26" />
      <stop offset="45%" stop-color="#ea580c" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#050811" stop-opacity="0" />
    </radialGradient>

    <!-- Cool Robot Side Ambient Glow (Right) -->
    <radialGradient id="robotCoolGlow" cx="68%" cy="48%" r="48%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.28" />
      <stop offset="45%" stop-color="#0284c7" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#050811" stop-opacity="0" />
    </radialGradient>

    <!-- Central Touch Contact Singularity Glow -->
    <radialGradient id="contactSpark" cx="50%" cy="44.5%" r="24%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1" />
      <stop offset="12%" stop-color="#fef08a" stop-opacity="0.95" />
      <stop offset="30%" stop-color="#38bdf8" stop-opacity="0.65" />
      <stop offset="62%" stop-color="#0ea5e9" stop-opacity="0.20" />
      <stop offset="100%" stop-color="#050811" stop-opacity="0" />
    </radialGradient>

    <!-- Sculpted Warm Human Skin Gradient -->
    <linearGradient id="humanSkin" x1="0%" y1="15%" x2="100%" y2="85%">
      <stop offset="0%" stop-color="#9a4e24" />
      <stop offset="32%" stop-color="#c67140" />
      <stop offset="68%" stop-color="#e59b6e" />
      <stop offset="92%" stop-color="#f7c7a3" />
      <stop offset="100%" stop-color="#fde4ce" />
    </linearGradient>

    <linearGradient id="humanSkinShadow" x1="0%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#5c280e" />
      <stop offset="50%" stop-color="#8c431e" />
      <stop offset="100%" stop-color="#c46f41" />
    </linearGradient>

    <linearGradient id="humanRimLight" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.2" />
      <stop offset="65%" stop-color="#fde68a" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.98" />
    </linearGradient>

    <!-- Precision Titanium & Carbon Robot Hand Gradients -->
    <linearGradient id="robotTitanium" x1="100%" y1="15%" x2="0%" y2="85%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="30%" stop-color="#1e293b" />
      <stop offset="65%" stop-color="#475569" />
      <stop offset="88%" stop-color="#94a3b8" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>

    <linearGradient id="robotDarkChassis" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16" />
      <stop offset="50%" stop-color="#111c2d" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>

    <linearGradient id="robotCyanEdge" x1="100%" y1="0%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.25" />
      <stop offset="65%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#e0f2fe" stop-opacity="1" />
    </linearGradient>
  </defs>

  <!-- 1. Deep Atmospheric Canvas -->
  <rect width="1600" height="840" fill="url(#bgCanvas)" />
  <circle cx="510" cy="400" r="520" fill="url(#humanWarmGlow)" />
  <circle cx="1090" cy="400" r="520" fill="url(#robotCoolGlow)" />

  <!-- Subtle Geometric Studio Horizon Grid & Harmonic Arcs -->
  <g fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
    <circle cx="800" cy="374" r="190" />
    <circle cx="800" cy="374" r="320" />
    <circle cx="800" cy="374" r="460" />
    <line x1="0" y1="374" x2="1600" y2="374" stroke-dasharray="6 10" />
    <line x1="800" y1="0" x2="800" y2="840" stroke-dasharray="6 10" />
  </g>

  <!-- Fine Ambient Dust & Neural Synapses -->
  <g fill="#e2e8f0" opacity="0.45">
    <circle cx="240" cy="180" r="1.5" fill="#fcd34d" />
    <circle cx="390" cy="130" r="1.2" fill="#fbbf24" />
    <circle cx="560" cy="195" r="1.8" fill="#fde68a" />
    <circle cx="670" cy="145" r="1.3" fill="#fef08a" />
    <circle cx="940" cy="150" r="1.5" fill="#7dd3fc" />
    <circle cx="1065" cy="200" r="1.8" fill="#38bdf8" />
    <circle cx="1220" cy="135" r="1.3" fill="#bae6fd" />
    <circle cx="1365" cy="190" r="1.6" fill="#38bdf8" />
    <circle cx="480" cy="590" r="1.4" fill="#fbbf24" />
    <circle cx="1120" cy="585" r="1.5" fill="#38bdf8" />
  </g>

  <!-- ===================================================================== -->
  <!-- 2. LEFT SIDE: HUMAN BEING'S HAND REACHING TOWARD CENTER (794, 374)    -->
  <!-- ===================================================================== -->
  <g id="human-hand-assembly">
    <!-- Subtle Organic Bio-Aura Waves Along Human Forearm -->
    <path d="M 40 500 Q 280 410 540 365" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.28" stroke-dasharray="8 6" />
    <path d="M 90 595 Q 340 490 615 430" fill="none" stroke="#fbbf24" stroke-width="1.2" stroke-opacity="0.22" />

    <!-- Curled Back Fingers (Little, Ring, and Middle Fingers in Perspective Depth) -->
    <!-- Little Finger (Curled Lowest) -->
    <path
      d="M 545 485 C 585 495, 628 525, 646 560 C 655 578, 638 594, 618 584 C 590 568, 558 538, 520 518 Z"
      fill="url(#humanSkinShadow)"
    />
    <!-- Ring Finger (Curled Mid-Low) -->
    <path
      d="M 575 452 C 626 466, 675 502, 700 544 C 710 562, 692 580, 670 568 C 640 548, 598 512, 552 488 Z"
      fill="url(#humanSkinShadow)"
    />
    <!-- Middle Finger (Gracefully Bent Under Index Finger) -->
    <path
      d="M 605 410 C 668 420, 720 456, 748 504 C 760 524, 738 544, 715 530 C 682 508, 640 470, 585 450 Z"
      fill="url(#humanSkin)"
      opacity="0.88"
    />

    <!-- Main Human Forearm, Wrist, Dorsal Hand, and Extended Index Finger -->
    <path
      d="M -20 485
         C 135 430, 290 385, 435 348
         C 488 335, 535 332, 588 340
         C 636 346, 686 352, 735 356
         C 762 358, 782 362, 794 371
         C 799 376, 797 389, 786 394
         C 764 404, 728 402, 688 398
         C 650 395, 622 396, 602 414
         C 626 436, 642 465, 632 488
         C 620 510, 582 512, 548 504
         C 590 532, 626 568, 635 595
         C 642 616, 616 630, 594 614
         C 562 590, 524 550, 480 524
         C 432 496, 385 495, 325 516
         C 210 558, 95 612, -20 665
         Z"
      fill="url(#humanSkin)"
    />

    <!-- Sculpted Human Thumb (Lower Forefront Curve) -->
    <path
      d="M 465 455
         C 525 462, 582 492, 626 544
         C 642 564, 650 588, 636 604
         C 620 620, 594 610, 572 586
         C 538 548, 495 522, 442 510
         Z"
      fill="url(#humanSkin)"
    />

    <!-- Warm Anatomical Highlights, Fingernail & Golden Rim Lighting -->
    <path
      d="M 40 466 C 185 415, 320 374, 445 345 C 500 332, 545 332, 595 339 C 648 346, 705 353, 758 357 C 776 359, 790 364, 795 372"
      fill="none"
      stroke="url(#humanRimLight)"
      stroke-width="3.2"
      stroke-linecap="round"
    />
    <!-- Human Fingernail Subtle Highlight -->
    <path
      d="M 774 362 C 784 363, 792 367, 794 373 C 786 376, 777 375, 771 370 Z"
      fill="#fde8d7"
      opacity="0.85"
    />
    <!-- Subtle Knuckle & Tendon Contours -->
    <path d="M 575 352 Q 605 366 618 386" fill="none" stroke="#8c431e" stroke-width="1.6" stroke-opacity="0.35" />
    <path d="M 665 362 Q 672 375 668 388" fill="none" stroke="#8c431e" stroke-width="1.4" stroke-opacity="0.3" />
    <path d="M 730 366 Q 735 376 731 386" fill="none" stroke="#8c431e" stroke-width="1.3" stroke-opacity="0.3" />
  </g>

  <!-- ===================================================================== -->
  <!-- 3. RIGHT SIDE: ROBOT HAND REACHING TOWARD CENTER (806, 374)           -->
  <!-- ===================================================================== -->
  <g id="robot-hand-assembly">
    <!-- Telemetry & Circuit Traces Along Robot Forearm -->
    <path d="M 1560 500 Q 1320 410 1060 365" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.35" stroke-dasharray="10 6" />
    <path d="M 1510 595 Q 1260 490 985 430" fill="none" stroke="#0ea5e9" stroke-width="1.2" stroke-opacity="0.28" />

    <!-- Curled Back Robotic Fingers (Articulated Phalanges & Servo Joints) -->
    <!-- Robotic Little Finger -->
    <path
      d="M 1055 485 L 995 518 L 954 560 C 945 575, 960 592, 978 582 L 1025 544 L 1080 515 Z"
      fill="url(#robotDarkChassis)"
      stroke="#38bdf8"
      stroke-width="1"
      stroke-opacity="0.4"
    />
    <!-- Robotic Ring Finger -->
    <path
      d="M 1025 452 L 950 492 L 900 544 C 890 560, 908 578, 928 566 L 982 520 L 1048 486 Z"
      fill="url(#robotDarkChassis)"
      stroke="#38bdf8"
      stroke-width="1.1"
      stroke-opacity="0.5"
    />
    <!-- Robotic Middle Finger (Segmented Metallic Phalanges) -->
    <path
      d="M 995 410 L 912 442 L 852 504 C 840 522, 862 542, 884 528 L 942 478 L 1015 448 Z"
      fill="url(#robotTitanium)"
      stroke="#7dd3fc"
      stroke-width="1.2"
      stroke-opacity="0.65"
    />

    <!-- Main Robotic Forearm, Carpals, Metacarpal Chassis & Extended Index Finger -->
    <path
      d="M 1620 485
         L 1295 376
         L 1165 348
         L 1012 340
         L 865 356
         L 814 365
         C 805 368, 803 379, 809 387
         C 818 397, 845 401, 912 398
         L 998 414
         L 968 486
         L 1052 504
         L 1120 524
         L 1275 516
         L 1620 665
         Z"
      fill="url(#robotTitanium)"
      stroke="#38bdf8"
      stroke-width="1.5"
      stroke-opacity="0.65"
    />

    <!-- Internal Carbon-Fiber & Hydraulic Cutouts on Robot Hand -->
    <polygon
      points="1265,392 1155,368 1030,362 1045,442 1175,468 1280,455"
      fill="url(#robotDarkChassis)"
      stroke="#38bdf8"
      stroke-width="1.2"
      stroke-opacity="0.55"
    />

    <!-- Articulated Robotic Thumb (Foreground Metallic Actuator) -->
    <path
      d="M 1135 455
         L 1035 478
         L 968 548
         C 954 566, 952 590, 966 604
         C 982 618, 1006 608, 1028 584
         L 1085 526
         L 1158 510
         Z"
      fill="url(#robotTitanium)"
      stroke="#7dd3fc"
      stroke-width="1.5"
      stroke-opacity="0.8"
    />

    <!-- Glowing Optical Conduit Lines Inside Robot Hand & Forearm -->
    <g fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round">
      <path d="M 1540 535 L 1280 435 L 1150 408 L 1015 376 L 822 376" stroke-opacity="0.85" />
      <path d="M 1150 408 L 1045 488 L 976 575" stroke-opacity="0.65" />
      <path d="M 1280 435 L 1460 565" stroke-opacity="0.45" />
    </g>

    <!-- Cool Cyan Rim Light Along Upper Edge of Robot Hand & Index Finger -->
    <path
      d="M 1560 466 L 1295 376 L 1165 348 L 1012 340 L 865 356 L 807 371"
      fill="none"
      stroke="url(#robotCyanEdge)"
      stroke-width="3.4"
      stroke-linecap="round"
    />

    <!-- Precision Servo Rotary Joints (Knuckles & Phalange Hinges) -->
    <g>
      <!-- Wrist Primary Gyro Joint -->
      <circle cx="1165" cy="408" r="16" fill="#090d16" stroke="#38bdf8" stroke-width="2" />
      <circle cx="1165" cy="408" r="6" fill="#38bdf8" />

      <!-- Index MCP Knuckle Joint -->
      <circle cx="1012" cy="374" r="13" fill="#090d16" stroke="#7dd3fc" stroke-width="2" />
      <circle cx="1012" cy="374" r="5" fill="#fde047" />

      <!-- Index PIP Phalange Joint -->
      <circle cx="928" cy="374" r="9" fill="#090d16" stroke="#38bdf8" stroke-width="1.8" />
      <circle cx="928" cy="374" r="3.5" fill="#38bdf8" />

      <!-- Index DIP Distal Joint -->
      <circle cx="862" cy="374" r="7" fill="#090d16" stroke="#7dd3fc" stroke-width="1.6" />
      <circle cx="862" cy="374" r="2.8" fill="#fde047" />

      <!-- Thumb CMC & MCP Servo Joints -->
      <circle cx="1088" cy="492" r="11" fill="#090d16" stroke="#38bdf8" stroke-width="1.8" />
      <circle cx="1088" cy="492" r="4" fill="#38bdf8" />
      <circle cx="1026" cy="542" r="8.5" fill="#090d16" stroke="#7dd3fc" stroke-width="1.5" />
      <circle cx="1026" cy="542" r="3" fill="#fde047" />

      <!-- Middle & Ring Finger Servo Nodes -->
      <circle cx="912" cy="452" r="7.5" fill="#090d16" stroke="#38bdf8" stroke-width="1.5" />
      <circle cx="950" cy="496" r="7" fill="#090d16" stroke="#38bdf8" stroke-width="1.4" />
    </g>
  </g>

  <!-- ===================================================================== -->
  <!-- 4. POINT OF CONTACT: HUMAN FINGERTIP TOUCHING ROBOT FINGERTIP         -->
  <!-- ===================================================================== -->
  <g id="symbiosis-contact-spark">
    <!-- Radiant Aura at Contact Point (800, 374) -->
    <circle cx="800" cy="374" r="195" fill="url(#contactSpark)" />

    <!-- Concentric Harmonic Resonance Ripples -->
    <circle cx="800" cy="374" r="28" fill="none" stroke="#fef08a" stroke-width="2" stroke-opacity="0.9" />
    <circle cx="800" cy="374" r="56" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.65" stroke-dasharray="6 4" />
    <circle cx="800" cy="374" r="96" fill="none" stroke="#fbbf24" stroke-width="1.2" stroke-opacity="0.4" />

    <!-- Delicate Synaptic Arcs Bridging Human & Robot Fingertips -->
    <path d="M 760 364 Q 800 335 842 364" fill="none" stroke="#fef08a" stroke-width="2" stroke-opacity="0.85" />
    <path d="M 765 388 Q 800 415 838 388" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.85" />
    <line x1="800" y1="295" x2="800" y2="453" stroke="#ffffff" stroke-width="1.5" stroke-opacity="0.7" />
    <line x1="725" y1="374" x2="875" y2="374" stroke="#ffffff" stroke-width="1.8" stroke-opacity="0.8" />

    <!-- Luminous Core Contact Star -->
    <circle cx="800" cy="374" r="11" fill="#ffffff" />
    <circle cx="800" cy="374" r="5.5" fill="#fef08a" />
  </g>
</svg>`;

export const HUMAN_ROBOT_HAND_TOUCH_DATA_URI = `data:image/svg+xml;utf8,${encodeURIComponent(
  HUMAN_ROBOT_HAND_TOUCH_SVG
)}`;

