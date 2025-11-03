import React, { useState } from 'react';
import { 
  Brain, Eye, Mic, FileText, MessageSquare, 
  Camera, Upload, Volume2, Map, Users, 
  Sparkles, Radio, ArrowLeft
} from 'lucide-react';
import VisionAnalyzer from './VisionAnalyzer';
import VoiceAssistant from './VoiceAssistant';
import LiveVoiceAssistant from './LiveVoiceAssistant';
import DocumentAnalyzer from './DocumentAnalyzer';
import AIChat from './AIChat';

type FeatureTab = 'vision' | 'voice' | 'liveVoice' | 'document' | 'chat' | 'overview';

interface GeminiAIHubProps {
  initialTab?: FeatureTab;
  onClose?: () => void;
}

export default function GeminiAIHub({ initialTab = 'overview', onClose }: GeminiAIHubProps) {
  const [activeTab, setActiveTab] = useState<FeatureTab>(initialTab);

  const features = [
    {
      id: 'vision' as FeatureTab,
      name: 'AI Vision Analysis',
      description: 'Analyze images for accessibility, safety, and navigation assistance',
      icon: Eye,
      color: 'blue',
      capabilities: [
        'Accessibility scoring and recommendations',
        'Safety hazard detection',
        'Navigation assistance for people with disabilities',
        'Real-time camera analysis',
        'Photo upload and batch processing'
      ]
    },
    {
      id: 'voice' as FeatureTab,
      name: 'Voice Assistant',
      description: 'Advanced speech-to-text with AI processing and multilingual support',
      icon: Mic,
      color: 'purple',
      capabilities: [
        'Multi-language speech recognition',
        'Sentiment analysis and insights',
        'Action item extraction',
        'Real-time audio level monitoring',
        'Text-to-speech output'
      ]
    },
    {
      id: 'liveVoice' as FeatureTab,
      name: 'Live Voice Assistant',
      description: 'Real-time speech-to-text and text-to-speech for hearing and vision accessibility',
      icon: Radio,
      color: 'purple',
      capabilities: [
        'Real-time speech-to-text conversion',
        'Gemini Live API integration',
        'Text-to-speech audio responses',
        'Location-aware responses',
        'Multi-language support',
        'Accessibility-first design'
      ]
    },
    {
      id: 'document' as FeatureTab,
      name: 'Document Intelligence',
      description: 'Extract insights from documents with accessibility compliance analysis',
      icon: FileText,
      color: 'green',
      capabilities: [
        'Accessibility compliance scoring',
        'Policy and legal analysis',
        'Content summarization',
        'Key point extraction',
        'Downloadable reports'
      ]
    },
    {
      id: 'chat' as FeatureTab,
      name: 'Smart Chat Assistant',
      description: 'Location-aware AI chat with mapping integration',
      icon: MessageSquare,
      color: 'orange',
      capabilities: [
        'Location-based recommendations',
        'Accessibility-focused responses',
        'Google Maps integration',
        'Conversation history',
        'Context-aware assistance'
      ]
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'vision':
        return <VisionAnalyzer />;
      case 'voice':
        return <VoiceAssistant />;
      case 'liveVoice':
        return <LiveVoiceAssistant />;
      case 'document':
        return <DocumentAnalyzer />;
      case 'chat':
        return <AIChat onClose={() => setActiveTab('overview')} />;
      case 'overview':
      default:
        return (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Sparkles className="h-12 w-12" />
                <h1 className="text-4xl font-bold">AI Assistant Hub</h1>
              </div>
              <p className="text-xl mb-6">
                AI-Powered Accessibility Tools
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`p-6 border-2 border-${feature.color}-200 dark:border-${feature.color}-800 rounded-lg hover:shadow-lg transition-all cursor-pointer`}
                  onClick={() => setActiveTab(feature.id)}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 bg-${feature.color}-100 dark:bg-${feature.color}-900 rounded-lg`}>
                      <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                    </div>
                    <h3 className={`text-xl font-bold text-${feature.color}-800 dark:text-${feature.color}-200`}>
                      {feature.name}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Key Capabilities:</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      {feature.capabilities.map((capability, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 bg-${feature.color}-500 rounded-full`}></div>
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button className={`mt-4 w-full p-2 bg-${feature.color}-600 text-white rounded hover:bg-${feature.color}-700 transition-colors`}>
                    Try {feature.name}
                  </button>
                </div>
              ))}
            </div>

            {/* Technology Stack */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Hackathon-Winning Technology Stack
              </h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-600 mb-2">Gemini AI Integrations</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Gemini 2.5 Flash for text processing</li>
                    <li>• Vision API for image analysis</li>
                    <li>• Multi-modal content understanding</li>
                    <li>• Context-aware conversations</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-green-600 mb-2">Accessibility Features</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Real-time accessibility scoring</li>
                    <li>• Voice command interface</li>
                    <li>• Screen reader optimization</li>
                    <li>• High contrast support</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-purple-600 mb-2">Innovation Highlights</h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Location-aware AI responses</li>
                    <li>• Multi-language support</li>
                    <li>• Real-time image analysis</li>
                    <li>• Document intelligence</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">Experience the Future of Accessibility</h3>
              <p className="mb-4">Try each AI feature above to see how Gemini transforms accessibility technology</p>
              <div className="flex flex-wrap justify-center gap-2">
                {features.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => setActiveTab(feature.id)}
                    className="px-4 py-2 bg-white text-gray-800 rounded hover:bg-gray-100 transition-colors"
                  >
                    <feature.icon className="inline h-4 w-4 mr-1" />
                    {feature.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 py-4">
            {/* Back Button */}
            {onClose && (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </button>
            )}
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-1 flex-1">
              {[
                { id: 'overview' as FeatureTab, name: 'Overview', icon: Brain },
                ...features.map(f => ({ id: f.id, name: f.name, icon: f.icon }))
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {renderTabContent()}
      </div>
    </div>
  );
}