import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const port=Number(process.env.PORT||4310);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.zip':'application/zip','.txt':'text/plain; charset=utf-8','.json':'application/json'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let relative=decodeURIComponent(url.pathname);if(relative==='/')relative='/index.html';const target=path.resolve(root,'.'+relative);if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return}if(!(await stat(target)).isFile()){res.writeHead(404);res.end();return}const bytes=await readFile(target);res.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store','Content-Length':bytes.length});if(req.method==='HEAD')res.end();else res.end(bytes)}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`3DASTRA preview at http://127.0.0.1:${port}`));
