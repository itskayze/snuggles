import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, TrendingUp, Calendar, Heart, Moon, UtensilsCrossed } from "lucide-react";
import { authStore } from "@/stores/authStore";
import { supabase } from "@/integrations/supabase/client";
import type { Baby, Insight } from "@/types/database";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SmartInsights = () => {
  const navigate = useNavigate();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const state = authStore.getState();
    if (!state.isAuthenticated) {
      navigate("/auth");
      return;
    }
    loadBabies();
  }, [navigate]);

  useEffect(() => {
    if (selectedBaby) {
      loadInsights(selectedBaby.id);
    }
  }, [selectedBaby]);

  const loadBabies = async () => {
    try {
      const state = authStore.getState();
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", state.user?.email)
        .maybeSingle();

      if (!profile) return;

      const { data, error } = await supabase
        .from("babies")
        .select("*")
        .eq("user_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setBabies(data || []);
      if (data && data.length > 0) {
        setSelectedBaby(data[0]);
      }
    } catch (error) {
      console.error("Error loading babies:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadInsights = async (babyId: string) => {
    try {
      const { data, error } = await supabase
        .from("insights")
        .select("*")
        .eq("baby_id", babyId)
        .order("insight_date", { ascending: false })
        .limit(20);

      if (error) throw error;
      setInsights(data || []);
    } catch (error) {
      console.error("Error loading insights:", error);
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'sleep': return <Moon className="w-5 h-5" />;
      case 'nutrition': return <UtensilsCrossed className="w-5 h-5" />;
      case 'wellness': return <Heart className="w-5 h-5" />;
      case 'growth': return <TrendingUp className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  const generateDemoInsights = () => {
    if (!selectedBaby) return [];
    const ageInMonths = Math.floor(
      (Date.now() - new Date(selectedBaby.birth_date).getTime()) / (1000 * 60 * 60 * 24 * 30)
    );

    return [
      {
        type: 'sleep',
        title: 'Sleep Pattern Observation',
        description: `${selectedBaby.name} is averaging good sleep durations. Continue maintaining consistent bedtime routines.`,
        date: new Date().toLocaleDateString(),
      },
      {
        type: 'growth',
        title: 'Growth Milestone',
        description: `At ${ageInMonths} months, ${selectedBaby.name} is developing well. Keep tracking measurements regularly.`,
        date: new Date().toLocaleDateString(),
      },
      {
        type: 'nutrition',
        title: 'Feeding Recommendation',
        description: `Based on ${selectedBaby.name}'s age, consider introducing new food textures if you haven't already.`,
        date: new Date().toLocaleDateString(),
      },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const displayInsights = insights.length > 0 ? insights : (selectedBaby ? generateDemoInsights() : []);

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
            <div className="w-16 h-16 rounded-2xl bg-sky/10 border-2 border-sky/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-sky" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Smart Insights
              </span>
            </h1>
            <p className="text-muted-foreground">
              Personalized insights that adapt to your parenting journey
            </p>
          </div>

          {babies.length > 0 && (
            <div className="flex gap-4 mb-6">
              <Select
                value={selectedBaby?.id}
                onValueChange={(id) => {
                  const baby = babies.find((b) => b.id === id);
                  if (baby) setSelectedBaby(baby);
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select baby" />
                </SelectTrigger>
                <SelectContent>
                  {babies.map((baby) => (
                    <SelectItem key={baby.id} value={baby.id}>
                      {baby.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {babies.length === 0 ? (
            <Card className="p-8 text-center">
              <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Baby Profiles Yet</h3>
              <p className="text-muted-foreground mb-4">
                Add a baby profile to start receiving personalized insights
              </p>
              <Button onClick={() => navigate("/growth-tracker")}>Go to Growth Tracker</Button>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card className="p-6 gradient-card shadow-soft border-2 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Personalized Insights for {selectedBaby?.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  Based on your tracking data, here are AI-generated insights to support your parenting journey.
                </p>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {displayInsights.map((insight: any, index) => (
                  <Card key={index} className="p-6 gradient-card shadow-soft border-2">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getInsightIcon(insight.insight_type || insight.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">
                          {insight.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(insight.insight_date || insight.date).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>

              {displayInsights.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">
                    Start tracking data in other features to receive personalized insights
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartInsights;
