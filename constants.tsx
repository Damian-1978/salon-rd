
import React from 'react';
import { Category, Product, Supplier, RegistrationRecord } from './types';
import { Sparkles, Droplets, Scissors, Flame, Zap, Wind, Package } from 'lucide-react';

export const PLATFORM_MARKUP = 1.20; 
export const POINTS_PER_PESO = 0.01; 

export const CATEGORIES_CONFIG = [
  { name: Category.OFERTAS, icon: <Flame className="w-4 h-4" /> },
  { name: Category.LINEAS_CAPILARES, icon: <Package className="w-4 h-4" /> },
  { name: Category.TRATAMIENTOS, icon: <Sparkles className="w-4 h-4" /> },
  { name: Category.SHAMPOO, icon: <Droplets className="w-4 h-4" /> },
  { name: Category.TINTES, icon: <Zap className="w-4 h-4" /> },
  { name: Category.KERATINA, icon: <Scissors className="w-4 h-4" /> },
  { name: Category.EQUIPOS, icon: <Wind className="w-4 h-4" /> },
];

const rdPrefixes = ["809", "829", "849"];
const getRandomPhone = () => {
  const prefix = rdPrefixes[Math.floor(Math.random() * rdPrefixes.length)];
  const num = Math.floor(1000000 + Math.random() * 8999999);
  return `${prefix}${num}`;
};

/** 
 * GENERACIÓN DE 50 SUPLIDORES ACTUALIZADOS 
 */
const supplierSeeds = [
  { name: "Salerm Cosmetics RD", rep: "Luis Matos", loc: "Miraflores, SD" },
  { name: "Hair Care RD", rep: "Juan Polanco", loc: "Los Prados, SD" },
  { name: "Sued & Fanni", rep: "Ana Victoria", loc: "Zona Univ, SD" },
  { name: "Suplidora La Familiar", rep: "M. Cedeño", loc: "Independencia, SD" },
  { name: "Almacenes Santiago", rep: "R. Espinal", loc: "Las Carreras, Santiago" },
  { name: "L'Oréal RD", rep: "Gerencia Ventas", loc: "Piantini, SD" },
  { name: "Schwarzkopf Pro", rep: "Distribución Elite", loc: "Naco, SD" },
  { name: "Sebastian Pro", rep: "Claudia Ortiz", loc: "Bella Vista, SD" },
  { name: "Wella Professionals", rep: "Pedro Ruiz", loc: "Gazcue, SD" },
  { name: "Revlon Professional", rep: "Sofia Baez", loc: "Arroyo Hondo, SD" },
  { name: "Olaplex RD", rep: "Marcos Diaz", loc: "Evaristo Morales, SD" },
  { name: "Parlux Distribución", rep: "Enrique Santos", loc: "Santiago Centro" },
  { name: "Wahl RD", rep: "Victor Hugo", loc: "Villa Consuelo, SD" },
  { name: "Alter Ego RD", rep: "Isabel Mejia", loc: "La Romana Centro" },
  { name: "Alfaparf Milano RD", rep: "Roberto Caro", loc: "Punta Cana Village" }
];

export const MOCK_SUPPLIERS: Supplier[] = Array.from({ length: 50 }).map((_, i) => {
  const seed = supplierSeeds[i % supplierSeeds.length];
  const isExtra = i >= supplierSeeds.length;
  return {
    id: (1001 + i).toString(),
    businessName: isExtra ? `Distribuidora ${['Nacional', 'Premium', 'Elite', 'Global', 'Cosmética'][i % 5]} ${i}` : seed.name,
    representative: isExtra ? `Agente ${i}` : seed.rep,
    productType: "Belleza & Cosmetología",
    phone: isExtra ? getRandomPhone() : seed.name === "Salerm Cosmetics RD" ? "8096831004" : getRandomPhone(),
    location: isExtra ? `${['Moca', 'Baní', 'Haina', 'Bonao', 'Azua'][i % 5]}, RD` : seed.loc,
    balance: 0,
    isAuthorized: true
  };
});

