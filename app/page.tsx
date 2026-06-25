"use client";

import React, { useState } from 'react';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import LocationInfo from "@/components/LocationInfo";
import About from "@/components/About";
import Services from "@/components/Services";

import Reviews from "@/components/Reviews";
import Social from "@/components/Social";
import FAQ from "@/components/FAQ";
import BlogPreview from "@/components/BlogPreview";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import BookingWidget from "@/components/BookingWidget";
export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-dark">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Hero />
      <LocationInfo />
      <Services />
      <About />
      <Reviews />
      {/* Works photos merged into About section */}
      <Social />
      <FAQ />
      <BlogPreview />
      <MapSection />
      <Footer />
      <BookingWidget />
    </main>
  );
}
