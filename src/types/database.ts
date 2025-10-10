export interface UserProfile {
  id: string;
  name: string;
  email: string;
  membership_tier: 'free' | 'monthly' | 'annual';
  membership_expires_at?: string;
  theme_preference: 'light' | 'dark' | 'auto';
  created_at: string;
  updated_at: string;
}

export interface Baby {
  id: string;
  user_id: string;
  name: string;
  birth_date: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  created_at: string;
  updated_at: string;
}

export interface GrowthRecord {
  id: string;
  baby_id: string;
  date: string;
  weight_kg?: number;
  height_cm?: number;
  head_circumference_cm?: number;
  notes?: string;
  created_at: string;
}

export interface SleepRecord {
  id: string;
  baby_id: string;
  sleep_start: string;
  sleep_end?: string;
  sleep_quality?: 'poor' | 'fair' | 'good' | 'excellent';
  notes?: string;
  created_at: string;
}

export interface CryRecord {
  id: string;
  baby_id: string;
  cry_time: string;
  duration_minutes: number;
  cry_type: 'hungry' | 'tired' | 'discomfort' | 'pain' | 'unknown';
  resolution?: string;
  created_at: string;
}

export interface NutritionRecord {
  id: string;
  baby_id: string;
  meal_time: string;
  meal_type: 'breast_milk' | 'formula' | 'solid_food' | 'snack' | 'water';
  amount?: string;
  food_items?: Record<string, any>;
  notes?: string;
  created_at: string;
}

export interface MealPlan {
  id: string;
  baby_id: string;
  plan_date: string;
  meals: Array<{
    time: string;
    type: string;
    items: string[];
  }>;
  created_at: string;
}

export interface WellnessRecord {
  id: string;
  user_id: string;
  date: string;
  mood_rating?: number;
  stress_level?: number;
  notes?: string;
  affirmation?: string;
  mindfulness_minutes: number;
  created_at: string;
}

export interface Insight {
  id: string;
  baby_id: string;
  insight_date: string;
  insight_type: 'sleep' | 'growth' | 'nutrition' | 'development' | 'wellness';
  title: string;
  description: string;
  data?: Record<string, any>;
  created_at: string;
}
