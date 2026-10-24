/**
 * Namma Kannada - Custom Hooks
 * Reusable React hooks for auth, geolocation, offline sync, and audio.
 */

import { useEffect, useCallback, useRef, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { api } from "@/lib/api";
import { useAuthStore, useOfflineStore } from "@/store";

// ─── Firebase Auth Hook ─────────────────────────────────────────────────────

export function useFirebaseAuth() {
  const { setUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const result = await api.loginWithFirebaseToken(idToken);
          setToken(result.access_token);
          setUser({
            uid: firebaseUser.uid,
            display_name: firebaseUser.displayName || "User",
            avatar_url: firebaseUser.photoURL || undefined,
            total_contributions: result.user?.total_contributions || 0,
            total_score: result.user?.total_score || 0,
            badges: result.user?.badges || [],
            favorite_regions: result.user?.favorite_regions || [],
            rank: result.user?.rank || 0,
            joined_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
          });
        } catch {
          // Backend might not be running — still set basic user info
          setUser({
            uid: firebaseUser.uid,
            display_name: firebaseUser.displayName || "User",
            avatar_url: firebaseUser.photoURL || undefined,
            total_contributions: 0,
            total_score: 0,
            badges: [],
            favorite_regions: [],
            rank: 0,
            joined_at: firebaseUser.metadata.creationTime || new Date().toISOString(),
          });
        }
      } else {
        setUser(null);
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setToken, setLoading]);

  const loginWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }, []);

  const logoutUser = useCallback(async () => {
    await signOut(auth);
    logout();
  }, [logout]);

  return { loginWithGoogle, logoutUser };
}

// ─── Geolocation Hook ───────────────────────────────────────────────────────

interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setIsLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  return { position, error, isLoading, requestLocation };
}

// ─── Online/Offline Detection Hook ──────────────────────────────────────────

export function useOnlineStatus() {
  const { setOnline, isOnline } = useOfflineStore();

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    setOnline(navigator.onLine);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setOnline]);

  return isOnline;
}

// ─── Offline Sync Hook ─────────────────────────────────────────────────────

export function useOfflineSync() {
  const { queue, removeFromQueue, isSyncing, setSyncing } = useOfflineStore();
  const isOnline = useOnlineStatus();

  const syncQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0 || isSyncing) return;

    setSyncing(true);
    for (const item of queue) {
      try {
        switch (item.type) {
          case "phrase":
            await api.createPhrase(item.data as any);
            break;
          case "audio":
            // Handle audio sync
            break;
          case "upvote":
            await api.upvotePhrase(item.data.phraseId as string);
            break;
        }
        removeFromQueue(item.id);
      } catch (error) {
        console.error("Sync failed for item:", item.id, error);
      }
    }
    setSyncing(false);
  }, [isOnline, queue, isSyncing, setSyncing, removeFromQueue]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      syncQueue();
    }
  }, [isOnline, syncQueue, queue.length]);

  return { syncQueue, pendingCount: queue.length, isSyncing };
}

// ─── Debounce Hook ──────────────────────────────────────────────────────────

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ─── Geo-Fenced Notification Hook ───────────────────────────────────────────

export function useGeoNotifications() {
  const [currentRegion, setCurrentRegion] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const checkRegion = useCallback((lat: number, lng: number) => {
    // Simple bounding-box check for Karnataka regions
    // In production, use proper geofencing with turf.js
    if (lat > 15.0 && lng < 76.0) return "north_karnataka";
    if (lat < 13.0 && lng > 76.0) return "south_karnataka";
    if (lng < 75.5 && lat > 12.5 && lat < 15.0) return "coastal_karnataka";
    if (lat > 16.0 && lng > 76.0) return "hyderabad_karnataka";
    if (lat > 13.5 && lat < 14.5 && lng > 75.0 && lng < 76.0) return "malnad";
    if (lat > 12.0 && lat < 12.7 && lng > 75.3 && lng < 76.0) return "kodagu";
    return "standard";
  }, []);

  const startWatching = useCallback(() => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const region = checkRegion(pos.coords.latitude, pos.coords.longitude);
        if (region !== currentRegion) {
          setCurrentRegion(region);
          // Trigger notification for new region
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("ನಮ್ಮ ಕನ್ನಡ", {
              body: `You've entered the ${region.replace("_", " ")} dialect zone!`,
              icon: "/icons/icon-192x192.png",
            });
          }
        }
      },
      undefined,
      { enableHighAccuracy: false, maximumAge: 300000 }
    );
  }, [checkRegion, currentRegion]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }
  }, []);

  useEffect(() => {
    return () => stopWatching();
  }, [stopWatching]);

  return { currentRegion, startWatching, stopWatching };
}
