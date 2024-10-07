import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from 'lucide-react';

interface BrandMetricsProps {
  healthScore: number;
  healthMessage: string;
  achievements: string[];
  level: number;
  xp: number;
  maxXp: number;
}

const BrandMetrics: React.FC<BrandMetricsProps> = ({
  healthScore,
  healthMessage,
  achievements,
  level,
  xp,
  maxXp
}) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Brand Health Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold">{healthScore}</div>
            <Progress value={healthScore} className="w-full" />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">{healthMessage}</p>
        </CardFooter>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2" />
            Brand Building Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {achievements.map((achievement, index) => (
              <Badge key={index} variant="secondary" className="bg-white text-purple-500">
                {achievement}
              </Badge>
            ))}
          </div>
          <Progress value={(xp / maxXp) * 100} className="mt-4" />
          <p className="mt-2">Level {level}: Brand Maestro ({xp}/{maxXp} XP)</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandMetrics;