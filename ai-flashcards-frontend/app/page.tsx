import { Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import HomeContent from "@/components/HomeContent";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Suspense fallback={<div className="flex-1" />}>
        <HomeContent />
      </Suspense>
      <Footer />
    </div>
  );
}
