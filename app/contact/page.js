"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Textarea } from "@nextui-org/react";
import { Card, CardBody } from "@nextui-org/react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form submitted:", formData);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        console.error("Error submitting form:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 p-6"
    >
      <Card className="w-full max-w-4xl shadow-lg rounded-lg overflow-hidden">
        <CardBody className="p-8 bg-white">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="font-bold text-2xl text-gray-700"
          >
            Contact Us
          </motion.h2>
          <p className="text-gray-500 text-sm mb-6">We'd love to hear from you! Fill out the form below to send us a message.</p>
          <form onSubmit={handleSubmit}>
            <motion.div 
              initial={{ opacity: 0, x: -30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-4"
            >
              <Input
                id="name"
                label="Name"
                placeholder="Your Name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 30 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-4"
            >
              <Input
                id="email"
                label="Email Address"
                placeholder="yourname@example.com"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-4"
            >
              <Textarea
                id="message"
                label="Message"
                placeholder="Write your message here..."
                value={formData.message}
                onChange={handleInputChange}
                className="h-32"
                required
              />
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="mt-4"
            >
              <Button
                className="w-full bg-blue-600 text-white hover:bg-blue-700 transition duration-300"
                type="submit"
              >
                Send Message
              </Button>
            </motion.div>
          </form>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default ContactForm;