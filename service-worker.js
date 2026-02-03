/**
 * CyberPuzzle.fun - Enhanced Service Worker
 * Performance Optimized with Advanced Caching Strategies
 * 
 * Features:
 * - Cache-First strategy for static assets (instant loading)
 * - Network-First strategy for HTML (fresh content)
 * - Stale-While-Revalidate for JS/CSS (fast + fresh)
 * - Precache critical assets
 * - Background sync for offline form submissions
 * 
 * @version 2.0.0
 */

const CACHE_VERSION = 'cyberpuzzle-v2';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Critical assets to cache immediately on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/puzzle1/dist/js/script-optimized.js',
    '/puzzle1/dist/js/game-utils.js',
    '/puzzle1/dist/js/quiz.js',
    '/puzzle1/dist/css/styles.css',
    '/manifest.json',
    '/puzzle1/puzzle1.html',
    '/puzzle1/puzzle1a.html',
    '/puzzle1/puzzle1b.html',
    '/puzzle1/puzzle1c.html',
    '/puzzle1/puzzle1d.html',
    '/puzzle1/puzzle1e.html',
    '/puzzle1/puzzle1f.html',
    '/puzzle1/quiz.html',
    '/puzzle1/assets/img/CyberPuzzle.Fun.png',
    '/puzzle1/assets/img/bottle_img.jpg'
];

// Cache duration configurations (in seconds)
const CACHE_STRATEGIES = {
    // HTML pages: Network first, cache fallback (1 hour max age)
    html: { maxAge: 3600, strategy: 'network-first' },
    // CSS/JS: Stale while revalidate (1 week max age)
    static: { maxAge: 604800, strategy: 'stale-while-revalidate' },
    // Images: Cache first (30 days max age)
    images: { maxAge: 2592000, strategy: 'cache-first' },
    // API/JSON: Network first (5 min max age)
    api: { maxAge: 300, strategy: 'network-first' }
};

// ============================================
// INSTALL EVENT
// ============================================
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Pre-caching critical assets');
                // Add assets one by one to handle individual failures gracefully
                return Promise.all(
                    PRECACHE_ASSETS.map(url => 
                        cache.add(url).catch(err => 
                            console.warn(`[SW] Failed to cache: ${url}`, err)
                        )
                    )
                );
            })
            .then(() => {
                console.log('[SW] Pre-cache complete');
                return self.skipWaiting();
            })
            .catch((err) => {
                console.error('[SW] Pre-cache failed:', err);
                self.skipWaiting();
            })
    );
});

