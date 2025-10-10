import { Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t-2 border-border">
      <div className="absolute inset-0 gradient-hero opacity-5" />
      
      <div className="container relative z-10 mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <h3 className="text-2xl font-bold">Snuggles</h3>
          </div>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            by <span className="font-semibold text-foreground">Sarang.co</span>
          </p>
          
          <p className="text-muted-foreground italic">
            Where science meets love, and technology nurtures trust.
          </p>
          
          <div className="pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sarang.co. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Medical information verified by WHO, UNICEF, NHS, CDC, and AAP healthcare experts.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
