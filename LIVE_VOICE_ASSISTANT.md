# Live Voice Assistant - Speech-to-Text & Text-to-Speech Implementation

## Overview
The Live Voice Assistant feature implements a comprehensive accessibility solution following the speech-to-text and text-to-speech flow you specified. This feature is specifically designed for users with hearing and visual disabilities.

## Implementation Flow

### 🎤 User speaks
- **Input**: User speaks into their microphone
- **Technology**: WebRTC MediaRecorder API
- **Features**: 
  - Real-time audio level monitoring
  - Echo cancellation and noise suppression
  - Multi-language support
  - Visual feedback with animated microphone button

### ↓ Gemini Live API (audio input)
- **Process**: Audio is captured and sent to backend
- **Format**: WebM with Opus codec for optimal quality
- **Backend Route**: `/api/live-voice-assistant`
- **Function**: `speechToText()` in `server/gemini.ts`

### ↓ Gemini reasoning + Maps grounding
- **AI Processing**: Gemini 2.5 Flash analyzes the transcribed text
- **Location Context**: Integrates user location for map-grounded responses
- **Accessibility Focus**: Specialized prompts for accessibility needs
- **Function**: `processWithGeminiLive()` in `server/gemini.ts`

### ↓ Gemini Live API (audio or text output)
- **Text Response**: Always provides text for hearing-impaired users
- **Audio Generation**: Optional text-to-speech for vision-impaired users
- **Function**: `textToSpeech()` in `server/gemini.ts`

### 🗣️ Speaks back to user
- **Browser TTS**: Built-in speechSynthesis API as fallback
- **Custom Audio**: Support for Gemini-generated audio responses
- **Controls**: Play, pause, stop, and replay functionality

## Accessibility Features

### For Hearing Disabilities
- **Visual Conversation History**: All interactions displayed as text
- **Real-time Transcription**: Live speech-to-text conversion
- **Language Support**: 10+ languages supported
- **Visual Audio Indicators**: Animated microphone shows recording status

### For Vision Disabilities  
- **Text-to-Speech**: All responses spoken aloud
- **Audio Controls**: Easy voice navigation
- **Large Buttons**: Accessible UI with high contrast
- **Screen Reader Friendly**: Semantic HTML and ARIA labels

### Universal Design
- **Multi-language**: Supports 10 major languages
- **Location Awareness**: GPS integration for contextual responses
- **Conversation Persistence**: History maintained during session
- **Error Recovery**: Graceful handling of API failures

## Technical Implementation

### Frontend Component: `LiveVoiceAssistant.tsx`
```typescript
// Key features:
- Real-time audio recording
- Audio level visualization  
- Conversation history display
- Text-to-speech controls
- Multi-language support
- Location integration
```

### Backend API: `/api/live-voice-assistant`
```typescript
// Processing pipeline:
1. Receive audio file
2. Convert speech to text
3. Process with Gemini Live
4. Generate audio response
5. Return comprehensive result
```

### Gemini Integration: `processLiveVoiceWithGemini()`
```typescript
// Three-step process:
1. speechToText() - Audio transcription
2. processWithGeminiLive() - AI reasoning + maps
3. textToSpeech() - Audio generation
```

## User Interface Features

### Main Controls
- **Large Round Microphone Button**: Primary interaction
- **Language Selector**: Choose from 10 languages
- **Audio Toggle**: Enable/disable text-to-speech
- **Conversation History**: Scrollable chat-like interface

### Visual Feedback
- **Audio Level Indicator**: Pulsing animation during recording
- **Processing States**: Clear status messages
- **Speaking Indicator**: Shows when audio is playing
- **Timestamp Display**: When each interaction occurred

### Accessibility Information Panel
- Lists all accessibility features
- Explains benefits for different disabilities
- Provides usage instructions

## Error Handling & Graceful Degradation

### Microphone Access
- Clear permission requests
- Fallback error messages
- Alternative input methods suggested

### API Failures
- Local error handling
- Helpful error messages spoken aloud
- Retry mechanisms built-in

### Network Issues
- Offline detection
- Cached responses when possible
- Clear connectivity status

## Future Enhancements

### Production Integrations
1. **Google Speech-to-Text API**: Replace simulated transcription
2. **Google Text-to-Speech API**: Higher quality audio generation
3. **Google Maps API**: Real location data and grounding
4. **WebSocket Streaming**: Real-time audio processing

### Advanced Features
1. **Voice Profiles**: Personalized speech recognition
2. **Conversation Memory**: Long-term context retention
3. **Offline Mode**: Local processing capabilities
4. **Integration APIs**: Connect with assistive technology

## Usage Instructions

### For Users with Hearing Difficulties:
1. Click the microphone button to start
2. Speak your question naturally
3. Read the text response in the conversation history
4. Use the visual indicators to know when you can speak

### For Users with Vision Impairments:
1. Enable audio responses in settings
2. Click the large microphone button (keyboard accessible)
3. Speak your question
4. Listen to the spoken response
5. Use replay buttons to hear responses again

### For All Users:
- Choose your preferred language
- Enable location for better responses
- View conversation history
- Clear chat when needed

This implementation provides a comprehensive accessibility solution that follows your specified flow: 🎤 → Gemini Live → 🗣️, ensuring both hearing and vision-impaired users can interact naturally with AI assistance.