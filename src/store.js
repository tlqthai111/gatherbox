import { getProduct, delivery, MAX_QUANTITY_PER_LINE } from './catalogue.js';
export const CART_KEY = 'gatherbox.cart.v1';
export const ORDER_KEY = 'gatherbox.demo-order.v1';

// Never trust prices, names or other properties supplied by browser storage.
export function validLines(value) {
  if (!Array.isArray(value)) return [];
  const merged = new Map();
  for (const line of value) {
    if (!line || !getProduct(line.productId) || !Number.isSafeInteger(line.quantity) || line.quantity < 1) continue;
    merged.set(line.productId, Math.min(MAX_QUANTITY_PER_LINE, (merged.get(line.productId) || 0) + line.quantity));
  }
  return [...merged].map(([productId, quantity]) => ({ productId, quantity }));
}

export function totals(lines) {
  const subtotal = validLines(lines).reduce((sum, line) => sum + getProduct(line.productId).priceCents * line.quantity, 0);
  const shipping = subtotal ? delivery.priceCents : 0;
  return { subtotal, delivery: shipping, total: subtotal + shipping };
}

export function loadCart(storage) {
  try {
    const raw = storage.getItem(CART_KEY);
    let parsed;
    try { parsed = JSON.parse(raw); } catch { parsed = []; }
    const lines = validLines(parsed);
    if (raw !== null && raw !== JSON.stringify(lines)) storage.setItem(CART_KEY, JSON.stringify(lines));
    return lines;
  } catch { return []; }
}

export function saveCart(storage, lines) {
  try { storage.setItem(CART_KEY, JSON.stringify(validLines(lines))); return true; } catch { return false; }
}

export function validOrder(value) {
  if (!value || !/^GB-DEMO-[A-F0-9]{12}$/.test(value.reference) || !Array.isArray(value.lines)) return null;
  const lines = validLines(value.lines);
  if (!lines.length || JSON.stringify(lines) !== JSON.stringify(value.lines)) return null;
  return { reference: value.reference, lines };
}
