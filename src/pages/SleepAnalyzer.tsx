import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Moon, CloudMoon, Plus, Baby, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authStore } from "@/stores/authStore";
import type { Baby, SleepRecord, CryRecord } from "@/types/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SleepAnalyzer = () => {
  const navigate = useNavigate();
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [sleepRecords, setSleepRecords] = useState<SleepRecord[]>([]);
  const [cryRecords, setCryRecords] = useState<CryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [addSleepOpen, setAddSleepOpen] = useState(false);
  const [addCryOpen, setAddCryOpen] = useState(false);

  const [newSleep, setNewSleep] = useState({
    sleep_start: "",
    sleep_end: "",
    sleep_quality: "good" as const,
    notes: "",
  });

  const [newCry, setNewCry] = useState({
    duration_minutes: "",
    cry_type: "unknown" as const,
    resolution: "",
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
      loadRecords(selectedBaby.id);
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

  const loadRecords = async (babyId: string) => {
    try {
      const { data: sleepData, error: sleepError } = await supabase
        .from("sleep_records")
        .select("*")
        .eq("baby_id", babyId)
        .order("sleep_start", { ascending: false })
        .limit(10);

      const { data: cryData, error: cryError } = await supabase
        .from("cry_records")
        .select("*")
        .eq("baby_id", babyId)
        .order("cry_time", { ascending: false })
        .limit(10);

      if (sleepError) throw sleepError;
      if (cryError) throw cryError;

      setSleepRecords(sleepData || []);
      setCryRecords(cryData || []);
    } catch (error) {
      console.error("Error loading records:", error);
      toast.error("Failed to load records");
    }
  };

  const handleAddSleep = async () => {
    if (!selectedBaby) return;

    try {
      const { error } = await supabase.from("sleep_records").insert({
        baby_id: selectedBaby.id,
        sleep_start: newSleep.sleep_start,
        sleep_end: newSleep.sleep_end || null,
        sleep_quality: newSleep.sleep_quality,
        notes: newSleep.notes || null,
      });

      if (error) throw error;

      toast.success("Sleep record added!");
      setAddSleepOpen(false);
      setNewSleep({ sleep_start: "", sleep_end: "", sleep_quality: "good", notes: "" });
      loadRecords(selectedBaby.id);
    } catch (error) {
      console.error("Error adding sleep record:", error);
      toast.error("Failed to add sleep record");
    }
  };

  const handleAddCry = async () => {
    if (!selectedBaby) return;

    try {
      const { error } = await supabase.from("cry_records").insert({
        baby_id: selectedBaby.id,
        duration_minutes: parseInt(newCry.duration_minutes),
        cry_type: newCry.cry_type,
        resolution: newCry.resolution || null,
      });

      if (error) throw error;

      toast.success("Cry record added!");
      setAddCryOpen(false);
      setNewCry({ duration_minutes: "", cry_type: "unknown", resolution: "" });
      loadRecords(selectedBaby.id);
    } catch (error) {
      console.error("Error adding cry record:", error);
      toast.error("Failed to add cry record");
    }
  };

  const calculateSleepInsights = () => {
    if (!sleepRecords.length) return null;

    const completedSleeps = sleepRecords.filter((r) => r.sleep_end);
    if (!completedSleeps.length) return null;

    const totalMinutes = completedSleeps.reduce((sum, record) => {
      const start = new Date(record.sleep_start).getTime();
      const end = new Date(record.sleep_end!).getTime();
      return sum + (end - start) / (1000 * 60);
    }, 0);

    const avgMinutes = Math.round(totalMinutes / completedSleeps.length);
    const avgHours = Math.floor(avgMinutes / 60);
    const avgMins = avgMinutes % 60;

    const goodQuality = completedSleeps.filter((r) => r.sleep_quality === "excellent" || r.sleep_quality === "good").length;
    const qualityPercent = Math.round((goodQuality / completedSleeps.length) * 100);

    return { avgHours, avgMins, qualityPercent, totalRecords: completedSleeps.length };
  };

  const insights = calculateSleepInsights();

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 border-2 border-accent/20 flex items-center justify-center mx-auto mb-4">
              <Moon className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Sleep & Cry Analyzer
              </span>
            </h1>
            <p className="text-muted-foreground">Understand and optimize your baby's sleep patterns</p>
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

            <Dialog open={addSleepOpen} onOpenChange={setAddSleepOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Log Sleep
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Sleep Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sleep_start">Start Time</Label>
                    <Input
                      id="sleep_start"
                      type="datetime-local"
                      value={newSleep.sleep_start}
                      onChange={(e) => setNewSleep({ ...newSleep, sleep_start: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleep_end">End Time (optional)</Label>
                    <Input
                      id="sleep_end"
                      type="datetime-local"
                      value={newSleep.sleep_end}
                      onChange={(e) => setNewSleep({ ...newSleep, sleep_end: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sleep_quality">Sleep Quality</Label>
                    <Select value={newSleep.sleep_quality} onValueChange={(value: any) => setNewSleep({ ...newSleep, sleep_quality: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="poor">Poor</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="excellent">Excellent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sleep_notes">Notes (optional)</Label>
                    <Input
                      id="sleep_notes"
                      value={newSleep.notes}
                      onChange={(e) => setNewSleep({ ...newSleep, notes: e.target.value })}
                      placeholder="Any observations..."
                    />
                  </div>
                  <Button onClick={handleAddSleep} className="w-full">
                    Save Sleep Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={addCryOpen} onOpenChange={setAddCryOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Log Crying
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Crying Episode</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newCry.duration_minutes}
                      onChange={(e) => setNewCry({ ...newCry, duration_minutes: e.target.value })}
                      placeholder="e.g., 15"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cry_type">Cry Type</Label>
                    <Select value={newCry.cry_type} onValueChange={(value: any) => setNewCry({ ...newCry, cry_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hungry">Hungry</SelectItem>
                        <SelectItem value="tired">Tired</SelectItem>
                        <SelectItem value="discomfort">Discomfort</SelectItem>
                        <SelectItem value="pain">Pain</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="resolution">How was it resolved?</Label>
                    <Input
                      id="resolution"
                      value={newCry.resolution}
                      onChange={(e) => setNewCry({ ...newCry, resolution: e.target.value })}
                      placeholder="e.g., Fed, changed diaper..."
                    />
                  </div>
                  <Button onClick={handleAddCry} className="w-full">
                    Save Cry Record
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {insights && (
            <Card className="mb-6 p-6 gradient-card shadow-soft border-2">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CloudMoon className="w-5 h-5 text-accent" />
                Sleep Insights
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Avg Sleep Duration</p>
                  <p className="text-2xl font-bold text-accent">
                    {insights.avgHours}h {insights.avgMins}m
                  </p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Sleep Quality</p>
                  <p className="text-2xl font-bold text-primary">{insights.qualityPercent}%</p>
                  <p className="text-xs text-muted-foreground">Good or excellent</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Records</p>
                  <p className="text-2xl font-bold text-secondary">{insights.totalRecords}</p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 gradient-card shadow-soft border-2">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Moon className="w-5 h-5 text-accent" />
                Recent Sleep Sessions
              </h3>
              {sleepRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No sleep records yet</p>
              ) : (
                <div className="space-y-3">
                  {sleepRecords.slice(0, 5).map((record) => {
                    const start = new Date(record.sleep_start);
                    const duration = record.sleep_end
                      ? Math.round((new Date(record.sleep_end).getTime() - start.getTime()) / (1000 * 60))
                      : null;
                    return (
                      <div key={record.id} className="p-3 bg-background/50 rounded-lg border border-border">
                        <p className="font-semibold text-sm">{start.toLocaleString()}</p>
                        {duration && <p className="text-sm text-muted-foreground">Duration: {Math.floor(duration / 60)}h {duration % 60}m</p>}
                        <p className="text-xs text-muted-foreground capitalize">Quality: {record.sleep_quality}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            <Card className="p-6 gradient-card shadow-soft border-2">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                Recent Crying Episodes
              </h3>
              {cryRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No cry records yet</p>
              ) : (
                <div className="space-y-3">
                  {cryRecords.slice(0, 5).map((record) => (
                    <div key={record.id} className="p-3 bg-background/50 rounded-lg border border-border">
                      <p className="font-semibold text-sm">{new Date(record.cry_time).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Duration: {record.duration_minutes} minutes</p>
                      <p className="text-xs text-muted-foreground capitalize">Type: {record.cry_type.replace("_", " ")}</p>
                      {record.resolution && <p className="text-xs text-success mt-1">Resolved: {record.resolution}</p>}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SleepAnalyzer;
