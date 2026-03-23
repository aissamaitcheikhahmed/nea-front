export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

export const dummyProducts: Product[] = [
  {
    id: '1',
    name: 'Tafel Conferentie 6-pers',
    description: 'Stevige conferentietafel voor meetings en seminaries.',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?w=400',
    price: 45,
    category: 'conference',
  },
  {
    id: '2',
    name: 'Marktstand 3x2m',
    description: 'Compacte marktopstelling voor events en food corners.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400',
    price: 120,
    category: 'market',
  },
  {
    id: '3',
    name: 'Expo Stand Premium',
    description: 'Premium stand met professionele uitstraling.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400',
    price: 350,
    category: 'expo',
  },
  {
    id: '4',
    name: 'Buitentafel Rond',
    description: 'Ronde buitentafel voor recepties en tuinfeesten.',
    image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?w=400',
    price: 35,
    category: 'outdoor',
  },
  {
    id: '5',
    name: 'Tafel Vergaderzaal 10-pers',
    description: 'Ruime tafel voor grotere teams en workshops.',
    image: 'https://images.unsplash.com/photo-1593062096033-9a26f09a8d83?w=400',
    price: 85,
    category: 'conference',
  },
  {
    id: '6',
    name: 'Kraam Markt 2x1.5m',
    description: 'Praktische marktkraam met snelle opbouw.',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
    price: 75,
    category: 'market',
  },
  {
    id: '7',
    name: 'Beursstand 6m',
    description: 'Brede beursstand ideaal voor productpresentaties.',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400',
    price: 280,
    category: 'expo',
  },
  {
    id: '8',
    name: 'Picknicktafel Outdoor',
    description: 'Weerbestendige picknicktafel voor buitenlocaties.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400',
    price: 25,
    category: 'outdoor',
  },
];
