/**
 * GatherBox catalogue — DEMONSTRATION VALUES ONLY.
 *
 * All prices and the delivery charge below are sample figures chosen for a
 * UTS 31245 student prototype. They are not quotes, have not been checked
 * against supplier costs, and must not be presented as real prices.
 * Materials and suppliers are unverified, so `material` is null on purpose.
 *
 * Money is stored as integer cents (AUD) to avoid floating-point rounding.
 * The static HTML pages repeat these values; keep both in sync
 * (see tests/integration.test.js). Runtime prices use this catalogue.
 */

export const IS_DEMO_PRICING = true;

export const DEMO_PRICING_NOTICE =
  'Sample prices for a student prototype. GatherBox is not trading and these are not real prices.';

export const CURRENCY = 'AUD';

/** Highest quantity a customer can choose for one kit line (UI limit, not stock). */
export const MAX_QUANTITY_PER_LINE = 10;

export const products = [
  {
    id: 'kit-10',
    sku: 'GB-KIT-10-NEUTRAL',
    name: '10-guest kit',
    shortName: '10-guest',
    style: 'Neutral',
    guests: 10,
    priceCents: 2900,
    isDemoPrice: true,
    contents: [
      { item: 'Plates', quantity: 10 },
      { item: 'Cups', quantity: 10 },
      { item: 'Forks', quantity: 10 },
      { item: 'Napkins', quantity: 10 },
    ],
    material: null,
    materialNote: 'Materials to be confirmed with a supplier.',
    image: new URL('./assets/kit-10.svg', import.meta.url).href,
    imageAlt:
      'Illustration of the 10-guest kit: one stack of plates, a row of cups, forks and folded napkins in neutral tones.',
  },
  {
    id: 'kit-20',
    sku: 'GB-KIT-20-NEUTRAL',
    name: '20-guest kit',
    shortName: '20-guest',
    style: 'Neutral',
    guests: 20,
    priceCents: 4900,
    isDemoPrice: true,
    contents: [
      { item: 'Plates', quantity: 20 },
      { item: 'Cups', quantity: 20 },
      { item: 'Forks', quantity: 20 },
      { item: 'Napkins', quantity: 20 },
    ],
    material: null,
    materialNote: 'Materials to be confirmed with a supplier.',
    image: new URL('./assets/kit-20.svg', import.meta.url).href,
    imageAlt:
      'Illustration of the 20-guest kit: two stacks of plates, two rows of cups, forks and folded napkins in neutral tones.',
  },
];

export const delivery = {
  id: 'sydney-flat',
  label: 'Sydney delivery (sample flat charge)',
  priceCents: 1200,
  isDemoPrice: true,
  area: 'Sydney metropolitan area (proposed, not confirmed)',
};

export function getProduct(id) {
  return products.find((product) => product.id === id) ?? null;
}

const audFormatter = new Intl.NumberFormat('en-AU', { style: 'currency', currency: CURRENCY });

/** formatAUD(2900) → "$29.00" */
export function formatAUD(cents) {
  return audFormatter.format(cents / 100);
}

/** One-line contents summary, e.g. "10 plates, 10 cups, 10 forks and 10 napkins". */
export function contentsSummary(product) {
  const parts = product.contents.map(({ item, quantity }) => `${quantity} ${item.toLowerCase()}`);
  return `${parts.slice(0, -1).join(', ')} and ${parts.at(-1)}`;
}
