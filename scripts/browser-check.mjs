import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, ...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}) });
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173/gatherbox/';
const output = process.env.SCREENSHOT_DIR || 'tmp/browser-check';
await mkdir(output,{recursive:true});
let checks = 0;
const failures = [];
const requests = [];
const check = (name) => { checks++; console.log(`PASS ${name}`); };
const context = await browser.newContext({ viewport: { width:1280,height:900 }});
context.on('page', p => {
 p.on('pageerror', e => failures.push(e.message));
 p.on('request', r => requests.push({url:r.url(),method:r.method(),body:r.postData()}));
 p.on('response', r => { if(r.status()>=400) failures.push(`${r.status()} ${r.url()}`); });
});
const page = await context.newPage();
const go = name => page.goto(`${base}${name}.html`);
const visible = s => assert.equal(s,true);
const value = s => page.locator(s).textContent();
const active = () => page.evaluate(()=>document.activeElement.id);
const total = async (prefix, expected) => assert.equal(await value(`[data-${prefix}-total]`), expected);
const add = async (id,qty=1) => { await page.locator(`#qty-${id}`).fill(String(qty)); await page.locator(`[data-add-to-cart-form][data-product-id="${id}"] button`).click(); };
try {
 for(const name of ['index','shop','cart','checkout','confirmation','help','team']) {
  await go(name);
  assert.equal(page.url().includes('?'),false);
  const issues = await page.evaluate(() => {
   const issues=[];const ids=[...document.querySelectorAll('[id]')].map(el=>el.id);
   if(new Set(ids).size!==ids.length)issues.push('duplicate IDs');
   if(document.querySelectorAll('h1').length!==1)issues.push('h1 count');
   if(document.documentElement.lang!=='en-AU')issues.push('language');
   for(const img of document.images)if(!img.hasAttribute('alt')||!img.complete||img.naturalWidth===0)issues.push('image');
   for(const el of document.querySelectorAll('[aria-describedby],[aria-labelledby],[aria-controls]'))for(const attr of ['aria-describedby','aria-labelledby','aria-controls'])for(const id of (el.getAttribute(attr)||'').split(/\s+/).filter(Boolean))if(!document.getElementById(id))issues.push(`ARIA ${id}`);
   for(const el of document.querySelectorAll('input:not([type="hidden"]),select,textarea'))if(!el.labels?.length)issues.push(`label ${el.id}`);
   for(const el of document.querySelectorAll('a[href],img[src],script[src],link[href]')) {
    const url=new URL(el.getAttribute('href')||el.getAttribute('src'),location.href);
    if(url.origin===location.origin&&!url.pathname.startsWith('/gatherbox/'))issues.push(`base ${url}`);
   }
   return issues;
  });
  assert.deepEqual(issues,[],name);
  const links=await page.locator('a[href]').evaluateAll(els=>els.map(el=>el.href));
  for(const url of new Set(links)){const parsed=new URL(url);if(parsed.origin===new URL(base).origin){assert.equal((await context.request.get(url)).status(),200,url);}}
  check(`${name}: production page, labels, IDs, ARIA references, images and local links`);
 }
 await go('team');
 const rows=await page.locator('tbody tr').allTextContents();
 for(const [name,sid] of [['Luu Quoc Thai Tran','25507474'],['Anthony Bui','26486593'],['Ashcan Zaman','26077610']])assert.ok(rows.some(row=>row.includes(name)&&row.includes(sid)));
 assert.equal((await value('body')).includes('To be supplied'),false);check('all three Team names and user-confirmed SIDs');
 await go('confirmation');visible(await page.locator('[data-confirmation-state="empty"]').isVisible());check('direct confirmation without order');
 await go('checkout');await page.locator('[data-action="place-order"]').click();visible(await page.locator('#checkout-alert').isVisible());assert.equal(await active(),'checkout-error-summary');check('empty checkout blocked and invalid summary focused');
 for(const [id,entry] of Object.entries({'checkout-name':'Alex Sample','checkout-email':'alex@example.com','checkout-address1':'1 Example Street','checkout-suburb':'Sampleton','checkout-postcode':'2000'}))await page.locator(`#${id}`).fill(entry);
 await page.locator('#payment-sim-approved').check();await page.locator('[data-action="place-order"]').click();await page.locator('#checkout-alert').waitFor({state:'visible'});assert.match(await value('#checkout-alert'),/cart is empty/);assert.ok(page.url().endsWith('/checkout.html'));assert.equal(await page.evaluate(()=>sessionStorage.getItem('gatherbox.demo-order.v1')),null);check('direct empty checkout with valid fields and approval cannot create an order');
 await go('cart');const emptyShop=page.locator('[data-cart-state="empty"] a');assert.equal(await emptyShop.textContent(),'Shop kits');assert.ok((await emptyShop.getAttribute('href')).endsWith('shop.html'));visible(await emptyShop.isVisible());assert.equal(await page.locator('[data-action="go-to-checkout"]').isVisible(),false);await emptyShop.click();assert.ok(page.url().endsWith('/shop.html'));check('empty cart has a working shopping route and no checkout link');
 await go('shop');await add('kit-10');await go('cart');await total('cart','$41.00');check('10-guest kit: $29 + $12 = $41');
 await page.locator('[data-action="remove-from-cart"]').click();visible(await page.locator('[data-cart-state="empty"]').isVisible());assert.equal(await active(),'cart-empty-heading');check('last removal: empty state and heading focus');
 await go('shop');await add('kit-20');await go('cart');await total('cart','$61.00');check('20-guest kit: $49 + $12 = $61');
 await go('shop');await add('kit-10',2);await go('cart');await total('cart','$119.00');assert.equal(await value('[data-cart-subtotal]'),'$107.00');check('mixed cart, sample delivery applied once');
 await page.locator('#cart-qty-kit-10').fill('3');await page.locator('#cart-qty-kit-10').press('Tab');await total('cart','$148.00');
 await page.locator('#cart-qty-kit-10').fill('0');await page.locator('#cart-qty-kit-10').press('Tab');assert.equal(await page.locator('#cart-qty-kit-10').inputValue(),'3');await total('cart','$148.00');check('quantity update and invalid quantity restored');
 await page.reload();await total('cart','$148.00');check('cart survives reload');
 await page.screenshot({path:`${output}/desktop-cart.png`,fullPage:true});
 await go('checkout');await total('checkout','$148.00');await page.locator('[data-action="place-order"]').click();assert.equal(await active(),'checkout-error-summary');assert.equal(await page.locator('#checkout-error-summary a').count(),6);
 await page.locator('#checkout-error-summary a').first().click();assert.equal(await active(),'checkout-name');check('checkout invalid submission: six linked errors, summary and field focus');
 await page.locator('#checkout-name').fill('Alex Sample');await page.locator('#checkout-email').fill('bad');await page.locator('#checkout-address1').fill('1 Example Street');await page.locator('#checkout-suburb').fill('Sampleton');await page.locator('#checkout-postcode').fill('abcd');await page.locator('#payment-sim-declined').check();
 await page.locator('[data-action="place-order"]').click();assert.equal(await page.locator('#checkout-error-summary a').count(),2);check('email format and four-digit postcode errors');
 await page.locator('#checkout-email').fill('alex@example.com');await page.locator('#checkout-postcode').fill('2000');assert.equal(await page.locator('#checkout-error-summary').isVisible(),false);
 await page.locator('[data-action="place-order"]').click();await page.locator('#checkout-alert').waitFor({state:'visible'});assert.match(await value('#checkout-alert'),/Payment declined/);assert.equal(await page.locator('#checkout-name').inputValue(),'Alex Sample');assert.match(await page.evaluate(()=>localStorage.getItem('gatherbox.cart.v1')),/kit-10/);check('declined simulation preserves cart and current form entries');
 await page.locator('#payment-sim-approved').focus();await page.locator('#payment-sim-approved').press('Space');await page.locator('[data-action="place-order"]').focus();await page.keyboard.press('Enter');await page.waitForURL('**/confirmation.html');await total('confirmation','$148.00');visible(await page.locator('[data-confirmation-state="order"]').isVisible());assert.match(await value('[data-order-reference]'),/^GB-DEMO-[A-F0-9]{12}$/);assert.equal(await page.evaluate(()=>localStorage.getItem('gatherbox.cart.v1')),'[]');
 const storage=await page.evaluate(()=>JSON.stringify({local:{...localStorage},session:{...sessionStorage}}));for(const secret of ['Alex Sample','alex@example.com','1 Example Street','Sampleton','fullName','addressLine'])assert.equal(storage.includes(secret),false,secret);
 assert.equal((await value('body')).includes('Alex Sample'),false);check('keyboard retry approved: confirmation, expected total, cleared cart, no personal data in storage or confirmation');
 await page.reload();await total('confirmation','$148.00');check('confirmation reload retains nonpersonal summary');
 await page.screenshot({path:`${output}/desktop-confirmation.png`,fullPage:true});
 await go('help');await page.locator('[data-action="send-contact"]').click();assert.equal(await active(),'contact-error-summary');assert.equal(await page.locator('#contact-error-summary a').count(),4);
 await page.locator('#contact-name').fill('Alex Sample');await page.locator('#contact-email').fill('bad');await page.locator('#contact-topic').selectOption('kits');await page.locator('#contact-message').fill('   ');await page.locator('[data-action="send-contact"]').click();assert.equal(await page.locator('#contact-error-summary a').count(),2);
 await page.locator('#contact-email').fill('alex@example.com');await page.locator('#contact-message').fill('Example question');await page.locator('[data-action="send-contact"]').click();await page.locator('#contact-status').waitFor({state:'visible'});assert.match(await value('#contact-status'),/not sent or saved/);assert.equal(await page.locator('#contact-message').inputValue(),'');check('contact required, email and whitespace validation; honest unsent result and reset');
 await page.evaluate(()=>localStorage.setItem('gatherbox.cart.v1','{broken'));await go('cart');visible(await page.locator('[data-cart-state="empty"]').isVisible());assert.equal(await page.evaluate(()=>localStorage.getItem('gatherbox.cart.v1')),'[]');
 await page.evaluate(()=>localStorage.setItem('gatherbox.cart.v1',JSON.stringify([{productId:'kit-10',quantity:2,email:'do-not-store'},{productId:'unknown',quantity:5},{productId:'kit-20',quantity:-1}])));await page.reload();await total('cart','$70.00');assert.equal(await page.evaluate(()=>localStorage.getItem('gatherbox.cart.v1')),'[{"productId":"kit-10","quantity":2}]');check('malformed and tampered localStorage safely repaired');
 await page.evaluate(()=>sessionStorage.setItem('gatherbox.demo-order.v1','{"reference":"bad","lines":[]}'));await go('confirmation');visible(await page.locator('[data-confirmation-state="empty"]').isVisible());check('corrupt confirmation handled');
 // Cross-tab changes use the storage event; do not require a reload.
 await go('cart');const other=await context.newPage();await other.goto(`${base}shop.html`);await other.locator('[data-product-id="kit-20"] button').click();await page.waitForFunction(()=>document.querySelector('[data-cart-total]').textContent==='$119.00');await other.close();check('cross-tab cart synchronisation');
 await page.setViewportSize({width:390,height:844});await go('shop');await page.locator('.skip-link').focus();await page.keyboard.press('Enter');assert.equal(await active(),'main');await page.locator('.nav-toggle').focus();await page.keyboard.press('Enter');assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'true');await page.keyboard.press('Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent),'Home');await page.keyboard.press('Escape');assert.equal(await active(),'');assert.equal(await page.locator('.nav-toggle').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('.nav-toggle').evaluate(el=>el===document.activeElement),true);check('mobile keyboard skip link, menu Enter, Tab and Escape focus');
 for(const width of [390,320]) {
  await page.setViewportSize({width,height:844});
  for(const name of ['index','shop','cart','checkout','confirmation','help','team']) {
   await go(name);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`${name} ${width}`);
   await page.screenshot({path:`${output}/${width}-${name}.png`,fullPage:true});
  }
  check(`${width}px: all seven pages no horizontal document overflow and screenshots captured`);
 }
 await page.setViewportSize({width:390,height:844});await go('shop');await page.locator('#qty-kit-10').fill('10');await page.locator('[data-product-id="kit-10"] button').focus();await page.keyboard.press('Enter');await page.locator('#cart-status').waitFor({state:'visible'});assert.match(await value('#cart-status'),/up to 10/);check('keyboard add respects existing per-kit quantity cap');
 await go('cart');await page.locator('[data-product-id="kit-10"] [data-action="remove-from-cart"]').focus();await page.keyboard.press('Enter');assert.equal(await active(),'cart-qty-kit-20');await total('cart','$61.00');check('mobile keyboard removal focuses the remaining kit');
 await go('checkout');await page.locator('[data-action="place-order"]').click();await page.screenshot({path:`${output}/390-checkout-errors.png`,fullPage:true});
 await page.locator('#checkout-name').fill('Alex Sample');await page.locator('#checkout-email').fill('alex@example.com');await page.locator('#checkout-address1').fill('1 Example Street');await page.locator('#checkout-suburb').fill('Sampleton');await page.locator('#checkout-postcode').fill('2000');await page.locator('#payment-sim-approved').check();await page.locator('[data-action="place-order"]').click();await page.waitForURL('**/confirmation.html');await total('confirmation','$61.00');await page.screenshot({path:`${output}/390-confirmation-success.png`,fullPage:true});check('390px actual approved checkout and confirmation');
 assert.deepEqual(failures,[]);
 assert.equal(requests.some(r=>r.method!=='GET'),false);
 assert.equal(requests.some(r=>new URL(r.url).origin!==new URL(base).origin),false);
 for(const r of requests)assert.equal(/alex%40|Alex%20Sample|Example%20Street|paymentSimulation|fullName/.test(r.url),false);
 check('no JS errors, HTTP failures, external requests, non-GET requests or checkout data in URLs');
 const nojs=await browser.newContext({javaScriptEnabled:false});const p2=await nojs.newPage();await p2.goto(`${base}checkout.html`);assert.equal(await p2.locator('[data-action="place-order"]').isDisabled(),true);await p2.goto(`${base}help.html`);assert.equal(await p2.locator('[data-action="send-contact"]').isDisabled(),true);await nojs.close();check('JavaScript-disabled checkout/contact cannot submit');
 const blocked=await browser.newContext();await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError')}})});const p3=await blocked.newPage();await p3.goto(`${base}shop.html`);await p3.locator('[data-product-id="kit-10"] button').click();await p3.locator('#storage-alert').waitFor({state:'visible'});assert.match(await p3.locator('#storage-alert').textContent(),/not saved/);await blocked.close();check('blocked localStorage: honest error without crash');
 const noSession=await browser.newContext();await noSession.addInitScript(()=>{Object.defineProperty(window,'sessionStorage',{get(){return {getItem(){return null;},setItem(){throw new DOMException('Blocked','SecurityError');}}}})});const p4=await noSession.newPage();await p4.goto(`${base}shop.html`);await p4.locator('[data-product-id="kit-10"] button').click();await p4.goto(`${base}checkout.html`);
 for(const [id,entry] of Object.entries({'checkout-name':'Alex Sample','checkout-email':'alex@example.com','checkout-address1':'1 Example Street','checkout-suburb':'Sampleton','checkout-postcode':'2000'}))await p4.locator(`#${id}`).fill(entry);
 await p4.locator('#payment-sim-approved').check();await p4.locator('[data-action="place-order"]').click();await p4.locator('#checkout-alert').waitFor({state:'visible'});assert.match(await p4.locator('#checkout-alert').textContent(),/could not be saved/);assert.match(await p4.evaluate(()=>localStorage.getItem('gatherbox.cart.v1')),/kit-10/);await noSession.close();check('blocked sessionStorage: approval keeps cart and explains retry');
 console.log(`RESULT ${checks} checks passed; screenshots: ${output}`);
} finally { await browser.close(); }
