/*
  # Snuggles App Complete Database Schema

  ## Overview
  This migration creates all tables needed for the Snuggles babycare application including
  user profiles, growth tracking, sleep analysis, nutrition planning, wellness tracking,
  and membership management.

  ## New Tables Created

  ### 1. `user_profiles`
  - `id` (uuid, primary key, references auth.users)
  - `name` (text)
  - `email` (text, unique)
  - `membership_tier` (text, default 'free') - Options: free, monthly, annual
  - `membership_expires_at` (timestamptz, nullable)
  - `theme_preference` (text, default 'light') - Options: light, dark, auto
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### 2. `babies`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `name` (text)
  - `birth_date` (date)
  - `gender` (text) - Options: male, female, other, prefer_not_to_say
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

  ### 3. `growth_records`
  - `id` (uuid, primary key)
  - `baby_id` (uuid, references babies)
  - `date` (date)
  - `weight_kg` (decimal)
  - `height_cm` (decimal)
  - `head_circumference_cm` (decimal, nullable)
  - `notes` (text, nullable)
  - `created_at` (timestamptz, default now())

  ### 4. `sleep_records`
  - `id` (uuid, primary key)
  - `baby_id` (uuid, references babies)
  - `sleep_start` (timestamptz)
  - `sleep_end` (timestamptz, nullable)
  - `sleep_quality` (text) - Options: poor, fair, good, excellent
  - `notes` (text, nullable)
  - `created_at` (timestamptz, default now())

  ### 5. `cry_records`
  - `id` (uuid, primary key)
  - `baby_id` (uuid, references babies)
  - `cry_time` (timestamptz)
  - `duration_minutes` (integer)
  - `cry_type` (text) - Options: hungry, tired, discomfort, pain, unknown
  - `resolution` (text, nullable)
  - `created_at` (timestamptz, default now())

  ### 6. `nutrition_records`
  - `id` (uuid, primary key)
  - `baby_id` (uuid, references babies)
  - `meal_time` (timestamptz)
  - `meal_type` (text) - Options: breast_milk, formula, solid_food, snack, water
  - `amount` (text, nullable)
  - `food_items` (jsonb, nullable)
  - `notes` (text, nullable)
  - `created_at` (timestamptz, default now())

  ### 7. `meal_plans`
  - `id` (uuid, primary key)
  - `baby_id` (uuid, references babies)
  - `plan_date` (date)
  - `meals` (jsonb) - Array of meal objects with time, type, and items
  - `created_at` (timestamptz, default now())

  ### 8. `wellness_records`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references user_profiles)
  - `date` (date)
  - `mood_rating` (integer) - 1-5 scale
  - `stress_level` (integer) - 1-5 scale
  - `notes` (text, nullable)
  - `affirmation` (text, nullable)
  - `mindfulness_minutes` (integer, default 0)
  - `created_at` (timestamptz, default now())

  ### 9. `insights`
  - `id` (uuid, primary key)
  - `baby_id` (uuid, references babies)
  - `insight_date` (date)
  - `insight_type` (text) - Options: sleep, growth, nutrition, development, wellness
  - `title` (text)
  - `description` (text)
  - `data` (jsonb, nullable)
  - `created_at` (timestamptz, default now())

  ## Security
  - All tables have Row Level Security (RLS) enabled
  - Policies ensure users can only access their own data
  - Authentication is required for all operations

  ## Important Notes
  1. All foreign key relationships use CASCADE for deletions to maintain data integrity
  2. Updated_at timestamps are automatically maintained via triggers
  3. RLS policies are restrictive by default - users must be authenticated and can only access their own data
*/

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  membership_tier text DEFAULT 'free' CHECK (membership_tier IN ('free', 'monthly', 'annual')),
  membership_expires_at timestamptz,
  theme_preference text DEFAULT 'light' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (email = current_user);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (email = current_user)
  WITH CHECK (email = current_user);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (email = current_user);

