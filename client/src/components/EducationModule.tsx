import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock } from "lucide-react";

interface EducationModuleProps {
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  topics: string[];
  courseUrl?: string;
}

export default function EducationModule({
  title,
  description,
  duration,
  difficulty,
  topics,
  courseUrl,
}: EducationModuleProps) {
  const difficultyColors = {
    Beginner: "secondary",
    Intermediate: "default",
    Advanced: "destructive",
  } as const;

  const handleStartLearning = () => {
    if (courseUrl) {
      window.open(courseUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="hover-elevate" data-testid={`module-${title.toLowerCase().replace(/\s/g, '-')}`}>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <CardTitle className="text-xl flex-1">{title}</CardTitle>
          <Badge variant={difficultyColors[difficulty]}>{difficulty}</Badge>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {topics.length} topics
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge key={topic} variant="outline" className="text-xs">
              {topic}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button 
            className="flex-1" 
            onClick={handleStartLearning}
            data-testid="button-start-module"
          >
            Start Learning
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
