/**
 * Single source of truth for API catalog table, API details, and credential `api` field.
 * Product copy uses generic demo-safe placeholders for external presentations.
 */

/**
 * @typedef {object} ApiCatalogProduct
 * @property {string} name
 * @property {string} productDisplayName
 * @property {string} version
 * @property {string} owner
 * @property {string} lifecycle
 * @property {string} catalogStatus
 * @property {string} description
 * @property {string} tag
 * @property {string} created
 * @property {string} baseUrl
 * @property {string} specUrl
 * @property {string} docUrl
 * @property {string} approval
 * @property {{ tier: string, rateLimit: string }[]} planTiers
 * @property {string} [slug]
 */

const DESC = 'Illustrative API description for demonstration.';

function demoProduct(i, slug) {
  const letter = String.fromCharCode(65 + (i % 6));
  const name = `Sample API ${letter}`;
  return {
    name,
    productDisplayName: `${name} (demo)`,
    version: 'v1',
    owner: 'Demo organization',
    lifecycle: 'Production',
    catalogStatus: 'Published',
    description: DESC,
    tag: 'Demo',
    created: 'Jan 24, 2026 10:15',
    baseUrl: `https://api.example.com/${slug}`,
    specUrl: `https://specs.example.com/${slug}/openapi.json`,
    docUrl: `https://docs.example.com/${slug}`,
    approval: 'Manual approval (demo)',
    planTiers: [
      { tier: 'Bronze', rateLimit: '100/day' },
      { tier: 'Silver', rateLimit: '1000/day' },
      { tier: 'Gold', rateLimit: '10000/day' }
    ],
    slug
  };
}

/** @type {ApiCatalogProduct[]} */
export const API_CATALOG_PRODUCTS = [
  demoProduct(0, 'sample-a'),
  demoProduct(1, 'sample-b'),
  demoProduct(2, 'sample-c'),
  demoProduct(3, 'sample-d'),
  demoProduct(4, 'sample-e'),
  demoProduct(5, 'sample-f')
];

/** Ordered names — use for credential `api` field (same order as products). */
export const CATALOG_PRODUCT_NAMES = API_CATALOG_PRODUCTS.map((p) => p.name);

export function getCatalogProductByName(name) {
  return API_CATALOG_PRODUCTS.find((p) => p.name === name) || null;
}

/** Rows for API catalog table (legacy portal list; model still used by API details). */
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
