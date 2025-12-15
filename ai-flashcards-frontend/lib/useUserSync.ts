"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { syncUserToBackend } from "./api-client";
import { useUserData } from "./UserContext";

/**
 * Hook that automatically syncs the user to the backend after authentication.
 * This ensures the user exists in the database whenever they sign in or sign up.
 *
 * The sync happens when:
 * - User first authenticates
 * - Access token changes (e.g., after refresh)
 *
 * Uses a ref to track the last synced token to avoid duplicate calls for the same token.
 */
export function useUserSync() {
  const { data: session, status } = useSession();
  const { setUserData } = useUserData();
  const lastSyncedTokenRef = useRef<string | null>(null);
  const isSyncingRef = useRef(false);

  useEffect(() => {
    // Only sync when:
    // 1. Session is authenticated
    // 2. Access token is available
    // 3. We haven't already synced this specific token
    // 4. We're not currently syncing
    if (
      status === "authenticated" &&
      session?.accessToken &&
      lastSyncedTokenRef.current !== session.accessToken &&
      !isSyncingRef.current
    ) {
      isSyncingRef.current = true;
      const currentToken = session.accessToken;

      syncUserToBackend(currentToken)
        .then((userData) => {
          if (process.env.NODE_ENV === "development") {
            console.log("User synced to backend:", userData);
          }
          setUserData(userData);
          lastSyncedTokenRef.current = currentToken;
        })
        .catch((error) => {
          // Log error but don't block user experience
          console.error("Failed to sync user to backend:", error);
          // Don't update lastSyncedTokenRef on error, so we can retry with the same token
        })
        .finally(() => {
          isSyncingRef.current = false;
        });
    }

    // Reset sync state when user signs out
    if (status === "unauthenticated") {
      lastSyncedTokenRef.current = null;
      isSyncingRef.current = false;
      setUserData(null);
    }
  }, [status, session?.accessToken]);
}
