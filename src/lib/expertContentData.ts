export interface Article {
  id: string;
  title: string;
  category: string;
  source: string;
  summary: string;
  ageRange: string;
  readTime: number;
}

export const EXPERT_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Understanding Baby Sleep Patterns',
    category: 'Sleep',
    source: 'AAP',
    summary: 'Learn about healthy sleep patterns for babies and how to establish good sleep routines from birth through toddlerhood.',
    ageRange: '0-24 months',
    readTime: 5,
  },
  {
    id: '2',
    title: 'Introduction to Solid Foods',
    category: 'Nutrition',
    source: 'WHO',
    summary: 'Expert guidance on when and how to introduce solid foods, including signs of readiness and first food recommendations.',
    ageRange: '4-12 months',
    readTime: 7,
  },
  {
    id: '3',
    title: 'Developmental Milestones: First Year',
    category: 'Development',
    source: 'CDC',
    summary: 'Track your baby\'s development with this comprehensive guide to milestones in the first 12 months of life.',
    ageRange: '0-12 months',
    readTime: 10,
  },
  {
    id: '4',
    title: 'Vaccination Schedule and Safety',
    category: 'Health',
    source: 'CDC',
    summary: 'Complete guide to recommended vaccinations, their importance, and what to expect during and after immunizations.',
    ageRange: '0-24 months',
    readTime: 8,
  },
  {
    id: '5',
    title: 'Postpartum Mental Health',
    category: 'Parent Wellness',
    source: 'NHS',
    summary: 'Understanding postpartum emotions, recognizing signs of postpartum depression, and knowing when to seek help.',
    ageRange: 'All',
    readTime: 6,
  },
  {
    id: '6',
    title: 'Baby Safety at Home',
    category: 'Safety',
    source: 'Red Cross',
    summary: 'Essential tips for childproofing your home and preventing common accidents as your baby becomes more mobile.',
    ageRange: '6-24 months',
    readTime: 9,
  },
  {
    id: '7',
    title: 'Breastfeeding: Getting Started',
    category: 'Nutrition',
    source: 'UNICEF',
    summary: 'Practical advice for new mothers on establishing breastfeeding, common challenges, and when to seek support.',
    ageRange: '0-6 months',
    readTime: 8,
  },
  {
    id: '8',
    title: 'Understanding Baby Crying',
    category: 'Development',
    source: 'AAP',
    summary: 'Learn to decode different types of crying and effective soothing techniques for fussy babies.',
    ageRange: '0-12 months',
    readTime: 5,
  },
];

export const CATEGORIES = ['All', 'Sleep', 'Nutrition', 'Development', 'Health', 'Safety', 'Parent Wellness'];