-- Create babies table
CREATE TABLE IF NOT EXISTS babies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  birth_date date NOT NULL,
  gender text CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE babies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own babies"
  ON babies FOR SELECT
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can insert own babies"
  ON babies FOR INSERT
  TO authenticated
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can update own babies"
  ON babies FOR UPDATE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user))
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

CREATE POLICY "Users can delete own babies"
  ON babies FOR DELETE
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

-- Create growth_records table
CREATE TABLE IF NOT EXISTS growth_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg decimal(5,2),
  height_cm decimal(5,2),
  head_circumference_cm decimal(5,2),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE growth_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own baby growth records"
  ON growth_records FOR ALL
  TO authenticated
  USING (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ))
  WITH CHECK (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ));

-- Create sleep_records table
CREATE TABLE IF NOT EXISTS sleep_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  sleep_start timestamptz NOT NULL,
  sleep_end timestamptz,
  sleep_quality text CHECK (sleep_quality IN ('poor', 'fair', 'good', 'excellent')),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sleep_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own baby sleep records"
  ON sleep_records FOR ALL
  TO authenticated
  USING (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ))
  WITH CHECK (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ));

-- Create cry_records table
CREATE TABLE IF NOT EXISTS cry_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  cry_time timestamptz NOT NULL DEFAULT now(),
  duration_minutes integer DEFAULT 0,
  cry_type text CHECK (cry_type IN ('hungry', 'tired', 'discomfort', 'pain', 'unknown')),
  resolution text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cry_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own baby cry records"
  ON cry_records FOR ALL
  TO authenticated
  USING (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ))
  WITH CHECK (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ));

-- Create nutrition_records table
CREATE TABLE IF NOT EXISTS nutrition_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  meal_time timestamptz NOT NULL DEFAULT now(),
  meal_type text CHECK (meal_type IN ('breast_milk', 'formula', 'solid_food', 'snack', 'water')),
  amount text,
  food_items jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own baby nutrition records"
  ON nutrition_records FOR ALL
  TO authenticated
  USING (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ))
  WITH CHECK (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ));

-- Create meal_plans table
CREATE TABLE IF NOT EXISTS meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  plan_date date NOT NULL DEFAULT CURRENT_DATE,
  meals jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own baby meal plans"
  ON meal_plans FOR ALL
  TO authenticated
  USING (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ))
  WITH CHECK (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ));

-- Create wellness_records table
CREATE TABLE IF NOT EXISTS wellness_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  date date NOT NULL DEFAULT CURRENT_DATE,
  mood_rating integer CHECK (mood_rating >= 1 AND mood_rating <= 5),
  stress_level integer CHECK (stress_level >= 1 AND stress_level <= 5),
  notes text,
  affirmation text,
  mindfulness_minutes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE wellness_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wellness records"
  ON wellness_records FOR ALL
  TO authenticated
  USING (user_id IN (SELECT id FROM user_profiles WHERE email = current_user))
  WITH CHECK (user_id IN (SELECT id FROM user_profiles WHERE email = current_user));

-- Create insights table
CREATE TABLE IF NOT EXISTS insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  baby_id uuid NOT NULL REFERENCES babies(id) ON DELETE CASCADE,
  insight_date date NOT NULL DEFAULT CURRENT_DATE,
  insight_type text CHECK (insight_type IN ('sleep', 'growth', 'nutrition', 'development', 'wellness')),
  title text NOT NULL,
  description text NOT NULL,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own baby insights"
  ON insights FOR SELECT
  TO authenticated
  USING (baby_id IN (
    SELECT b.id FROM babies b
    JOIN user_profiles up ON b.user_id = up.id
    WHERE up.email = current_user
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_user_profiles_updated_at') THEN
    CREATE TRIGGER update_user_profiles_updated_at
      BEFORE UPDATE ON user_profiles
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_babies_updated_at') THEN
    CREATE TRIGGER update_babies_updated_at
      BEFORE UPDATE ON babies
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;