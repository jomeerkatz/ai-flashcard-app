"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useUserData } from "@/lib/UserContext";

export default function DebugPanel() {
  const { data: session, status } = useSession();
  const { userData } = useUserData();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const truncateToken = (token?: string) => {
    if (!token) return "N/A";
    return `${token.substring(0, 20)}...${token.substring(token.length - 10)}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp * 1000).toLocaleString();
  };

  const parseJWT = (token?: string) => {
    if (!token) return null;
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const idTokenClaims = session?.idToken ? parseJWT(session.idToken) : null;

  return (
    <div className="border-t-2 border-slate-900 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-orange-900/20 border-2 border-orange-500/50 p-3 mb-4">
          <p className="text-orange-400 text-sm font-bold flex items-center gap-2 uppercase tracking-wide">
            <span>⚠️</span>
            <span>DEBUG MODE - Never expose tokens in production</span>
          </p>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-slate-900 border-2 border-slate-800 hover:border-orange-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
          aria-expanded={isExpanded}
        >
          <span className="text-sm font-bold text-white uppercase tracking-wide">
            Debug Information
          </span>
          <svg
            className={`w-5 h-5 text-orange-500 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            {/* Authentication Status */}
            <div className="bg-slate-900 border-2 border-slate-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Authentication Status
              </h3>
              <p className="text-sm text-slate-400">
                Status:{" "}
                <span
                  className={`font-bold ${
                    status === "authenticated"
                      ? "text-green-400"
                      : status === "loading"
                      ? "text-orange-400"
                      : "text-red-400"
                  }`}
                >
                  {status.toUpperCase()}
                </span>
              </p>
            </div>

            {/* Access Token */}
            <div className="bg-slate-900 border-2 border-slate-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Access Token
              </h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs text-slate-400 bg-black border-2 border-slate-900 p-2 font-mono break-all">
                  {truncateToken(session?.accessToken)}
                </code>
                {session?.accessToken && (
                  <button
                    onClick={() => copyToClipboard(session.accessToken!)}
                    className="px-4 py-2 text-xs bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black transition-all duration-200 font-bold uppercase tracking-wide"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                )}
              </div>
            </div>

            {/* ID Token Claims */}
            <div className="bg-slate-900 border-2 border-slate-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                ID Token Claims
              </h3>
              {idTokenClaims ? (
                <pre className="text-xs text-slate-400 bg-black border-2 border-slate-900 p-3 font-mono overflow-auto max-h-64">
                  {JSON.stringify(idTokenClaims, null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-slate-400">No ID token available</p>
              )}
            </div>

            {/* Refresh Token */}
            <div className="bg-slate-900 border-2 border-slate-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Refresh Token
              </h3>
              <p className="text-sm text-slate-400">
                Present:{" "}
                <span
                  className={`font-bold ${
                    session?.refreshToken ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {session?.refreshToken ? "Yes" : "No"}
                </span>
              </p>
            </div>

            {/* Token Expiration */}
            <div className="bg-slate-900 border-2 border-slate-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Token Expiration
              </h3>
              <p className="text-sm text-slate-400">
                Expires At:{" "}
                <span className="font-bold text-white">
                  {formatDate(session?.expiresAt)}
                </span>
              </p>
            </div>

            {/* Backend User Data */}
            <div className="bg-slate-900 border-2 border-slate-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Backend User Data
              </h3>
              {userData ? (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">
                    User ID:{" "}
                    <span className="font-bold text-white font-mono">
                      {userData.id}
                    </span>
                  </p>
                  <pre className="text-xs text-slate-400 bg-black border-2 border-slate-900 p-3 font-mono overflow-auto">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  No user data synced yet
                </p>
              )}
            </div>

            {/* Session Data */}
            <div className="bg-slate-900 border-2 border-slate-800 p-4">
              <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">
                Session Data
              </h3>
              <pre className="text-xs text-slate-400 bg-black border-2 border-slate-900 p-3 font-mono overflow-auto max-h-64">
                {JSON.stringify(
                  {
                    user: session?.user,
                    expires: session?.expires,
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
