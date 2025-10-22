export function saveToStorage(key: string, value: unknown) {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (e) {
    console.error("Error Saving to Storage:", e);
  }
}

export function loadFromStorage<T = unknown>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (e) {
    console.error("Error Loading From Storage:", e);
    return null;
  }
}

export function removeFromStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error("Error Removing From Storage:", e);
  }
}
