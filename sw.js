// 선한목자교회 이단 분별 안내 - 서비스워커
// 오프라인에서도 앱이 열리도록 페이지를 저장(캐시)합니다.
var CACHE = 'hjc-heresy-v1';

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      // 시작 페이지(현재 폴더)를 미리 저장
      return c.addAll(['./', './index.html']).catch(function(){});
    })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  // 네트워크 우선, 실패하면 저장해둔 것으로
  e.respondWith(
    fetch(e.request).then(function(resp){
      var copy = resp.clone();
      caches.open(CACHE).then(function(c){ c.put(e.request, copy); }).catch(function(){});
      return resp;
    }).catch(function(){
      return caches.match(e.request).then(function(r){
        return r || caches.match('./index.html') || caches.match('./');
      });
    })
  );
});
