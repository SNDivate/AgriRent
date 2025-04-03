"use client";

import React from "react";
import { motion } from "framer-motion";
import Footer from "@/app/components/footer";
import Nav from "../components/navbar";

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Nav/>
      {/* Hero Section */}
      <div className="py-20 lg:py-24 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-600 leading-tight mb-4">
            About AgriRent
          </h1>
          <p className="text-lg text-gray-600">
            AgriRent is a platform dedicated to connecting farmers and agricultural businesses with reliable, affordable equipment rental options. We aim to simplify access to essential farming tools, ensuring optimal productivity.
          </p>
        </div>
      </div>

      {/* Mission, Vision, and Values Section */}
      <div className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-8">
            Our Mission, Vision, and Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div className="bg-gray-50 p-6 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Mission</h3>
              <p className="text-gray-700">
                To empower farmers by offering an easy-to-use platform for renting essential equipment, ensuring that agricultural practices are optimized and sustainable.
              </p>
            </motion.div>
            <motion.div className="bg-gray-50 p-6 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Vision</h3>
              <p className="text-gray-700">
                Our vision is to revolutionize the agricultural industry by providing accessible and efficient rental solutions to farmers, promoting sustainable and profitable farming practices globally.
              </p>
            </motion.div>
            <motion.div className="bg-gray-50 p-6 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
              <h3 className="text-xl font-semibold text-green-600 mb-2">Values</h3>
              <p className="text-gray-700">
                Integrity, innovation, and inclusivity drive our mission to support farmers with seamless access to equipment.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 lg:py-20 bg-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {["Browse Equipment", "Register on AgriRent", "Login to Your Account", "Request Equipment", "Receive & Use Equipment"].map((step, index) => (
              <motion.div key={index} className="bg-white p-6 rounded-lg shadow-lg" whileHover={{ scale: 1.05 }}>
                <h3 className="text-xl font-semibold text-green-600 mb-2">Step {index + 1}</h3>
                <p className="text-gray-700">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {[{
              question: "What is AgriRent?",
              answer: "AgriRent is an online platform where farmers and agricultural businesses can rent equipment for their farming needs."
            }, {
              question: "How can I rent equipment?",
              answer: "You can browse available equipment on our website, select what you need, and complete the rental process online."
            }, {
              question: "What are the payment options?",
              answer: "We offer a variety of payment options, including credit/debit cards, online banking, and UPI transactions."
            }].map((faq, index) => (
              <details key={index} className="bg-gray-50 p-6 rounded-lg shadow-lg cursor-pointer">
                <summary className="font-semibold text-green-600 cursor-pointer">{faq.question}</summary>
                <p className="text-gray-700 mt-2">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default About;