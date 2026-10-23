// Stale-while-revalidate cache: lecture SYNCHRONE pour un affichage instantané.
// Les clés sont préfixées par l'utilisateur pour éviter toute fuite de données entre comptes.
const mem = new Map();
const PREFIX = "swr:";

function scopedKey(key) {
  let uid = "anon";
  try {
    const u = JSON.parse(localStorage.getItem("cached_user") || "null");
    if (u?.id) uid = u.id;
  } catch {}
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  return `${PREFIX}${host}:${uid}:${key}`;
}

export function readCache(key) {
  const k = scopedKey(key);
  if (mem.has(k)) return mem.get(k);
  try {
    const raw = sessionStorage.getItem(k);
    if (raw) {
      const v = JSON.parse(raw);
      mem.set(k, v);
      return v;
    }
  } catch {}
  return undefined;
}

export function writeCache(key, data) {
  const k = scopedKey(key);
  mem.set(k, data);
  try {
    sessionStorage.setItem(k, JSON.stringify(data));
  } catch {}
}

export function clearSwrCache() {
  mem.clear();
  try {
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  } catch {}
}
