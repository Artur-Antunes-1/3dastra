import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile,access} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=path.join(repo,'site');
const base=process.argv[2]||'http://127.0.0.1:4310';
const require=createRequire(import.meta.url);
const dependencyPath=process.argv[3];
const playwrightPath=require.resolve('playwright',{paths:dependencyPath?[dependencyPath]:undefined});
const playwright=await import(pathToFileURL(playwrightPath).href);
const {chromium}=playwright.default??playwright;
let executablePath=chromium.executablePath();
try{await access(executablePath)}catch{executablePath='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';await access(executablePath)}
const capture=path.join(repo,'artifacts/screenshots');await mkdir(capture,{recursive:true});
const browser=await chromium.launch({headless:true,executablePath});
const report={url:base,browser:browser.version(),errors:[],failedRequests:[],externalRequests:[],viewports:[],checks:[]};
try{
  const context=await browser.newContext({viewport:{width:1440,height:1000},deviceScaleFactor:1,reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});
  const page=await context.newPage();
  page.on('pageerror',error=>report.errors.push(error.message));
  page.on('console',message=>{if(message.type()==='error')report.errors.push(message.text())});
  page.on('requestfailed',request=>report.failedRequests.push({url:request.url(),error:request.failure()?.errorText}));
  page.on('request',request=>{if(/^https?:/.test(request.url())&&new URL(request.url()).origin!==new URL(base).origin)report.externalRequests.push(request.url())});
  const response=await page.goto(base,{waitUntil:'networkidle'});assert.equal(response.status(),200);
  await page.evaluate(()=>document.fonts.ready);
  const decode=()=>page.locator('img[src]').evaluateAll(async images=>{for(const img of images){img.loading='eager';await img.decode()}});
  await decode();
  assert.equal(await page.locator('h1').count(),1);report.contentCharacters=(await page.locator('main').innerText()).length;assert.ok(report.contentCharacters>3000);assert.ok(await page.locator('#hero-title').isVisible());
  assert.equal(await page.locator('.vite-error-overlay,[data-nextjs-dialog]').count(),0);
  const missingAnchors=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(link=>!document.getElementById(link.hash.slice(1))).map(link=>link.hash));assert.deepEqual(missingAnchors,[]);
  await page.screenshot({path:path.join(capture,'desktop.png')});
  await page.screenshot({path:path.join(capture,'desktop-full.png'),fullPage:true});
  assert.equal(await page.locator('html').getAttribute('lang'),'en');
  const externalLinks=await page.locator('a[href^="https://"]').evaluateAll(links=>links.map(a=>a.href));
  assert.ok(externalLinks.every(href=>href==='https://github.com/Artur-Antunes-1/3dastra'));
  report.checks.push('English content, approved source links, local fonts, images and anchors loaded.');
  for(let i=0;i<6;i++){await page.locator(`#step-tab-${i}`).click();await page.locator('#step-image').evaluate(img=>img.decode());assert.equal(await page.locator(`#step-tab-${i}`).getAttribute('aria-selected'),'true');assert.equal(await page.locator('#method-panel').getAttribute('aria-labelledby'),`step-tab-${i}`)}
  await page.locator('#next-step').click();assert.equal(await page.locator('#step-tab-0').getAttribute('aria-selected'),'true');
  await page.locator('#step-tab-0').focus();await page.keyboard.press('ArrowRight');assert.equal(await page.locator('#step-tab-1').getAttribute('aria-selected'),'true');
  await page.locator('#method-panel').screenshot({path:path.join(capture,'method.png')});
  await page.locator('#case-stones').click();await decode();assert.ok((await page.locator('#case-concept').getAttribute('src')).includes('stone-geometry'));
  await page.locator('#case-implementation').click();assert.ok(await page.locator('#image-dialog').isVisible());await page.keyboard.press('Escape');assert.equal(await page.locator('#image-dialog').isVisible(),false);
  assert.equal(await page.evaluate(()=>document.activeElement===document.querySelector('#case-implementation').closest('button')),true);
  await page.locator('#case-tree').click();await decode();
  await page.locator('#examples').screenshot({path:path.join(capture,'model-studies.png')});
  report.checks.push('All six method stages, keyboard tabs, case switching, image enlargement, Escape and focus restoration.');
  for(const key of ['world','product','architecture','character']){await page.locator(`[data-usecase="${key}"]`).first().click();assert.ok(await page.locator('#usecase-dialog').isVisible());assert.equal(await page.locator('#usecase-references li').count(),3);assert.equal(await page.locator('#usecase-checks li').count(),3);await page.locator('#usecase-image').evaluate(img=>img.decode());if(key==='product')await page.locator('#usecase-dialog').screenshot({path:path.join(capture,'usecase.png')});await page.locator('#usecase-apply').click();assert.equal(await page.locator('#project-type').inputValue(),key);assert.equal(await page.locator('#usecase-dialog').isVisible(),false)}
  await page.locator('#project-idea').fill('A botanical station with two glass rooms.');await page.locator('#has-target').check();
  let text=await page.locator('#prompt-output').innerText();assert.ok(text.includes('two glass rooms'));assert.ok(text.includes('already chosen visual target'));assert.ok(!text.includes('wait for my choice'));
  await page.locator('#copy-prompt').click();const clipboard=await page.evaluate(()=>navigator.clipboard.readText());assert.equal(clipboard.replace(/\r\n/g,'\n'),text);
  await page.locator('#has-target').uncheck();text=await page.locator('#prompt-output').innerText();assert.ok(text.includes('wait for my choice'));
  await page.locator('#project-idea').fill('');assert.ok(await page.locator('#copy-prompt').isDisabled());
  await page.locator('#project-type').selectOption('world');assert.ok(await page.locator('#copy-prompt').isEnabled());
  await page.locator('#install-other').click();assert.ok((await page.locator('#installation-steps').innerText()).includes('installation convention'));await page.locator('#install-codex').click();
  await page.locator('.faq-list summary').first().click();assert.equal(await page.locator('.faq-list details').first().getAttribute('open'),'');
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('a[download]').first().click()]);assert.equal(download.suggestedFilename(),'3DASTRA.zip');
  const downloaded=await readFile(await download.path());const original=await readFile(path.join(root,'public/downloads/3DASTRA.zip'));const hash=data=>createHash('sha256').update(data).digest('hex');assert.equal(hash(downloaded),hash(original));
  report.downloadSha256=hash(downloaded);report.checks.push('Four detailed use cases, prompt variants, real clipboard copy, empty input, install tabs, FAQ and byte-identical ZIP download.');
  for(const [width,height] of [[1440,1000],[820,1180],[390,844],[320,720]]){await page.setViewportSize({width,height});await page.reload({waitUntil:'networkidle'});await page.evaluate(async()=>{await document.fonts.ready;window.scrollTo(0,0)});await decode();const dimensions=await page.evaluate(()=>({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,innerWidth,bodyWidth:document.body.scrollWidth}));assert.ok(dimensions.scrollWidth<=dimensions.clientWidth+1,JSON.stringify({width,...dimensions}));report.viewports.push({width,height,...dimensions});if(width===390){await page.screenshot({path:path.join(capture,'mobile.png')});await page.screenshot({path:path.join(capture,'mobile-full.png'),fullPage:true})}
  }
  await page.locator('#menu-button').click();assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'true');await page.locator('#navigation a[href="#get-started"]').click();assert.equal(await page.locator('#menu-button').getAttribute('aria-expanded'),'false');assert.equal(await page.locator('#navigation').isVisible(),false);
  await page.locator('#copy-prompt').click();assert.ok((await page.evaluate(()=>navigator.clipboard.readText())).startsWith('Use $3dastra'));
  report.checks.push('Desktop, tablet, 390px and 320px layouts; mobile menu and prompt copy; reduced-motion mode.');
  assert.deepEqual(report.errors,[]);assert.deepEqual(report.failedRequests,[]);assert.deepEqual(report.externalRequests,[]);
  report.passed=true;
}finally{await browser.close();await writeFile(path.join(repo,'artifacts/browser-verification.json'),JSON.stringify(report,null,2)+'\n')}
console.log(JSON.stringify(report,null,2));
