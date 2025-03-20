"use client";
import { motion } from "framer-motion";
import React from "react";
import { ImagesSlider } from "./ui/images-slider";
import { TypewriterEffectSmooth } from "./ui/typewriter-effect";
import Link from "next/link";

export function ImagesSliderDemo() {
  const images = [
    "/slide1.jpg",
    "/slide2.jpg",
    "/slide3.jpeg"
  ];


  const words = [
    { text: "Smart " },
    { text: "Farming," },
    { text: "Easy " },
    { text: "" },
    { text: "Renting.", className: "text-blue-500 dark:text-blue-500" },
  ];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Image Slider */}
      <ImagesSlider
        className="absolute inset-0 w-full h-full object-cover"
        images={images}
      />

      {/* Overlay Content */}
      <motion.div
        initial={{ opacity: 1, y: -80 }}
        animate={{ opacity: 0.7, y: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute inset-0 z-50 flex flex-col justify-center items-center bg-black bg-opacity-20"
      >
        <motion.p className="font-bold text-6xl md:text-8xl text-center text-white py-4">
          Welcome to <br /> AgriRent..!
        </motion.p>

        <div className="flex flex-col items-center justify-center space-y-4">
          <p className="text-neutral-200 text-sm sm:text-base">
            Conecting framers..!
          </p>

          <TypewriterEffectSmooth words={words} />

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
            <Link href="/login">
              <button className="w-40 h-10 rounded-xl bg-black border text-white text-sm">
                Login
              </button>
            </Link>
            <Link href="/register">
              <button className="w-40 h-10 rounded-xl bg-white text-black border border-black text-sm">
                Register
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default ImagesSliderDemo;
