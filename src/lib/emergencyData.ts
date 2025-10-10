export interface EmergencyCard {
  id: string;
  title: string;
  category: 'urgent' | 'moderate' | 'info';
  symptoms: string[];
  steps: string[];
  whenToCallDoctor: string;
}

export const EMERGENCY_CARDS: EmergencyCard[] = [
  {
    id: '1',
    title: 'High Fever',
    category: 'urgent',
    symptoms: ['Temperature above 100.4°F (38°C) in babies under 3 months', 'Temperature above 102°F (38.9°C) in older babies', 'Fever lasting more than 24 hours'],
    steps: [
      'Measure temperature accurately with a rectal thermometer',
      'Keep baby comfortable and lightly dressed',
      'Offer plenty of fluids',
      'Monitor for other symptoms',
      'Give fever reducer only if doctor recommends',
    ],
    whenToCallDoctor: 'Immediately if under 3 months with any fever, or if fever is very high, persistent, or accompanied by other concerning symptoms.',
  },
  {
    id: '2',
    title: 'Choking',
    category: 'urgent',
    symptoms: ['Inability to cry or cough', 'Blue skin color', 'Difficulty breathing', 'Loss of consciousness'],
    steps: [
      'Call emergency services immediately',
      'For infants: Give 5 back blows between shoulder blades',
      'For infants: Give 5 chest thrusts if back blows don\'t work',
      'Continue until object is dislodged or baby becomes unconscious',
      'If unconscious, begin CPR',
    ],
    whenToCallDoctor: 'Call 911 immediately if baby is choking and cannot breathe.',
  },
  {
    id: '3',
    title: 'Dehydration',
    category: 'moderate',
    symptoms: ['Fewer wet diapers', 'Dry mouth and lips', 'No tears when crying', 'Sunken soft spot', 'Lethargy'],
    steps: [
      'Offer breast milk or formula more frequently',
      'If recommended by doctor, give oral rehydration solution',
      'Monitor number of wet diapers',
      'Check for signs of improvement',
      'Keep baby cool if ill',
    ],
    whenToCallDoctor: 'If baby shows signs of severe dehydration, refuses to feed, or has no wet diapers for 6+ hours.',
  },
  {
    id: '4',
    title: 'Persistent Crying',
    category: 'moderate',
    symptoms: ['Crying for more than 3 hours', 'Cannot be consoled', 'Unusual high-pitched cry', 'Accompanied by other symptoms'],
    steps: [
      'Check if baby is hungry, tired, or needs diaper change',
      'Look for signs of discomfort or pain',
      'Try soothing techniques: rocking, white noise, skin-to-skin',
      'Check temperature',
      'Examine for tight clothing or hair tourniquets',
    ],
    whenToCallDoctor: 'If crying is unusual, very intense, or accompanied by fever, vomiting, or other symptoms.',
  },
  {
    id: '5',
    title: 'Breathing Difficulties',
    category: 'urgent',
    symptoms: ['Rapid breathing', 'Flared nostrils', 'Chest retractions', 'Wheezing', 'Blue lips or face'],
    steps: [
      'Call emergency services immediately',
      'Keep baby upright',
      'Clear any visible obstructions from airway',
      'Stay calm and reassuring',
      'Monitor breathing rate and color',
    ],
    whenToCallDoctor: 'Call 911 immediately for any severe breathing difficulty.',
  },
  {
    id: '6',
    title: 'Falls and Head Injuries',
    category: 'moderate',
    symptoms: ['Fall from height', 'Hit head', 'Loss of consciousness', 'Vomiting after head injury', 'Unusual behavior'],
    steps: [
      'Stay calm and assess the situation',
      'Check for consciousness and breathing',
      'Look for visible injuries',
      'Keep baby still if neck or spine injury suspected',
      'Apply cold compress to bumps',
      'Monitor for 24-48 hours',
    ],
    whenToCallDoctor: 'Immediately if baby lost consciousness, is vomiting, seems confused, or fall was from significant height.',
  },
  {
    id: '7',
    title: 'Allergic Reactions',
    category: 'urgent',
    symptoms: ['Hives or rash', 'Swelling of face or lips', 'Difficulty breathing', 'Vomiting', 'Pale or blue skin'],
    steps: [
      'Call emergency services if breathing difficulty or severe swelling',
      'Remove allergen source if known',
      'Give antihistamine only if previously prescribed',
      'Monitor breathing closely',
      'Keep baby comfortable and calm',
    ],
    whenToCallDoctor: 'Call 911 for severe reactions. Contact doctor for any allergic reaction in babies.',
  },
  {
    id: '8',
    title: 'Diarrhea and Vomiting',
    category: 'moderate',
    symptoms: ['Multiple episodes of diarrhea', 'Frequent vomiting', 'Blood in stool', 'Signs of dehydration', 'Fever'],
    steps: [
      'Continue breastfeeding or formula feeding',
      'Offer small, frequent amounts of fluid',
      'Monitor for dehydration signs',
      'Keep track of number of episodes',
      'Maintain good hygiene',
    ],
    whenToCallDoctor: 'If baby has signs of dehydration, blood in stool, persistent vomiting, or is under 3 months old.',
  },
];

export const EMERGENCY_CONTACTS = [
  { name: 'Emergency Services', number: '911', description: 'For life-threatening emergencies' },
  { name: 'Poison Control', number: '1-800-222-1222', description: 'For poisoning emergencies' },
  { name: 'Pediatrician', number: 'Add your doctor', description: 'Your baby\'s doctor' },
];
