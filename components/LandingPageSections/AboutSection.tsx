import React from "react";
import { AnimatedBeam } from "../magicui/animated-beam";
import { ThreeDMarquee } from "../aceternityui/3d-marquee";
import { image, img } from "framer-motion/client";

const AboutSection = () => {
  const images = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
    "https://assets.aceternity.com/animated-testimonials.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Tooltip_luwy44.png",
    "https://assets.aceternity.com/github-globe.png",
    "https://assets.aceternity.com/glare-card.png",
    "https://assets.aceternity.com/layout-grid.png",
    "https://assets.aceternity.com/flip-text.png",
    "https://assets.aceternity.com/hero-highlight.png",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "https://assets.aceternity.com/shooting-stars-and-stars-background.png",
    "https://assets.aceternity.com/signup-form.png",
    "https://assets.aceternity.com/cloudinary_bkp/stars_sxle3d.png",
    "https://assets.aceternity.com/spotlight-new.webp",
    "https://assets.aceternity.com/cloudinary_bkp/Spotlight_ar5jpr.png",
    "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    "https://assets.aceternity.com/tabs.png",
    "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    "https://assets.aceternity.com/cloudinary_bkp/typewriter-effect.png",
    "https://assets.aceternity.com/glowing-effect.webp",
    "https://assets.aceternity.com/hover-border-gradient.png",
    "https://assets.aceternity.com/cloudinary_bkp/Infinite_Moving_Cards_evhzur.png",
    "https://assets.aceternity.com/cloudinary_bkp/Lamp_hlq3ln.png",
    "https://assets.aceternity.com/macbook-scroll.png",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "https://assets.aceternity.com/multi-step-loader.png",
    "https://assets.aceternity.com/vortex.png",
    "https://assets.aceternity.com/wobble-card.png",
    "https://assets.aceternity.com/world-map.webp",
  ];
  return (
    <section className="min-h-[850px] bg-gradient-to-b from-[#FFFFFF] to-[#b8c4f0] py-24 overflow-x-clip">
      <div className="px-5 py-2">
        {/*About Us Description*/}
        <div className="max-w-[850px] mx-auto">
          <div className="flex  justify-center">
            <div className="tag">Enhance Your Financial Wellness</div>
          </div>
          <div className="mt-3 flex flex-col justify-center items-center mb-5">
            <h2 className="text-center text-3xl md:text-[54px] md:leading-[60px] font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] text-transparent bg-clip-text mt-5">
              {" "}
              An AI-Driven Decentralized <br /> Peer to Peer Microloan Ecosystem
            </h2>
            <p className="text-center text-[22px] leading-[30px] tracking-tight text-[#010D3E] mt-5">
              A comprehensive platform built to enable lenders to stake in loan
              pools for passive income, while providing borrowers with seamless
              access to DeFi-powered microloans for personal or business needs.
            </p>
          </div>
        
        </div>
        <div className="flex justify-between items-center max-w-[1200px] mx-auto mt-5">

       
        <div className="mt-5 max-w-[1200px] ">
            <ThreeDMarquee images={images} />
          </div>
          </div>
      </div>
    </section>
  );
};

export default AboutSection;
