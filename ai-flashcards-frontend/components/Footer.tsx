"use client";

import { useDebugMode } from "@/lib/useDebugMode";
import DebugPanel from "./DebugPanel";

export default function Footer() {
  const { isEnabled, toggle, isAvailable } = useDebugMode();

  return (
    <footer className="mt-auto">
      {isEnabled && <DebugPanel />}
      <div className="border-t-2 border-slate-900 bg-black">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500 font-medium">
              © {new Date().getFullYear()} AI Flashcards App. All rights
              reserved.
            </div>
            {isAvailable && (
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm text-slate-400 font-semibold uppercase tracking-wide">
                  Debug Mode
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isEnabled}
                    onChange={toggle}
                    className="sr-only"
                    aria-label="Toggle debug mode"
                  />
                  <div
                    className={`w-12 h-6 border-2 transition-all duration-200 ${
                      isEnabled
                        ? "bg-orange-500 border-orange-500"
                        : "bg-black border-slate-800"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white border-2 border-slate-900 transform transition-transform duration-200 mt-0.5 ${
                        isEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
              </label>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
