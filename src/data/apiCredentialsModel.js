/**
 * Single source of truth for My API keys table and API key detail page field values.
 */

import { CATALOG_PRODUCT_NAMES, getCatalogProductByName } from './apiCatalogModel';

/** Long use-case cell copy — generic for external demo (no internal project detail). */
export const USE_CASE_EXPANDED_TEXT =
  'Illustrative use case text for demo purposes only. Real requester context is not shown in external walkthroughs.';

/** Varied demo use-case copy for tables (short / medium / long) — all demo-safe. */
export const USE_CASE_MOCK_SAMPLES = [
  'Sandbox integration testing.',
  'Sample partner application.',
  'Short validation request.',
  USE_CASE_EXPANDED_TEXT,
  'Read-only analytics prototype.',
  'Placeholder narrative for UI review. No production systems referenced.',
  'Mobile client smoke test.',
  'Regional reporting workflow (illustrative).',
  'OK',
  'Webhook subscription lifecycle demo.'
];

const KEY_NAMES = [
  'Demo-Key-01',
  'Demo-Key-02',
  'Demo-Key-03',
  'Demo-Key-04',
  'Demo-Key-05',
  'Demo-Key-06',
  'Demo-Key-07',
  'Demo-Key-08',
  'Demo-Key-09',
  'Demo-Key-10',
  'Demo-Key-11',
  'Demo-Key-12',
  'Demo-Key-13',
  'Demo-Key-14',
  'Demo-Key-15',
  'Demo-Key-16'
];

const STATUSES = [
  'Active',
  'Pending',
  'Active',
  'Rejected',
  'Active',
  'Pending',
  'Active',
  'Rejected',
  'Active',
  'Pending',
  'Pending',
  'Pending',
  'Pending',
  'Active',
  'Rejected',
  'Pending'
];

const TIERS = [
  'Low',
  'High',
  'Silver',
  'Bronze',
  'Gold',
  'New',
  'Old',
  'Gold',
  'Silver',
  'Bronze',
  'Gold',
  'Silver',
  'Bronze',
  'High',
  'Low',
  'New'
];

/** Demo display names for My Toki “User” column (not the same as `owner` email). */
export const DEMO_TABLE_USER_NAMES = [
  'Morgan Chen',
  'Riley Park',
  'Jordan Okonkwo',
  'Samira Nasser',
  'Casey Wu',
  'Alex Rivera',
  'Jamie Frost',
  'Taylor Brooks',
  'Avery Singh',
  'Quinn Delgado',
  'Reese Malhotra',
  'Rowan Patel',
  'Skyler Gomez',
  'Drew Nakamura',
  'Blair Sato',
  'Cameron Ali'
];

/** Requester identities — anonymized for external demo screen shares. */
export const CREDENTIAL_OWNERS = [
  'applicant-aa@demo.example',
  'applicant-ab@demo.example',
  'applicant-ac@demo.example',
  'applicant-ad@demo.example',
  'applicant-ae@demo.example',
  'applicant-af@demo.example',
  'applicant-ag@demo.example',
  'applicant-ah@demo.example',
  'applicant-ai@demo.example',
  'applicant-aj@demo.example'
];

/** Owner assigned to newly requested keys (demo “current user”). */
export const DEMO_CURRENT_USER_OWNER = 'demo.you@example.com';

/** Extra API labels for Request API key modal (search / scroll demos) — generic only. */
const REQUESTABLE_API_EXTRA = [
  'Sample API G',
  'Sample API H',
  'Sample API I',
  'Sample API J',
  'Sample API K'
];

/** APIs available in Request API key modal (deduped, no placeholder row label) */
export const REQUESTABLE_API_NAMES = [...new Set([...CATALOG_PRODUCT_NAMES, ...REQUESTABLE_API_EXTRA])].sort((a, b) =>
  a.localeCompare(b)
);

const API_KEY_STATES = [
  'viewed',
  'masked',
  'generating',
  'empty',
  'masked',
  'viewed',
  'generating',
  'empty',
  'masked',
  'viewed',
  'masked',
  'masked',
  'viewed',
  'generating',
  'masked',
  'viewed'
];

const REJECTION_REASONS = [
  null,
  null,
  null,
  'Request did not meet the illustrated approval criteria (demo).',
  null,
  null,
  null,
  'Scope or tier not approved for this sample API (demo).',
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
];

/** Tier options for filters and Edit API key modal */
export const CREDENTIAL_TIER_OPTIONS = ['Bronze', 'Gold', 'Silver', 'Low', 'High', 'New', 'Old'];

/**
 * Tier choices in Edit API key modal — outline label + daily limit (matches design).
 * @type {{ value: string, description: string }[]}
 */
