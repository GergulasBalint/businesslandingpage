import { useState } from 'react';
import { motion } from 'framer-motion';
import Head from 'next/head';
import Calculator from '../components/Calculator';
import Hero from '../components/Hero';
import Features from '../components/Features';
import ConsultationForm from '../components/ConsultationForm';
import React from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Head>
        <title>Business Valuation - Get a Free Professional Consultation</title>
        <meta name="description" content="Get a quick estimate of your business value and schedule a free consultation with our valuation experts for an accurate assessment." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Hero />
        <Features />
        <Calculator />
        <ConsultationForm />
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-20">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Business Valuation Experts. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
