import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, UtensilsCrossed, Plus, Baby, Calendar } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authStore } from "@/stores/authStore";
import type { Baby, NutritionRecord } from "@/types/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAgeCategory, MEAL_SUGGESTIONS, FEEDING_SCHEDULE } from "@/lib/nutritionData";

const NutritionPlanner = () => {
  const navigate = useNavigate();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [nutritionRecords, setNutritionRecords] = useState<NutritionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [addMealOpen, setAddMealOpen] = useState(false);

  const [newMeal, setNewMeal] = useState({
    meal_type: "solid_food" as const,
    amount: "",
    food_items: "",
    notes: "",
  });

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
      loadNutritionRecords(selectedBaby.id);
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
      toast.error("Failed to load babies");
    } finally {
      setLoading(false);
    }
  };

  const loadNutritionRecords = async (babyId: string) => {
    try {
      const { data, error } = await supabase
        .from("nutrition_records")
        .select("*")
        .eq("baby_id", babyId)
        .order("meal_time", { ascending: false })
        .limit(20);

      if (error) throw error;
      setNutritionRecords(data || []);
    } catch (error) {
      console.error("Error loading nutrition records:", error);
      toast.error("Failed to load nutrition records");
    }
  };

  const handleAddMeal = async () => {
    if (!selectedBaby) return;

    try {
      const foodItems = newMeal.food_items.split(',').map(item => item.trim()).filter(Boolean);

      const { error } = await supabase.from("nutrition_records").insert({
        baby_id: selectedBaby.id,
        meal_type: newMeal.meal_type,
        amount: newMeal.amount || null,
        food_items: foodItems.length > 0 ? { items: foodItems } : null,
        notes: newMeal.notes || null,
      });

      if (error) throw error;

      toast.success("Meal logged!");
      setAddMealOpen(false);
      setNewMeal({ meal_type: "solid_food", amount: "", food_items: "", notes: "" });
      loadNutritionRecords(selectedBaby.id);
    } catch (error) {
      console.error("Error adding meal:", error);
      toast.error("Failed to log meal");
    }
  };

  const getMealSuggestions = () => {
    if (!selectedBaby) return null;
    const category = getAgeCategory(selectedBaby.birth_date);
    return MEAL_SUGGESTIONS[category as keyof typeof MEAL_SUGGESTIONS];
  };

  const getFeedingSchedule = () => {
    if (!selectedBaby) return null;
    const category = getAgeCategory(selectedBaby.birth_date);
    return FEEDING_SCHEDULE[category as keyof typeof FEEDING_SCHEDULE];
  };

  const getTodayStats = () => {
    const today = new Date().toDateString();
    const todayMeals = nutritionRecords.filter(
      r => new Date(r.meal_time).toDateString() === today
    );

    return {
      totalMeals: todayMeals.length,
      breastMilk: todayMeals.filter(r => r.meal_type === 'breast_milk').length,
      formula: todayMeals.filter(r => r.meal_type === 'formula').length,
      solids: todayMeals.filter(r => r.meal_type === 'solid_food').length,
    };
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

  if (babies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 py-8">
          <Button onClick={() => navigate("/dashboard")} variant="outline" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Card className="p-8 text-center max-w-2xl mx-auto">
            <Baby className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Baby Profiles Yet</h3>
            <p className="text-muted-foreground mb-4">
              Please add a baby profile in Growth Tracker first
            </p>
            <Button onClick={() => navigate("/growth-tracker")}>Go to Growth Tracker</Button>
          </Card>
        </div>
      </div>
    );
  }

  const suggestions = getMealSuggestions();
  const schedule = getFeedingSchedule();
  const stats = getTodayStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-sky/10 border-2 border-sky/20 flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8 text-sky" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Nutrition Planner
              </span>
            </h1>
            <p className="text-muted-foreground">Dynamic meal planning tailored to your baby's needs</p>
          </div>

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

            <Dialog open={addMealOpen} onOpenChange={setAddMealOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Log Meal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Meal</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="meal_type">Meal Type</Label>
                    <Select value={newMeal.meal_type} onValueChange={(value: any) => setNewMeal({ ...newMeal, meal_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breast_milk">Breast Milk</SelectItem>
                        <SelectItem value="formula">Formula</SelectItem>
                        <SelectItem value="solid_food">Solid Food</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                        <SelectItem value="water">Water</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="amount">Amount (optional)</Label>
                    <Input
                      id="amount"
                      value={newMeal.amount}
                      onChange={(e) => setNewMeal({ ...newMeal, amount: e.target.value })}
                      placeholder="e.g., 120ml, 1 cup"
                    />
                  </div>
                  <div>
                    <Label htmlFor="food_items">Food Items (comma-separated)</Label>
                    <Input
                      id="food_items"
                      value={newMeal.food_items}
                      onChange={(e) => setNewMeal({ ...newMeal, food_items: e.target.value })}
                      placeholder="e.g., banana, rice cereal, carrots"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Input
                      id="notes"
                      value={newMeal.notes}
                      onChange={(e) => setNewMeal({ ...newMeal, notes: e.target.value })}
                      placeholder="Any observations..."
                    />
                  </div>
                  <Button onClick={handleAddMeal} className="w-full">
                    Save Meal
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 gradient-card shadow-soft border-2">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Today's Summary
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Meals</span>
                  <span className="font-bold">{stats.totalMeals}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Breast Milk</span>
                  <span className="font-bold">{stats.breastMilk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Formula</span>
                  <span className="font-bold">{stats.formula}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Solid Foods</span>
                  <span className="font-bold">{stats.solids}</span>
                </div>
              </div>
            </Card>

            {suggestions && (
              <Card className="p-6 gradient-card shadow-soft border-2 md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Age-Appropriate Meal Suggestions</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-primary mb-2">Recommended Foods:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {suggestions.meals.map((meal, i) => (
                        <li key={i}>{meal}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <p className="text-sm font-semibold mb-1">Feeding Schedule:</p>
                    <p className="text-sm text-muted-foreground">{schedule}</p>
                  </div>
                  <div className="p-3 bg-secondary/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">{suggestions.notes}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>

          <Card className="p-6 gradient-card shadow-soft border-2">
            <h3 className="text-xl font-semibold mb-4">Recent Meals</h3>
            {nutritionRecords.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No meals logged yet</p>
            ) : (
              <div className="space-y-3">
                {nutritionRecords.slice(0, 10).map((record) => (
                  <div key={record.id} className="p-4 bg-background/50 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-sm">
                          {new Date(record.meal_time).toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {record.meal_type.replace('_', ' ')}
                        </p>
                      </div>
                      {record.amount && (
                        <span className="text-sm font-semibold text-primary">{record.amount}</span>
                      )}
                    </div>
                    {record.food_items && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(record.food_items as any).items?.map((item: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-secondary/20 text-xs rounded-full">
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                    {record.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{record.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NutritionPlanner;
