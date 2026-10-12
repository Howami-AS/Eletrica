const CACHE_NAME='dimensiona-eletrica-v2';
const APP_URL=new URL('./Dimensiona_Eletrica_v2.html',self.registration.scope).href;
const APP_ASSETS=[
 './Dimensiona_Eletrica_v2.html',
 './manifest.webmanifest',
 './icon-192.png',
 './icon-512.png'
];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(
  APP_ASSETS.map(asset=>new URL(asset,self.registration.scope).href)
 )).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(
  keys.filter(key=>key.startsWith('dimensiona-eletrica-')&&key!==CACHE_NAME)
   .map(key=>caches.delete(key))
 )).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
  event.respondWith(fetch(event.request).then(response=>{
   const copy=response.clone();
   caches.open(CACHE_NAME).then(cache=>cache.put(event.request,copy));
   return response;
  }).catch(()=>caches.match(event.request).then(cached=>cached||caches.match(APP_URL))));
  return;
 }
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
