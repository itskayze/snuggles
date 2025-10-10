import { Card } from "@/components/ui/card";
import { Heart, Lightbulb, Quote } from "lucide-react";

const founders = [
  {
    name: "Sarah Khan",
    role: "Co-Founder & Chief Health Strategist",
    bio: "A globally recognized child wellness researcher and healthcare innovator, passionate about bridging public health with technology.",
    philosophy: "Parents deserve guidance that's as kind as it is credible.",
    icon: Heart,
  },
  {
    name: "Krishang Saharia",
    role: "Co-Founder & Product Visionary",
    bio: "An AI innovator, writer, and designer with a mission to humanize technology and build purpose-driven digital ecosystems.",
    philosophy: "Every piece of code should carry warmth.",
    icon: Lightbulb,
  },
];

export const About = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-accent opacity-10" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-6 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold animate-scale-in">
            The Heart Behind{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-float">
              Snuggles
            </span>
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            At Snuggles by Sarang.co, we're reimagining babycare for the modern world — blending science, empathy, and verified AI to guide parents confidently through every step of nurturing.
          </p>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We believe that technology should comfort, not overwhelm. Every recommendation, every pixel, and every prompt within Snuggles is designed with that single goal in mind: to make parenthood a little lighter, and love a little easier.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {founders.map((founder, index) => {
            const Icon = founder.icon;
            return (
              <Card 
                key={index}
                className="p-8 gradient-card shadow-medium hover:shadow-float transition-all border-2 animate-fade-in hover:scale-105"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0 animate-float">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-1">
                      <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                        {founder.name}
                      </span>
                    </h3>
                    <p className="text-sm text-primary font-medium">{founder.role}</p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {founder.bio}
                </p>
                
                <div className="relative pl-6 border-l-4 border-primary/30">
                  <Quote className="absolute -left-3 -top-2 w-6 h-6 text-primary/40" />
                  <p className="text-foreground font-medium italic">
                    {founder.philosophy}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
        
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="p-8 gradient-card shadow-soft border-2">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  Our Mission
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower parents worldwide with personalized, expert-approved, and emotionally intelligent babycare, uniting verified science with heartfelt design.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Lightbulb className="w-6 h-6 text-accent" />
                  Our Vision
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  To make Snuggles the world's most trusted AI-driven baby wellness companion, where every insight is safe, every suggestion is kind, and every moment feels supported.
                </p>
              </div>
            </div>
          </Card>
          
          <Card className="p-8 gradient-hero text-center shadow-medium border-2 border-primary/30">
            <Quote className="w-12 h-12 text-primary-foreground/60 mx-auto mb-4" />
            <blockquote className="text-xl md:text-2xl font-medium text-primary-foreground leading-relaxed mb-6">
              "Snuggles was born from a simple truth — parenting can be overwhelming, even when it's beautiful. We wanted to create something that doesn't just give answers, but understands emotions."
            </blockquote>
            <p className="text-lg text-primary-foreground/90 mb-2">
              Every night feed, every cry, every tiny milestone matters.
            </p>
            <p className="text-lg text-primary-foreground/90 mb-6">
              Our dream with Snuggles is to make technology hold your hand through them — gently, intelligently, and with love.
            </p>
            <p className="text-primary-foreground font-semibold">
              — Sarah Khan & Krishang Saharia, Co-Founders
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};
