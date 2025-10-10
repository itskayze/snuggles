import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, User } from "lucide-react";

const sampleMessages = [
  {
    role: "user",
    content: "My baby hasn't been sleeping well. What should I do?",
  },
  {
    role: "assistant",
    content: "Hey there! I understand sleep challenges can be tough. Let me suggest a gentle bedtime routine: a warm bath at 7 PM, dimmed lights, soft lullabies, and feeding before sleep. Would you like me to create a personalized sleep schedule based on your baby's age?",
  },
  {
    role: "user",
    content: "Yes please! She's 6 months old.",
  },
  {
    role: "assistant",
    content: "Perfect! At 6 months, babies typically need 14-15 hours of sleep total. I've created a gentle routine for you:\n\n• 7:00 AM - Wake & feed\n• 9:00 AM - Morning nap (1-1.5 hrs)\n• 1:00 PM - Afternoon nap (1-1.5 hrs)\n• 7:00 PM - Bedtime routine\n• 7:30 PM - Night sleep\n\nShall I set up sleep tracking reminders?",
  },
];

export const ChatPreview = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-fade-in">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Meet{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              SnugBot
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Your AI companion offering real-time, personalized support — calm, nurturing, and always there when you need guidance.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-float border-2 overflow-hidden">
            {/* Chat header */}
            <div className="gradient-hero p-4 flex items-center gap-3 border-b-2 border-primary/30">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-primary-foreground">SnugBot</h3>
                <p className="text-sm text-primary-foreground/80">Always here to help</p>
              </div>
              <div className="w-3 h-3 rounded-full bg-success animate-glow-pulse" />
            </div>
            
            {/* Chat messages */}
            <div className="p-6 space-y-4 max-h-[500px] overflow-y-auto bg-muted/20">
              {sampleMessages.map((message, index) => (
                <div 
                  key={index}
                  className={`flex gap-3 animate-fade-in-up ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-secondary text-secondary-foreground'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl shadow-soft max-w-[85%] ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-card text-card-foreground rounded-tl-sm border-2'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t-2 bg-background">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask SnugBot anything..." 
                  className="flex-1 rounded-full border-2"
                  disabled
                />
                <Button size="icon" className="rounded-full shadow-medium" disabled>
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                This is a preview. Full chat available in the app.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
