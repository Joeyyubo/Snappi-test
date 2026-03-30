/**
 * Single source of truth for My API keys table and API key detail page field values.
 */

import { CATALOG_PRODUCT_NAMES, getCatalogProductByName } from './apiCatalogModel';

export const USE_CASE_EXPANDED_TEXT =
  'Expansion Content, holy cannoli looks like we figured it out, holy cannoli looks like we figured it out, holy cannoli looks like we figured it out, holy ca.';

/** Varied demo use-case copy for tables (short / medium / long). */
export const USE_CASE_MOCK_SAMPLES = [
  'Batch sync only.',
  'Retail POS integration for checkout.',
  'Short test.',
  USE_CASE_EXPANDED_TEXT,
  'Internal analytics dashboard. Read-only.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Mobile app.',
  'Compliance reporting for EU region; requires quarterly reconciliation exports and audit trail access.',
  'OK',
  'Partner portal: rate-limited endpoints for tier-two partners, webhook callbacks for subscription lifecycle, optional sandbox testing.'
];

const KEY_NAMES = [
  'Name of this key',
  'Auth API Key',
  'Payment Gateway Credential',
  'Catalog API Key',
  'Inventory Sync Key',
  'Notification Service Key',
  'Analytics API Credential',
  'Customer Profile Key',
  'Shipping API Key',
  'Billing API Credential',
  'Partner Portal Key',
  'Warehouse Sync Key',
  'Checkout API v2 Key',
  'Loyalty Program Key',
  'Pricing Service Key',
  'Support Webhook Key'
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

/** Varied owners for My API keys / approvals / API catalog (mix of names and email-style IDs). */
export const CREDENTIAL_OWNERS = [
  'Priya Sharma',
  'james.morrison@example.com',
  'María Fernández',
  'platform-automation@acme.demo',
  'Wei Chen',
  'sarah.k.ortiz@example.org',
  'Jordan Okafor',
  'dev-north@internal.demo',
  'Elena Volkov',
  'n.mueller@example.net'
];

/** Owner assigned to newly requested keys (demo “current user”). */
export const DEMO_CURRENT_USER_OWNER = 'Avery Patel';

/** Extra catalog names for Request API key modal (search / scroll demos) */
const REQUESTABLE_API_EXTRA = [
  'Toy store API',
  'Pet store API',
  'Cat store API',
  'Car store API',
  'Pet sell API',
  'Pet sale API',
  'Pet stop API'
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
  'Ion test. Lorem ipsum dolor sit amet consectetur adipiscing elit.',
  null,
  null,
  null,
  'Policy mismatch. The requested scope is not approved for this API.',
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
  "Only letters, numbers, and hyphens (-) are allowed. No spaces or other characters (e.g. 'My-Key-01').";

export const API_KEY_NAME_DUPLICATE_ERROR =
  'API key name already in use. Enter a unique name.';

export function buildCredentialsData() {
  return KEY_NAMES.map((name, i) => {
    const apiName = CATALOG_PRODUCT_NAMES[i % CATALOG_PRODUCT_NAMES.length];
    const catalog = getCatalogProductByName(apiName);
    return {
    id: `cred-${i}`,
    name,
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
      name: 'Name of this key',
      api: catalogApiName,
      status: 'Active',
      tier: 'Low',
      apiKeyState: 'viewed',
      requestedTime: REQUESTED_TIME_DISPLAY,
      useCase: USE_CASE_EXPANDED_TEXT
    },
    {
      id: base('2'),
      name: 'Name of this key',
      api: catalogApiName,
      status: 'Active',
      tier: 'High',
      apiKeyState: 'viewed',
      requestedTime: formatRequestedTimeFromUtcMs(Date.UTC(2026, 0, 24, 10, 15) - 45 * 60 * 1000),
      useCase: USE_CASE_EXPANDED_TEXT
    },
    {
      id: base('3'),
      name: 'My application',
      api: catalogApiName,
      status: 'Pending',
      tier: 'Low',
      apiKeyState: 'masked',
      requestedTime: formatRequestedTimeFromUtcMs(Date.UTC(2026, 0, 24, 10, 15) - 90 * 60 * 1000),
      useCase: USE_CASE_EXPANDED_TEXT
    }
  ];
}
