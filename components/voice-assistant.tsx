'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, RotateCcw, Send } from 'lucide-react';

interface VoiceAssistantProps {
  onDataExtracted: (data: {
    departureDate: string;
    arrivalDate: string;
    destination: string;
    activities: string;
    budget: string;
  }) => void;
}

export function VoiceAssistant({ onDataExtracted }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: string; message: string }>>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [extractedData, setExtractedData] = useState({
    departureDate: '',
    arrivalDate: '',
    destination: '',
    activities: '',
    budget: '500000',
  });

  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    { question: 'When do you want to depart? Please say the date like February 15, 2026', field: 'departureDate' },
    { question: 'When do you want to return? Please say the date like February 20, 2026', field: 'arrivalDate' },
    { question: 'What is your destination?', field: 'destination' },
    { question: 'What activities interest you?', field: 'activities' },
    { question: 'What is your budget in Indian Rupees?', field: 'budget' },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-IN';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setTranscript('');
        };

        recognitionRef.current.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptSegment = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              interim += transcriptSegment + ' ';
            }
          }
          setTranscript(interim);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('[v0] Speech recognition error:', event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const speak = (text: string) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const parseDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    if (!isNaN(dateObj.getTime())) {
      return dateObj.toISOString().split('T')[0];
    }
    return '';
  };

  const parseBudget = (budgetString: string): string => {
    const cleanStr = budgetString.toLowerCase().replace(/[^0-9]/g, '');
    const num = parseInt(cleanStr) || 500000;
    return Math.max(1000, Math.min(10000000, num)).toString();
  };

  const handleSubmitResponse = async () => {
    if (!transcript.trim()) return;

    const question = questions[currentStep];
    let processedValue = transcript.trim();

    if (question.field === 'departureDate' || question.field === 'arrivalDate') {
      processedValue = parseDate(processedValue) || processedValue;
    } else if (question.field === 'budget') {
      processedValue = parseBudget(processedValue);
    }

    setExtractedData((prev) => ({
      ...prev,
      [question.field]: processedValue,
    }));

    setChatHistory((prev) => [
      ...prev,
      { role: 'assistant', message: question.question },
      { role: 'user', message: transcript },
    ]);

    setTranscript('');

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
      setTimeout(() => {
        speak(questions[currentStep + 1].question);
      }, 500);
    } else {
      setChatHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          message: 'Perfect! I have all the information. Click "Continue to Email" to proceed with your travel itinerary.',
        },
      ]);
      speak('Perfect! I have all the information. You can now enter your email and generate your itinerary.');
    }
  };

  const handleContinue = () => {
    onDataExtracted(extractedData);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setTranscript('');
    setChatHistory([]);
    setExtractedData({
      departureDate: '',
      arrivalDate: '',
      destination: '',
      activities: '',
      budget: '500000',
    });
    setTimeout(() => {
      speak(questions[0].question);
    }, 300);
  };

  const handleStartConversation = () => {
    setChatHistory([{ role: 'assistant', message: questions[0].question }]);
    speak(questions[0].question);
  };

  if (chatHistory.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-card border border-border/30 rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-all duration-300" style={{ boxShadow: 'none' }} onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 0 25px rgba(0,217,255,0.3)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.5)'; }} onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'hsl(var(--border))'; }}>
          <Mic className="w-16 h-16 mx-auto text-primary" />
          <h3 className="text-2xl font-semibold text-foreground">Voice Assistant</h3>
          <p className="text-muted-foreground">Answer a few quick questions and let our AI fill your travel preferences automatically</p>
          <Button onClick={handleStartConversation} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold">
            <Mic className="w-4 h-4 mr-2" />
            Start Voice Conversation
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Chat History */}
      <div className="bg-card border border-border/30 rounded-lg p-6 space-y-4 min-h-96 max-h-96 overflow-y-auto" style={{ boxShadow: 'inset 0 0 20px rgba(0,217,255,0.05)' }}>
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary/20 text-foreground border border-secondary/30'}`}>
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Transcript Display */}
      {currentStep < questions.length && (
        <div className="bg-input border border-border/50 rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-2">Listening...</p>
          <p className="text-foreground font-medium">{transcript || 'Waiting for your response...'}</p>
        </div>
      )}

      {/* Extracted Data Preview */}
      {currentStep === questions.length && (
        <div className="bg-card border border-border/30 rounded-lg p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground mb-3">Your Travel Details:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Departure:</p>
              <p className="text-foreground font-medium">{extractedData.departureDate || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Return:</p>
              <p className="text-foreground font-medium">{extractedData.arrivalDate || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Destination:</p>
              <p className="text-foreground font-medium">{extractedData.destination || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Budget:</p>
              <p className="text-foreground font-medium">₹{extractedData.budget}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {currentStep < questions.length ? (
          <>
            <Button onClick={startListening} disabled={isListening || isSpeaking} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              <Mic className="w-4 h-4 mr-2" />
              {isListening ? 'Listening...' : 'Record Answer'}
            </Button>
            <Button onClick={handleSubmitResponse} disabled={!transcript.trim() || isListening} className="flex-1 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Send className="w-4 h-4 mr-2" />
              Next
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleContinue} className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold">
              Continue to Email
            </Button>
            <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
