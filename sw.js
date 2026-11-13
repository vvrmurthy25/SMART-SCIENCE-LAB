/* Smart Science Lab – offline helper (service worker) */
const CACHE="ssl-20261113143954";
const FILES=["/", "/manifest.webmanifest", "/icon-192.png", "/icon-512.png", "/apple-touch-icon.png", "/class10/lesson1/games.html", "/class10/lesson1/index.html", "/class10/lesson1/lab.html", "/class10/lesson1/zinc.html", "/class10/lesson10/games.html", "/class10/lesson10/index.html", "/class10/lesson10/lab.html", "/class10/lesson11/games.html", "/class10/lesson11/index.html", "/class10/lesson11/lab.html", "/class10/lesson12/games.html", "/class10/lesson12/index.html", "/class10/lesson12/lab.html", "/class10/lesson2/games.html", "/class10/lesson2/index.html", "/class10/lesson2/lab.html", "/class10/lesson3/games.html", "/class10/lesson3/index.html", "/class10/lesson3/lab.html", "/class10/lesson4/games.html", "/class10/lesson4/index.html", "/class10/lesson4/lab.html", "/class10/lesson9/games.html", "/class10/lesson9/index.html", "/class10/lesson9/lab.html", "/index.html"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(CACHE);
  await Promise.all(FILES.map(async u=>{try{const r=await fetch(u,{cache:"reload"});if(r.ok){const b=await r.blob();await c.put(u,new Response(b,{status:200,headers:{"Content-Type":r.headers.get("Content-Type")||""}}));}}catch(x){}}));
  self.skipWaiting();})());});
self.addEventListener("activate",e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==CACHE&&k.startsWith("ssl-"))await caches.delete(k);await self.clients.claim();})());});
function alt(path){const a=[path];if(path.endsWith("/"))a.push(path+"index.html");else if(!/\.[a-z0-9]+$/i.test(path)){a.push(path+".html");a.push(path+"/index.html");}else if(path.endsWith("/index.html"))a.push(path.slice(0,-10));return a;}
async function fromCache(req){const c=await caches.open(CACHE);const u=new URL(req.url);
  for(const p of alt(u.pathname)){const r=await c.match(p,{ignoreSearch:true});if(r)return r;}return null;}
self.addEventListener("fetch",e=>{const req=e.request;if(req.method!=="GET")return;const u=new URL(req.url);
  if(u.origin===location.origin){e.respondWith((async()=>{const hit=await fromCache(req);
      if(hit){e.waitUntil((async()=>{try{const r=await fetch(req);if(r.ok&&!r.redirected){const c=await caches.open(CACHE);await c.put(u.pathname,r.clone());}}catch(x){}})());return hit;}
      try{return await fetch(req);}catch(x){const home=await caches.match("/");return home||Response.error();}})());return;}
  if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(req);
      if(hit)return hit;try{const r=await fetch(req);if(r.ok||r.type==="opaque")c.put(req,r.clone());return r;}catch(x){return Response.error();}})());}
});
