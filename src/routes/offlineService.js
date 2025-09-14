// Offline Service for Nabha Shiksha-AI
// Handles offline functionality, data caching, and synchronization

class OfflineService {
  constructor() {
    this.dbName = 'NabhaShikshaAI';
    this.dbVersion = 1;
    this.db = null;
    this.isOnline = navigator.onLine;
    this.syncQueue = [];
    
    this.initializeDB();
    this.setupEventListeners();
  }

  // Initialize IndexedDB for offline storage
  async initializeDB() {
    try {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => {
        console.error('Failed to open IndexedDB');
      };
      
      request.onsuccess = (event) => {
        this.db = event.target.result;
        console.log('IndexedDB initialized successfully');
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('lessons')) {
          const lessonsStore = db.createObjectStore('lessons', { keyPath: 'id' });
          lessonsStore.createIndex('topic', 'topic', { unique: false });
          lessonsStore.createIndex('level', 'level', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('conversations')) {
          const conversationsStore = db.createObjectStore('conversations', { keyPath: 'id', autoIncrement: true });
          conversationsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'userId' });
        }
        
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
          syncStore.createIndex('type', 'type', { unique: false });
        }
      };
      
    } catch (error) {
      console.error('Error initializing IndexedDB:', error);
    }
  }

  // Set up event listeners for online/offline status
  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.syncPendingData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }

  // Store lesson data offline
  async storeLesson(lessonData) {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['lessons'], 'readwrite');
      const store = transaction.objectStore('lessons');
      
      const lesson = {
        id: lessonData.id || Date.now().toString(),
        ...lessonData,
        storedAt: new Date().toISOString(),
        isOffline: true
      };
      
      await store.put(lesson);
      console.log('Lesson stored offline:', lesson.id);
      
    } catch (error) {
      console.error('Error storing lesson offline:', error);
      throw error;
    }
  }

  // Get lesson data from offline storage
  async getLesson(lessonId) {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['lessons'], 'readonly');
      const store = transaction.objectStore('lessons');
      
      return new Promise((resolve, reject) => {
        const request = store.get(lessonId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
    } catch (error) {
      console.error('Error getting lesson from offline storage:', error);
      return null;
    }
  }

  // Get all lessons from offline storage
  async getAllLessons() {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['lessons'], 'readonly');
      const store = transaction.objectStore('lessons');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
    } catch (error) {
      console.error('Error getting all lessons from offline storage:', error);
      return [];
    }
  }

  // Store conversation offline
  async storeConversation(conversationData) {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['conversations'], 'readwrite');
      const store = transaction.objectStore('conversations');
      
      const conversation = {
        ...conversationData,
        timestamp: new Date().toISOString(),
        isOffline: true
      };
      
      await store.add(conversation);
      console.log('Conversation stored offline');
      
    } catch (error) {
      console.error('Error storing conversation offline:', error);
      throw error;
    }
  }

  // Get conversations from offline storage
  async getConversations(limit = 50) {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['conversations'], 'readonly');
      const store = transaction.objectStore('conversations');
      const index = store.index('timestamp');
      
      return new Promise((resolve, reject) => {
        const request = index.getAll(null, limit);
        request.onsuccess = () => resolve(request.result.reverse());
        request.onerror = () => reject(request.error);
      });
      
    } catch (error) {
      console.error('Error getting conversations from offline storage:', error);
      return [];
    }
  }

  // Store user progress offline
  async storeProgress(userId, progressData) {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['progress'], 'readwrite');
      const store = transaction.objectStore('progress');
      
      const progress = {
        userId,
        ...progressData,
        updatedAt: new Date().toISOString(),
        isOffline: true
      };
      
      await store.put(progress);
      console.log('Progress stored offline for user:', userId);
      
    } catch (error) {
      console.error('Error storing progress offline:', error);
      throw error;
    }
  }

  // Get user progress from offline storage
  async getProgress(userId) {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      
      return new Promise((resolve, reject) => {
        const request = store.get(userId);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
    } catch (error) {
      console.error('Error getting progress from offline storage:', error);
      return null;
    }
  }

  // Add item to sync queue
  async addToSyncQueue(item) {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      
      const syncItem = {
        ...item,
        createdAt: new Date().toISOString(),
        retryCount: 0
      };
      
      await store.add(syncItem);
      console.log('Item added to sync queue');
      
    } catch (error) {
      console.error('Error adding item to sync queue:', error);
      throw error;
    }
  }

  // Sync pending data when online
  async syncPendingData() {
    if (!this.isOnline) {
      console.log('Not online, skipping sync');
      return;
    }

    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const transaction = this.db.transaction(['syncQueue'], 'readwrite');
      const store = transaction.objectStore('syncQueue');
      
      const request = store.getAll();
      request.onsuccess = async () => {
        const items = request.result;
        console.log(`Syncing ${items.length} pending items`);
        
        for (const item of items) {
          try {
            await this.syncItem(item);
            await store.delete(item.id);
            console.log('Synced item:', item.id);
          } catch (error) {
            console.error('Failed to sync item:', item.id, error);
            // Increment retry count
            item.retryCount = (item.retryCount || 0) + 1;
            if (item.retryCount < 3) {
              await store.put(item);
            } else {
              await store.delete(item.id);
              console.log('Max retries reached, removing item:', item.id);
            }
          }
        }
      };
      
    } catch (error) {
      console.error('Error syncing pending data:', error);
    }
  }

  // Sync individual item
  async syncItem(item) {
    try {
      const response = await fetch(`/api/${item.type}`, {
        method: item.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item.data)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('Error syncing item:', error);
      throw error;
    }
  }

  // Check if data is available offline
  async isDataAvailableOffline(dataType, identifier) {
    try {
      if (!this.db) {
        return false;
      }

      const transaction = this.db.transaction([dataType], 'readonly');
      const store = transaction.objectStore(dataType);
      
      return new Promise((resolve, reject) => {
        const request = store.get(identifier);
        request.onsuccess = () => resolve(!!request.result);
        request.onerror = () => reject(request.error);
      });
      
    } catch (error) {
      console.error('Error checking offline data availability:', error);
      return false;
    }
  }

  // Get offline storage statistics
  async getStorageStats() {
    try {
      if (!this.db) {
        return null;
      }

      const stats = {};
      const storeNames = ['lessons', 'conversations', 'progress', 'syncQueue'];
      
      for (const storeName of storeNames) {
        const transaction = this.db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        
        stats[storeName] = await new Promise((resolve, reject) => {
          const request = store.count();
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      }
      
      return stats;
      
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return null;
    }
  }

  // Clear all offline data
  async clearAllData() {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const storeNames = ['lessons', 'conversations', 'progress', 'syncQueue'];
      
      for (const storeName of storeNames) {
        const transaction = this.db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await store.clear();
      }
      
      console.log('All offline data cleared');
      
    } catch (error) {
      console.error('Error clearing offline data:', error);
      throw error;
    }
  }

  // Check if online
  isOnlineStatus() {
    return this.isOnline;
  }

  // Get sync queue length
  async getSyncQueueLength() {
    try {
      if (!this.db) {
        return 0;
      }

      const transaction = this.db.transaction(['syncQueue'], 'readonly');
      const store = transaction.objectStore('syncQueue');
      
      return new Promise((resolve, reject) => {
        const request = store.count();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      
    } catch (error) {
      console.error('Error getting sync queue length:', error);
      return 0;
    }
  }
}

// Create singleton instance
const offlineService = new OfflineService();

export default offlineService;
