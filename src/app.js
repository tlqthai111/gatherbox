import { getProduct, products, formatAUD, contentsSummary, delivery, MAX_QUANTITY_PER_LINE } from './catalogue.js';
import { CART_KEY, ORDER_KEY, loadCart, saveCart, totals, validOrder } from './store.js';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const text = (selector, value) => $$(selector).forEach(el => { el.textContent = value; });
function announce(selector, message) {
  const region = $(selector);
  if (!region) return;
  region.textContent = '';
  requestAnimationFrame(() => { region.textContent = message; });
}
function show(prefix, state) {
  $$(`[data-${prefix}-state]`).forEach(el => { el.hidden = el.getAttribute(`data-${prefix}-state`) !== state; });
}
function readCart() {
  try { return loadCart(window.localStorage); } catch { return []; }
}
function writeCart(lines) {
  try { if (saveCart(window.localStorage, lines)) return true; } catch { /* blocked storage */ }
  announce('#storage-alert', 'Your browser could not save the cart. Enable site storage and try again; this change was not saved.');
  return false;
}
function focusHeading(id) {
  const el = document.getElementById(id);
  el.tabIndex = -1;
  el.focus();
}
function renderSummary(prefix, lines) {
  const list = $(`[data-${prefix}-lines]`);
  if (list) list.replaceChildren(...lines.map(({ productId, quantity }) => {
    const product = getProduct(productId);
    const li = document.createElement('li');
    const label = document.createElement('span');
    const price = document.createElement('span');
    label.textContent = `${quantity} × ${product.name}`;
    price.textContent = formatAUD(product.priceCents * quantity);
    li.append(label, price);
    return li;
  }));
  for (const [key, cents] of Object.entries(totals(lines))) text(`[data-${prefix}-${key}]`, formatAUD(cents));
}

