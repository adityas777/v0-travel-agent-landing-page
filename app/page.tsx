'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Sparkles, Send, Loader2, Mic } from 'lucide-react';
import { VoiceAssistant } from '@/components/voice-assistant';
import { EntryPage } from '@/components/entry-page';

export default function Home() {
  const [hasEnteredDetails, setHasEnteredDetails] = useState(false);
  const [userName, setUserName] = useState('');
  const [useVoiceMode, setUseVoiceMode] = useState(false);
  const [departureDate, setDepartureDate] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [destination, setDestination] = useState('');
  const [activities, setActivities] = useState('');
  const [budget, setBudget] = useState('500000');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEntrySubmit = (name: string, enteredEmail: string) => {
    setUserName(name);
    setEmail(enteredEmail);
    setHasEnteredDetails(true);
  };

  const formatCurrency = (value: string) => {
    const num = parseInt(value);
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(2)} Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(2)} L`;
    } else if (num >= 1000) {
      return `₹${(num / 1000).toFixed(1)}K`;
    }
    return `₹${num}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        email,
        departureDate,
        arrivalDate,
        destination,
        activities,
        budget,
      };

      console.log('[v0] Submitting payload:', payload);

      const response = await fetch('/api/webhook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('[v0] Webhook response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('[v0] Webhook response:', result);
        setSubmitted(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('[v0] Webhook error:', response.status, errorData);
        setLoading(false);
        
        // Show user-friendly error message
        if (response.status === 404 && errorData.message?.includes('not registered')) {
          alert('Webhook Configuration Required:\n\nYour n8n workflow webhook is not activated. Please:\n\n1. Go to your n8n workflow at https://mom1323.app.n8n.cloud/\n2. Click "Execute workflow" button on the canvas\n3. Try submitting again\n\nFor permanent setup, deactivate test mode in your n8n webhook.');
        } else {
          alert(`Error: ${errorData.message || 'Failed to send request. Please try again.'}`);
        }
      }
    } catch (error) {
      console.error('[v0] Submit error:', error);
      setLoading(false);
      alert('Error sending request. Please try again.');
    }
  };

  if (submitted && loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-background flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
              <Sparkles className="absolute w-8 h-8 text-secondary animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Creating Your Perfect Itinerary
            </h2>
            <p className="text-muted-foreground text-lg">
              Our AI is crafting a personalized travel experience just for you...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && !loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-background flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center animate-in zoom-in">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              You will receive your itinerary in a minute
            </h2>
            <p className="text-muted-foreground text-lg">
              Check your email inbox for your personalized travel itinerary
            </p>
          </div>
          <Button
            onClick={() => {
              setSubmitted(false);
              setDepartureDate('');
              setArrivalDate('');
              setDestination('');
              setActivities('');
              setBudget('500000');
              setEmail('');
            }}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground border border-secondary/30 transition-all duration-300"
          >
            Plan Another Trip
          </Button>
        </div>
      </div>
    );
  }

  // Show entry page if user hasn't entered details yet
  if (!hasEnteredDetails) {
    return <EntryPage onSubmit={handleEntrySubmit} />;
  }

  return (
    <div className="min-h-screen w-full bg-background">
      {/* Bookease Website */}
      <iframe
        src="/bookease.html"
        className="w-full border-0"
        style={{ height: '100vh' }}
        title="Bookease Travel Booking"
      />

      {/* Travel Planner Dashboard */}
      <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-background relative overflow-hidden">
      {/* Studio Lighting Effects */}
      <div className="studio-light-top" />
      <div className="studio-light-side" />
      <div className="studio-light-bottom" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Grid background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(0,217,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,217,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-xl opacity-50 rounded-full" />
                <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                  <MapPin className="w-8 h-8 text-background" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                AI Travel Planner
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Let artificial intelligence craft your perfect journey. Describe your dream trip and we'll create a personalized itinerary.
            </p>
            
            {/* Mode Toggle */}
            <div className="flex justify-center gap-3 mt-8 flex-wrap">
              <Button
                onClick={() => setUseVoiceMode(false)}
                variant={!useVoiceMode ? 'default' : 'outline'}
                className="transition-all duration-300"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Manual Input
              </Button>
              <Button
                onClick={() => setUseVoiceMode(true)}
                variant={useVoiceMode ? 'default' : 'outline'}
                className="transition-all duration-300"
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice Assistant
              </Button>
            </div>
          </div>

          {useVoiceMode ? (
            <div className="space-y-6">
              <VoiceAssistant
                onDataExtracted={(data) => {
                  setDepartureDate(data.departureDate);
                  setArrivalDate(data.arrivalDate);
                  setDestination(data.destination);
                  setActivities(data.activities);
                  setBudget(data.budget);
                  setUseVoiceMode(false);
                }}
              />
            </div>
          ) : !submitted ? (
            <div>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Section */}
                <div className="bg-card border border-border/30 rounded-lg transition-all duration-300 hover:border-primary/50 p-6 space-y-4" style={{ boxShadow: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(0,217,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Your Email
                  </h2>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@gmail.com"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-200"
                    required
                  />
                  <p className="text-xs text-muted-foreground">We'll send your personalized itinerary to this email</p>
                </div>

                {/* Dates Section */}
                <div className="bg-card border border-border/30 rounded-lg transition-all duration-300 hover:border-primary/50 p-6 space-y-4" style={{ boxShadow: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(0,217,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Travel Dates
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Departure Date</label>
                      <input
                        type="date"
                        value={departureDate}
                        onChange={(e) => setDepartureDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Arrival Date</label>
                      <input
                        type="date"
                        value={arrivalDate}
                        onChange={(e) => setArrivalDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>

                {/* Destination Section */}
                <div className="bg-card border border-border/30 rounded-lg transition-all duration-300 hover:border-primary/50 p-6 space-y-4" style={{ boxShadow: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(0,217,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    Destination
                  </h2>
                  <textarea
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                    placeholder="Where would you like to go? (e.g., Paris, France - romantic getaway exploring museums and cafes)"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-200 resize-none"
                    rows={3}
                  />
                </div>

                {/* Activities Section */}
                <div className="bg-card border border-border/30 rounded-lg transition-all duration-300 hover:border-primary/50 p-6 space-y-4" style={{ boxShadow: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(0,217,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Activities & Preferences
                  </h2>
                  <textarea
                    value={activities}
                    onChange={(e) => setActivities(e.target.value)}
                    placeholder="What activities interest you? (e.g., hiking, local cuisine, historical sites, adventure sports, shopping, relaxation, etc.)"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border/50 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30 outline-none transition-all duration-200 resize-none"
                    rows={3}
                  />
                </div>

                {/* Budget Section */}
                <div className="bg-card border border-border/30 rounded-lg transition-all duration-300 hover:border-primary/50 p-6 space-y-6" style={{ boxShadow: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(0,217,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}>
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-secondary" />
                    Budget
                  </h2>
                  
                  {/* Budget Display */}
                  <div className="budget-display">
                    <p className="text-sm text-muted-foreground mb-2">Your Budget</p>
                    <p className="budget-value">{formatCurrency(budget)}</p>
                  </div>

                  {/* Budget Slider */}
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="1000"
                      max="10000000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground font-medium">
                      <span>₹1K</span>
                      <span>₹50L</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !departureDate || !arrivalDate || !destination || !email}
                  className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold text-lg border border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Itinerary...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Generate My Itinerary
                    </>
                  )}
                </Button>

                {/* Info text */}
                <p className="text-center text-sm text-muted-foreground">
                  ✨ Your personalized itinerary will be sent to your email in minutes
                </p>
              </form>
            </div>
          ) : null}
        </div>
      </div>
    </div>
    </div>
  );
}
