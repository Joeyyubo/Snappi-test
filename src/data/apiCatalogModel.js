/**
 * Single source of truth for API catalog table, API details, and credential `api` column names.
 * My API keys / API key approvals use the same `name` values as catalog rows.
 */

const DESC = 'Description of the API product.';

/** Sample owners (aligned with CREDENTIAL_OWNERS in apiCredentialsModel, no circular import). */
const SAMPLE_OWNERS = [
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

/**
 * @typedef {object} ApiCatalogProduct
 * @property {string} name — Catalog list title & navigation key (must match credential `api`)
 * @property {string} productDisplayName — Shown in API details “API product name”
 * @property {string} version
 * @property {string} owner
 * @property {string} lifecycle — Production | Staging | Testing
 * @property {string} catalogStatus — Published | Active | Draft | Retired | Deprecated
 * @property {string} description
 * @property {string} tag
 * @property {string} created
 * @property {string} baseUrl
 * @property {string} specUrl
 * @property {string} docUrl
 * @property {string} approval
 * @property {{ tier: string, rateLimit: string }[]} planTiers
 * @property {string} [slug] — for OpenAPI mock
 */

/** @type {ApiCatalogProduct[]} */
export const API_CATALOG_PRODUCTS = [
  {
    name: 'Flight API',
    productDisplayName: 'Air Flight API',
    version: 'V1',
    owner: 'John Doe',
    lifecycle: 'Production',
    catalogStatus: 'Published',
    description: DESC,
    tag: 'Business',
    created: 'Jan 24, 2026 10:15',
    baseUrl: 'http://smartairline.api.com/flightapi',
    specUrl: 'https://Smartairline.com/flightapi/v1',
    docUrl: 'https://docexample/v1',
    approval: 'Need manual approval',
    planTiers: [
      { tier: 'Bronze', rateLimit: '100/day' },
      { tier: 'Silver', rateLimit: '1000/day' },
      { tier: 'Gold', rateLimit: '10000/day' }
    ],
    slug: 'flight-api'
  },
  {
    name: 'Ticket API',
    productDisplayName: 'Ticket Reservation API',
    version: 'V1',
    owner: SAMPLE_OWNERS[1],
    lifecycle: 'Staging',
    catalogStatus: 'Draft',
    description: DESC,
    tag: 'People',
    created: 'Jan 22, 2026 14:32',
    baseUrl: 'https://api.smartairline.com/tickets',
    specUrl: 'https://api.smartairline.com/tickets/v1/openapi',
    docUrl: 'https://docs.smartairline.com/tickets/v1',
    approval: 'Need manual approval',
    planTiers: [
      { tier: 'Bronze', rateLimit: '200/day' },
      { tier: 'Silver', rateLimit: '2000/day' },
      { tier: 'Gold', rateLimit: '20000/day' }
    ],
    slug: 'ticket-api'
  },
  {
    name: 'Airport Information API',
    productDisplayName: 'Airport Information API',
    version: 'V2',
    owner: SAMPLE_OWNERS[2],
    lifecycle: 'Production',
    catalogStatus: 'Active',
    description: DESC,
    tag: 'Airport',
    created: 'Jan 20, 2026 09:00',
    baseUrl: 'https://api.smartairline.com/airports',
    specUrl: 'https://api.smartairline.com/airports/v2/spec',
    docUrl: 'https://docs.smartairline.com/airports',
    approval: 'Automatic',
    planTiers: [
      { tier: 'Bronze', rateLimit: '500/day' },
      { tier: 'Silver', rateLimit: '5000/day' },
      { tier: 'Gold', rateLimit: '50000/day' }
    ],
    slug: 'airport-information-api'
  },
  {
    name: 'Baggage Tracking API',
    productDisplayName: 'Baggage Tracking API',
    version: 'V1',
    owner: SAMPLE_OWNERS[3],
    lifecycle: 'Testing',
    catalogStatus: 'Deprecated',
    description: DESC,
    tag: 'Information',
    created: 'Jan 18, 2026 16:45',
    baseUrl: 'https://api.smartairline.com/baggage',
    specUrl: 'https://api.smartairline.com/baggage/v1/spec',
    docUrl: 'https://docs.smartairline.com/baggage',
    approval: 'Need manual approval',
    planTiers: [
      { tier: 'Bronze', rateLimit: '100/day' },
      { tier: 'Silver', rateLimit: '800/day' },
      { tier: 'Gold', rateLimit: '8000/day' }
    ],
    slug: 'baggage-tracking-api'
  },
  {
    name: 'Crew Scheduling API',
    productDisplayName: 'Crew Scheduling API',
    version: 'V1',
    owner: SAMPLE_OWNERS[4],
    lifecycle: 'Production',
    catalogStatus: 'Published',
    description: DESC,
    tag: 'People',
    created: 'Jan 15, 2026 11:20',
    baseUrl: 'https://api.smartairline.com/crew',
    specUrl: 'https://api.smartairline.com/crew/v1/spec',
    docUrl: 'https://docs.smartairline.com/crew',
    approval: 'Need manual approval',
    planTiers: [
      { tier: 'Bronze', rateLimit: '150/day' },
      { tier: 'Silver', rateLimit: '1500/day' },
      { tier: 'Gold', rateLimit: '15000/day' }
    ],
    slug: 'crew-scheduling-api'
  },
  {
    name: 'Weather Feed API',
    productDisplayName: 'Weather Feed API',
    version: 'V2',
    owner: SAMPLE_OWNERS[5],
    lifecycle: 'Staging',
    catalogStatus: 'Retired',
    description: DESC,
    tag: 'Information',
    created: 'Jan 12, 2026 08:05',
    baseUrl: 'https://api.smartairline.com/weather',
    specUrl: 'https://api.smartairline.com/weather/v2/spec',
    docUrl: 'https://docs.smartairline.com/weather',
    approval: 'Automatic',
    planTiers: [
      { tier: 'Bronze', rateLimit: '300/day' },
      { tier: 'Silver', rateLimit: '3000/day' },
      { tier: 'Gold', rateLimit: '30000/day' }
    ],
    slug: 'weather-feed-api'
  },
  {
    name: 'Loyalty Program API',
    productDisplayName: 'Loyalty Program API',
    version: 'V1',
    owner: SAMPLE_OWNERS[6],
    lifecycle: 'Production',
    catalogStatus: 'Active',
    description: DESC,
    tag: 'Business',
    created: 'Jan 10, 2026 13:50',
    baseUrl: 'https://api.smartairline.com/loyalty',
    specUrl: 'https://api.smartairline.com/loyalty/v1/spec',
    docUrl: 'https://docs.smartairline.com/loyalty',
    approval: 'Need manual approval',
    planTiers: [
      { tier: 'Bronze', rateLimit: '250/day' },
      { tier: 'Silver', rateLimit: '2500/day' },
      { tier: 'Gold', rateLimit: '25000/day' }
    ],
    slug: 'loyalty-program-api'
  },
  {
    name: 'Gate Assignment API',
    productDisplayName: 'Gate Assignment API',
    version: 'V1',
    owner: SAMPLE_OWNERS[7],
    lifecycle: 'Testing',
    catalogStatus: 'Draft',
    description: DESC,
    tag: 'Airport',
    created: 'Jan 8, 2026 15:10',
    baseUrl: 'https://api.smartairline.com/gates',
    specUrl: 'https://api.smartairline.com/gates/v1/spec',
    docUrl: 'https://docs.smartairline.com/gates',
    approval: 'Automatic',
    planTiers: [
      { tier: 'Bronze', rateLimit: '120/day' },
      { tier: 'Silver', rateLimit: '1200/day' },
      { tier: 'Gold', rateLimit: '12000/day' }
    ],
    slug: 'gate-assignment-api'
  },
  {
    name: 'Payment Gateway API',
    productDisplayName: 'Payment Gateway API',
    version: 'V3',
    owner: SAMPLE_OWNERS[8],
    lifecycle: 'Production',
    catalogStatus: 'Published',
    description: DESC,
    tag: 'Business',
    created: 'Jan 5, 2026 10:00',
    baseUrl: 'https://api.payments.example.com',
    specUrl: 'https://api.payments.example.com/v3/openapi.json',
    docUrl: 'https://docs.payments.example.com/v3',
    approval: 'Need manual approval',
    planTiers: [
      { tier: 'Bronze', rateLimit: '1000/day' },
      { tier: 'Silver', rateLimit: '10000/day' },
      { tier: 'Gold', rateLimit: '100000/day' }
    ],
    slug: 'payment-gateway-api'
  },
  {
    name: 'Notification Service API',
    productDisplayName: 'Notification Service API',
    version: 'V2',
    owner: SAMPLE_OWNERS[9],
    lifecycle: 'Staging',
    catalogStatus: 'Deprecated',
    description: DESC,
    tag: 'Information',
    created: 'Jan 3, 2026 12:30',
    baseUrl: 'https://api.notify.example.com',
    specUrl: 'https://api.notify.example.com/v2/spec',
    docUrl: 'https://docs.notify.example.com',
    approval: 'Automatic',
    planTiers: [
      { tier: 'Bronze', rateLimit: '400/day' },
      { tier: 'Silver', rateLimit: '4000/day' },
      { tier: 'Gold', rateLimit: '40000/day' }
    ],
    slug: 'notification-service-api'
  }
];

/** Ordered names — use for credential `api` field (same order as products). */
export const CATALOG_PRODUCT_NAMES = API_CATALOG_PRODUCTS.map((p) => p.name);

export function getCatalogProductByName(name) {
  return API_CATALOG_PRODUCTS.find((p) => p.name === name) || null;
}

/** Rows for API catalog table (PortalPage). */
export function getCatalogTableRows() {
  return API_CATALOG_PRODUCTS.map((p, i) => ({
    id: `catalog-${i}`,
    name: p.name,
    version: p.version,
    owner: p.owner,
    lifecycle: p.lifecycle,
    status: p.catalogStatus,
    description: p.description,
    tag: p.tag,
    created: p.created
  }));
}
