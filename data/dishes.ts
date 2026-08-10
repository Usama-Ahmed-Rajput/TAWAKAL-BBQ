export interface DishItem {
  id: string;
  name: string;
  urduName?: string;
  description: string;
  price: string;
  heatLevel: 'Mild' | 'Medium' | 'Fire Hot';
  badge?: string;
  tagline: string;
  image: string;
}

export const SIGNATURE_DISHES: DishItem[] = [
  {
    id: 'dish-1',
    name: 'Chicken Tikka',
    urduName: 'چکن تکہ',
    description: 'Char-grilled chicken marinated in Tawakal\'s signature red spices.',
    price: 'Rs. 580',
    heatLevel: 'Medium',
    badge: 'Fire Grilled',
    tagline: 'The timeless classic perfected over live coals.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-2',
    name: 'Seekh Kebab',
    urduName: 'سیخ کباب',
    description: 'Juicy hand-minced beef infused with roasted coriander & chili.',
    price: 'Rs. 720',
    heatLevel: 'Medium',
    badge: 'Smokey & Melted',
    tagline: 'Iron-skewered perfection with authentic wood smoke.',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-3',
    name: 'Malai Boti',
    urduName: 'ملائی بوٹی',
    description: 'Melt-in-your-mouth chicken marinated in velvety cream and white pepper.',
    price: 'Rs. 890',
    heatLevel: 'Mild',
    badge: 'Chef Choice',
    tagline: 'Silky softness balanced with subtle ember smokiness.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-4',
    name: 'Beef Boti',
    urduName: 'بیف بوٹی',
    description: 'Prime beef cuts marinated in papaya and stone-ground chili blend.',
    price: 'Rs. 950',
    heatLevel: 'Fire Hot',
    badge: 'Bold & Spicy',
    tagline: 'Heavy fire sear yielding explosive rustic flavor.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-5',
    name: 'Chicken Boti',
    urduName: 'چکن بوٹی',
    description: 'Succulent boneless chicken morsels laced with crushed methi & lemon.',
    price: 'Rs. 850',
    heatLevel: 'Medium',
    badge: 'Crowd Favorite',
    tagline: 'Zesty, savory and blistered to high perfection.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dish-6',
    name: 'Tawakal Special Platter',
    urduName: 'تَوَکَّل اسپیشل پلیٹر',
    description: 'Our ultimate grand selection of tikka, boti, kebabs and fresh parathas.',
    price: 'Rs. 3,450',
    heatLevel: 'Medium',
    badge: 'Grand Feast',
    tagline: 'One table. Every favorite. Served on a sizzling iron skillet.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
];
