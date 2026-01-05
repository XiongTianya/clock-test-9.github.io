// PWA Service Worker for GitHub Pages
const CACHE_NAME = 'neon-chronos-v1';

// 这里的资源列表是离线时需要的核心文件
// 在生产构建中，这些通常由构建工具自动生成
// 这里我们是一个基础的缓存策略，确保应用能被识别为 PWA
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // 不强制要求所有文件都下载成功才安装成功，防止外部 CDN 失败导致 SW 安装失败
        // 这样即使图标没加载出来，PWA 功能也能启用
        return cache.addAll(urlsToCache).catch(err => {
            console.warn('Some assets failed to cache, but continuing PWA install', err);
        });
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});