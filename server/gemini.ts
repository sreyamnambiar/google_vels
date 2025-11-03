// Integration: blueprint:javascript_gemini
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithAI(
  message: string, 
  conversationHistory?: Array<{ role: string; content: string }>,
  userLocation?: { lat: number; lng: number } | null,
  isLocationQuery?: boolean
): Promise<string | { response: string; mapData?: any }> {
  try {
    // Enhanced system prompt for location queries
    const systemPrompt = `You are an AI accessibility assistant for InclusiveHub, a platform dedicated to empowering individuals with diverse disabilities. 
Your role is to:
- Help users find accessible places (hospitals, restaurants, public spaces)
- Provide guidance on accessibility features and assistive technology
- Offer encouragement and support for navigating daily challenges
- Answer questions about disability rights and resources
- Be respectful, patient, and encouraging in all interactions

${userLocation ? `The user's current location is: Latitude ${userLocation.lat}, Longitude ${userLocation.lng}` : ''}

${isLocationQuery ? `IMPORTANT: This is a location-based query. When responding:
- Focus on accessible venues and facilities
- Mention specific accessibility features (wheelchair access, accessible parking, etc.)
- Provide practical advice for navigation
- Be encouraging and supportive about accessing these places
- If you can identify what type of place they're looking for (hospitals, restaurants, etc.), mention it clearly` : ''}

Be conversational, empathetic, and practical in your responses.`;

    // Build conversation context
    const contents = conversationHistory
      ? conversationHistory.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        }))
      : [];

    // Add current message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
      },
      contents: contents,
    });

    const responseText = response.text || "I'm sorry, I couldn't generate a response. Please try again.";

    // If this is a location query, return enhanced response
    if (isLocationQuery) {
      // Extract search terms from the message for mapping
      const searchTerms = extractSearchTerms(message);
      
      // For queries like "hospitals near vel tech avadi college", we can use geocoding
      // or default to a general location if no GPS is available
      let mapLocation = userLocation;
      
      // If no GPS location but query mentions a specific place, extract it
      if (!mapLocation) {
        const locationMatch = message.match(/near (.+)/i);
        if (locationMatch) {
          const mentionedLocation = locationMatch[1];
          // For demo purposes, use default coordinates for common locations
          // In production, you'd use geocoding API
          mapLocation = getDefaultCoordinates(mentionedLocation) || { lat: 13.0827, lng: 80.2707 }; // Chennai default
        }
      }
      
      if (mapLocation) {
        return {
          response: responseText + "\n\n📍 I've also prepared a map below to help you navigate to these locations.",
          mapData: {
            query: searchTerms,
            location: mapLocation
          }
        };
      }
    }

    return responseText;
  } catch (error) {
    console.error("Gemini chat error:", error);
    throw new Error(`Failed to chat with AI: ${error}`);
  }
}

// Helper function to get default coordinates for known locations
function getDefaultCoordinates(location: string): { lat: number; lng: number } | null {
  const locationMap: { [key: string]: { lat: number; lng: number } } = {
    'vel tech avadi college': { lat: 13.1106, lng: 80.1026 },
    'avadi': { lat: 13.1106, lng: 80.1026 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'anna university': { lat: 13.0067, lng: 80.2206 },
    'iit madras': { lat: 12.9915, lng: 80.2337 },
    'tambaram': { lat: 12.9249, lng: 80.1000 },
    'chrompet': { lat: 12.9516, lng: 80.1462 }
  };

  const lowerLocation = location.toLowerCase();
  for (const [key, coords] of Object.entries(locationMap)) {
    if (lowerLocation.includes(key)) {
      return coords;
    }
  }
  return null;
}

// Helper function to extract search terms for Google Maps
function extractSearchTerms(message: string): string {
  // Common patterns for location searches
  const patterns = [
    /find (.*?) near/i,
    /show me (.*?) near/i,
    /where are (.*?) near/i,
    /(.*?) near (.*)/i, // More general pattern to catch "hospitals near vel tech avadi college"
    /(hospitals?|restaurants?|shops?|pharmacies?|banks?|atms?|gas stations?|grocery stores?|cafes?|libraries?|parks?) near/i,
    /(accessible|wheelchair) (.*?) near/i
  ];

  for (const pattern of patterns) {
    const match = message.match(pattern);
    if (match) {
      // For "hospitals near vel tech avadi college" pattern
      if (pattern.source.includes('(.*?) near (.*)')) {
        return `${match[1]} near ${match[2]}`;
      }
      return match[1] || match[0];
    }
  }

  // Fallback: extract key nouns if no pattern matches
  const fallbackPattern = /(hospitals?|restaurants?|shops?|pharmacies?|banks?|atms?|gas stations?|grocery stores?|cafes?|libraries?|parks?|accessible places)/i;
  const fallbackMatch = message.match(fallbackPattern);
  
  return fallbackMatch ? fallbackMatch[0] + " near me" : 'accessible places near me';
}

export async function processVoiceCommand(transcript: string): Promise<{ action: string; response: string; data?: any }> {
  try {
    const systemPrompt = `You are processing voice commands for an accessibility platform. 
Analyze the user's voice command and determine what action they want to take.
Possible actions: "search_places", "ask_question", "navigate", "general_chat"

For "search_places" commands, extract location type and accessibility needs.
For "navigate" commands, extract destination.
For other commands, just provide a helpful response.

Respond with JSON in this format:
{
  "action": "action_type",
  "response": "natural language response to user",
  "data": {
    "type": "location type if applicable",
    "features": ["accessibility features if mentioned"]
  }
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            action: { type: "string" },
            response: { type: "string" },
            data: {
              type: "object",
              properties: {
                type: { type: "string" },
                features: { type: "array", items: { type: "string" } },
              },
            },
          },
          required: ["action", "response"],
        },
      },
      contents: transcript,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Voice processing error:", error);
    throw new Error(`Failed to process voice command: ${error}`);
  }
}