export function initApp() {
  const storageAlert = document.createElement('div');
  storageAlert.id = 'storage-alert';
  storageAlert.className = 'alert-region container';
  storageAlert.setAttribute('role', 'alert');
  $('#main').prepend(storageAlert);
  // Only enable form submission after handlers are installed below.
  let cart = readCart();
  const page = document.body.dataset.page;
  function header() {
    const count = cart.reduce((sum, line) => sum + line.quantity, 0);
    $$('[data-cart-count]').forEach(el => { el.hidden = !count; el.textContent = `${count} ${count === 1 ? 'kit' : 'kits'}`; });
  }
  function refresh() {
    cart = readCart();
    header();
    if (page === 'cart') renderCart();
    if (page === 'checkout') { show('checkout', cart.length ? 'filled' : 'empty'); renderSummary('checkout', cart); }
  }
  function renderCart() {
    show('cart', cart.length ? 'filled' : 'empty');
    const list = $('[data-cart-lines]');
    list.replaceChildren(...cart.map(({ productId, quantity }) => {
      const product = getProduct(productId);
      const line = $('#cart-line-template').content.firstElementChild.cloneNode(true);
      line.dataset.productId = productId;
      $('[data-line-image]', line).src = product.image;
      $('[data-line-name]', line).textContent = product.name;
      $('[data-line-contents]', line).textContent = contentsSummary(product);
      $('[data-line-unit-price]', line).textContent = formatAUD(product.priceCents);
      const input = $('[data-line-quantity]', line);
      // Replace the inert template association with a product-unique ID before insertion.
      input.id = `cart-qty-${productId}`;
      input.value = quantity;
      input.max = MAX_QUANTITY_PER_LINE;
      $('[data-line-quantity-label]', line).htmlFor = input.id;
      $('[data-line-quantity-name]', line).textContent = ` of ${product.name}s`;
      $('[data-line-remove-name]', line).textContent = ` ${product.name}`;
      $('[data-line-total]', line).textContent = formatAUD(product.priceCents * quantity);
      input.addEventListener('change', () => {
        const next = input.valueAsNumber;
        if (!Number.isInteger(next) || next < 1 || next > MAX_QUANTITY_PER_LINE) {
          input.value = quantity;
          announce('#cart-status', `Enter a whole quantity from 1 to ${MAX_QUANTITY_PER_LINE}. The previous quantity has been kept.`);
          return;
        }
        const latest = readCart();
        if (!latest.some(item => item.productId === productId)) { refresh(); return; }
        const updated = latest.map(item => item.productId === productId ? { productId, quantity: next } : item);
        if (!writeCart(updated)) { input.value = quantity; return; }
        quantity = next;
        cart = updated;
        header();
        $('[data-line-total]', line).textContent = formatAUD(product.priceCents * next);
        for (const [key, cents] of Object.entries(totals(cart))) text(`[data-cart-${key}]`, formatAUD(cents));
        announce('#cart-status', `${product.name} quantity updated to ${next}. Total ${formatAUD(totals(cart).total)} AUD.`);
      });
      $('[data-action="remove-from-cart"]', line).addEventListener('click', () => {
        const index = cart.findIndex(item => item.productId === productId);
        if (!writeCart(readCart().filter(item => item.productId !== productId))) return;
        refresh();
        const inputs = $$('[data-line-quantity]');
        if (inputs.length) inputs[Math.min(index, inputs.length - 1)].focus();
        else focusHeading('cart-empty-heading');
        announce('#cart-status', `Removed ${product.name}. ${cart.length ? `Total ${formatAUD(totals(cart).total)} AUD.` : 'Your cart is empty.'}`);
      });
      return line;
    }));
    // Only the totals are present on the cart, so this keeps the line controls intact.
    for (const [key, cents] of Object.entries(totals(cart))) text(`[data-cart-${key}]`, formatAUD(cents));
  }
  // Static prices remain as no-JS content; runtime values always come from the catalogue.
  products.forEach(product => text(`[data-price-for="${product.id}"]`, formatAUD(product.priceCents)));
  text('[data-delivery-price]', formatAUD(delivery.priceCents));
  $$('[data-add-to-cart-form]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const input = $('[data-quantity-input]', form);
      const quantity = input.valueAsNumber;
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_LINE) { input.reportValidity(); return; }
      const product = getProduct(form.dataset.productId);
      if (!product) return;
      const latest = readCart();
      const existing = latest.find(line => line.productId === product.id);
      if ((existing?.quantity || 0) + quantity > MAX_QUANTITY_PER_LINE) {
        announce('#cart-status', `You can have up to ${MAX_QUANTITY_PER_LINE} of each kit in the cart. Change its quantity in your cart.`);
        return;
      }
      if (existing) existing.quantity += quantity;
      else latest.push({ productId: product.id, quantity });
      if (!writeCart(latest)) return;
      cart = latest;
      header();
      announce('#cart-status', `Added ${quantity} × ${product.name} to your cart.`);
    });
  });
  if (page === 'checkout') setupCheckout();
  if (page === 'help') setupContact();
  if (page === 'confirmation') {
    let order;
    try { order = validOrder(JSON.parse(sessionStorage.getItem(ORDER_KEY))); } catch { /* missing/blocked/corrupt */ }
    show('confirmation', order ? 'order' : 'empty');
    if (order) { text('[data-order-reference]', order.reference); renderSummary('confirmation', order.lines); }
  }
  refresh();
  $$('form [data-js-required]').forEach(el => { el.disabled = false; });
  window.addEventListener('storage', event => { if (event.key === CART_KEY || event.key === null) refresh(); });
  window.addEventListener('pageshow', refresh);

  function setupCheckout() {
    const form = $('[data-checkout-form]');
    const validator = setupValidation(form, '#checkout-error-summary', {
      'checkout-name': 'Enter a fictional full name.',
      'checkout-email': 'Enter an email address in the format name@example.com.',
      'checkout-address1': 'Enter a fictional street address.',
      'checkout-suburb': 'Enter a fictional suburb.',
      'checkout-postcode': 'Enter a 4-digit postcode.',
      'payment-sim-approved': 'Choose an approved or declined payment simulation.',
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      text('#checkout-alert', '');
      refresh();
      const valid = validator.validate();
      if (!cart.length) {
        announce('#checkout-alert', 'Your cart is empty. Add a kit before placing a demonstration order.');
        if (valid) focusHeading('checkout-summary-heading');
        return;
      }
      if (!valid) return;
      const result = form.elements.paymentSimulation.value;
      if (result === 'declined') {
        announce('#checkout-alert', 'Payment declined (simulated). No money was taken. Your cart and entries have been kept. Choose “Simulate an approved payment” and try again.');
        return;
      }
      if (result !== 'approved') return;
      const bytes = crypto.getRandomValues(new Uint8Array(6));
      const reference = `GB-DEMO-${[...bytes].map(n => n.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
      // Explicit allowlist: no form values, customer identity or address leave this page.
      const order = { reference, lines: cart.map(({ productId, quantity }) => ({ productId, quantity })) };
      try { sessionStorage.setItem(ORDER_KEY, JSON.stringify(order)); }
      catch { announce('#checkout-alert', 'The demonstration confirmation could not be saved. Enable site storage and retry. Your cart has been kept.'); return; }
      if (!writeCart([])) {
        try { sessionStorage.removeItem(ORDER_KEY); } catch { /* blocked storage */ }
        return;
      }
      form.reset();
      location.assign(new URL('confirmation.html', location.href));
    });
  }
  function setupContact() {
    const form = $('[data-contact-form]');
    const validator = setupValidation(form, '#contact-error-summary', {
      'contact-name': 'Enter a fictional name.',
      'contact-email': 'Enter an email address in the format name@example.com.',
      'contact-topic': 'Choose a topic.',
      'contact-message': 'Enter a demonstration message.',
    });
    form.addEventListener('submit', event => {
      event.preventDefault();
      text('#contact-status', '');
      if (!validator.validate()) return;
      form.reset();
      announce('#contact-status', 'Demonstration complete. Your message was not sent or saved. No one will receive it or reply.');
    });
  }
}

function setupValidation(form, summarySelector, messages) {
  form.noValidate = true;
  const summary = $(summarySelector);
  const errors = new Map();
  function check(id) {
    const field = document.getElementById(id);
    const radios = field.type === 'radio' ? $$(`input[name="${field.name}"]`, form) : [field];
    const invalid = field.type === 'radio' ? !radios.some(r => r.checked) : !field.value.trim() || !field.validity.valid;
    radios.forEach(el => { if (invalid) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid'); });
    text(`[data-error-for="${id}"]`, invalid ? messages[id] : '');
    if (invalid) errors.set(id, messages[id]); else errors.delete(id);
  }
  function render() {
    summary.hidden = !errors.size;
    $('[data-error-list]', summary).replaceChildren(...[...errors].map(([id, message]) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${id}`;
      a.textContent = message;
      a.addEventListener('click', event => { event.preventDefault(); document.getElementById(id).focus(); });
      li.append(a);
      return li;
    }));
  }
  form.addEventListener('input', event => {
    const id = event.target.type === 'radio' ? 'payment-sim-approved' : event.target.id;
    if (errors.has(id)) { check(id); render(); }
  });
  // Clear personal form values before a page enters the back/forward cache.
  window.addEventListener('pagehide', () => { form.reset(); });
  return { validate() {
    Object.keys(messages).forEach(check);
    render();
    if (errors.size) summary.focus();
    return !errors.size;
  } };
}
