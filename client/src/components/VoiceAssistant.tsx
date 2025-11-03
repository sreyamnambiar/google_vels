import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, Languages, FileText, Brain } from 'lucide-react';

interface TranscriptionResult {
  text: string;
  language: string;
  confidence: number;
  summary: string;
  actionItems: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  accessibility_insights: string[];
}

export default function VoiceAssistant() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [language, setLanguage] = useState('en-US');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'es-ES', name: 'Spanish' },
    { code: 'fr-FR', name: 'French' },
    { code: 'de-DE', name: 'German' },
    { code: 'hi-IN', name: 'Hindi' },
    { code: 'zh-CN', name: 'Chinese' },
    { code: 'ja-JP', name: 'Japanese' },
    { code: 'ar-SA', name: 'Arabic' },
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio level monitoring
      audioContextRef.current = new AudioContext();
      analyzerRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyzerRef.current);
      
      analyzerRef.current.fftSize = 256;
      const bufferLength = analyzerRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateAudioLevel = () => {
        if (analyzerRef.current && isRecording) {
          analyzerRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average);
          requestAnimationFrame(updateAudioLevel);
        }
      };
      updateAudioLevel();

      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await processAudio(audioBlob);
        
        // Stop audio context
        stream.getTracks().forEach(track => track.stop());
        audioContextRef.current?.close();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setAudioLevel(0);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', language);

      const response = await fetch('/api/speech-analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setTranscription(data.result);
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Speech processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="h-8 w-8 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Voice Assistant
        </h2>
      </div>

      {/* Language Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Languages className="inline h-4 w-4 mr-1" />
          Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Recording Controls */}
      <div className="flex flex-col items-center space-y-4 mb-8">
        <div className="relative">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 scale-110'
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white disabled:opacity-50`}
          >
            {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </button>
          
          {/* Audio Level Visualization */}
          {isRecording && (
            <div className="absolute -inset-4 rounded-full border-4 border-red-400 animate-pulse"
                 style={{ 
                   transform: `scale(${1 + audioLevel / 500})`,
                   opacity: audioLevel / 255 
                 }}>
            </div>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-400 text-center">
          {isRecording 
            ? 'Recording... Click to stop' 
            : isProcessing 
            ? 'Processing with AI...' 
            : 'Click to start recording'
          }
        </p>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            <span className="text-sm text-purple-600">Analyzing with Gemini AI...</span>
          </div>
        )}
      </div>

      {/* Results */}
      {transcription && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Results</h3>
          
          {/* Transcription */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                <FileText className="inline h-4 w-4 mr-1" />
                Transcription ({transcription.language})
              </h4>
              <button
                onClick={() => speakText(transcription.text)}
                className="p-1 text-blue-600 hover:text-blue-800"
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
            <p className="text-blue-800 dark:text-blue-200">{transcription.text}</p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Confidence: {Math.round(transcription.confidence * 100)}%
            </p>
          </div>

          {/* Summary */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">AI Summary</h4>
            <p className="text-green-800 dark:text-green-200">{transcription.summary}</p>
          </div>

          {/* Sentiment Analysis */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
              Sentiment: 
              <span className={`ml-2 px-2 py-1 rounded text-sm ${
                transcription.sentiment === 'positive' ? 'bg-green-200 text-green-800' :
                transcription.sentiment === 'negative' ? 'bg-red-200 text-red-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {transcription.sentiment}
              </span>
            </h4>
          </div>

          {/* Action Items */}
          {transcription.actionItems.length > 0 && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Action Items</h4>
              <ul className="list-disc list-inside text-purple-800 dark:text-purple-200 space-y-1">
                {transcription.actionItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Accessibility Insights */}
          {transcription.accessibility_insights.length > 0 && (
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                Accessibility Insights
              </h4>
              <ul className="list-disc list-inside text-indigo-800 dark:text-indigo-200 space-y-1">
                {transcription.accessibility_insights.map((insight, index) => (
                  <li key={index}>{insight}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}