import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Send, Mic, Sparkles, MapPin } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import SimpleMap from "./SimpleMap";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  mapData?: {
    query: string;
    location: { lat: number; lng: number };
    results?: any[];
  };
}

interface AIChatProps {
  onClose: () => void;
}

export default function AIChat({ onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI accessibility assistant powered by Gemini. I can help you find accessible places, learn about accessibility features, get recommendations, and provide directions to nearby locations. Try asking me 'Find hospitals near me' or 'Show me wheelchair accessible restaurants nearby'. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location access denied:", error);
        }
      );
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Check if this is a location-based query
      const isLocationQuery = /\b(near|nearby|directions to|find .* near|hospitals? near|restaurants? near|shops? near|pharmacies? near|.* near .*)\b/i.test(currentInput);
      
      console.log('Query:', currentInput);
      console.log('Is location query:', isLocationQuery);
      console.log('User location:', userLocation);
      
      const requestBody = {
        message: currentInput,
        conversationHistory: messages.slice(-5), // Send last 5 messages for context
        userLocation: userLocation,
        isLocationQuery: isLocationQuery
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      console.log('API Response:', data); // Debug log
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        mapData: data.mapData // Include map data if returned
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling AI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm sorry, I'm having trouble connecting to my AI services right now. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="fixed right-6 bottom-6 w-[420px] max-w-[calc(100vw-3rem)] h-[580px] max-h-[calc(100vh-3rem)] flex flex-col shadow-2xl z-[9999] border-2 border-primary/10 bg-background/95 backdrop-blur-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 border-b bg-primary/5">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Assistant
          {userLocation && (
            <MapPin className="h-4 w-4 text-green-500" />
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Close chat"
          data-testid="button-close-chat"
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[85%] space-y-2">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted text-foreground mr-4"
                    }`}
                    data-testid={`message-${message.role}`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  </div>
                  
                  {/* Show map if message has map data */}
                  {message.mapData && (
                    <div className="mr-4">
                      <SimpleMap 
                        query={message.mapData.query}
                        location={message.mapData.location}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-foreground rounded-2xl px-4 py-3 mr-4 max-w-[85%]">
                  <p className="text-sm text-muted-foreground">AI is thinking...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 w-full"
        >
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Voice input"
            data-testid="button-voice-chat"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
            className="flex-1"
            disabled={isLoading}
            data-testid="input-chat-message"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !input.trim()}
            data-testid="button-send-message"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}