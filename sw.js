if(!self.define){let e,i={};const s=(s,n)=>(s=new URL(s+".js",n).href,i[s]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=s,e.onload=i,document.head.appendChild(e)}else e=s,importScripts(s),i()})).then((()=>{let e=i[s];if(!e)throw new Error(`Module ${s} didn’t register its module`);return e})));self.define=(n,r)=>{const o=e||("document"in self?document.currentScript.src:"")||location.href;if(i[o])return;let t={};const c=e=>s(e,o),a={module:{uri:o},exports:t,require:c};i[o]=Promise.all(n.map((e=>a[e]||c(e)))).then((e=>(r(...e),t)))}}define(["./workbox-b833909e"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"apple-touch-icon.png",revision:"1b5185abe562cd89eb3e1fbc3dfe354a"},{url:"assets/index-JYWsAn6m.css",revision:null},{url:"assets/index-wwgH_L1Y.js",revision:null},{url:"favicon.png",revision:"f1d242fe7866f3eae96f2749cf78ff0f"},{url:"index.html",revision:"8f52635d2388c77632a6729349fdf29f"},{url:"pwa-192x192.png",revision:"0f9e3ba3442433ba6ecdfd5364ad9bc4"},{url:"pwa-512x512.png",revision:"5c8a48333c080d533df8cc799ad01438"},{url:"registerSW.js",revision:"0c8329ee13539c50a128d59226d29233"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"vite.svg",revision:"8e3a10e157f75ada21ab742c022d5430"},{url:"manifest.webmanifest",revision:"c79a6d55b5fe342eeeb95721668c84a5"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"))),e.registerRoute(/^https:\/\/fonts\.googleapis\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-cache",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:31536e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));