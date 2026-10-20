import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validLines, totals, loadCart, saveCart, validOrder, CART_KEY } from '../src/store.js';
import { products, delivery, formatAUD } from '../src/catalogue.js';

test('single kits, mixed carts and delivery once per nonempty order', () => {
  assert.deepEqual(totals([]), { subtotal: 0, delivery: 0, total: 0 });
  assert.equal(totals([{ productId: 'kit-10', quantity: 1 }]).total, 4100);
  assert.equal(totals([{ productId: 'kit-20', quantity: 1 }]).total, 6100);
  assert.deepEqual(totals([{ productId: 'kit-10', quantity: 2 }, { productId: 'kit-20', quantity: 1 }]), { subtotal: 10700, delivery: 1200, total: 11900 });
});
test('storage allowlist rejects unknown IDs and invalid quantities, merges and caps lines', () => {
  assert.deepEqual(validLines([null, {}, {productId:'bad', quantity:1}, {productId:'kit-10',quantity:0}, {productId:'kit-10',quantity:1.5}, {productId:'kit-10',quantity:'2'}, {productId:'kit-10',quantity:Infinity}]), []);
  assert.deepEqual(validLines([{productId:'kit-10',quantity:8,priceCents:1,email:'private'}, {productId:'kit-10',quantity:8}]), [{productId:'kit-10',quantity:10}]);
});
test('malformed storage is repaired and denied storage does not throw', () => {
  let raw = '{oops';
  const storage = { getItem: () => raw, setItem: (key, value) => { assert.equal(key,CART_KEY); raw=value; } };
  assert.deepEqual(loadCart(storage), []);
  assert.equal(raw,'[]');
  assert.equal(saveCart(storage,[{productId:'kit-20',quantity:2,email:'private'}]),true);
  assert.equal(raw,'[{"productId":"kit-20","quantity":2}]');
  const denied = {getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  assert.deepEqual(loadCart(denied),[]);
  assert.equal(saveCart(denied,[]),false);
});
test('confirmation validates reference and canonical lines, strips unrelated data', () => {
  assert.equal(validOrder(null),null);
  assert.equal(validOrder({reference:'fake',lines:[]}),null);
  assert.equal(validOrder({reference:'GB-DEMO-ABCDEF123456',lines:[{productId:'kit-20',quantity:-1}]}),null);
  assert.deepEqual(validOrder({reference:'GB-DEMO-ABCDEF123456',lines:[{productId:'kit-20',quantity:1}],email:'private'}),{reference:'GB-DEMO-ABCDEF123456',lines:[{productId:'kit-20',quantity:1}]});
});
test('no-JS sample prices agree with the central catalogue', async () => {
  for (const page of ['index','shop']) {
    const html = await readFile(new URL(`../${page}.html`,import.meta.url),'utf8');
    for(const product of products) assert.ok(html.includes(`data-price-for="${product.id}">${formatAUD(product.priceCents)}`), `${page}: ${product.id}`);
  }
  const help=await readFile(new URL('../help.html',import.meta.url),'utf8');
  assert.ok(help.includes(`data-delivery-price>${formatAUD(delivery.priceCents)}`));
});
