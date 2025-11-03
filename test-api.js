// Test script to verify Gemini API key works
import { GoogleGenAI } from "@google/genai";

const apiKey = "AIzaSyB5KOKJRZBqkg8gMPyp0urZ3IjgX4cxB1g";
const ai = new GoogleGenAI({ apiKey });

async function testAPI() {
  try {
    console.log("Testing Gemini API...");
    
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("Hello, this is a test message. Please respond.");
    
    console.log("✅ API Key is working!");
    console.log("Response:", result.response.text());
    
  } catch (error) {
    console.error("❌ API Key test failed:", error.message);
  }
}

testAPI();