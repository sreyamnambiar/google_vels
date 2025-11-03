import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

export default function FeatureCard({ icon: Icon, title, description, onClick }: FeatureCardProps) {
  return (
    <Card 
      className={`hover-elevate text-center ${onClick ? 'cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg' : ''}`} 
      data-testid={`feature-${title.toLowerCase().replace(/\s/g, '-')}`}
      onClick={onClick}
    >
      <CardHeader className="space-y-4">
        <div className="mx-auto h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
