// Service Worker for Nabha Shiksha-AI
// Provides offline functionality and caching for the learning platform

const CACHE_NAME = 'nabha-shiksha-ai-v1';
const OFFLINE_CACHE_NAME = 'nabha-shiksha-ai-offline-v1';

// Files to cache for offline use
const STATIC_CACHE_URLS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png'
];

// API endpoints to cache
const API_CACHE_URLS = [
  '/api/ai/status',
  '/api/content/topics',
  '/api/content/levels'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Error caching static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== OFFLINE_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }
  
  // Handle static assets
  if (url.pathname.startsWith('/static/') || url.pathname === '/' || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(handleStaticRequest(request));
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }
});

// Handle API requests with offline fallback
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    console.log('Network request failed, trying cache:', request.url);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline fallback for API requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'You are offline. Some features may not be available.',
        offline: true
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

// Handle static asset requests
async function handleStaticRequest(request) {
  try {
    // Try cache first for static assets
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Try network
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache the response
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('Static asset request failed:', request.url);
    
    // Return a fallback response
    if (request.url.endsWith('.js')) {
      return new Response('console.log("Script not available offline");', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }
    
    if (request.url.endsWith('.css')) {
      return new Response('/* Styles not available offline */', {
        headers: { 'Content-Type': 'text/css' }
      });
    }
    
    return new Response('Resource not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      return networkResponse;
    }
    
    throw new Error('Network response not ok');
    
  } catch (error) {
    console.log('Navigation request failed, trying cache:', request.url);
    
    // Try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page
    return caches.match('/') || new Response('App not available offline', {
      status: 404,
      statusText: 'Not Found'
    });
  }
}

// Background sync for offline data
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'sync-conversations') {
    event.waitUntil(syncConversations());
  } else if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// Sync conversations when back online
async function syncConversations() {
  try {
    console.log('Syncing conversations...');
    
    // Get conversations from IndexedDB
    const conversations = await getConversationsFromIndexedDB();
    
    for (const conversation of conversations) {
      try {
        await fetch('/api/conversations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(conversation)
        });
        
        console.log('Conversation synced:', conversation.id);
        
      } catch (error) {
        console.error('Failed to sync conversation:', conversation.id, error);
      }
    }
    
  } catch (error) {
    console.error('Error syncing conversations:', error);
  }
}

// Sync progress when back online
async function syncProgress() {
  try {
    console.log('Syncing progress...');
    
    // Get progress from IndexedDB
    const progress = await getProgressFromIndexedDB();
    
    for (const progressItem of progress) {
      try {
        await fetch(`/api/user/progress/${progressItem.userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(progressItem)
        });
        
        console.log('Progress synced for user:', progressItem.userId);
        
      } catch (error) {
        console.error('Failed to sync progress:', progressItem.userId, error);
      }
    }
    
  } catch (error) {
    console.error('Error syncing progress:', error);
  }
}

// Helper function to get conversations from IndexedDB
async function getConversationsFromIndexedDB() {
  // This would be implemented to read from IndexedDB
  // For now, return empty array
  return [];
}

// Helper function to get progress from IndexedDB
async function getProgressFromIndexedDB() {
  // This would be implemented to read from IndexedDB
  // For now, return empty array
  return [];
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: 'You have a new lesson available!',
    icon: '/logo192.png',
    badge: '/logo192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Start Learning',
        icon: '/logo192.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/logo192.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Nabha Shiksha-AI', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/tutor')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll(event.data.urls);
        })
    );
  }
});

console.log('Service Worker loaded successfully');
