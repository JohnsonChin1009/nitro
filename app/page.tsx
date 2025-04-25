"use client";

import PrivyButton from "@/components/custom/PrivyButton";
import AboutSection from "@/components/landingpagesections/AboutUsSection";
import CallToAction from "@/components/landingpagesections/CallToAction";
import FeatureSection from "@/components/landingpagesections/FeaturesSection";
import Hero from "@/components/landingpagesections/HeroSection";
import LandingFooter from "@/components/landingpagesections/LandingFooter";
import LandingHeader from "@/components/landingpagesections/LandingHeader";

export default function LandingPage() {
  return (
    <main>
      {/* Header */}
      <LandingHeader/>
      {/* Hero Section */}
      <Hero/>
      <section>
        <PrivyButton />
      </section>
      { /* What is Nitro? */}
      <AboutSection/>
      {/* Features of Nitro */}
      <FeatureSection/>
      <CallToAction/>
          {/* Footer */}
      <LandingFooter/>
    </main>
  )
}