import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertCircle, Phone, Shield, AlertTriangle } from "lucide-react";
import { EMERGENCY_CARDS, EMERGENCY_CONTACTS } from "@/lib/emergencyData";
import { authStore } from "@/stores/authStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const EmergencyGuide = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    const state = authStore.getState();
    if (!state.isAuthenticated) {
      navigate("/auth");
      return;
    }
  }, [navigate]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'destructive';
      case 'moderate': return 'default';
      default: return 'secondary';
    }
  };

  const selectedCardData = EMERGENCY_CARDS.find(card => card.id === selectedCard);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          onClick={() => navigate("/dashboard")}
          variant="outline"
          className="mb-6 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/20 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Emergency Guide
              </span>
            </h1>
            <p className="text-muted-foreground">
              Quick access to emergency information when you need it most
            </p>
          </div>

          <Card className="p-6 gradient-card shadow-soft border-2 mb-6 bg-accent/5">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-8 h-8 text-accent" />
              <div>
                <h3 className="text-xl font-semibold">Emergency Services</h3>
                <p className="text-sm text-muted-foreground">
                  In case of emergency, always call your local emergency number
                </p>
              </div>
            </div>
            <p className="text-accent font-semibold">
              ⚠️ For serious emergencies, seek immediate medical attention
            </p>
          </Card>

          <Card className="p-6 gradient-card shadow-soft border-2 mb-6 bg-gradient-to-r from-destructive/10 to-destructive/5">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-5 h-5 text-destructive" />
              Emergency Contacts
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {EMERGENCY_CONTACTS.map((contact, i) => (
                <div key={i} className="p-3 bg-background rounded-lg border-2 border-destructive/20">
                  <p className="font-semibold text-sm mb-1">{contact.name}</p>
                  <p className="text-xl font-bold text-destructive mb-1">{contact.number}</p>
                  <p className="text-xs text-muted-foreground">{contact.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {EMERGENCY_CARDS.map((card) => (
              <Card
                key={card.id}
                className="p-5 gradient-card shadow-soft border-2 hover:shadow-medium transition-all cursor-pointer"
                onClick={() => setSelectedCard(card.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <Badge variant={getCategoryColor(card.category) as any}>
                    {card.category === 'urgent' ? <AlertTriangle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {card.symptoms.slice(0, 2).join(', ')}...
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  View Steps
                </Button>
              </Card>
            ))}
          </div>

          <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              {selectedCardData && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {selectedCardData.title}
                      <Badge variant={getCategoryColor(selectedCardData.category) as any}>
                        {selectedCardData.category}
                      </Badge>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        Symptoms
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {selectedCardData.symptoms.map((symptom, i) => (
                          <li key={i}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        What to Do
                      </h4>
                      <ol className="list-decimal list-inside space-y-2 text-sm">
                        {selectedCardData.steps.map((step, i) => (
                          <li key={i} className="text-muted-foreground">{step}</li>
                        ))}
                      </ol>
                    </div>
                    <div className="p-4 bg-destructive/10 rounded-lg border-2 border-destructive/20">
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-destructive">
                        <Phone className="w-4 h-4" />
                        When to Call Doctor
                      </h4>
                      <p className="text-sm">{selectedCardData.whenToCallDoctor}</p>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default EmergencyGuide;
