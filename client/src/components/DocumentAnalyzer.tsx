import React, { useState, useRef } from 'react';
import { FileText, Upload, Link, Brain, Download, Share2, Volume2, VolumeX, Play, Pause, RotateCcw } from 'lucide-react';

interface DocumentAnalysis {
  summary: string;
  analysisType: string;
  documentUrl: string;
  timestamp: string;
  keyPoints?: string[];
  recommendations?: string[];
  compliance_score?: number;
  actionItems?: string[];
  briefSummary?: string;
  detailedSummary?: string;
  extractedText?: string;
  wordCount?: number;
  readingTime?: number;
}

export default function DocumentAnalyzer() {
  const [documentUrl, setDocumentUrl] = useState('');
  const [analysisType, setAnalysisType] = useState('content_summary');
  const [summaryLevel, setSummaryLevel] = useState('detailed');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<DocumentAnalysis | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [enableTextToSpeech, setEnableTextToSpeech] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const analysisTypes = [
    { value: 'content_summary', label: 'Content Summary & Analysis' },
    { value: 'accessibility_summary', label: 'Accessibility Compliance Analysis' },
    { value: 'policy_analysis', label: 'Policy & Legal Analysis' },
    { value: 'technical_analysis', label: 'Technical Documentation Analysis' },
    { value: 'educational_content', label: 'Educational Content Analysis' },
  ];

  const summaryLevels = [
    { value: 'brief', label: 'Brief Summary (1-2 sentences)' },
    { value: 'detailed', label: 'Detailed Summary (1-2 paragraphs)' },
    { value: 'comprehensive', label: 'Comprehensive Analysis (Full details)' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // In a real implementation, you would upload the file and get a URL
      setDocumentUrl(`uploaded://${file.name}`);
    }
  };

  const analyzeDocument = async () => {
    if (!documentUrl && !uploadedFile) {
      alert('Please provide a document URL or upload a file');
      return;
    }

    setAnalyzing(true);
    try {
      const response = await fetch('/api/document-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentUrl: documentUrl || `file://${uploadedFile?.name}`,
          analysisType: analysisType,
          summaryLevel: summaryLevel,
        }),
      });

      const data = await response.json();
      setResult(data.analysis);
      
      // Auto-read summary if enabled
      if (enableTextToSpeech && data.analysis.summary) {
        setTimeout(() => {
          speakText(data.analysis.summary);
        }, 1000);
      }
    } catch (error) {
      console.error('Document analysis failed:', error);
      alert('Document analysis failed. Please try again.');
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
    
    let fullText = `Document Analysis Results: ${result.summary}. `;
    
    if (result.keyPoints && result.keyPoints.length > 0) {
      fullText += `Key points: ${result.keyPoints.join(', ')}. `;
    }
    
    if (result.recommendations && result.recommendations.length > 0) {
      fullText += `Recommendations: ${result.recommendations.join(', ')}. `;
    }
    
    if (result.actionItems && result.actionItems.length > 0) {
      fullText += `Action items: ${result.actionItems.join(', ')}. `;
    }
    
    if (result.compliance_score) {
      fullText += `Compliance score: ${result.compliance_score} out of 10.`;
    }
    
    speakText(fullText);
  };

  const downloadReport = () => {
    if (!result) return;

    const report = `
Document Analysis Report
========================
Generated: ${new Date(result.timestamp).toLocaleString()}
Document: ${result.documentUrl}
Analysis Type: ${result.analysisType}

SUMMARY:
${result.summary}

${result.keyPoints ? `
KEY POINTS:
${result.keyPoints.map(point => `• ${point}`).join('\n')}
` : ''}

${result.recommendations ? `
RECOMMENDATIONS:
${result.recommendations.map(rec => `• ${rec}`).join('\n')}
` : ''}

${result.compliance_score ? `
COMPLIANCE SCORE: ${result.compliance_score}/10
` : ''}

Generated by InclusiveHub AI Document Analyzer
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `document-analysis-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="h-8 w-8 text-green-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          AI Document Analyzer
        </h2>
      </div>

      {/* Input Section */}
      <div className="space-y-6 mb-8">
        {/* Analysis Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Analysis Type
          </label>
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            {analysisTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Document Input Methods */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Link className="inline h-4 w-4 mr-1" />
              Document URL
            </label>
            <input
              type="url"
              value={documentUrl}
              onChange={(e) => setDocumentUrl(e.target.value)}
              placeholder="https://example.com/document.pdf"
              className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Upload className="inline h-4 w-4 mr-1" />
              Upload Document
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        {/* Uploaded File Display */}
        {uploadedFile && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-blue-800 dark:text-blue-200">
              <FileText className="inline h-4 w-4 mr-1" />
              Selected: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          </div>
        )}

        {/* Summary Level Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Summary Level
          </label>
          <select
            value={summaryLevel}
            onChange={(e) => setSummaryLevel(e.target.value as 'brief' | 'detailed' | 'comprehensive')}
            className="w-full p-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          >
            <option value="brief">Brief Summary</option>
            <option value="detailed">Detailed Summary</option>
            <option value="comprehensive">Comprehensive Analysis</option>
          </select>
        </div>

        {/* Text-to-Speech Options */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={enableTextToSpeech}
              onChange={(e) => setEnableTextToSpeech(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              <Volume2 className="inline h-4 w-4 mr-1" />
              Enable Text-to-Speech
            </span>
          </label>
          
          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="flex items-center space-x-1 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              <VolumeX size={16} />
              <span>Stop Speaking</span>
            </button>
          )}
        </div>

        {/* Analyze Button */}
        <button
          onClick={analyzeDocument}
          disabled={analyzing || (!documentUrl && !uploadedFile)}
          className="w-full p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Brain className="h-5 w-5" />
          {analyzing ? 'Analyzing with Gemini AI...' : 'Analyze Document'}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Analysis Results</h3>
            <div className="flex gap-2">
              {enableTextToSpeech && (
                <>
                  <button
                    onClick={() => speakText(result.summary)}
                    disabled={isSpeaking}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    <Play className="h-4 w-4" />
                    Read Summary
                  </button>
                  <button
                    onClick={speakFullAnalysis}
                    disabled={isSpeaking}
                    className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    <Volume2 className="h-4 w-4" />
                    Read All
                  </button>
                </>
              )}
              <button
                onClick={downloadReport}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => navigator.share?.({ 
                  title: 'Document Analysis Report', 
                  text: result.summary 
                })}
                className="flex items-center gap-1 px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                <Share2 className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>

          {/* Document Info */}
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Document Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Source:</span>
                <p className="font-medium break-all">{result.documentUrl}</p>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Analyzed:</span>
                <p className="font-medium">{new Date(result.timestamp).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Main Summary */}
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              AI Analysis Summary
            </h4>
            <div className="text-green-800 dark:text-green-200 whitespace-pre-wrap">
              {result.summary}
            </div>
          </div>

          {/* Key Points */}
          {result.keyPoints && result.keyPoints.length > 0 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Key Points</h4>
              <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
                {result.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && result.recommendations.length > 0 && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Recommendations</h4>
              <ul className="list-disc list-inside text-purple-800 dark:text-purple-200 space-y-1">
                {result.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Compliance Score */}
          {result.compliance_score && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                Compliance Score: {result.compliance_score}/10
              </h4>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(result.compliance_score / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}