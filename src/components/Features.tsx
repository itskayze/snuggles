import { Card } from "@/components/ui/card";
import { 
  Bot, 
  LineChart, 
  Moon, 
  UtensilsCrossed, 
  Heart, 
  BookOpen,
  AlertCircle,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "SnugBot AI Assistant",
    description: "Real-time personalized support with our nurturing AI trained on verified pediatric datasets.",
    color: "primary",
  },
  {
    icon: LineChart,
    title: "Growth Tracker",
    description: "Track height, weight, and milestones against WHO growth charts with AI-powered insights.",
    color: "secondary",
  },
  {
    icon: Moon,
    title: "Sleep & Cry Analyzer",
    description: "Predictive AI analyzing sleep patterns and suggesting optimal routines for better rest.",
    color: "accent",
  },
  {
    icon: UtensilsCrossed,
    title: "Nutrition Planner",
    description: "Dynamic meal planning tailored to your baby's age, health, and dietary preferences.",
    color: "sky",
  },
  {
    icon: Heart,
    title: "Parent Wellness",
    description: "Mental wellness support with mood tracking, affirmations, and mindfulness sessions.",
    color: "primary",
  },
  {
    icon: BookOpen,
    title: "Expert Content Hub",
    description: "Verified educational content from WHO, UNICEF, NHS, and AAP pediatric experts.",
    color: "secondary",
  },
  {
    icon: AlertCircle,
    title: "Emergency Guide",
    description: "Interactive cards for common baby emergencies with AI-guided voice navigation.",
    color: "accent",
  },
  {
    icon: Sparkles,
    title: "Smart Insights",
    description: "Daily personalized insights and recommendations that adapt to your parenting journey.",
    color: "sky",
  },
];

const colorMap = {
  primary: "bg-primary/10 text-primary border-primary/20",
  secondary: "bg-secondary/10 text-secondary border-secondary/20",
  accent: "bg-accent/10 text-accent border-accent/20",
  sky: "bg-sky/10 text-sky border-sky/20",
};

export const Features = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Confident Parenting
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Scientifically backed features designed to support every stage of your baby's journey
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="p-6 gradient-card shadow-soft hover:shadow-medium transition-all group cursor-pointer border-2 hover:border-primary/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl ${colorMap[feature.color as keyof typeof colorMap]} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 border`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
