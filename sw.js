// Service Worker for CyberPuzzle.fun
// Provides offline functionality and caching

const CACHE_NAME = 'cyberpuzzle-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/puzzle1/puzzle1.html',
    '/puzzle1/puzzle1a.html',
    '/puzzle1/puzzle1b.html',
    '/puzzle1/puzzle1c.html',
    '/puzzle1/puzzle1d.html',
    '/puzzle1/puzzle1e.html',
    '/puzzle1/puzzle1f.html',
    '/puzzle1/quiz.html',
    '/puzzle1/dist/js/game-utils.js',
    '/puzzle1/dist/js/quiz.js',
    '/puzzle1/dist/css/styles.css',
    '/puzzle1/assets/img/CyberPuzzle.Fun.png',
    '/puzzle1/assets/img/bottle_img.jpg',
    '/puzzle1/assets/img/cipher_img.jpg',
    '/puzzle1/assets/img/keyboard_clue.jpg'
];

// Install event - cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache opened');
                return cache.addAll(urlsToCache);
            })
            .catch(err => {
                console.log('Cache failed:', err);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then(response => {
                        // Don't cache if not a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Clone the response
                        const responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });
                        
                        return response;
                    });
            })
            .catch(() => {
                // Fallback for offline
                if (event.request.mode === 'navigate') {
                    return caches.match('/index.html');
                }
            })
    );
});
