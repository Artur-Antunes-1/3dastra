import {cp,mkdir,readFile,writeFile,stat,lstat,realpath,readdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=await realpath(path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'));
const dist=path.resolve(root,'dist');
if(path.dirname(dist)!==root||path.basename(dist)!=='dist')throw new Error('Unexpected output directory.');
try{if((await lstat(dist)).isSymbolicLink())throw new Error('Refusing to clear a linked output directory.')}catch(error){if(error.code!=='ENOENT')throw error}
const approvedImages=new Set(['observatory.webp','product.webp','architecture.webp','character.webp','forest-reference.webp','tree-render.webp','stone-render.webp','stone-geometry.webp','share-en.png','NOTICE.md']);
for(const name of await readdir(path.join(root,'public/images'))){if(!approvedImages.has(name))throw new Error(`Image not in the reviewed asset list: ${name}`)}
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
await cp(path.join(root,'index.html'),path.join(dist,'index.html'));
await cp(path.join(root,'src'),path.join(dist,'src'),{recursive:true});
await cp(path.join(root,'public'),dist,{recursive:true});
const html=await readFile(path.join(dist,'index.html'),'utf8');
if(!html.includes('<html lang="en">'))throw new Error('The presentation must be in English.');
const zipSize=(await stat(path.join(dist,'downloads/3DASTRA.zip'))).size;
if(zipSize<1000)throw new Error('Missing skill package.');
await writeFile(path.join(dist,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://3dastra.vercel.app/sitemap.xml\n');
await writeFile(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://3dastra.vercel.app/</loc></url></urlset>\n');
console.log('3DASTRA built from reviewed public assets into a clean output directory.');
