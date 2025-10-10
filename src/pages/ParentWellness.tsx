import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Plus, Sparkles, Timer } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authStore } from "@/stores/authStore";
import type { WellnessRecord } from "@/types/database";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { getTodayAffirmation, MINDFULNESS_EXERCISES, MOOD_EMOJI, STRESS_LEVEL_TEXT } from "@/lib/wellnessData";

const ParentWellness = () => {
  const navigate = useNavigate();
  const [wellnessRecords, setWellnessRecords] = useState<WellnessRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [addRecordOpen, setAddRecordOpen] = useState(false);
  const [exerciseOpen, setExerciseOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(0);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  const [newRecord, setNewRecord] = useState({
    mood_rating: 3,
    stress_level: 3,
    notes: "",
    mindfulness_minutes: 0,
  });

  const todayAffirmation = getTodayAffirmation();

  useEffect(() => {
    const state = authStore.getState();
    if (!state.isAuthenticated) {
      navigate("/auth");
      return;
    }
    loadWellnessRecords();
  }, [navigate]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            toast.success("Mindfulness session complete!");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const loadWellnessRecords = async () => {
    try {
      const state = authStore.getState();
      const { data: profile } = await supabase
        .from("user_profiles")
        .select("id")
        .eq("email", state.user?.email)
        .maybeSingle();

      if (!profile) return;

      const { data, error } = await supabase
        .from("wellness_records")
        .select("*")
        .eq("user_id", profile.id)
        .order("date", { ascending: false })
        .limit(30);

      if (error) throw error;
      setWellnessRecords(data || []);
    } catch (error) {
      console.error("Error loading wellness records:", error);
      toast.error("Failed to load wellness records");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
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

      const { error } = await supabase.from("wellness_records").insert({
        user_id: profile.id,
        mood_rating: newRecord.mood_rating,
        stress_level: newRecord.stress_level,
        notes: newRecord.notes || null,
        affirmation: todayAffirmation,
        mindfulness_minutes: newRecord.mindfulness_minutes,
      });

      if (error) throw error;

      toast.success("Wellness entry saved!");
      setAddRecordOpen(false);
      setNewRecord({ mood_rating: 3, stress_level: 3, notes: "", mindfulness_minutes: 0 });
      loadWellnessRecords();
    } catch (error) {
      console.error("Error adding wellness record:", error);
      toast.error("Failed to save wellness entry");
    }
  };

  const startMindfulness = (exerciseIndex: number) => {
    const exercise = MINDFULNESS_EXERCISES[exerciseIndex];
    setSelectedExercise(exerciseIndex);
    setTimer(exercise.duration * 60);
    setTimerActive(true);
    setExerciseOpen(true);
  };

  const getWeeklyStats = () => {
    const lastWeek = wellnessRecords.slice(0, 7);
    if (lastWeek.length === 0) return null;

    const avgMood = lastWeek.reduce((sum, r) => sum + (r.mood_rating || 0), 0) / lastWeek.length;
    const avgStress = lastWeek.reduce((sum, r) => sum + (r.stress_level || 0), 0) / lastWeek.length;
    const totalMindfulness = lastWeek.reduce((sum, r) => sum + r.mindfulness_minutes, 0);

    return {
      avgMood: avgMood.toFixed(1),
      avgStress: avgStress.toFixed(1),
      totalMindfulness,
      daysTracked: lastWeek.length,
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

  const stats = getWeeklyStats();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Parent Wellness
              </span>
            </h1>
            <p className="text-muted-foreground">Take care of yourself while caring for your baby</p>
          </div>

          <Card className="p-6 gradient-card shadow-soft border-2 mb-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
            <div className="flex items-center gap-3 mb-3">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold">Today's Affirmation</h3>
            </div>
            <p className="text-lg italic text-muted-foreground">{todayAffirmation}</p>
          </Card>

          <div className="flex gap-4 mb-6">
            <Dialog open={addRecordOpen} onOpenChange={setAddRecordOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  Log Wellness Check-in
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Wellness Check-in</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <Label>How are you feeling today?</Label>
                    <div className="flex justify-between mt-3 mb-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => setNewRecord({ ...newRecord, mood_rating: val })}
                          className={`text-3xl transition-transform ${newRecord.mood_rating === val ? 'scale-125' : 'scale-100 opacity-50'}`}
                        >
                          {MOOD_EMOJI[val as keyof typeof MOOD_EMOJI]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Stress Level: {STRESS_LEVEL_TEXT[newRecord.stress_level as keyof typeof STRESS_LEVEL_TEXT]}</Label>
                    <Slider
                      value={[newRecord.stress_level]}
                      onValueChange={(val) => setNewRecord({ ...newRecord, stress_level: val[0] })}
                      min={1}
                      max={5}
                      step={1}
                      className="mt-3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mindfulness">Mindfulness Minutes Today</Label>
                    <Input
                      id="mindfulness"
                      type="number"
                      value={newRecord.mindfulness_minutes}
                      onChange={(e) => setNewRecord({ ...newRecord, mindfulness_minutes: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes (optional)</Label>
                    <Textarea
                      id="notes"
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      placeholder="How are you feeling? What's on your mind?"
                      rows={3}
                    />
                  </div>
                  <Button onClick={handleAddRecord} className="w-full">
                    Save Check-in
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {stats && (
            <Card className="mb-6 p-6 gradient-card shadow-soft border-2">
              <h3 className="text-xl font-semibold mb-4">Your Week at a Glance</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Mood</p>
                  <p className="text-2xl font-bold text-primary">{stats.avgMood}/5</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Average Stress</p>
                  <p className="text-2xl font-bold text-accent">{stats.avgStress}/5</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Mindfulness Time</p>
                  <p className="text-2xl font-bold text-secondary">{stats.totalMindfulness}min</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Days Tracked</p>
                  <p className="text-2xl font-bold text-sky">{stats.daysTracked}/7</p>
                </div>
              </div>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6 gradient-card shadow-soft border-2">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Timer className="w-5 h-5 text-accent" />
                Mindfulness Exercises
              </h3>
              <div className="space-y-3">
                {MINDFULNESS_EXERCISES.map((exercise, index) => (
                  <div key={index} className="p-4 bg-background/50 rounded-lg border border-border">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold">{exercise.title}</p>
                        <p className="text-sm text-muted-foreground">{exercise.duration} minutes</p>
                      </div>
                      <Button size="sm" onClick={() => startMindfulness(index)}>
                        Start
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{exercise.description}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 gradient-card shadow-soft border-2">
              <h3 className="text-xl font-semibold mb-4">Recent Check-ins</h3>
              {wellnessRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No check-ins yet</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {wellnessRecords.slice(0, 10).map((record) => (
                    <div key={record.id} className="p-3 bg-background/50 rounded-lg border border-border">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm">{new Date(record.date).toLocaleDateString()}</p>
                        <div className="flex gap-2">
                          <span className="text-xl">{MOOD_EMOJI[record.mood_rating as keyof typeof MOOD_EMOJI]}</span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Stress: {STRESS_LEVEL_TEXT[record.stress_level as keyof typeof STRESS_LEVEL_TEXT]}</p>
                        {record.mindfulness_minutes > 0 && (
                          <p>Mindfulness: {record.mindfulness_minutes} min</p>
                        )}
                        {record.notes && <p className="mt-2 text-sm">{record.notes}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <Dialog open={exerciseOpen} onOpenChange={setExerciseOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{MINDFULNESS_EXERCISES[selectedExercise]?.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {timerActive && (
                  <div className="text-center py-8">
                    <p className="text-6xl font-bold text-primary mb-4">{formatTime(timer)}</p>
                    <Button onClick={() => setTimerActive(false)} variant="outline">
                      Pause
                    </Button>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {MINDFULNESS_EXERCISES[selectedExercise]?.description}
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    {MINDFULNESS_EXERCISES[selectedExercise]?.steps.map((step, i) => (
                      <li key={i} className="text-muted-foreground">{step}</li>
                    ))}
                  </ol>
                </div>
                {!timerActive && (
                  <Button onClick={() => setTimerActive(true)} className="w-full">
                    {timer === 0 ? 'Start' : 'Resume'}
                  </Button>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ParentWellness;
