"use client";

import { signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import type { Session } from "next-auth";

interface UserDropdownProps {
  session: Session;
}

export default function UserDropdown({ session }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      setIsSigningOut(true);
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error("Sign out error:", err);
      setIsSigningOut(false);
      // Reopen dropdown to show error state if needed
      setIsOpen(true);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const getInitials = (name?: string | null, email?: string | null) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const displayName =
    session.user?.name || session.user?.email?.split("@")[0] || "User";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border-2 border-slate-800 hover:border-orange-500 bg-slate-900 hover:bg-slate-950 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 border-2 border-orange-500 bg-black flex items-center justify-center text-sm font-bold text-orange-500">
          {getInitials(session.user?.name, session.user?.email)}
        </div>
        <span className="hidden sm:block text-sm font-semibold text-white uppercase tracking-wide">
          {displayName}
        </span>
        <svg
          className={`w-4 h-4 transition-transform text-orange-500 ${
            isOpen ? "rotate-180" : ""
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

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-black border-2 border-orange-500 shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
          <div className="p-3 border-b-2 border-slate-900">
            <p className="text-sm font-bold text-white truncate uppercase tracking-wide">
              {session.user?.name || "User"}
            </p>
            <p className="text-xs text-slate-400 truncate mt-1">
              {session.user?.email}
            </p>
          </div>
          <div className="p-1">
            <button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full text-left px-3 py-2 text-sm text-orange-500 hover:bg-orange-500 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 focus:outline-none focus:bg-orange-500 focus:text-black font-semibold uppercase tracking-wide flex items-center gap-2"
            >
              {isSigningOut ? (
                <>
                  <div className="w-3 h-3 border-2 border-orange-500 border-t-transparent animate-spin" />
                  <span>Signing out...</span>
                </>
              ) : (
                "Sign Out"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
