'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, ArrowRight } from 'lucide-react';

interface EntryPageProps {
  onSubmit: (name: string, email: string) => void;
}

export function EntryPage({ onSubmit }: EntryPageProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        onSubmit(name, email);
      }, 300);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center bg-background">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: 'block' }}
        >
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20video%20-%20Made%20with%20Clipchamp%20%282%29%20%281%29%20%281%29%20%281%29-G9ojxVP2S8CAX8WNrKYUS35Qz9NkKa.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Subtle Overlay for Text Readability - Allows Video to Show Through */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-black/10 to-black/20" />

      {/* Studio Lighting Effects */}
      <div className="studio-light-top" />
      <div className="studio-light-side" />
      <div className="studio-light-bottom" />

      {/* Content Container with Transparent Box */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 space-y-8 shadow-2xl">
          {/* Hero Section */}
          <div className="text-center mb-6 space-y-6">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-2xl opacity-60 rounded-full animate-pulse" />
                <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center shadow-2xl">
                  <MapPin className="w-10 h-10 text-background" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Wanderlust Planner
                </span>
              </h1>
              <p className="text-lg text-muted-foreground/80">
                Your AI-powered travel companion
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground text-sm">
              Enter your details to start planning your perfect trip
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="premium-input w-full outline-none"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@gmail.com"
                  className="premium-input w-full outline-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={!name.trim() || !email.trim() || isLoading}
                className="premium-btn w-full h-12 text-primary-foreground font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground text-center">
            Your information is secure and will only be used for your travel itinerary
          </p>
        </div>
      </div>
    </div>
  );
}
