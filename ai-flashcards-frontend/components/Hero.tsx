"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </section>
    );
  }

  if (session) {
    const displayName =
      session.user?.name || session.user?.email?.split("@")[0] || "there";

    return (
      <section className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
            Welcome back, {displayName}!
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-8">
            Ready to continue your learning journey?
          </p>
          <button
            onClick={() => router.push("/folders")}
            className="px-10 py-4 bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black font-bold text-lg uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
            aria-label="View folders"
          >
            View Folders
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 flex items-center justify-center py-20 px-4">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
          Master Your Learning with
          <span className="text-orange-500"> AI Flashcards</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          Create intelligent flashcards powered by AI, study smarter, and
          accelerate your learning journey. Transform any topic into memorable
          study materials.
        </p>
        <button
          className="px-10 py-4 bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-black font-bold text-lg uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
          aria-label="Get started (placeholder)"
        >
          Get Started
        </button>
      </div>
    </section>
  );
}
