// src/lib/basic/preferenceStore.ts
// Lightweight in-memory session preference store.
// Tracks user preferences that affect engine output.
// Phase 2: migrate to Supabase per-user storage.

// -------------------------
// Preference shape
// -------------------------

export interface UserPreferences {
  allowVideo: boolean;
}

// -------------------------
// Preference key type
// -------------------------

export type PreferenceKey = keyof UserPreferences;

// -------------------------
// Default preferences
// -------------------------

const DEFAULT_PREFERENCES: UserPreferences = {
  allowVideo: true,
};

// -------------------------
// In-memory store
// Resets on serverless cold start.
// Phase 2: replace with per-user DB row.
// -------------------------

let store: UserPreferences = { ...DEFAULT_PREFERENCES };

// -------------------------
// Get all preferences
// -------------------------

export function getPreferences(): UserPreferences {
  return { ...store };
}

// -------------------------
// Set a preference value
// -------------------------

export function setPreference(
  key: PreferenceKey,
  value: UserPreferences[PreferenceKey]
): void {
  store = { ...store, [key]: value };
  console.log(`[NIRA PREFERENCES] ${key} set to ${value}`);
}

// -------------------------
// Reset all preferences
// to defaults
// -------------------------

export function resetPreferences(): void {
  store = { ...DEFAULT_PREFERENCES };
  console.log("[NIRA PREFERENCES] Reset to defaults");
}
