(()=>{"use strict";var e={913:()=>{try{self["workbox:core:6.4.2"]&&_()}catch(e){}},977:()=>{try{self["workbox:precaching:6.4.2"]&&_()}catch(e){}},80:()=>{try{self["workbox:routing:6.4.2"]&&_()}catch(e){}},873:()=>{try{self["workbox:strategies:6.4.2"]&&_()}catch(e){}}},t={};function s(a){var n=t[a];if(void 0!==n)return n.exports;var i=t[a]={exports:{}};return e[a](i,i.exports,s),i.exports}(()=>{s(913);const e=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class t extends Error{constructor(t,s){super(e(t,s)),this.name=t,this.details=s}}const a={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},n=e=>[a.prefix,e,a.suffix].filter((e=>e&&e.length>0)).join("-"),i=e=>e||n(a.precache),r=e=>e||n(a.runtime);function c(e,t){const s=t();return e.waitUntil(s),s}s(977);function o(e){if(!e)throw new t("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:s,url:a}=e;if(!a)throw new t("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(a,location.href),i=new URL(a,location.href);return n.searchParams.set("__WB_REVISION__",s),{cacheKey:n.href,url:i.href}}class h{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class l{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let u;async function f(e,s){let a=null;if(e.url){a=new URL(e.url).origin}if(a!==self.location.origin)throw new t("cross-origin-copy-response",{origin:a});const n=e.clone(),i={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},r=s?s(i):i,c=function(){if(void 0===u){const e=new Response("");if("body"in e)try{new Response(e.body),u=!0}catch(e){u=!1}u=!1}return u}()?n.body:await n.blob();return new Response(c,r)}function d(e,t){const s=new URL(e);for(const e of t)s.searchParams.delete(e);return s.href}class p{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const g=new Set;s(873);function y(e){return"string"==typeof e?new Request(e):e}class w{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new p,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const e of this._plugins)this._pluginStateMap.set(e,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:s}=this;let a=y(e);if("navigate"===a.mode&&s instanceof FetchEvent&&s.preloadResponse){const e=await s.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?a.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))a=await e({request:a.clone(),event:s})}catch(e){if(e instanceof Error)throw new t("plugin-error-request-will-fetch",{thrownErrorMessage:e.message})}const i=a.clone();try{let e;e=await fetch(a,"navigate"===a.mode?void 0:this._strategy.fetchOptions);for(const t of this.iterateCallbacks("fetchDidSucceed"))e=await t({event:s,request:i,response:e});return e}catch(e){throw n&&await this.runCallbacks("fetchDidFail",{error:e,event:s,originalRequest:n.clone(),request:i.clone()}),e}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=y(e);let s;const{cacheName:a,matchOptions:n}=this._strategy,i=await this.getCacheKey(t,"read"),r=Object.assign(Object.assign({},n),{cacheName:a});s=await caches.match(i,r);for(const e of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await e({cacheName:a,matchOptions:n,cachedResponse:s,request:i,event:this.event})||void 0;return s}async cachePut(e,s){const a=y(e);var n;await(n=0,new Promise((e=>setTimeout(e,n))));const i=await this.getCacheKey(a,"write");if(!s)throw new t("cache-put-with-no-response",{url:(r=i.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const c=await this._ensureResponseSafeToCache(s);if(!c)return!1;const{cacheName:o,matchOptions:h}=this._strategy,l=await self.caches.open(o),u=this.hasCallback("cacheDidUpdate"),f=u?await async function(e,t,s,a){const n=d(t.url,s);if(t.url===n)return e.match(t,a);const i=Object.assign(Object.assign({},a),{ignoreSearch:!0}),r=await e.keys(t,i);for(const t of r)if(n===d(t.url,s))return e.match(t,a)}(l,i.clone(),["__WB_REVISION__"],h):null;try{await l.put(i,u?c.clone():c)}catch(e){if(e instanceof Error)throw"QuotaExceededError"===e.name&&await async function(){for(const e of g)await e()}(),e}for(const e of this.iterateCallbacks("cacheDidUpdate"))await e({cacheName:o,oldResponse:f,newResponse:c.clone(),request:i,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))a=y(await e({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),a=a=>{const n=Object.assign(Object.assign({},a),{state:s});return t[e](n)};yield a}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const e of this.iterateCallbacks("cacheWillUpdate"))if(t=await e({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class _ extends class{constructor(e={}){this.cacheName=r(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,a="params"in e?e.params:void 0,n=new w(this,{event:t,request:s,params:a}),i=this._getResponse(n,s,t);return[i,this._awaitComplete(i,n,s,t)]}async _getResponse(e,s,a){let n;await e.runCallbacks("handlerWillStart",{event:a,request:s});try{if(n=await this._handle(s,e),!n||"error"===n.type)throw new t("no-response",{url:s.url})}catch(t){if(t instanceof Error)for(const i of e.iterateCallbacks("handlerDidError"))if(n=await i({error:t,event:a,request:s}),n)break;if(!n)throw t}for(const t of e.iterateCallbacks("handlerWillRespond"))n=await t({event:a,request:s,response:n});return n}async _awaitComplete(e,t,s,a){let n,i;try{n=await e}catch(i){}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:n}),await t.doneWaiting()}catch(e){e instanceof Error&&(i=e)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:n,error:i}),t.destroy(),i)throw i}}{constructor(e={}){e.cacheName=i(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(_.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,s){let a;const n=s.params||{};if(!this._fallbackToNetwork)throw new t("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{0;const t=n.integrity,i=e.integrity,r=!i||i===t;if(a=await s.fetch(new Request(e,{integrity:i||t})),t&&r){this._useDefaultCacheabilityPluginIfNeeded();await s.cachePut(e,a.clone());0}}return a}async _handleInstall(e,s){this._useDefaultCacheabilityPluginIfNeeded();const a=await s.fetch(e);if(!await s.cachePut(e,a.clone()))throw new t("bad-precaching-response",{url:e.url,status:a.status});return a}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==_.copyRedirectedCacheableResponsesPlugin&&(a===_.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);0===t?this.plugins.push(_.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}_.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},_.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await f(e):e};class v{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new _({cacheName:i(e),plugins:[...t,new l({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const s=[];for(const a of e){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:e,url:n}=o(a),i="string"!=typeof a&&a.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new t("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==a.integrity)throw new t("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,a.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,i),s.length>0){const e=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return c(e,(async()=>{const t=new h;this.strategy.plugins.push(t);for(const[t,s]of this._urlsToCacheKeys){const a=this._cacheKeysToIntegrities.get(s),n=this._urlsToCacheModes.get(t),i=new Request(t,{integrity:a,cache:n,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:i,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}}))}activate(e){return c(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),a=[];for(const n of t)s.has(n.url)||(await e.delete(n),a.push(n.url));return{deletedURLs:a}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const s=this.getCacheKeyForURL(e);if(!s)throw new t("non-precached-url",{url:e});return t=>(t.request=new Request(e),t.params=Object.assign({cacheKey:s},t.params),this.strategy.handle(t))}}s(80);(async()=>{const e=function(){const e=JSON.parse(new URLSearchParams(self.location.search).get("params"));return e.debug&&console.log("[Docusaurus-PWA][SW]: Service Worker params:",e),e}(),t=[{"revision":"1eb4ae65aac7fce898615ca26e99eade","url":"404.html"},{"revision":"308fdc8fc65aea29f3c1c9d35bfd7ea8","url":"assets/css/styles.6aa5c6ce.css"},{"revision":"6d1fb22100e16b8e9b0eceb0a943cae0","url":"assets/js/01a85c17.0cc65a1c.js"},{"revision":"1b7fb8a21ada26196f6fcaaa3971b7a5","url":"assets/js/087471bf.46cfab55.js"},{"revision":"ea9f2ccf5bfde91d18672341d3719619","url":"assets/js/13e72f07.1938ac56.js"},{"revision":"8ba843edf571793e099a7b3f02ce6d9d","url":"assets/js/14eb3368.992d88d6.js"},{"revision":"0c28b1467a59dec6f736ae1668882840","url":"assets/js/17896441.7b714bf7.js"},{"revision":"d371a44488debc74731531c955f1b8d3","url":"assets/js/195.09d8721b.js"},{"revision":"7d8835b8bee1019219989c4634ff23c5","url":"assets/js/1b33fba6.f93f2c86.js"},{"revision":"dfdc9557fc7f81bbc1fc874bea628599","url":"assets/js/1be78505.cdedd2db.js"},{"revision":"cb835d37ccd1f21e92e92fa6daf3422f","url":"assets/js/1df93b7f.3d4ca215.js"},{"revision":"31a7f87a7dff955a5f6f139dfb663e61","url":"assets/js/1e5d5328.c3fc8596.js"},{"revision":"00267cadfe500cd98d9df4ea68e55369","url":"assets/js/230.6828fdc6.js"},{"revision":"9666cae3d48e6a1aea43c97d972468fb","url":"assets/js/2dc770a8.9a4dd74d.js"},{"revision":"f889814287603890165d896a6d185270","url":"assets/js/3720c009.d83a4e0d.js"},{"revision":"2f72088a35acd47271e040f4447ad7f4","url":"assets/js/39259ab7.0ce674f6.js"},{"revision":"45f2be61365b1e0e3eea5ad6645f145f","url":"assets/js/4087.8d2e44e1.js"},{"revision":"0be66dfc96b9143037cdb0efecaf68c9","url":"assets/js/4089ca92.a9899eb4.js"},{"revision":"12ec200800f05878bfb1a3486a588e81","url":"assets/js/44bbf579.61e6f010.js"},{"revision":"56852c141337baa6763ab31288d45a2e","url":"assets/js/4608.c0bcc25b.js"},{"revision":"3cb12ec52b89b58b82a215125f1143a0","url":"assets/js/4992a861.e99741d4.js"},{"revision":"272227242650c083db7570c5d29f781f","url":"assets/js/4b76f9ef.aeb518ca.js"},{"revision":"e3c0ea14cd02e47ed1cca5f1b79907b1","url":"assets/js/5131.4656d8cc.js"},{"revision":"b393e256a5b832221a7e5c0545fdb5d8","url":"assets/js/5283.c38ce7e0.js"},{"revision":"39f3eca477b37eb39e219db12d5bdd67","url":"assets/js/55960ee5.ca6ad671.js"},{"revision":"0c8a88ebb7aad490844c99485272d5d4","url":"assets/js/5897.70889b12.js"},{"revision":"ef6ce423f4ed301bb1157b9d28a75781","url":"assets/js/65c4b625.b7b207b9.js"},{"revision":"c8b49c6e2e401a142d93ba4fe1c3eb23","url":"assets/js/6875c492.44dcbe79.js"},{"revision":"3ac5f726f8990effc01413470b4827e1","url":"assets/js/6b37e605.89312f43.js"},{"revision":"b90833193d326bca30a674041f1255b1","url":"assets/js/72a09322.6aeb254d.js"},{"revision":"d3325f812e948e5a6d2b484c99abea2c","url":"assets/js/7968494a.d9266b2b.js"},{"revision":"721bfa3fb7b232ba38d6bb823ecc24b0","url":"assets/js/7d6b771b.4118fb6b.js"},{"revision":"7486c6451977e28bb22d033125b3c328","url":"assets/js/7f50fbde.234c7125.js"},{"revision":"c8c2a5edaea87411f5fb0ed9af6793d1","url":"assets/js/814f3328.bfad024a.js"},{"revision":"9c8f462a654759b9e24ec5ebdb8662b6","url":"assets/js/851d9a4f.5d744879.js"},{"revision":"3d9916c3b3f40fd2c92465aa68035cbc","url":"assets/js/85892949.b6910863.js"},{"revision":"7f3d440e816890d448cf8193d0567d5c","url":"assets/js/8c3b7957.e2a72f3d.js"},{"revision":"b117c1d8956a1721c843cc51f1abd009","url":"assets/js/935f2afb.615febfb.js"},{"revision":"9f49640f243fdfb1e9065b2529a8b2f3","url":"assets/js/98b639e9.45ab2339.js"},{"revision":"c286331e19528fa5a5dcc91375aa5eff","url":"assets/js/999f3c84.85c78bb2.js"},{"revision":"4e1e8d3915eda11128943a6bf616802d","url":"assets/js/9e4087bc.c81708a2.js"},{"revision":"891c22ae311bc12a440faa3ee632bc7f","url":"assets/js/a6aa9e1f.6a1558f9.js"},{"revision":"ffffacb5381bdc72bc52f7ab023d7b25","url":"assets/js/a886fb2a.f4abf2b7.js"},{"revision":"aa327b647121e571f117ca7b0afc5c99","url":"assets/js/b282f2e4.21ef8f65.js"},{"revision":"45fe7c61ef331cf162664c986807e3e6","url":"assets/js/b6ec3d34.a34c1946.js"},{"revision":"d90af06d26d5a289b7805a86007d7100","url":"assets/js/b8548973.b2c7f632.js"},{"revision":"d9d0eceec99be9cfc022a4df38bbae46","url":"assets/js/bd8cd139.6c78f7ab.js"},{"revision":"916a9a606088eafe7b80b5a082eb0a99","url":"assets/js/ccc49370.3f88ce4c.js"},{"revision":"12f90d1b5713bb35a9a153812744a298","url":"assets/js/cea9bb76.295d4890.js"},{"revision":"fc823c87e3b6b92bcba1d0b0e8610523","url":"assets/js/d08c7ded.646bf353.js"},{"revision":"4128e7794a62e87ba77f141f8e9e2def","url":"assets/js/d42ef43a.bfe1de73.js"},{"revision":"88ab1745661db84e564134f62ec24b27","url":"assets/js/d6ea6338.98dd223b.js"},{"revision":"0a7880e2c17ca22d9750b75000d6f406","url":"assets/js/df203c0f.c612ca1e.js"},{"revision":"d0849a356f371bee27a191c04f7a7e95","url":"assets/js/df8912d1.24bf3574.js"},{"revision":"6fde837194dac1fead2182eb2d194fbe","url":"assets/js/e031bee9.832f6df2.js"},{"revision":"a3a3792d2730685884849af352a6c0dd","url":"assets/js/f5c9f649.c1c36c54.js"},{"revision":"8b51494c52943345d3ca19cfb088b79b","url":"assets/js/f63795f7.aa678c76.js"},{"revision":"9a9b4bc61f2f823bf09d0f18b84146fe","url":"assets/js/f7a6f418.7b5ccc2c.js"},{"revision":"4b70dca915758b83d3fbb387487d5817","url":"assets/js/f853dbbb.5c5e1ee9.js"},{"revision":"78177890eb671f029665715a4c021869","url":"assets/js/f8570ef9.19b884dc.js"},{"revision":"603287d7b93fda368b05a242595a79f5","url":"assets/js/ff5ec031.9f4f0454.js"},{"revision":"96f9b3df91fd67c25a377693f2f6cdc2","url":"assets/js/main.417e611c.js"},{"revision":"58022df1edf2f9fed4bb4ba946112fb8","url":"assets/js/runtime~main.79813d4f.js"},{"revision":"da69895e29abc30ae6561c1033b34533","url":"blog.html"},{"revision":"503d9caf79bb47ba0d6871a8ba2026bc","url":"blog/2022/02/22/embed-tweet-to-docusaurus.html"},{"revision":"2b9020f7cb19346ce22bca4d6d12080d","url":"blog/2022/index.html"},{"revision":"70ac2c20a6a1e643388808d965b66672","url":"blog/againstc.html"},{"revision":"e02c5d3c038f751d00c97b04bc7733ca","url":"blog/archive.html"},{"revision":"33750363b6a9586d761c26c40fa3c7a8","url":"blog/feed.json"},{"revision":"a6d1be2af5fc3c3433b114c109ed3769","url":"blog/tags.html"},{"revision":"0e8a5d2e84aec216bb53eb8c2a00c5e9","url":"blog/tags/againstc.html"},{"revision":"b8efb67504776fa35babf8da9821330b","url":"blog/tags/docusaurus.html"},{"revision":"c309e18f9caea9f104d9f63e0f2578ac","url":"blog/tags/remark.html"},{"revision":"f373e4cdafa525aed53c15b5281fea02","url":"blog/tags/twitter.html"},{"revision":"592c9cb3d6ad0318aa574d495a5f4fd9","url":"blog/tags/widget.html"},{"revision":"60c6b53b036460dd818193755b6bf169","url":"blog/tags/オープンレター.html"},{"revision":"849e8c211f3ebf15e92f0079d0f619d2","url":"blog/tags/キャンセル・カルチャー.html"},{"revision":"9c81e797913ddf71152bc272075781d3","url":"index.html"},{"revision":"9f2a52e9d86645333914473ebb95ca7d","url":"search-index-default.json"},{"revision":"a66c31b4452bef77fce4a7dcc6c2fe1b","url":"search-index-docs-default-current.json"},{"revision":"6e1477100024e6ef80091c5f3bc59839","url":"topic/category/2022-年.html"},{"revision":"9f94f0b6ac1bab93cc25ff81f099be96","url":"topic/category/february.html"},{"revision":"36bdb3f442bed9dd434af3743c5a96c1","url":"topic/index.html"},{"revision":"7afce70a525bfd5e56b5c1cd1c6df12a","url":"topic/open-letters.html"},{"revision":"60905bef0a4cbc3860995480e6cb22a1","url":"topic/open-letters/background.html"},{"revision":"057679db13e870b5d2b3558c0eb0c8d4","url":"topic/open-letters/background/atmosphere.html"},{"revision":"b848eb186e145a9863651810cf88e4a1","url":"topic/open-letters/background/re-flaming.html"},{"revision":"1fb6432bee5d2803e03cec39876b76e7","url":"topic/open-letters/search.html"},{"revision":"0ced1d2eed859f0e051777caea8a9d7f","url":"topic/open-letters/timeline.html"},{"revision":"56362bb42131111cf65f9180058c315e","url":"topic/open-letters/timeline/2022/02/25.html"},{"revision":"dfe843ccbf0a396311a4cc6822ea415c","url":"topic/tags.html"},{"revision":"00db742499d8bee4aa987e53fa824f58","url":"topic/tags/againstc.html"},{"revision":"7f7c747b2946d86f5ebae81856ce58b4","url":"topic/tags/オープンレター.html"},{"revision":"cf9179cc07c60566d3ae43b311bb242e","url":"topic/tags/キャンセル・カルチャー.html"},{"revision":"dfa0138103ddcb648c69ed94535bc061","url":"topic/tags/タイムライン.html"},{"revision":"c3fbe93a1ef47031476ca3e61fae2a05","url":"topic/tags/ネットリンチ.html"},{"revision":"f9457273b6c1da28f9825458efd94792","url":"topic/tags/まとめ.html"},{"revision":"e83e41aceeea59869a3b0e4231655ae5","url":"topic/tags/事実陳列罪.html"},{"revision":"35d9c96f0f84b156446915a4c2b85a51","url":"topic/tags/偏向報道.html"},{"revision":"fdfffdf37164d7a51565bc3e5885a751","url":"topic/tags/名誉毀損.html"},{"revision":"9201e0e2f31f5b5ad702294a97cbfc8d","url":"topic/tags/呉座勇一.html"},{"revision":"7ec391f1a30e750adafd2affe0df42d4","url":"topic/tags/日文研.html"},{"revision":"e8133d0e1ed42d0423dbe8c64dd453dc","url":"topic/tags/炎上.html"},{"revision":"3bf205e8f8ed8e26120e92ed09ac9346","url":"topic/tags/言い逃げ.html"},{"revision":"fac0028efdb72f3a93666c295dfd6d03","url":"topic/tags/訴訟.html"},{"revision":"c42dfe85906b0abd8b82776273bc9299","url":"assets/images/open-letters-banner-527408dd079a97565e0e4eb37b48bd9a.png"},{"revision":"6c8ba1838ccbeaf4228c2cf679d98526","url":"img/android-chrome-192x192.png"},{"revision":"2ca1ca0f180238eda6e18630af4e93ef","url":"img/android-chrome-512x512.png"},{"revision":"ad8d2050195faa94a7386a9732bdeb08","url":"img/apple-touch-icon.png"},{"revision":"7fa1a026116afe175cae818030d4ffc4","url":"img/docusaurus.png"},{"revision":"85cf57703cefbe4a3181bf21271c28a6","url":"img/favicon-16x16.png"},{"revision":"1cdbb76c2ed4c17a2d72d389da67d822","url":"img/favicon-32x32.png"},{"revision":"c1936125c3666ea8ab77554203fa548c","url":"img/favicon.ico"},{"revision":"506ca15e5db5b5bcf9ebd4e619de7809","url":"img/logo_dark.png"},{"revision":"c997d96e2e8b0fe8c6f62e36621e41bb","url":"img/logo_dark.svg"},{"revision":"0ae28342b1ce23e9d7da7cadb920d554","url":"img/logo.png"},{"revision":"32f28365fdd523f1645d747b15c71222","url":"img/logo.svg"},{"revision":"42f0193727a6f6c500773aef286147c5","url":"img/mstile-144x144.png"},{"revision":"98b6243b8d671fcbbaaa64888a742f37","url":"img/mstile-150x150.png"},{"revision":"a0c2e131fd23384794b4a9bdb70c63cb","url":"img/mstile-310x150.png"},{"revision":"46262cbe0298b049a756561cef67b3db","url":"img/mstile-310x310.png"},{"revision":"80097937ff9785becec77c81097a00ee","url":"img/mstile-70x70.png"},{"revision":"c42dfe85906b0abd8b82776273bc9299","url":"img/open-letters-banner.png"},{"revision":"66908c04fc5ffd43d70aa57c9fa8e348","url":"img/open-letters-banner.svg"},{"revision":"53e83f8eb421cbe1065fd7d8dfb7ed98","url":"img/safari-pinned-tab.svg"},{"revision":"0fad112f2cbcace5ae3bd73131b23fc8","url":"assets/fonts/PlemolJPConsole-9196a41aa1f34c9f527a515765cf43da.woff2"}],s=new v({fallbackToNetwork:!0});e.offlineMode&&(s.addToCacheList(t),e.debug&&console.log("[Docusaurus-PWA][SW]: addToCacheList",{precacheManifest:t})),await async function(e){}(),self.addEventListener("install",(t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: install event",{event:t}),t.waitUntil(s.install(t))})),self.addEventListener("activate",(t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: activate event",{event:t}),t.waitUntil(s.activate(t))})),self.addEventListener("fetch",(async t=>{if(e.offlineMode){const a=t.request.url,n=function(e){const t=[],s=new URL(e,self.location.href);return s.origin!==self.location.origin||(s.search="",s.hash="",t.push(s.href),s.pathname.endsWith("/")?t.push(`${s.href}index.html`):t.push(`${s.href}/index.html`)),t}(a);for(let i=0;i<n.length;i+=1){const r=n[i],c=s.getCacheKeyForURL(r);if(c){const s=caches.match(c);e.debug&&console.log("[Docusaurus-PWA][SW]: serving cached asset",{requestURL:a,possibleURL:r,possibleURLs:n,cacheKey:c,cachedResponse:s}),t.respondWith(s);break}}}})),self.addEventListener("message",(async t=>{e.debug&&console.log("[Docusaurus-PWA][SW]: message event",{event:t});"SKIP_WAITING"===(t.data&&t.data.type)&&self.skipWaiting()}))})()})()})();