// ============================================
// ACTIVATE EVENT
// ============================================
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    
    event.waitUntil(
        // Clean up old caches
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // Delete caches that don't match current version
                    if (cacheName.startsWith('cyberpuzzle-') && !cacheName.includes(CACHE_VERSION)) {
                        console.log(`[SW] Deleting old cache: ${cacheName}`);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
        .then(() => {
            console.log('[SW] Activation complete');
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// ============================================
// FETCH EVENT
// ============================================
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip cross-origin requests (except approved CDNs)
    if (!url.origin.includes(self.location.origin) && 
        !url.href.includes('cdn.jsdelivr.net') &&
        !url.href.includes('fonts.googleapis.com')) {
        return;
    }

    // Determine cache strategy based on request type
    const strategy = getCacheStrategy(request, url);
    
    event.respondWith(
        handleRequest(request, strategy)
    );
});

/**
 * Determine the appropriate cache strategy for a request
 */
function getCacheStrategy(request, url) {
    const pathname = url.pathname.toLowerCase();
    
    // HTML pages
    if (pathname.endsWith('.html') || pathname === '/' || pathname === '') {
        return CACHE_STRATEGIES.html;
    }
    
    // Images
    if (/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(pathname)) {
        return CACHE_STRATEGIES.images;
    }
    
    // Static assets (CSS, JS)
    if (/\.(css|js)$/i.test(pathname)) {
        return CACHE_STRATEGIES.static;
    }
    
    // Fonts
    if (/\.(woff2?|ttf|otf|eot)$/i.test(pathname)) {
        return CACHE_STRATEGIES.static;
    }
    
    // API/JSON
    if (pathname.includes('/api/') || pathname.endsWith('.json')) {
        return CACHE_STRATEGIES.api;
    }
    
    // Default to network-first
    return CACHE_STRATEGIES.html;
}

/**
 * Handle a request based on the specified strategy
 */
async function handleRequest(request, strategy) {
    const cacheName = getCacheNameForStrategy(strategy);
    
    switch (strategy.strategy) {
        case 'cache-first':
            return cacheFirst(request, cacheName);
        case 'stale-while-revalidate':
            return staleWhileRevalidate(request, cacheName);
        case 'network-first':
        default:
            return networkFirst(request, cacheName);
    }
}

/**
 * Get the appropriate cache name for a strategy
 */
function getCacheNameForStrategy(strategy) {
    switch (strategy.strategy) {
        case 'cache-first':
            return IMAGE_CACHE;
        case 'stale-while-revalidate':
            return STATIC_CACHE;
        case 'network-first':
        default:
            return DYNAMIC_CACHE;
    }
}

// ============================================
// CACHING STRATEGIES
// ============================================

/**
 * Cache First Strategy: Serve from cache, fetch from network if not cached
 * Best for: Images, fonts, static assets that don't change
 */
async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
        return cached;
    }
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('[SW] Cache first failed:', error);
        return new Response('Offline - content not cached', { status: 503 });
    }
}

/**
 * Network First Strategy: Fetch from network, fallback to cache
 * Best for: HTML pages, API calls - ensures fresh content
 */
async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            // Update cache with fresh response
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('[SW] Network failed, serving from cache:', request.url);
        const cached = await cache.match(request);
        
        if (cached) {
            return cached;
        }
        
        // If navigating and offline, return index.html for SPA behavior
        if (request.mode === 'navigate') {
            const fallback = await caches.match('/index.html');
            if (fallback) {
                return fallback;
            }
        }
        
        return new Response('Offline - no cached content available', { 
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
        });
    }
}

/**
 * Stale While Revalidate Strategy: Serve from cache immediately, update in background
 * Best for: CSS, JS - fast loading with background freshness updates
 */
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    // Always try to fetch fresh version in background
    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch((error) => {
            console.warn('[SW] Background fetch failed:', error);
            return null;
        });
    
    // Return cached version immediately if available
    if (cached) {
        // Revalidate in background
        fetchPromise;
        return cached;
    }
    
    // If not cached, wait for network
    try {
        return await fetchPromise;
    } catch (error) {
        return new Response('Offline - content not available', { status: 503 });
    }
}

// ============================================
// BACKGROUND SYNC
// ============================================
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgressData());
    }
});

async function syncProgressData() {
    // Placeholder for background sync logic
    console.log('[SW] Background sync executed');
}

// ============================================
// PUSH NOTIFICATIONS (placeholder)
// ============================================
self.addEventListener('push', (event) => {
    const options = {
        body: event.data?.text() || 'New update from CyberPuzzle!',
        icon: '/puzzle1/assets/img/CyberPuzzle.Fun.png',
        badge: '/puzzle1/assets/img/CyberPuzzle.Fun.png',
        vibrate: [100, 50, 100],
        data: {
            url: '/'
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('CyberPuzzle.fun', options)
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data?.url || '/')
    );
});

// ============================================
// MESSAGE HANDLING (for app communication)
// ============================================
self.addEventListener('message', (event) => {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data?.type === 'CACHE_ASSETS') {
        event.waitUntil(
            caches.open(STATIC_CACHE)
                .then(cache => cache.addAll(event.data.assets))
        );
    }
});

console.log('[SW] Service Worker loaded successfully');
