import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Eye,
  Users,
  BarChart2,
  ThumbsUp,
  Activity,
} from "lucide-react";

const insightsData = [
  {
    label: "Impressions",
    value: 12450,
    icon: BarChart2,
    color: "bg-blue-100 text-blue-600",
    iconBg: "bg-blue-200",
  },
  {
    label: "Reach",
    value: 9800,
    icon: Users,
    color: "bg-green-100 text-green-600",
    iconBg: "bg-green-200",
  },
  {
    label: "Views",
    value: 6700,
    icon: Eye,
    color: "bg-purple-100 text-purple-600",
    iconBg: "bg-purple-200",
  },
  {
    label: "Engagements",
    value: 2300,
    icon: Activity,
    color: "bg-yellow-100 text-yellow-600",
    iconBg: "bg-yellow-200",
  },
  {
    label: "Likes",
    value: 1200,
    icon: ThumbsUp,
    color: "bg-pink-100 text-pink-600",
    iconBg: "bg-pink-200",
  },
];

const Insights: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Insights</h1>
      <div className="flex gap-6 overflow-x-auto">
        {insightsData.map((insight) => {
          const Icon = insight.icon;
          return (
            <Card
              key={insight.label}
              className={cn(
                "flex flex-col items-center py-8 flex-1 shadow-lg border-0 hover:shadow-xl transition-shadow",
                insight.color
              )}
            >
              <CardContent className="flex flex-col items-center gap-3">
                <span className={`rounded-full p-3 mb-2 ${insight.iconBg}`}>
                  <Icon className="h-7 w-7" />
                </span>
                <span className="text-muted-foreground text-lg font-medium mb-1">
                  {insight.label}
                </span>
                <span className="text-3xl font-semibold">
                  {insight.value.toLocaleString()}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Insights;
