const API_BASE = import.meta.env.VITE_SYNC_API_URL || null;
const LOCAL_PREFIX = "lingo:";

function localKey(key, shared) {
  return `${LOCAL_PREFIX}${shared ? "shared:" : "personal:"}${key}`;
}

async function localGet(key, shared) {
  const raw = window.localStorage.getItem(localKey(key, shared));
  if (raw === null) throw new Error("not found");
  return { key, value: raw, shared: !!shared };
}

async function localSet(key, value, shared) {
  window.localStorage.setItem(localKey(key, shared), value);
  return { key, value, shared: !!shared };
}

async function localDelete(key, shared) {
  window.localStorage.removeItem(localKey(key, shared));
  return { key, deleted: true, shared: !!shared };
}

async function localList(prefix, shared) {
  const full = LOCAL_PREFIX + (shared ? "shared:" : "personal:") + (prefix || "");
  const keys = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(full)) {
      keys.push(k.slice((LOCAL_PREFIX + (shared ? "shared:" : "personal:")).length));
    }
  }
  return { keys, prefix: prefix || undefined, shared: !!shared };
}

async function remoteGet(key, shared) {
  const res = await fetch(`${API_BASE}/kv/${encodeURIComponent(key)}?shared=${shared}`);
  if (!res.ok) throw new Error("not found");
  return res.json();
}
async function remoteSet(key, value, shared) {
  const res = await fetch(`${API_BASE}/kv/${encodeURIComponent(key)}?shared=${shared}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error("write failed");
  return res.json();
}
async function remoteDelete(key, shared) {
  const res = await fetch(`${API_BASE}/kv/${encodeURIComponent(key)}?shared=${shared}`, { method: "DELETE" });
  if (!res.ok) throw new Error("delete failed");
  return res.json();
}
async function remoteList(prefix, shared) {
  const res = await fetch(`${API_BASE}/kv?prefix=${encodeURIComponent(prefix || "")}&shared=${shared}`);
  if (!res.ok) throw new Error("list failed");
  return res.json();
}

if (typeof window !== "undefined" && !window.storage) {
  window.storage = {
    get: (key, shared) => (API_BASE ? remoteGet(key, shared) : localGet(key, shared)),
    set: (key, value, shared) => (API_BASE ? remoteSet(key, value, shared) : localSet(key, value, shared)),
    delete: (key, shared) => (API_BASE ? remoteDelete(key, shared) : localDelete(key, shared)),
    list: (prefix, shared) => (API_BASE ? remoteList(prefix, shared) : localList(prefix, shared)),
  };
}
