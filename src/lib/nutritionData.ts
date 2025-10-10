export const MEAL_SUGGESTIONS = {
  '0-6months': {
    meals: ['Breast milk or formula only'],
    notes: 'Exclusive breastfeeding or formula feeding recommended for first 6 months',
  },
  '6-8months': {
    meals: [
      'Iron-fortified rice cereal',
      'Pureed vegetables (sweet potato, carrots, peas)',
      'Pureed fruits (banana, apple sauce, pears)',
      'Breast milk or formula',
    ],
    notes: 'Introduce single-ingredient purees one at a time',
  },
  '8-12months': {
    meals: [
      'Soft-cooked vegetables',
      'Soft fruits (banana, avocado, peach)',
      'Soft-cooked grains (oatmeal, pasta)',
      'Protein (scrambled eggs, tofu, beans)',
      'Breast milk or formula',
    ],
    notes: 'Introduce finger foods and soft textures',
  },
  '12-24months': {
    meals: [
      'Whole grain bread and pasta',
      'Variety of fruits and vegetables',
      'Protein sources (chicken, fish, eggs, legumes)',
      'Dairy products (milk, yogurt, cheese)',
      'Healthy fats (avocado, nut butters)',
    ],
    notes: 'Transition to family foods with varied textures',
  },
};

export const FEEDING_SCHEDULE = {
  '0-3months': '8-12 feedings per day',
  '3-6months': '6-8 feedings per day',
  '6-9months': '3-4 meals + 2-3 milk feedings per day',
  '9-12months': '3 meals + 2-3 snacks + milk feedings per day',
  '12-24months': '3 meals + 2 snacks per day',
};

export function getAgeCategory(birthDate: string): string {
  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

  if (months < 6) return '0-6months';
  if (months < 8) return '6-8months';
  if (months < 12) return '8-12months';
  return '12-24months';
}
