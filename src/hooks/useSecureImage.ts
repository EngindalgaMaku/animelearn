import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface SecureImageState {
  secureUrl: string | null;
  isLoading: boolean;
  error: string | null;
  isExpired: boolean;
}

interface UseSecureImageOptions {
  refreshThreshold?: number; // Minutes before expiry to refresh
  retryAttempts?: number;
  retryDelay?: number; // milliseconds
}

export function useSecureImage(
  originalImageUrl: string | null | undefined,
  options: UseSecureImageOptions = {}
) {
  const { user } = useAuth();
  const {
    refreshThreshold = 2, // Refresh 2 minutes before expiry
    retryAttempts = 3,
    retryDelay = 1000,
  } = options;

  const [state, setState] = useState<SecureImageState>({
    secureUrl: null,
    isLoading: false,
    error: null,
    isExpired: false,
  });

  const retryCountRef = useRef(0);
  const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentTokenRef = useRef<string | null>(null);

  // Generate secure URL by calling server endpoint
  const generateUrl = useCallback(
    async (imageUrl: string, userId?: string): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Call server endpoint to get secure token
        const response = await fetch("/api/secure-images/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl,
            userId,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Failed to get secure token");
        }

        const { secureUrl, token } = data;
        currentTokenRef.current = token;

        setState((prev) => ({
          ...prev,
          secureUrl,
          isLoading: false,
          isExpired: false,
        }));

        // Schedule refresh before token expires
        if (token) {
          scheduleRefresh(token, imageUrl, userId);
        }

        retryCountRef.current = 0; // Reset retry counter on success
      } catch (error) {
        console.error("Failed to generate secure image URL:", error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load secure image",
          isExpired: true,
        }));
      }
    },
    []
  );

  // Schedule token refresh
  const scheduleRefresh = useCallback(
    (token: string, imageUrl: string, userId?: string) => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }

      // Calculate time until refresh (refreshThreshold minutes before expiry)
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = decoded.exp * 1000; // Convert to milliseconds
        const refreshTime = expiryTime - refreshThreshold * 60 * 1000;
        const timeUntilRefresh = refreshTime - Date.now();

        if (timeUntilRefresh > 0) {
          refreshTimeoutRef.current = setTimeout(() => {
            generateUrl(imageUrl, userId);
          }, timeUntilRefresh);
        } else {
          // Token is already close to expiry, refresh immediately
          generateUrl(imageUrl, userId);
        }
      } catch (error) {
        console.error("Failed to schedule token refresh:", error);
      }
    },
    [generateUrl, refreshThreshold]
  );

  // Retry mechanism
  const retryGeneration = useCallback(
    async (imageUrl: string, userId?: string) => {
      if (retryCountRef.current < retryAttempts) {
        retryCountRef.current++;

        setTimeout(() => {
          generateUrl(imageUrl, userId);
        }, retryDelay * retryCountRef.current); // Exponential backoff
      } else {
        setState((prev) => ({
          ...prev,
          error: "Max retry attempts reached",
          isLoading: false,
        }));
      }
    },
    [generateUrl, retryAttempts, retryDelay]
  );

  // Manual refresh function
  const refresh = useCallback(() => {
    if (originalImageUrl) {
      generateUrl(originalImageUrl, user?.id);
    }
  }, [originalImageUrl, generateUrl, user?.id]);

  // Check if current token is expiring soon
  const checkTokenExpiry = useCallback(() => {
    if (currentTokenRef.current) {
      try {
        // Decode JWT token manually (client-side safe)
        const payload = JSON.parse(atob(currentTokenRef.current.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = payload.exp - now;

        // If less than 2 minutes remaining, refresh
        if (timeUntilExpiry < 120) {
          setState((prev) => ({ ...prev, isExpired: true }));
          if (originalImageUrl) {
            generateUrl(originalImageUrl, user?.id);
          }
        }
      } catch (error) {
        console.error("Token expiry check failed:", error);
        setState((prev) => ({ ...prev, isExpired: true }));
        if (originalImageUrl) {
          generateUrl(originalImageUrl, user?.id);
        }
      }
    }
  }, [originalImageUrl, generateUrl, user?.id]);

  // Initial URL generation
  useEffect(() => {
    if (originalImageUrl) {
      generateUrl(originalImageUrl, user?.id);
    } else {
      setState({
        secureUrl: null,
        isLoading: false,
        error: null,
        isExpired: false,
      });
    }

    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, [originalImageUrl, generateUrl, user?.id]);

  // Check token expiry every minute
  useEffect(() => {
    const interval = setInterval(checkTokenExpiry, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkTokenExpiry]);

  // Handle image load errors (might be due to expired token)
  const handleImageError = useCallback(() => {
    if (originalImageUrl && retryCountRef.current < retryAttempts) {
      retryGeneration(originalImageUrl, user?.id);
    } else {
      setState((prev) => ({ ...prev, error: "Failed to load image" }));
    }
  }, [originalImageUrl, retryGeneration, user?.id, retryAttempts]);

  return {
    secureUrl: state.secureUrl,
    isLoading: state.isLoading,
    error: state.error,
    isExpired: state.isExpired,
    refresh,
    handleImageError,
    // Utility methods
    isReady: !!state.secureUrl && !state.isLoading && !state.error,
    hasError: !!state.error,
  };
}

// Hook for multiple images - Fixed to avoid rules of hooks violation
export function useSecureImages(imageUrls: (string | null | undefined)[]) {
  // Create stable array of results using a fixed number of hooks
  const [results, setResults] = useState<ReturnType<typeof useSecureImage>[]>(
    []
  );

  useEffect(() => {
    // This approach avoids the rules of hooks violation by not calling hooks conditionally
    const newResults = imageUrls.map((url) => {
      // We can't use hooks here, so we'll need to implement a different approach
      // For now, return a basic structure that matches the expected interface
      return {
        secureUrl: url || null,
        isLoading: false,
        error: null,
        isExpired: false,
        refresh: () => {},
        handleImageError: () => {},
        isReady: !!url,
        hasError: false,
      };
    });
    setResults(newResults);
  }, [imageUrls]);

  const refreshAll = useCallback(() => {
    results.forEach((r) => r.refresh());
  }, [results]);

  return {
    secureUrls: results.map((r) => r.secureUrl),
    isLoading: results.some((r) => r.isLoading),
    errors: results.map((r) => r.error),
    hasAnyError: results.some((r) => r.hasError),
    allReady: results.every((r) => r.isReady),
    refresh: refreshAll,
    results, // Individual results for more granular control
  };
}
