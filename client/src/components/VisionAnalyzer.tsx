import React, { useState, useRef } from 'react';
import { Camera, Upload, Eye, AlertTriangle, CheckCircle, Info, Volume2, VolumeX, FileText, Play, Pause } from 'lucide-react';

interface AnalysisResult {
  accessibility: {
    score: number;
    issues: string[];
    improvements: string[];
  };
  safety: {
    hazards: string[];
    recommendations: string[];
  };
  description: string;
  extractedText?: string;
  textConfidence?: number;
}

export default function VisionAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [enableTextExtraction, setEnableTextExtraction] = useState(true);
  const [enableTextToSpeech, setEnableTextToSpeech] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please use file upload instead.');
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageData);
      
      // Stop camera
      const stream = video.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    try {
      const response = await fetch('/api/vision-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: selectedImage,
          analysisType: 'accessibility_safety',
          extractText: enableTextExtraction
        }),
      });

      const data = await response.json();
      setResult(data.analysis);
      
      // Automatically read extracted text if enabled
      if (enableTextToSpeech && data.analysis.extractedText && data.analysis.extractedText.trim()) {
        setTimeout(() => {
          speakText(data.analysis.extractedText);
        }, 1000); // Wait 1 second after analysis completes
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    // Stop any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      alert('Error occurred while speaking the text.');
    };
    
    currentUtteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const speakFullAnalysis = () => {
    if (!result) return;
    
    let fullText = `Analysis Results: ${result.description}. `;
    
    if (result.extractedText && result.extractedText.trim()) {
      fullText += `Extracted text from image: ${result.extractedText}. `;
    }
    
    fullText += `Accessibility score: ${result.accessibility.score} out of 10. `;
    
    if (result.accessibility.issues.length > 0) {
      fullText += `Issues found: ${result.accessibility.issues.join(', ')}. `;
    }
    
    fullText += `Improvements suggested: ${result.accessibility.improvements.join(', ')}. `;
    
    if (result.safety.hazards.length > 0) {
      fullText += `Safety hazards: ${result.safety.hazards.join(', ')}. `;
    }
    
    fullText += `Safety recommendations: ${result.safety.recommendations.join(', ')}.`;
    
    speakText(fullText);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <Eye className="h-8 w-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Vision & Text Analyzer
        </h2>
      </div>

      {/* Accessibility Features Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          🌟 Accessibility Features
        </h3>
        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <li>• Extract and read text from images aloud for vision assistance</li>
          <li>• Analyze accessibility compliance of spaces and objects</li>
          <li>• Identify safety hazards and provide recommendations</li>
          <li>• Voice feedback for all analysis results</li>
        </ul>
      </div>

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium">Extract Text from Images</span>
          </div>
          <button
            onClick={() => setEnableTextExtraction(!enableTextExtraction)}
            className={`w-12 h-6 rounded-full transition-colors ${
              enableTextExtraction ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              enableTextExtraction ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">Auto-Read Text Aloud</span>
          </div>
          <button
            onClick={() => setEnableTextToSpeech(!enableTextToSpeech)}
            className={`w-12 h-6 rounded-full transition-colors ${
              enableTextToSpeech ? 'bg-green-600' : 'bg-gray-300'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              enableTextToSpeech ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>

      {/* Image Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 transition-colors"
          >
            <Upload className="h-5 w-5" />
            Upload Photo
          </button>
          
          <button
            onClick={startCamera}
            disabled={cameraActive}
            className="w-full flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Camera className="h-5 w-5" />
            {cameraActive ? 'Camera Active' : 'Use Camera'}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        {/* Camera/Image Preview */}
        <div className="relative">
          {cameraActive ? (
            <div className="space-y-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-lg"
              />
              <button
                onClick={capturePhoto}
                className="w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Capture Photo
              </button>
            </div>
          ) : selectedImage ? (
            <img
              src={selectedImage}
              alt="Selected"
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No image selected</p>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      {/* Analyze Button */}
      {selectedImage && (
        <div className="space-y-4">
          <button
            onClick={analyzeImage}
            disabled={analyzing}
            className="w-full p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Eye className="h-5 w-5" />
            {analyzing ? 'Analyzing with AI Vision...' : 'Analyze Image & Extract Text'}
          </button>

          {/* Speaking Indicator */}
          {isSpeaking && (
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <Volume2 className="h-4 w-4 text-green-500 animate-pulse" />
              <span className="text-sm text-green-600 dark:text-green-400">Reading text aloud...</span>
              <button
                onClick={stopSpeaking}
                className="ml-2 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
              >
                Stop
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Results</h3>
            <button
              onClick={speakFullAnalysis}
              disabled={isSpeaking}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSpeaking ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {isSpeaking ? 'Speaking...' : 'Read All Results'}
            </button>
          </div>
          
          {/* Extracted Text Section */}
          {result.extractedText && result.extractedText.trim() && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100">
                    Extracted Text
                    {result.textConfidence && (
                      <span className="text-sm text-purple-700 dark:text-purple-300 ml-2">
                        (Confidence: {Math.round(result.textConfidence * 100)}%)
                      </span>
                    )}
                  </h4>
                </div>
                <button
                  onClick={() => speakText(result.extractedText!)}
                  disabled={isSpeaking}
                  className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
                >
                  <Volume2 className="h-3 w-3" />
                  Read Text
                </button>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                <p className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap">
                  {result.extractedText}
                </p>
              </div>
            </div>
          )}
          
          {/* No Text Found Message */}
          {enableTextExtraction && (!result.extractedText || !result.extractedText.trim()) && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-yellow-600" />
                <p className="text-yellow-800 dark:text-yellow-200">
                  No readable text was detected in this image. The image may not contain text, or the text may be too blurry or small to extract.
                </p>
              </div>
            </div>
          )}
          
          {/* Description */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Scene Description</h4>
            <p className="text-blue-800 dark:text-blue-200">{result.description}</p>
          </div>

          {/* Accessibility Score */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900 dark:text-green-100">
                Accessibility Score: {result.accessibility.score}/10
              </h4>
            </div>
            
            {result.accessibility.issues.length > 0 && (
              <div className="mb-3">
                <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Issues Found:</h5>
                <ul className="list-disc list-inside text-green-700 dark:text-green-300 space-y-1">
                  {result.accessibility.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h5 className="font-medium text-green-800 dark:text-green-200 mb-1">Improvements:</h5>
              <ul className="list-disc list-inside text-green-700 dark:text-green-300 space-y-1">
                {result.accessibility.improvements.map((improvement, index) => (
                  <li key={index}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Safety Analysis */}
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <h4 className="font-semibold text-orange-900 dark:text-orange-100">Safety Analysis</h4>
            </div>
            
            {result.safety.hazards.length > 0 && (
              <div className="mb-3">
                <h5 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Potential Hazards:</h5>
                <ul className="list-disc list-inside text-orange-700 dark:text-orange-300 space-y-1">
                  {result.safety.hazards.map((hazard, index) => (
                    <li key={index}>{hazard}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div>
              <h5 className="font-medium text-orange-800 dark:text-orange-200 mb-1">Safety Recommendations:</h5>
              <ul className="list-disc list-inside text-orange-700 dark:text-orange-300 space-y-1">
                {result.safety.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}