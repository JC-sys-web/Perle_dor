import productNecklace from '@/assets/product-necklace.jpg';
import productWatch from '@/assets/product-watch.jpg';
import productBracelet from '@/assets/product-bracelet.jpg';
import productClutch from '@/assets/product-clutch.jpg';
import { Product, Category } from '@/types';

export const defaultCategories: Category[] = [
  { id: '1', name: 'Bijoux', createdAt: new Date() },
  { id: '2', name: 'Montres', createdAt: new Date() },
  { id: '3', name: 'Accessoires', createdAt: new Date() },
  { id: '4', name: 'Sacs', createdAt: new Date() },
  { id: '5', name: 'Lunettes', createdAt: new Date() },
];

const productImages = [productNecklace, productWatch, productBracelet, productClutch];

const productNames = {
  '1': [ // Bijoux
    'Collier Élégance Dorée', 'Bracelet Luxe', 'Boucles Diamant', 'Pendentif Perle',
    'Bague Solitaire', 'Chaîne Vénitienne', 'Bracelet Charm', 'Boucles Créoles',
    'Collier Choker', 'Bague Éternité', 'Bracelet Jonc', 'Pendentif Cœur',
    'Boucles Goutte', 'Collier Rivière', 'Bracelet Tennis'
  ],
  '2': [ // Montres
    'Montre Classic Gold', 'Montre Sport Elite', 'Montre Vintage', 'Montre Skeleton',
    'Montre Chronographe', 'Montre Diver Pro', 'Montre Dress', 'Montre Automatique',
    'Montre Moonphase', 'Montre Tourbillon', 'Montre Pilote', 'Montre Tank'
  ],
  '3': [ // Accessoires
    'Pochette Signature', 'Ceinture Prestige', 'Écharpe Soie', 'Portefeuille Cuir',
    'Gants Élégants', 'Chapeau Panama', 'Broche Vintage', 'Boutons Manchette',
    'Porte-clés Luxe', 'Foulard Imprimé', 'Cravate Soie', 'Nœud Papillon'
  ],
  '4': [ // Sacs
    'Sac Tote Classic', 'Sac Bandoulière', 'Clutch Soirée', 'Sac Cabas',
    'Mini Bag Chic', 'Sac Seau', 'Pochette Enveloppe', 'Sac Bowling',
    'Besace Vintage', 'Sac Baguette', 'Hobo Bag', 'Sac Doctor'
  ],
  '5': [ // Lunettes
    'Lunettes Aviateur', 'Lunettes Cat Eye', 'Lunettes Rondes', 'Lunettes Carrées',
    'Lunettes Oversize', 'Lunettes Wayfarer', 'Lunettes Sport', 'Lunettes Vintage',
    'Lunettes Masque', 'Lunettes Pilote'
  ]
};

const descriptions = {
  '1': 'Bijou raffiné en plaqué or 18 carats, parfait pour les occasions spéciales. Design intemporel avec finitions soignées.',
  '2': 'Montre élégante avec mouvement de haute précision. Bracelet en cuir véritable ou acier inoxydable.',
  '3': 'Accessoire de luxe confectionné avec des matériaux nobles. Finitions impeccables pour un style distingué.',
  '4': 'Sac en cuir grainé de première qualité. Design fonctionnel et élégant pour toutes les occasions.',
  '5': 'Lunettes avec monture premium et verres haute qualité. Protection UV400 et style incomparable.'
};

const priceRanges = {
  '1': { min: 89, max: 890 },
  '2': { min: 250, max: 2500 },
  '3': { min: 45, max: 450 },
  '4': { min: 195, max: 1950 },
  '5': { min: 120, max: 680 }
};

export const generateMockProducts = (): Product[] => {
  const products: Product[] = [];
  let id = 1;

  Object.keys(productNames).forEach((categoryId) => {
    const names = productNames[categoryId as keyof typeof productNames];
    const { min, max } = priceRanges[categoryId as keyof typeof priceRanges];
    const description = descriptions[categoryId as keyof typeof descriptions];

    names.forEach((name, index) => {
      const price = Math.round((min + Math.random() * (max - min)) / 5) * 5;
      const imageIndex = (id - 1) % productImages.length;
      
      products.push({
        id: id.toString(),
        name,
        price,
        categoryId,
        description: `${description} Référence: ${name.toUpperCase().replace(/\s/g, '-')}-${id}`,
        images: [productImages[imageIndex]],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
      
      id++;
    });
  });

  // Shuffle the products for variety
  return products.sort(() => Math.random() - 0.5);
};

export const defaultProducts = generateMockProducts();
