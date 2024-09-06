'use client';

import React from 'react';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ContactForm() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <Input placeholder="Your Name" required />
      <Input type="email" placeholder="Your Email" required />
      <Textarea placeholder="Your Message" required />
      <Button type="submit">Send Message</Button>
    </form>
  );
}