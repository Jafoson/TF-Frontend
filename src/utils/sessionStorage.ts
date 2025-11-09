'use client'

// Client-seitige Funktionen für sessionStorage
export function saveToSessionStorage(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(key, value);
  }
}

export function getFromSessionStorage(key: string): string | null {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem(key);
  }
  return null;
}
