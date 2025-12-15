import { UserDto } from "@/types/user";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Syncs the user to the backend by creating or finding the user in the database.
 * @param accessToken - The JWT access token from Keycloak
 * @returns The user data from the backend, or null if the request failed
 * @throws {ApiError} If the request fails with a non-2xx status
 */
export async function syncUserToBackend(
  accessToken: string
): Promise<UserDto | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const error: ApiError = {
        message: `Failed to sync user: ${response.statusText}`,
        status: response.status,
      };

      // Handle specific error cases
      if (response.status === 401) {
        error.message = "Authentication failed. Please sign in again.";
      } else if (response.status >= 500) {
        error.message = "Server error. Please try again later.";
      }

      throw error;
    }

    const userData: UserDto = await response.json();
    return userData;
  } catch (error) {
    // Re-throw ApiError as-is
    if (error && typeof error === "object" && "message" in error) {
      throw error;
    }

    // Handle network errors
    const networkError: ApiError = {
      message:
        error instanceof Error
          ? `Network error: ${error.message}`
          : "Network error: Failed to connect to backend",
    };
    throw networkError;
  }
}
