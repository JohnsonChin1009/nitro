"use client";

import PrivyButton from "@/components/custom/PrivyButton";
import AboutSection from "@/components/LandingPageSections/AboutSection";
import Benefits from "@/components/LandingPageSections/Benefits";
import CallToAction from "@/components/LandingPageSections/CallToActionSection";
import FeatureSection from "@/components/LandingPageSections/FeatureSection";
import Hero from "@/components/LandingPageSections/HeroSection";


export default function LandingPage() {
  return (
    
    <main>
       {/* Hero Section */}
      <Hero/>
      <section>
        {/* <PrivyButton /> */}
      </section>

      { /* What is Nitro? */}
      <AboutSection/>
      {/* Features of Nitro */}
      <FeatureSection/>
      { /* Why Nitro? */}
      <Benefits/>
      <CallToAction/>
      {/* Footer */}
    </main>
  )
}