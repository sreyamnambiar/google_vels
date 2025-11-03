import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Languages, MapPin, Brain, Loader, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface LiveVoiceResponse {
  transcribedText: string;
  geminiResponse: string;
  audioResponse?: string; // Base64 audio
  locationData?: {
    places: any[];
    suggestions: string[];
  };
  confidence: number;
  language: string;
}

export default function LiveVoiceAssistant() {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState<Array<{
    type: 'user' | 'assistant';
    text: string;
    timestamp: Date;
    audioUrl?: string;
  }>>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [language, setLanguage] = useState('en-US');
  const [enableTextToSpeech, setEnableTextToSpeech] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'zh-CN', name: 'Chinese (Simplified)' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ar-SA', name: 'Arabic' },
    { code: 'pt-BR', name: 'Portuguese (Brazil)' },
    { code: 'ru-RU', name: 'Russian' },
  ];

  // Get user location for map grounding
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.warn('Location access denied:', error);
        }
      );
    }
  }, []);

  // Initialize audio level monitoring
  const setupAudioMonitoring = (stream: MediaStream) => {
    audioContextRef.current = new AudioContext();
    analyzerRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyzerRef.current);
    
    analyzerRef.current.fftSize = 256;
    const bufferLength = analyzerRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateAudioLevel = () => {
      if (analyzerRef.current && isListening) {
        analyzerRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / bufferLength;
        setAudioLevel(average);
        requestAnimationFrame(updateAudioLevel);
      }
    };
    updateAudioLevel();
  };

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      setupAudioMonitoring(stream);

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' });
        await processLiveAudio(audioBlob);
        
        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
        audioContextRef.current?.close();
      };

      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsListening(true);
      setAudioLevel(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions and try again.');
    }
  };

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setAudioLevel(0);
    }
  };

  const processLiveAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);
      formData.append('enableTTS', enableTextToSpeech.toString());
      
      if (userLocation) {
        formData.append('userLocation', JSON.stringify(userLocation));
      }

      const response = await fetch('/api/live-voice-assistant', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LiveVoiceResponse = await response.json();
      
      // Add user message to conversation
      setConversation(prev => [...prev, {
        type: 'user',
        text: data.transcribedText,
        timestamp: new Date()
      }]);

      // Add assistant response to conversation
      setConversation(prev => [...prev, {
        type: 'assistant',
        text: data.geminiResponse,
        timestamp: new Date(),
        audioUrl: data.audioResponse
      }]);

      // Play audio response if enabled and available
      if (enableTextToSpeech && data.audioResponse) {
        await playAudioResponse(data.audioResponse);
      } else if (enableTextToSpeech) {
        speakText(data.geminiResponse);
      }

    } catch (error) {
      console.error('Voice processing failed:', error);
      const errorMessage = 'I apologize, but I encountered an error processing your request. Please try again.';
      
      setConversation(prev => [...prev, {
        type: 'assistant',
        text: errorMessage,
        timestamp: new Date()
      }]);

      if (enableTextToSpeech) {
        speakText(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudioResponse = async (base64Audio: string) => {
    try {
      const audioData = atob(base64Audio);
      const audioBuffer = new ArrayBuffer(audioData.length);
      const view = new Uint8Array(audioBuffer);
      
      for (let i = 0; i < audioData.length; i++) {
        view[i] = audioData.charCodeAt(i);
      }
      
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      setIsSpeaking(true);
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        console.error('Error playing audio response');
      };
      
      await audio.play();
    } catch (error) {
      console.error('Error playing audio response:', error);
      setIsSpeaking(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      currentUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const clearConversation = () => {
    setConversation([]);
    stopSpeaking();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Live Voice Assistant
        </h2>
        <div className="text-sm text-gray-500 dark:text-gray-400 ml-auto">
          🎤 → Gemini Live → 🗣️
        </div>
      </div>

      {/* Accessibility Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Accessibility Features
        </h3>
        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <li>• Speech-to-text for users with hearing difficulties</li>
          <li>• Text-to-speech for users with visual impairments</li>
          <li>• Location-aware responses with map integration</li>
          <li>• Multi-language support for diverse users</li>
          <li>• Real-time audio level monitoring</li>
        </ul>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Language Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Languages className="inline h-4 w-4 mr-1" />
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            disabled={isListening || isProcessing}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Text-to-Speech Toggle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Audio Response
          </label>
          <Button
            variant={enableTextToSpeech ? "default" : "outline"}
            onClick={() => setEnableTextToSpeech(!enableTextToSpeech)}
            className="w-full"
            disabled={isListening || isProcessing}
          >
            {enableTextToSpeech ? (
              <>
                <Volume2 className="h-4 w-4 mr-2" />
                Voice Enabled
              </>
            ) : (
              <>
                <VolumeX className="h-4 w-4 mr-2" />
                Voice Disabled
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Voice Control */}
      <div className="text-center mb-6">
        <div className="relative inline-block">
          {/* Audio Level Indicator */}
          {isListening && (
            <div 
              className="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-pulse"
              style={{
                transform: `scale(${1 + audioLevel / 100})`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          )}
          
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isProcessing}
            size="lg"
            className={`relative z-10 w-20 h-20 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isProcessing ? (
              <Loader className="h-8 w-8 animate-spin" />
            ) : isListening ? (
              <MicOff className="h-8 w-8" />
            ) : (
              <Mic className="h-8 w-8" />
            )}
          </Button>
        </div>
        
        <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
              Processing your speech with Gemini AI...
            </div>
          ) : isListening ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-pulse h-2 w-2 bg-red-500 rounded-full"></div>
              Listening... Speak now, then click to stop
            </div>
          ) : (
            <div>
              Click to start voice conversation
              <br />
              <span className="text-xs text-gray-500">Your speech will be processed in real-time</span>
            </div>
          )}
        </div>

        {/* Speaking Indicator */}
        {isSpeaking && (
          <div className="mt-2 flex items-center justify-center gap-2">
            <Volume2 className="h-4 w-4 text-green-500 animate-pulse" />
            <span className="text-sm text-green-600 dark:text-green-400">Speaking...</span>
            <Button
              onClick={stopSpeaking}
              size="sm"
              variant="outline"
              className="ml-2"
            >
              <Pause className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>

      {/* Location Status */}
      {userLocation && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <MapPin className="h-4 w-4 text-green-500" />
          Location enabled for map-grounded responses
        </div>
      )}

      {/* Conversation History */}
      {conversation.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Conversation
            </h3>
            <Button onClick={clearConversation} variant="outline" size="sm">
              Clear
            </Button>
          </div>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-50 dark:bg-blue-900/20 ml-8'
                    : 'bg-gray-50 dark:bg-gray-700/50 mr-8'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${
                    message.type === 'user' ? 'bg-blue-500' : 'bg-purple-500'
                  }`} />
                  <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {message.type}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  {message.text}
                </div>
                {message.audioUrl && (
                  <Button
                    onClick={() => speakText(message.text)}
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Replay
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Instructions */}
      {conversation.length === 0 && (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🎤 Voice Commands Ready!
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">For Hearing Assistance:</h4>
              <ul className="space-y-1 text-left">
                <li>• Speak naturally into your microphone</li>
                <li>• Get visual text responses instantly</li>
                <li>• Use any supported language</li>
                <li>• View conversation history</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">For Vision Assistance:</h4>
              <ul className="space-y-1 text-left">
                <li>• Enable audio responses</li>
                <li>• Hear responses spoken aloud</li>
                <li>• Get location-aware information</li>
                <li>• Navigate using voice commands</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
              🎤 Real Speech Processing Guide:
            </h4>
            <ol className="text-sm text-yellow-700 dark:text-yellow-300 text-left space-y-1">
              <li>1. Click the microphone button below</li>
              <li>2. Allow microphone permissions when prompted</li>
              <li>3. Speak your actual question clearly (e.g., "What accessible restaurants are nearby?")</li>
              <li>4. Click the microphone again to stop recording</li>
              <li>5. Your real speech will be transcribed and processed by Gemini AI</li>
              <li>6. Receive personalized responses based on what you actually said</li>
            </ol>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              💡 <strong>Pro Tips:</strong> Speak clearly, reduce background noise, and ensure your microphone is working. 
              The system will transcribe your actual words and provide relevant accessibility assistance.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}