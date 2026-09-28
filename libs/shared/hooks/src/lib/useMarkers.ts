// libs/shared/hooks/src/lib/useMarkers.ts
import { useEffect, useState } from "react";

export interface Marker {
  id: number;
  name: string;
  position: google.maps.LatLngLiteral;
}

export const useMarkers = (url: string) => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Prevent execution if URL is empty
    if (!url) return;

    // 2. AbortController to cancel pending requests on unmount/re-run
    const controller = new AbortController();
    const { signal } = controller;

    const fetchMarkers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, { signal });

        // Check for common 404/500 errors
        if (!response.ok) {
          throw new Error(`Server Error: ${response.status} (${response.statusText})`);
        }

        // Validate JSON content type to avoid the "Unexpected token < in JSON" (HTML) error
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops! The server didn't send JSON. Is your Backend URL correct?");
        }

        const data: Marker[] = await response.json();
        setMarkers(data);
      } catch (err: any) {
        // Only update state if the error wasn't caused by a manual abort
        if (err.name !== "AbortError") {
          console.error("Marker Fetch Error:", err.message);
          setError(err.message);
        }
      } finally {
        // Check if the request was aborted before updating loading state
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchMarkers();

    // 3. Cleanup function: Aborts the fetch if the component unmounts
    return () => {
      controller.abort();
    };
  }, [url]); // Re-runs only when the URL changes

  return { markers, loading, error };
};