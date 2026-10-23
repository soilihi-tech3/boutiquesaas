// Browser IndexedDB and LocalStorage Manager for Offline Mode & Auto Sync

const DB_NAME = "MarchVertOfflineDB";
const DB_VERSION = 1;
const CACHE_STORE = "api_cache";
const QUEUE_STORE = "sync_queue";

function openDB() {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB not supported"));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        db.createObjectStore(CACHE_STORE);
      }
      if (!db.objectStoreNames.contains(QUEUE_STORE)) {
        db.createObjectStore(QUEUE_STORE, { keyPath: "id" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// ---- API DATA CACHING ----
export async function saveCache(key, data) {
  try {
    const db = await openDB();
    const tx = db.transaction(CACHE_STORE, "readwrite");
    tx.objectStore(CACHE_STORE).put(data, key);
    return true;
  } catch (e) {
    try {
      localStorage.setItem(`offline_cache_${key}`, JSON.stringify(data));
    } catch (err) {}
    return false;
  }
}

export async function getCache(key) {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(CACHE_STORE, "readonly");
      const req = tx.objectStore(CACHE_STORE).get(key);
      req.onsuccess = () => {
        if (req.result !== undefined) {
          resolve(req.result);
        } else {
          const fallback = localStorage.getItem(`offline_cache_${key}`);
          resolve(fallback ? JSON.parse(fallback) : null);
        }
      };
      req.onerror = () => {
        const fallback = localStorage.getItem(`offline_cache_${key}`);
        resolve(fallback ? JSON.parse(fallback) : null);
      };
    });
  } catch (e) {
    const fallback = localStorage.getItem(`offline_cache_${key}`);
    return fallback ? JSON.parse(fallback) : null;
  }
}

// ---- QUEUE MANAGEMENT FOR MUTATIONS (POST/PUT/DELETE) ----
export async function enqueueAction(action) {
  const item = {
    id: `action_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: Date.now(),
    ...action
  };
  try {
    const db = await openDB();
    const tx = db.transaction(QUEUE_STORE, "readwrite");
    tx.objectStore(QUEUE_STORE).put(item);
  } catch (e) {
    const queue = JSON.parse(localStorage.getItem("offline_sync_queue") || "[]");
    queue.push(item);
    localStorage.setItem("offline_sync_queue", JSON.stringify(queue));
  }
  return item;
}

export async function getPendingActions() {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(QUEUE_STORE, "readonly");
      const req = tx.objectStore(QUEUE_STORE).getAll();
      req.onsuccess = () => {
        const dbItems = req.result || [];
        const localItems = JSON.parse(localStorage.getItem("offline_sync_queue") || "[]");
        const all = [...dbItems, ...localItems];
        // Deduplicate by id
        const unique = Array.from(new Map(all.map(i => [i.id, i])).values());
        resolve(unique.sort((a, b) => a.timestamp - b.timestamp));
      };
      req.onerror = () => {
        const localItems = JSON.parse(localStorage.getItem("offline_sync_queue") || "[]");
        resolve(localItems);
      };
    });
  } catch (e) {
    const localItems = JSON.parse(localStorage.getItem("offline_sync_queue") || "[]");
    return localItems;
  }
}

export async function removeAction(id) {
  try {
    const db = await openDB();
    const tx = db.transaction(QUEUE_STORE, "readwrite");
    tx.objectStore(QUEUE_STORE).delete(id);
  } catch (e) {}
  try {
    const queue = JSON.parse(localStorage.getItem("offline_sync_queue") || "[]");
    const filtered = queue.filter(item => item.id !== id);
    localStorage.setItem("offline_sync_queue", JSON.stringify(filtered));
  } catch (e) {}
}

export async function clearQueue() {
  try {
    const db = await openDB();
    const tx = db.transaction(QUEUE_STORE, "readwrite");
    tx.objectStore(QUEUE_STORE).clear();
  } catch (e) {}
  localStorage.removeItem("offline_sync_queue");
}
