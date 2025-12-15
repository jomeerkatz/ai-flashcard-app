"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Hero from "./Hero";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages: Record<string, string> = {
        Configuration: "There is a problem with the server configuration.",
        AccessDenied: "You do not have permission to sign in.",
        Verification:
          "The verification token has expired or has already been used.",
        Default: "An error occurred during authentication. Please try again.",
      };
      setError(errorMessages[errorParam] || errorMessages.Default);

      // Clear error from URL after displaying
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [searchParams]);

  return (
    <>
      {error && (
        <div className="bg-red-900/30 border-b-2 border-red-600">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-400 font-semibold uppercase tracking-wide">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 border-2 border-transparent hover:border-red-400 p-1"
                aria-label="Dismiss error"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
      <main className="flex-1">
        <Hero />
      </main>
    </>
  );
}
