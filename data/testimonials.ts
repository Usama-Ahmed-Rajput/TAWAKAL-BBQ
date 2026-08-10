export interface Testimonial {
  id: string;
  author: string;
  role: string;
  rating: number;
  quote: string;
  favoriteDish: string;
  sourceNotice?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    author: 'Hamza Malik',
    role: 'Food Enthusiast & Guest',
    rating: 5,
    quote: 'Perfectly grilled and full of flavor. The smokiness of the Malai Boti and the tenderness of the Seekh Kebab is second to none in the city.',
    favoriteDish: 'Reshmi Malai Boti',
    sourceNotice: 'Placeholder Guest Review',
  },
  {
    id: 't-2',
    author: 'Sara Ahmed',
    role: 'Local Food Critic',
    rating: 5,
    quote: 'One of the best BBQ experiences. Real charcoal fire makes all the difference. You can taste the authenticity in every single bite.',
    favoriteDish: 'Tawakal Royal Platter',
    sourceNotice: 'Placeholder Guest Review',
  },
  {
    id: 't-3',
    author: 'Zainab & Bilal',
    role: 'Regular Family Guests',
    rating: 5,
    quote: 'The platter was absolutely amazing. Generous portions, searing hot from the coals, and the garlic naan puri paratha combination is divine.',
    favoriteDish: 'Tawakal Special Platter',
    sourceNotice: 'Placeholder Guest Review',
  },
  {
    id: 't-4',
    author: 'Rayan Siddiqui',
    role: 'BBQ Connoisseur',
    rating: 5,
    quote: 'Fire Beef Boti is for serious heat lovers. The bold spices and live charcoal aroma are exactly what luxury Pakistani street food should be.',
    favoriteDish: 'Fire Beef Boti',
    sourceNotice: 'Placeholder Guest Review',
  },
];
