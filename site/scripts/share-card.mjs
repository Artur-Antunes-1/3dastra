import {createRequire} from 'node:module';
import {access} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url);
const modulePath=require.resolve('playwright',{paths:process.argv[2]?[process.argv[2]]:undefined});
const module=await import(pathToFileURL(modulePath).href);
const {chromium}=module.default??module;
let executablePath=chromium.executablePath();
try{await access(executablePath)}catch{executablePath='C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'}
const browser=await chromium.launch({headless:true,executablePath});
try{
const page=await browser.newPage({viewport:{width:1200,height:630},deviceScaleFactor:1});
await page.goto('http://127.0.0.1:4310');
await page.setContent(`<!doctype html><html lang="en"><head><style>@font-face{font-family:Outfit;src:url('/fonts/outfit-variable.ttf')}*{box-sizing:border-box}body{margin:0;background:#f5f7fb;color:#202c45;font-family:Outfit,sans-serif;width:1200px;height:630px;position:relative;overflow:hidden}.brand{position:absolute;left:58px;top:45px;font-size:29px;font-weight:650;letter-spacing:-1.4px}h1{position:absolute;left:55px;top:175px;font-size:77px;line-height:1.06;letter-spacing:-4px;font-weight:500;margin:0}p{position:absolute;left:59px;top:380px;width:420px;font-size:23px;line-height:1.5;color:#637087}img{position:absolute;right:30px;top:30px;width:630px;height:570px;object-fit:cover;border-radius:33px 33px 90px 33px}.foot{position:absolute;left:59px;bottom:45px;font-size:16px;color:#465cdd}.brand span{display:inline-grid;place-items:center;margin-right:12px;border:1px solid #465cdd;width:31px;height:31px;border-radius:8px;font-size:20px;color:#465cdd;vertical-align:middle}</style></head><body><img src="/images/observatory.webp" alt=""><div class="brand"><span>✳</span>3DASTRA</div><h1>Picture it.<br>Then build it.</h1><p>An image-first skill for AI agents.<br>A visual direction you can build.</p><div class="foot">Concepts · Modeling · Comparison</div></body></html>`);
await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluate(img=>img.decode());
await page.screenshot({path:path.join(root,'public/images/share-en.png')});
console.log('Share card rendered from HTML and the generated hero artwork: 1200x630.');
}finally{await browser.close()}
