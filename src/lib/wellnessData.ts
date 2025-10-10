export const DAILY_AFFIRMATIONS = [
  "You are doing an amazing job as a parent.",
  "It's okay to ask for help. You don't have to do everything alone.",
  "Taking care of yourself is taking care of your baby.",
  "You are enough, exactly as you are.",
  "Every small step you take matters.",
  "Your love and presence are the greatest gifts you can give.",
  "It's okay to have difficult days. Tomorrow is a new start.",
  "You are stronger than you think.",
  "Your baby is lucky to have you.",
  "Remember to be kind to yourself today.",
  "You're learning and growing alongside your baby.",
  "Rest is not a luxury, it's a necessity.",
  "You're doing better than you think you are.",
  "Your feelings are valid, and it's okay to express them.",
  "Every parent has challenging moments. You're not alone.",
];

export const MINDFULNESS_EXERCISES = [
  {
    title: "5-Minute Breathing",
    duration: 5,
    description: "Focus on your breath for 5 minutes. Breathe in for 4 counts, hold for 4, exhale for 4.",
    steps: [
      "Find a quiet, comfortable space",
      "Close your eyes or soften your gaze",
      "Breathe in slowly through your nose for 4 counts",
      "Hold your breath for 4 counts",
      "Exhale slowly through your mouth for 4 counts",
      "Repeat for 5 minutes",
    ],
  },
  {
    title: "Body Scan",
    duration: 10,
    description: "Progressive relaxation from head to toe.",
    steps: [
      "Lie down or sit comfortably",
      "Close your eyes",
      "Start with your head, notice any tension",
      "Slowly scan down through your body",
      "Release tension as you notice it",
      "End at your toes, feeling completely relaxed",
    ],
  },
  {
    title: "Gratitude Moment",
    duration: 3,
    description: "Take a moment to appreciate three things from today.",
    steps: [
      "Think of one thing that made you smile today",
      "Recall a moment of connection with your baby",
      "Acknowledge something you accomplished, no matter how small",
      "Take a deep breath and feel grateful",
    ],
  },
  {
    title: "Quick Energy Reset",
    duration: 2,
    description: "Rapid energy boost when you're exhausted.",
    steps: [
      "Stand up and stretch your arms overhead",
      "Take 3 deep breaths",
      "Roll your shoulders back 5 times",
      "Shake out your hands and feet",
      "Drink a glass of water",
    ],
  },
];

export function getTodayAffirmation(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return DAILY_AFFIRMATIONS[dayOfYear % DAILY_AFFIRMATIONS.length];
}

export const MOOD_EMOJI = {
  1: "😢",
  2: "😕",
  3: "😐",
  4: "🙂",
  5: "😊",
};

export const STRESS_LEVEL_TEXT = {
  1: "Very Low",
  2: "Low",
  3: "Moderate",
  4: "High",
  5: "Very High",
};
