import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, LineChart, TrendingUp, Plus, Baby } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authStore } from "@/stores/authStore";
import type { Baby, GrowthRecord } from "@/types/database";
import { calculateAgeInMonths, getPercentile, WHO_WEIGHT_BOYS, WHO_WEIGHT_GIRLS, WHO_HEIGHT_BOYS, WHO_HEIGHT_GIRLS } from "@/lib/whoData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const GrowthTracker = () => {
  const navigate = useNavigate();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [growthRecords, setGrowthRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [addBabyOpen, setAddBabyOpen] = useState(false);
  const [addRecordOpen, setAddRecordOpen] = useState(false);

  const [newBaby, setNewBaby] = useState({
    name: "",
    birthDate: "",
    gender: "prefer_not_to_say" as const,
  });

  const [newRecord, setNewRecord] = useState({
    weight_kg: "",
    height_cm: "",
    head_circumference_cm: "",
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
      loadGrowthRecords(selectedBaby.id);
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

  const loadGrowthRecords = async (babyId: string) => {
    try {
      const { data, error } = await supabase
        .from("growth_records")
        .select("*")
        .eq("baby_id", babyId)
        .order("date", { ascending: false })
        .limit(10);

      if (error) throw error;
      setGrowthRecords(data || []);
    } catch (error) {
      console.error("Error loading growth records:", error);
      toast.error("Failed to load growth records");
    }
  };

  const handleAddBaby = async () => {
    try {
      const state = authStore.getState();
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", state.user?.email)
        .maybeSingle();

      if (!profile) {
        toast.error("User profile not found");
        return;
      }

      const { data, error } = await supabase
        .from("babies")
        .insert({
          user_id: profile.id,
          name: newBaby.name,
          birth_date: newBaby.birthDate,
          gender: newBaby.gender,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Baby profile added!");
      setAddBabyOpen(false);
      setNewBaby({ name: "", birthDate: "", gender: "prefer_not_to_say" });
      loadBabies();
    } catch (error) {
      console.error("Error adding baby:", error);
      toast.error("Failed to add baby");
    }
  };

  const handleAddRecord = async () => {
    if (!selectedBaby) return;

    try {
      const { error } = await supabase.from("growth_records").insert({
        baby_id: selectedBaby.id,
        weight_kg: newRecord.weight_kg ? parseFloat(newRecord.weight_kg) : null,
        height_cm: newRecord.height_cm ? parseFloat(newRecord.height_cm) : null,
        head_circumference_cm: newRecord.head_circumference_cm
          ? parseFloat(newRecord.head_circumference_cm)
          : null,
        notes: newRecord.notes || null,
      });

      if (error) throw error;

      toast.success("Growth record added!");
      setAddRecordOpen(false);
      setNewRecord({ weight_kg: "", height_cm: "", head_circumference_cm: "", notes: "" });
      loadGrowthRecords(selectedBaby.id);
    } catch (error) {
      console.error("Error adding record:", error);
      toast.error("Failed to add record");
    }
  };

  const getLatestRecord = () => {
    return growthRecords[0];
  };

  const getWHOInsights = () => {
    if (!selectedBaby || !growthRecords.length) return null;

    const latest = getLatestRecord();
    if (!latest.weight_kg && !latest.height_cm) return null;

    const ageInMonths = calculateAgeInMonths(selectedBaby.birth_date);
    const weightData = selectedBaby.gender === "male" ? WHO_WEIGHT_BOYS : WHO_WEIGHT_GIRLS;
    const heightData = selectedBaby.gender === "male" ? WHO_HEIGHT_BOYS : WHO_HEIGHT_GIRLS;

    return {
      age: ageInMonths,
      weightPercentile: latest.weight_kg
        ? getPercentile(latest.weight_kg, weightData, ageInMonths)
        : null,
      heightPercentile: latest.height_cm
        ? getPercentile(latest.height_cm, heightData, ageInMonths)
        : null,
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

  const insights = getWHOInsights();

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

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-secondary/10 border-2 border-secondary/20 flex items-center justify-center mx-auto mb-4">
              <LineChart className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Growth Tracker
              </span>
            </h1>
            <p className="text-muted-foreground">
              Track your baby's growth against WHO standards
            </p>
          </div>

          {babies.length === 0 ? (
            <Card className="p-8 text-center">
              <Baby className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Baby Profiles Yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your baby's profile to start tracking growth
              </p>
              <Dialog open={addBabyOpen} onOpenChange={setAddBabyOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Baby Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Baby Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={newBaby.name}
                        onChange={(e) => setNewBaby({ ...newBaby, name: e.target.value })}
                        placeholder="Baby's name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="birthDate">Birth Date</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={newBaby.birthDate}
                        onChange={(e) => setNewBaby({ ...newBaby, birthDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={newBaby.gender}
                        onValueChange={(value: any) => setNewBaby({ ...newBaby, gender: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleAddBaby} className="w-full">
                      Add Baby
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </Card>
          ) : (
            <>
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
                <Dialog open={addBabyOpen} onOpenChange={setAddBabyOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Baby
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Baby Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={newBaby.name}
                          onChange={(e) => setNewBaby({ ...newBaby, name: e.target.value })}
                          placeholder="Baby's name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="birthDate">Birth Date</Label>
                        <Input
                          id="birthDate"
                          type="date"
                          value={newBaby.birthDate}
                          onChange={(e) => setNewBaby({ ...newBaby, birthDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender</Label>
                        <Select
                          value={newBaby.gender}
                          onValueChange={(value: any) => setNewBaby({ ...newBaby, gender: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                            <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleAddBaby} className="w-full">
                        Add Baby
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={addRecordOpen} onOpenChange={setAddRecordOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Measurement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Growth Measurement</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          step="0.01"
                          value={newRecord.weight_kg}
                          onChange={(e) =>
                            setNewRecord({ ...newRecord, weight_kg: e.target.value })
                          }
                          placeholder="e.g., 7.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          step="0.1"
                          value={newRecord.height_cm}
                          onChange={(e) =>
                            setNewRecord({ ...newRecord, height_cm: e.target.value })
                          }
                          placeholder="e.g., 65.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="head">Head Circumference (cm)</Label>
                        <Input
                          id="head"
                          type="number"
                          step="0.1"
                          value={newRecord.head_circumference_cm}
                          onChange={(e) =>
                            setNewRecord({ ...newRecord, head_circumference_cm: e.target.value })
                          }
                          placeholder="e.g., 42.0"
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Input
                          id="notes"
                          value={newRecord.notes}
                          onChange={(e) =>
                            setNewRecord({ ...newRecord, notes: e.target.value })
                          }
                          placeholder="Any observations..."
                        />
                      </div>
                      <Button onClick={handleAddRecord} className="w-full">
                        Save Measurement
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {selectedBaby && insights && (
                <Card className="mb-6 p-6 gradient-card shadow-soft border-2">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    WHO Growth Insights
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-background/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">Age</p>
                      <p className="text-2xl font-bold text-secondary">
                        {insights.age} months
                      </p>
                    </div>
                    {insights.weightPercentile && (
                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Weight Percentile</p>
                        <p className="text-2xl font-bold text-primary">
                          {insights.weightPercentile}
                        </p>
                      </div>
                    )}
                    {insights.heightPercentile && (
                      <div className="p-4 bg-background/50 rounded-lg">
                        <p className="text-sm text-muted-foreground">Height Percentile</p>
                        <p className="text-2xl font-bold text-accent">
                          {insights.heightPercentile}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              <Card className="p-6 gradient-card shadow-soft border-2">
                <h3 className="text-xl font-semibold mb-4">Recent Measurements</h3>
                {growthRecords.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No measurements yet. Add your first measurement above!
                  </p>
                ) : (
                  <div className="space-y-3">
                    {growthRecords.map((record) => (
                      <div
                        key={record.id}
                        className="p-4 bg-background/50 rounded-lg border-2 border-border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold">
                            {new Date(record.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {record.weight_kg && (
                            <div>
                              <p className="text-muted-foreground">Weight</p>
                              <p className="font-semibold">{record.weight_kg} kg</p>
                            </div>
                          )}
                          {record.height_cm && (
                            <div>
                              <p className="text-muted-foreground">Height</p>
                              <p className="font-semibold">{record.height_cm} cm</p>
                            </div>
                          )}
                          {record.head_circumference_cm && (
                            <div>
                              <p className="text-muted-foreground">Head</p>
                              <p className="font-semibold">{record.head_circumference_cm} cm</p>
                            </div>
                          )}
                        </div>
                        {record.notes && (
                          <p className="text-sm text-muted-foreground mt-2">{record.notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrowthTracker;