export const EDIT_MODAL_TIER_OPTIONS = [
  { value: 'High', description: '4000 per daily' },
  { value: 'Low', description: '1000 per daily' },
  { value: 'Silver', description: '1500 per daily' },
  { value: 'Gold', description: '2000 per daily' }
];

export const TIER_TOOLTIPS = {
  Bronze: '500 per daily',
  Gold: '5000 per daily',
  Silver: '1000 per daily',
  Low: '200 per daily',
  High: '10000 per daily',
  New: '100 per daily',
  Old: '50 per daily'
};

export const TIER_LIMIT = { High: 10000, Gold: 5000, Silver: 1000, Bronze: 500, Low: 200, New: 100, Old: 50 };

/** Same string shown in the Tier column tooltip in the table */
export function getTierTooltipText(tier) {
  return TIER_TOOLTIPS[tier] || `${tier} tier`;
}

const REQUESTED_TIME_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Format: Jan 24, 2026 10:15 (short month, day, year, 24h HH:MM, UTC components). */
export function formatRequestedTimeUtc(year, monthIndex0, day, hour, minute) {
  const mo = REQUESTED_TIME_MONTHS[monthIndex0];
  const hh = String(hour).padStart(2, '0');
  const mm = String(minute).padStart(2, '0');
  return `${mo} ${day}, ${year} ${hh}:${mm}`;
}

function formatRequestedTimeFromUtcMs(ms) {
  const d = new Date(ms);
  return formatRequestedTimeUtc(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes()
  );
}

/** Canonical “requested” stamp for new keys and tables (matches column format). */
export const REQUESTED_TIME_DISPLAY = formatRequestedTimeUtc(2026, 0, 24, 10, 15);

/** Non-empty API key names: letters (any case), digits, and hyphen only (Request API key / validation UX). */
export const API_KEY_NAME_PATTERN = /^[a-zA-Z0-9-]+$/;

export const API_KEY_NAME_FORMAT_ERROR =
  "Only letters, numbers, and hyphens (-) are allowed. No spaces or other characters (e.g. 'My-Toki-01').";

export const API_KEY_NAME_DUPLICATE_ERROR =
  'Toki name already in use. Enter a unique name.';

export function buildCredentialsData() {
  return KEY_NAMES.map((name, i) => {
    const apiName = CATALOG_PRODUCT_NAMES[i % CATALOG_PRODUCT_NAMES.length];
    const catalog = getCatalogProductByName(apiName);
    return {
    id: `cred-${i}`,
    name,
    user: DEMO_TABLE_USER_NAMES[i % DEMO_TABLE_USER_NAMES.length],
    owner: catalog?.owner ?? CREDENTIAL_OWNERS[i % CREDENTIAL_OWNERS.length],
    api: apiName,
    status: STATUSES[i],
    tier: TIERS[i],
    apiKeyState: API_KEY_STATES[i],
    requestedTime: formatRequestedTimeFromUtcMs(Date.UTC(2026, 0, 24, 10, 15) - i * 45 * 60 * 1000),
    rejectionReason: REJECTION_REASONS[i] || undefined,
    useCase: USE_CASE_MOCK_SAMPLES[i % USE_CASE_MOCK_SAMPLES.length]
  };
  });
}

/**
 * Demo rows for API catalog → API details → API keys tab (matches design: filters, expand, statuses).
 * @param {string} catalogApiName — Current API product name from catalog
 */
export function buildCatalogDetailsApiKeysDemo(catalogApiName) {
  const base = (suffix) => `catalog-api-keys-${catalogApiName.replace(/\s+/g, '-').toLowerCase()}-${suffix}`;
  return [
    {
      id: base('1'),
      name: 'Catalog-demo-key-01',
      api: catalogApiName,
      status: 'Active',
      tier: 'Low',
      apiKeyState: 'viewed',
      requestedTime: REQUESTED_TIME_DISPLAY,
      useCase: USE_CASE_EXPANDED_TEXT
    },
    {
      id: base('2'),
      name: 'Catalog-demo-key-02',
      api: catalogApiName,
      status: 'Active',
      tier: 'High',
      apiKeyState: 'viewed',
      requestedTime: formatRequestedTimeFromUtcMs(Date.UTC(2026, 0, 24, 10, 15) - 45 * 60 * 1000),
      useCase: USE_CASE_EXPANDED_TEXT
    },
    {
      id: base('3'),
      name: 'Catalog-demo-key-03',
      api: catalogApiName,
      status: 'Pending',
      tier: 'Low',
      apiKeyState: 'masked',
      requestedTime: formatRequestedTimeFromUtcMs(Date.UTC(2026, 0, 24, 10, 15) - 90 * 60 * 1000),
      useCase: USE_CASE_EXPANDED_TEXT
    }
  ];
}