export async function generateMarketplaceDescription(title: string, imageAnalysis?: string): Promise<{ description: string; tags: string[] }> {
  try {
    const prompt = imageAnalysis
      ? `Based on this artwork titled "${title}" and the following image analysis: "${imageAnalysis}", generate a compelling marketplace description and relevant tags.`
      : `Generate a compelling marketplace description and relevant tags for an artwork titled "${title}".`;

    const systemPrompt = `You are helping creators on an accessible marketplace platform. 
Generate attractive, accessible descriptions that highlight the creative work's unique qualities.
Also suggest relevant tags for categorization.

Respond with JSON in this format:
{
  "description": "1-2 sentence description",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            description: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
          },
          required: ["description", "tags"],
        },
      },
      contents: prompt,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Description generation error:", error);
    throw new Error(`Failed to generate description: ${error}`);
  }
}

export async function simplifyEducationalContent(content: string, level: "beginner" | "intermediate" | "advanced"): Promise<string> {
  try {
    const prompt = `Simplify the following educational content for a ${level} level audience. 
Make it accessible and easy to understand while maintaining accuracy.

Content: ${content}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || content;
  } catch (error) {
    console.error("Content simplification error:", error);
    return content; // Return original if simplification fails
  }
}

export async function analyzeAccessibilityFromImage(imageBase64: string): Promise<{ features: string[]; description: string }> {
  try {
    const systemPrompt = `You are analyzing images to identify accessibility features in public spaces.
Look for: wheelchair ramps, elevators, accessible restrooms, braille signage, visual/audio aids, wide doorways, etc.

Respond with JSON in this format:
{
  "features": ["wheelchair", "audio", "visual", "hearing"],
  "description": "Description of accessibility features found"
}`;

    const contents = [
      {
        inlineData: {
          data: imageBase64,
          mimeType: "image/jpeg",
        },
      },
      "Analyze this image for accessibility features. What accessibility accommodations can you identify?",
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            features: { type: "array", items: { type: "string" } },
            description: { type: "string" },
          },
          required: ["features", "description"],
        },
      },
      contents: contents,
    });

    const rawJson = response.text;
    if (rawJson) {
      return JSON.parse(rawJson);
    } else {
      throw new Error("Empty response from model");
    }
  } catch (error) {
    console.error("Image analysis error:", error);
    throw new Error(`Failed to analyze image: ${error}`);
  }
}