/** 
 * GENERACIÓN DE 600 SALONES POR UBICACIÓN GEOGRÁFICA 
 */
const salonNames = ["Mirtha Hair", "Gold Blower", "Beia Salon", "Nails Republic", "Stylos", "Sua Salon", "Ceballo Design", "Beauty Lab", "Glow Studio", "Divas Salon", "Ivana Salon", "Bloom Beauty", "Luxury Spa", "Blue Salon", "Capri Hair", "Pelo Bueno", "Ondas & Rizos", "The Nail Bar", "Gatsby Salon", "Glamour Center"];
const sectors = [
  { name: "Piantini, SD", region: "Centro" },
  { name: "Naco, SD", region: "Centro" },
  { name: "Evaristo Morales, SD", region: "Centro" },
  { name: "Bella Vista, SD", region: "Sur" },
  { name: "Sarasota, SD", region: "Sur" },
  { name: "Santiago Centro", region: "Cibao" },
  { name: "Villa Olga, Santiago", region: "Cibao" },
  { name: "Punta Cana Village", region: "Este" },
  { name: "Bávaro", region: "Este" },
  { name: "La Romana", region: "Este" },
  { name: "Gazcue, SD", region: "Centro" },
  { name: "Arroyo Hondo, SD", region: "Centro" },
  { name: "San Francisco de Macorís", region: "Cibao" },
  { name: "Puerto Plata", region: "Norte" },
  { name: "Las Terrenas", region: "Norte" }
];

export const MOCK_REGISTRATIONS: RegistrationRecord[] = Array.from({ length: 600 }).map((_, i) => {
  const nameBase = salonNames[i % salonNames.length];
  const sector = sectors[i % sectors.length];
  return {
    id: `REG-PRO-${2000 + i}`,
    name: `Estilista Pro ${i + 1}`,
    salonName: `${nameBase} ${i < 20 ? '' : '#' + (i + 1)}`,
    city: sector.name,
    phone: getRandomPhone(),
    registeredAt: Date.now() - (i * 3600000),
    status: 'VERIFIED'
  };
});

/** 
 * CATALOGO DE PRODUCTOS 
 */
const images = [
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfac4023c6?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1527799822344-499045c2c012?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80"
];

export const MOCK_PRODUCTS: Product[] = Object.values(Category).flatMap((cat, catIdx) => {
  return Array.from({ length: 15 }).map((_, itemIdx) => {
    const globalId = (catIdx * 15 + itemIdx + 1).toString();
    const sup = MOCK_SUPPLIERS[itemIdx % MOCK_SUPPLIERS.length];
    const brands = ["Salerm", "Moroccanoil", "L'Oreal", "Wahl", "Parlux", "Olaplex", "Alfaparf", "Wella"];
    const brand = brands[itemIdx % brands.length];
    
    let basePrice = 900;
    if (cat === Category.EQUIPOS) basePrice = 5800;
    if (cat === Category.LINEAS_CAPILARES) basePrice = 3500;
    
    return {
      id: globalId,
      supplierId: sup.id,
      name: `${cat} ${brand} Pro-Elite RD`,
      brand: brand,
      category: cat,
      description: `Producto profesional de alto rendimiento por ${brand}. Distribuido oficialmente en RD por ${sup.businessName}.`,
      basePrice,
      baseBulkPrice: Math.floor(basePrice * 0.8),
      price: Math.floor(basePrice * PLATFORM_MARKUP),
      bulkPrice: Math.floor(basePrice * 0.8 * PLATFORM_MARKUP),
      bulkThreshold: 6,
      images: [images[itemIdx % images.length]],
      stock: 500,
      hairType: ['Todo Tipo', 'Tropical', 'Procesado'],
      benefits: ['Calidad Premium', 'Distribución Local', 'Fidelidad'],
      applicationTime: 'Variable',
      professionalWarning: 'Exclusivo para uso profesional en salones.',
      rating: 4.9,
      reviews: 150 + itemIdx,
      content: "Pro-Format 1L",
      isPublished: true
    };
  });
});
