import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Share2, Calendar } from "lucide-react";
import { useState } from "react";

interface CrowdfundingCardProps {
  title: string;
  organizer: string;
  description: string;
  goal: number;
  raised: number;
  backers: number;
  daysLeft: number;
  category: string;
  imageUrl?: string;
}

export default function CrowdfundingCard({
  title,
  organizer,
  description,
  goal,
  raised,
  backers,
  daysLeft,
  category,
  imageUrl,
}: CrowdfundingCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [imageError, setImageError] = useState(false);
  const percentage = Math.min((raised / goal) * 100, 100);

  const handleImageError = () => {
    setImageError(true);
  };

  // Fallback image based on category
  const getCategoryFallback = (category: string) => {
    const fallbacks = {
      'Community': '🏘️',
      'Arts & Culture': '🎭',
      'Education': '📚',
      'Technology': '💻',
      'Health': '🏥',
      'Environment': '🌱'
    };
    return fallbacks[category as keyof typeof fallbacks] || '🎯';
  };

  return (
    <Card className="hover-elevate overflow-hidden" data-testid={`crowdfunding-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <div className="relative">
        {imageUrl && !imageError ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-48 object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="text-6xl mb-3">{getCategoryFallback(category)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wide">{category}</div>
            </div>
          </div>
        )}
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-800 border-0 shadow-sm">{category}</Badge>
      </div>
      <CardHeader className="space-y-3">
        <CardTitle className="text-xl leading-tight">{title}</CardTitle>
        <p className="text-sm text-muted-foreground">by {organizer}</p>
        <p className="text-sm text-foreground leading-relaxed line-clamp-2">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-primary">${raised.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">of ${goal.toLocaleString()}</span>
          </div>
          <Progress value={percentage} className="h-2" />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="font-semibold text-foreground">{backers}</span>
            <span className="text-muted-foreground"> backers</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {daysLeft} days left
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 border-t pt-4">
        <Button className="flex-1" data-testid="button-donate">
          Donate Now
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSaved(!isSaved)}
          className={isSaved ? "text-destructive" : ""}
          aria-label="Save campaign"
          data-testid="button-save-campaign"
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        </Button>
        <Button variant="outline" size="icon" aria-label="Share campaign" data-testid="button-share-campaign">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