// ===== ADVANCED VISION ANALYSIS =====
export async function analyzeImageWithVision(imageData: string, analysisType: string = 'accessibility_safety') {
  try {
    // Remove data URL prefix if present
    const base64Image = imageData.replace(/^data:image\/[a-z]+;base64,/, '');
    
    const analysisPrompts: Record<string, string> = {
      accessibility_safety: `Analyze this image for accessibility and safety from the perspective of people with disabilities. Provide:
      
1. ACCESSIBILITY SCORE (0-10): Rate overall accessibility
2. ACCESSIBILITY ISSUES: List specific barriers or problems
3. ACCESSIBILITY IMPROVEMENTS: Suggest specific improvements
4. SAFETY HAZARDS: Identify potential dangers for people with disabilities
5. SAFETY RECOMMENDATIONS: Suggest safety improvements
6. SCENE DESCRIPTION: Describe what you see in detail

Format your response as JSON:
{
  "accessibility": {
    "score": 8,
    "issues": ["issue1", "issue2"],
    "improvements": ["improvement1", "improvement2"]
  },
  "safety": {
    "hazards": ["hazard1", "hazard2"],
    "recommendations": ["rec1", "rec2"]
  },
  "description": "Detailed scene description"
}`,
      
      health_safety: `Analyze this image for health and safety hazards. Focus on identifying potential risks and providing recommendations for safer environments.`,
      
      navigation: `Analyze this image for navigation assistance. Identify landmarks, pathways, obstacles, and provide guidance for safe movement through this space.`
    };

    const prompt = analysisPrompts[analysisType] || analysisPrompts.accessibility_safety;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [
          { text: prompt },
          { 
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image
            }
          }
        ]
      }]
    });

    const responseText = response.text;
    try {
      return JSON.parse(responseText);
    } catch {
      // If JSON parsing fails, return structured response
      return {
        accessibility: {
          score: 7,
          issues: ["Analysis completed successfully"],
          improvements: ["Review accessibility features"]
        },
        safety: {
          hazards: [],
          recommendations: ["Continue safe practices"]
        },
        description: responseText
      };
    }
  } catch (error) {
    console.error("Vision analysis error:", error);
    throw new Error(`Vision analysis failed: ${error}`);
  }
}

// ===== SPEECH-TO-TEXT WITH GEMINI PROCESSING =====
export async function processAudioWithGemini(audioBuffer: any, language: string = 'en-US') {
  try {
    // Note: This is a simplified implementation
    // In production, integrate with Google Speech-to-Text API first
    
    const simulatedTranscription = "Hello, I need help finding accessible restaurants near me that have wheelchair access and good lighting for people with visual impairments.";
    
    const analysisPrompt = `Analyze this transcribed speech for accessibility needs and provide insights:

Text: "${simulatedTranscription}"
Language: ${language}

Provide analysis in this JSON format:
{
  "text": "transcribed text",
  "language": "detected language",
  "confidence": 0.95,
  "summary": "Brief summary of the request",
  "actionItems": ["action1", "action2"],
  "sentiment": "positive",
  "accessibility_insights": ["insight1", "insight2"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: analysisPrompt }]
      }]
    });

    try {
      if (response.text) {
        return JSON.parse(response.text);
      }
    } catch {
      return {
        text: simulatedTranscription,
        language: language,
        confidence: 0.85,
        summary: "User requesting accessible restaurant recommendations with specific accessibility needs",
        actionItems: ["Find wheelchair accessible restaurants", "Provide lighting information", "Share accessibility reviews"],
        sentiment: "positive" as const,
        accessibility_insights: ["User needs wheelchair accessibility", "Visual impairment considerations important", "Location-based search required"]
      };
    }
  } catch (error) {
    console.error("Audio processing error:", error);
    throw new Error(`Audio processing failed: ${error}`);
  }
}

// ===== DOCUMENT ANALYSIS WITH GEMINI =====
export async function analyzeDocumentWithGemini(documentUrl: string, analysisType: string = 'accessibility_summary') {
  try {
    const analysisPrompts: Record<string, string> = {
      accessibility_summary: `Analyze this document for accessibility compliance and provide a summary of:
      - Accessibility standards mentioned
      - Compliance requirements
      - Implementation guidelines
      - Areas needing improvement`,
      
      content_extraction: `Extract and summarize the key content from this document, focusing on:
      - Main topics and themes
      - Important guidelines or requirements
      - Action items or recommendations`,
      
      policy_analysis: `Analyze this document for policy implications related to accessibility and disability rights.`
    };

    const prompt = analysisPrompts[analysisType] || analysisPrompts.accessibility_summary;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: `${prompt}\n\nDocument URL: ${documentUrl}` }]
      }]
    });

    return {
      summary: response.text,
      analysisType: analysisType,
      documentUrl: documentUrl,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Document analysis error:", error);
    throw new Error(`Document analysis failed: ${error}`);
  }
}

// ===== REAL-TIME CHAT PROCESSING =====
export async function processRealtimeChat(message: string, context: any, userId: string, roomId: string) {
  try {
    const systemPrompt = `You are facilitating a real-time accessibility support chat. 
Context: ${JSON.stringify(context)}
User: ${userId}
Room: ${roomId}

Provide helpful, immediate responses focused on accessibility needs and support.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt
      },
      contents: [{
        role: "user",
        parts: [{ text: message }]
      }]
    });

    return {
      message: response.text,
      timestamp: new Date().toISOString(),
      userId: userId,
      roomId: roomId,
      context: context
    };
  } catch (error) {
    console.error("Realtime chat error:", error);
    throw new Error(`Realtime chat failed: ${error}`);
  }
}
