"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Wizard from "@/components/Wizard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Wizard />
      </main>
      <Footer />
    </div>
  );
}
