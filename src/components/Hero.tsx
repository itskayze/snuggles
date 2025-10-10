import { Button } from "@/components/ui/button";
import { MessageCircle, Sparkles } from "lucide-react";
import cloudBearHero from "@/assets/cloud-bear-hero.jpg";
import heroBackground from "@/assets/hero-background.jpg";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 gradient-hero opacity-40" />
      
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Wellness Companion</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              Your Baby's Digital{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Wellness Companion
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Personalized, expert-verified AI guidance for modern parents. Track growth, analyze sleep patterns, plan nutrition, and nurture your baby with trusted support.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gap-2 shadow-medium hover:shadow-float transition-all" onClick={() => window.location.href = '/auth'}>
                <MessageCircle className="w-5 h-5" />
                Start with SnugBot
              </Button>
              <Button size="lg" variant="outline" className="border-2" onClick={() => window.location.href = '/auth'}>
                Explore Features
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Happy Parents</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">4.9★</div>
                <div className="text-sm text-muted-foreground">Expert Rating</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">100%</div>
                <div className="text-sm text-muted-foreground">Verified Content</div>
              </div>
            </div>
          </div>
          
          {/* Right content - Cloud Bear */}
          <div className="relative animate-scale-in">
            <div className="relative">
              <img 
                src={cloudBearHero} 
                alt="Snug the Cloud Bear - Your caring AI companion"
                className="w-full max-w-2xl mx-auto float-animation"
              />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl glow-pulse" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-accent/20 rounded-full blur-3xl glow-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
