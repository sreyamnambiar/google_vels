import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import DirectoryCard from "@/components/DirectoryCard";
import MarketplaceCard from "@/components/MarketplaceCard";
import CommunityPost from "@/components/CommunityPost";
import EducationModule from "@/components/EducationModule";
import VoiceInputButton from "@/components/VoiceInputButton";
import AIChat from "@/components/AIChat";
import NGOCard from "@/components/NGOCard";
import CrowdfundingCard from "@/components/CrowdfundingCard";
import MapView from "@/components/MapView";
import Footer from "@/components/Footer";
import GeminiAIHub from "@/components/GeminiAIHub";
import { Mic, Map, ShoppingBag, Users, BookOpen, Sparkles, Brain, Eye, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [showChat, setShowChat] = useState(false);
  const [showGeminiHub, setShowGeminiHub] = useState(false);
  const [initialTab, setInitialTab] = useState<'vision' | 'voice' | 'liveVoice' | 'document' | 'chat' | 'overview'>('overview');

  const openVoiceCommands = () => {
    setInitialTab('liveVoice');
    setShowGeminiHub(true);
  };

  const openVisionAnalysis = () => {
    setInitialTab('vision');
    setShowGeminiHub(true);
  };

  const openDocumentAnalysis = () => {
    setInitialTab('document');
    setShowGeminiHub(true);
  };

  const openAIHub = () => {
    setInitialTab('overview');
    setShowGeminiHub(true);
  };

  if (showGeminiHub) {
    return <GeminiAIHub initialTab={initialTab} onClose={() => setShowGeminiHub(false)} />;
  }

  return (
    <div className="min-h-screen">
      <HeroSection />

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Accessibility Hub
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powered by Gemini AI's multimodal capabilities for seamless interaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Mic}
              title="Voice Commands"
              description="Navigate the platform hands-free using natural voice commands powered by Gemini AI"
              onClick={openVoiceCommands}
            />
            <FeatureCard
              icon={Eye}
              title="AI Vision Analysis"
              description="Analyze images for accessibility, safety, and navigation assistance with advanced AI"
              onClick={openVisionAnalysis}
            />
            <FeatureCard
              icon={FileText}
              title="Document Intelligence"
              description="Extract insights and accessibility compliance from documents using AI analysis"
              onClick={openDocumentAnalysis}
            />
            <FeatureCard
              icon={Map}
              title="Smart Location Assistant"
              description="Find accessible places with AI-powered recommendations and real-time directions"
            />
            <FeatureCard
              icon={Brain}
              title="AI Assistant Hub"
              description="Access all advanced AI features in one comprehensive accessibility platform"
            />
            <FeatureCard
              icon={Sparkles}
              title="Multi-Modal AI"
              description="Experience the future with vision, voice, text, and location AI working together"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Places</h2>
              <p className="text-muted-foreground">Discover accessible locations near you</p>
            </div>
            <Button variant="outline" data-testid="button-view-all-places">
              View All
            </Button>
          </div>

          <div className="mb-8">
            <MapView
              locations={[]}
              center={{ lat: 37.7749, lng: -122.4194 }}
              onLocationClick={(loc) => console.log('Selected location:', loc.name)}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Creative Marketplace</h2>
            <Button variant="outline" data-testid="button-view-all-marketplace">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MarketplaceCard
              title="Abstract Sunset"
              creator="Sarah Chen"
              price={45}
              imageUrl="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop"
              tags={["Art", "Painting"]}
              description="Vibrant abstract coastal sunset"
            />
            <MarketplaceCard
              title="Handcrafted Pottery"
              creator="Mike Torres"
              price={32}
              imageUrl="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=300&fit=crop"
              tags={["Crafts", "Pottery"]}
              description="Unique ceramic bowl collection"
            />
            <MarketplaceCard
              title="Digital Portrait"
              creator="Emma Wilson"
              price={28}
              imageUrl="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=300&fit=crop"
              tags={["Digital", "Art"]}
              description="Custom digital illustrations"
            />
            <MarketplaceCard
              title="Woven Textiles"
              creator="Alex Kumar"
              price={55}
              imageUrl="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=300&fit=crop"
              tags={["Textiles", "Crafts"]}
              description="Traditional handwoven fabrics"
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Community Highlights</h2>

          <div className="space-y-6">
            <CommunityPost
              author="Alex Rodriguez"
              timestamp="2 hours ago"
              content="Just visited the new accessible cafe downtown! Amazing voice-activated ordering system and braille menus. Highly recommend to everyone in the community!"
              likes={24}
              comments={5}
            />
            <CommunityPost
              author="Jamie Lee"
              timestamp="5 hours ago"
              content="Sharing my experience with the AI assistant feature - it helped me find three wheelchair-accessible parks in my area. This platform is truly life-changing! 🌟"
              likes={42}
              comments={12}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-8">Educational Resources</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <EducationModule
              title="Understanding Digital Accessibility"
              description="Learn the fundamentals of web accessibility and inclusive design principles"
              duration="45 min"
              difficulty="Beginner"
              topics={["WCAG Guidelines", "Screen Readers", "Keyboard Navigation"]}
              courseUrl="https://www.udemy.com/course/website-accessibility-course/?utm_source=bing&utm_medium=udemyads&utm_campaign=BG-Search_Keyword_Beta_Prof_la.EN_cc.India&campaigntype=Search&portfolio=Bing-India&language=EN&product=Course&test=&audience=Keyword&topic=Web_Accessibility&priority=Beta&utm_content=deal4584&utm_term=_._ag_1315018296134674_._ad__._kw_Web+Accessibility+Beginner_._de_c_._dm__._pl__._ti_kwd-82189763998242%3Aaud-822297996%3Aloc-90_._li_156732_._pd__._&matchtype=p&msclkid=04834008aef71bbeba4f2900c95cf7f8&couponCode=PMNVD2025"
            />
            <EducationModule
              title="Navigating Public Spaces"
              description="Tips and strategies for accessing public facilities with confidence"
              duration="30 min"
              difficulty="Beginner"
              topics={["Rights & Laws", "Communication", "Planning"]}
            />
            <EducationModule
              title="Assistive Technology Guide"
              description="Explore the latest assistive technologies and how to use them effectively"
              duration="60 min"
              difficulty="Intermediate"
              topics={["Voice Control", "Screen Magnifiers", "Braille Displays"]}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">NGO Partners</h2>
            <p className="text-muted-foreground">Organizations making accessibility a reality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NGOCard
              name="Access Alliance"
              description="Dedicated to creating accessible infrastructure and advocating for disability rights worldwide"
              focus={["Infrastructure", "Advocacy", "Education"]}
              website="https://example.org"
              membersSupported={15000}
            />
            <NGOCard
              name="Inclusive Futures"
              description="Empowering individuals with disabilities through technology training and job placement programs"
              focus={["Employment", "Training", "Technology"]}
              website="https://example.org"
              membersSupported={8500}
            />
            <NGOCard
              name="Mobility First"
              description="Providing mobility aids and assistive devices to communities in need across 50 countries"
              focus={["Mobility", "Healthcare", "Community"]}
              website="https://example.org"
              membersSupported={22000}
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">Active Campaigns</h2>
            <p className="text-muted-foreground">Support community-driven accessibility projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CrowdfundingCard
              title="Accessible Playground Equipment"
              organizer="Community First Initiative"
              description="Help us build an inclusive playground with wheelchair-accessible swings, sensory play areas, and adaptive equipment for all children"
              goal={25000}
              raised={18500}
              backers={234}
              daysLeft={15}
              category="Community"
            />
            <CrowdfundingCard
              title="Audio Description Library"
              organizer="Sight & Sound Foundation"
              description="Creating audio descriptions for 1000+ classic films to make cinema accessible for visually impaired audiences"
              goal={40000}
              raised={32800}
              backers={512}
              daysLeft={8}
              category="Arts & Culture"
            />
            <CrowdfundingCard
              title="Sign Language Education Program"
              organizer="Hands Together Learning"
              description="Free sign language courses for families and educators to improve communication with deaf and hard-of-hearing individuals"
              goal={15000}
              raised={9200}
              backers={156}
              daysLeft={22}
              category="Education"
            />
          </div>
        </div>
      </section>

      <Footer />

      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Chat Button */}
        {!showChat && (
          <Button
            onClick={() => setShowChat(true)}
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            aria-label="Open AI Assistant Chat"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </Button>
        )}
        
        {/* Voice Input Button */}
        <VoiceInputButton
          onVoiceInput={(text) => {
            console.log("Voice input:", text);
            setShowChat(true);
          }}
        />
      </div>

      {showChat && <AIChat onClose={() => setShowChat(false)} />}
    </div>
  );
}
