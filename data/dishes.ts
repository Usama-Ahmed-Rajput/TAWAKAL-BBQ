export interface DishItem {
  id: string;
  slug?: string;
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
    id: 'chicken-tikka-leg',
    slug: 'chicken-tikka-leg',
    name: 'Chicken Tikka',
    urduName: 'چکن تکہ',
    description: 'Char-grilled chicken marinated in Tawakal\'s signature red spices.',
    price: 'Rs. 350',
    heatLevel: 'Medium',
    badge: 'Fire Grilled',
    tagline: 'The timeless classic perfected over live coals.',
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beef-kabab-plate',
    slug: 'beef-kabab-plate',
    name: 'Seekh Kebab',
    urduName: 'سیخ کباب',
    description: 'Juicy hand-minced beef infused with roasted coriander & chili.',
    price: 'Rs. 350',
    heatLevel: 'Medium',
    badge: 'Smokey & Melted',
    tagline: 'Iron-skewered perfection with authentic wood smoke.',
    image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'chicken-malai-botti-plate',
    slug: 'chicken-malai-botti-plate',
    name: 'Malai Boti',
    urduName: 'ملائی بوٹی',
    description: 'Melt-in-your-mouth chicken marinated in velvety cream and white pepper.',
    price: 'Rs. 600',
    heatLevel: 'Mild',
    badge: 'Chef Choice',
    tagline: 'Silky softness balanced with subtle ember smokiness.',
    image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'beef-botti-plate',
    slug: 'beef-botti-plate',
    name: 'Beef Boti',
    urduName: 'بیف بوٹی',
    description: 'Prime beef cuts marinated in papaya and stone-ground chili blend.',
    price: 'Rs. 600',
    heatLevel: 'Fire Hot',
    badge: 'Bold & Spicy',
    tagline: 'Heavy fire sear yielding explosive rustic flavor.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'chicken-botti-plate',
    slug: 'chicken-botti-plate',
    name: 'Chicken Boti',
    urduName: 'چکن بوٹی',
    description: 'Succulent boneless chicken morsels laced with crushed methi & lemon.',
    price: 'Rs. 520',
    heatLevel: 'Medium',
    badge: 'Crowd Favorite',
    tagline: 'Zesty, savory and blistered to high perfection.',
    image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'chicken-green-tikka',
    slug: 'chicken-green-tikka',
    name: 'Chicken Green Tikka',
    urduName: 'چکن گرین تکہ',
    description: 'Chest quarter chicken marinated in green chili, mint & coriander herbs.',
    price: 'Rs. 400',
    heatLevel: 'Medium',
    badge: 'Grand Feast',
    tagline: 'Green herb marinated chicken chest roasted on live embers.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
];
