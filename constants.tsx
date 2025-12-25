
import React from 'react';
import { Category, Product } from './types';
import { 
  Sparkles, 
  Droplets, 
  Scissors, 
  Flame, 
  Zap, 
  Wind,
  Package
} from 'lucide-react';

export const CATEGORIES_CONFIG = [
  { name: Category.OFERTAS, icon: <Flame className="w-5 h-5" />, color: 'bg-orange-500' },
  { name: Category.LINEAS_CAPILARES, icon: <Package className="w-5 h-5" />, color: 'bg-emerald-500' },
  { name: Category.TRATAMIENTOS, icon: <Sparkles className="w-5 h-5" />, color: 'bg-pink-500' },
  { name: Category.SHAMPOO, icon: <Droplets className="w-5 h-5" />, color: 'bg-blue-500' },
  { name: Category.TINTES, icon: <Zap className="w-5 h-5" />, color: 'bg-purple-500' },
  { name: Category.KERATINA, icon: <Scissors className="w-5 h-5" />, color: 'bg-indigo-500' },
  { name: Category.EQUIPOS, icon: <Wind className="w-5 h-5" />, color: 'bg-gray-700' },
];

export const BEAUTY_LINES = [
  { name: 'HairLuxe RD', logo: 'https://images.unsplash.com/photo-1522338140262-f46f5913618a?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'NaturePro', logo: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'ColorGuard', logo: 'https://images.unsplash.com/photo-1527799822344-429df98aadae?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'StylistTool', logo: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=200&h=200&auto=format&fit=crop' },
  { name: 'Caribbean Glow', logo: 'https://images.unsplash.com/photo-1596462502278-27bfac4023c6?q=80&w=200&h=200&auto=format&fit=crop' },
];

const categoryImages: Record<string, string[]> = {
  [Category.EQUIPOS]: [
    'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=600&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=600&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620331311520-246422ff83f9?q=80&w=600&h=600&auto=format&fit=crop'
  ],
  [Category.TRATAMIENTOS]: [
    'https://images.unsplash.com/photo-1527799822344-429df98aadae?q=80&w=600&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfac4023c6?q=80&w=600&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552046122-03184de85e08?q=80&w=600&h=600&auto=format&fit=crop'
  ],
  [Category.SHAMPOO]: [
    'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=600&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1559599101-f09722fb4948?q=80&w=600&h=600&auto=format&fit=crop'
  ],
  [Category.TINTES]: [
    'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=600&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=600&h=600&auto=format&fit=crop'
  ],
  [Category.LINEAS_CAPILARES]: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&h=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?q=80&w=600&h=600&auto=format&fit=crop'
  ]
};

const EQUIPOS_NAMES = [
  "Blower Profesional Ionic 4000",
  "Secador de Pared Pro-Turbo",
  "Plancha Titanium 450F Edition",
  "Tenaza Onduladora Cerámica 1\"",
  "Vaporizador Capilar de Ozono",
  "Climazón Digital Infrarrojo"
];

const LINEAS_NAMES = [
  "Línea Completa Hidratación Óleo",
  "Colección Colorimetría Maestro",
  "Línea Keratina Post-Tratamiento",
  "Duo Línea Brillo Dominicano",
  "Línea Especial Crecimiento Pro",
  "Línea de Mantenimiento RNC"
];

const categories = Object.values(Category);
const PRODUCTS_PER_CATEGORY = 6;

export const MOCK_PRODUCTS: Product[] = categories.flatMap((cat, catIdx) => {
  return Array.from({ length: PRODUCTS_PER_CATEGORY }).map((_, itemIdx) => {
    const globalId = (catIdx * PRODUCTS_PER_CATEGORY + itemIdx + 1).toString();
    const brand = BEAUTY_LINES[itemIdx % BEAUTY_LINES.length].name;
    
    let name = `${cat} Profesional Mod. ${globalId}`;
    let includedItems: string[] | undefined = undefined;

    if (cat === Category.EQUIPOS) {
      name = EQUIPOS_NAMES[itemIdx] || name;
    } else if (cat === Category.LINEAS_CAPILARES) {
      name = LINEAS_NAMES[itemIdx] || name;
      includedItems = ['Shampoo 1L', 'Mascarilla Reconstructora', 'Leave-in Protector', 'Gotas de Brillo', 'Ampolla Vitamínica'];
    }

    const basePrice = cat === Category.EQUIPOS ? 5000 : 800;
    const price = basePrice + (itemIdx * 250);
    const bulkPrice = Math.floor(price * 0.82);

    // Seleccionar imagen alusiva
    const pool = categoryImages[cat] || categoryImages[Category.TRATAMIENTOS];
    const imgUrl = pool[itemIdx % pool.length];

    return {
      id: globalId,
      name,
      brand,
      category: cat,
      description: `Sistema profesional de alto rendimiento para ${cat.toLowerCase()}. Diseñado para ofrecer resultados consistentes en el salón dominicano moderno.`,
      price,
      bulkPrice,
      bulkThreshold: cat === Category.EQUIPOS ? 2 : 6,
      images: [imgUrl, ...pool.filter(u => u !== imgUrl)],
      stock: 12 + (itemIdx * 5),
      hairType: ['Procesado', 'Rizo', 'Lacio'],
      benefits: ['Fórmula Avanzada', 'Uso Profesional'],
      applicationTime: 'Variable',
      professionalWarning: 'Exclusivo para uso en cabina.',
      rating: 4.5 + (Math.random() * 0.5),
      reviews: 12 + (itemIdx * 4),
      includedItems
    };
  });
});
