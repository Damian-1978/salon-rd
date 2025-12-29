
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
 * DIRECTORIO REAL DE 50 SUPLIDORES Y LABORATORIOS EN RD 
 */
const supplierSeeds = [
  { name: "Salerm Cosmetics RD", rep: "Luis Matos", loc: "Miraflores, SD" },
  { name: "Laboratorios Dr. Collado", rep: "Ricardo Collado", loc: "Zona Industrial Herrera, SD" },
  { name: "Distribuidora Beia", rep: "Ulises Polanco", loc: "Santiago Centro" },
  { name: "Sued & Fanni", rep: "Ana Victoria Sued", loc: "Zona Universitaria, SD" },
  { name: "Inversiones Yeb", rep: "Marcos Yeb", loc: "Villa Consuelo, SD" },
  { name: "Laboratorios Capilo Español", rep: "Ing. Jiménez", loc: "Haina, San Cristóbal" },
  { name: "Hair Care RD", rep: "Juan Carlos Polanco", loc: "Los Prados, SD" },
  { name: "Suplidora La Familiar", rep: "M. Cedeño", loc: "Independencia, SD" },
  { name: "Almacenes Santa Clara", rep: "Rosaura Valdez", loc: "Villa María, SD" },
  { name: "Distribuidora Corripio (Beauty Div)", rep: "Gerencia Comercial", loc: "Av. Núñez de Cáceres, SD" },
  { name: "Laboratorios JM Rodriguez", rep: "Pedro Rodriguez", loc: "Gazcue, SD" },
  { name: "Distribuidora Karidat", rep: "Karla Martínez", loc: "Piantini, SD" },
  { name: "Suplidora de Belleza Nelly", rep: "Nelly Almánzar", loc: "San Francisco de Macorís" },
  { name: "Laboratorios Mk (Kativa RD)", rep: "Sofia Herrera", loc: "Evaristo Morales, SD" },
  { name: "Professional Hair Center", rep: "Carlos Ruiz", loc: "Santiago Centro" },
  { name: "Distribuidora Isamar", rep: "Isabel Méndez", loc: "La Romana" },
  { name: "Suplidora La Esperanza", rep: "Miguelina Sosa", loc: "Moca" },
  { name: "Almacenes del Cabello RD", rep: "Raúl Espinal", loc: "Las Carreras, Santiago" },
  { name: "Distribuidora El Palacio de la Belleza", rep: "Félix Nova", loc: "Villa Consuelo, SD" },
  { name: "Hair & Beauty Supplies RD", rep: "Claudia Ortiz", loc: "Bella Vista, SD" },
  { name: "Distribuidora D'Oleo", rep: "Isidro D'Oleo", loc: "Independencia, SD" },
  { name: "Laboratorios Rivas", rep: "Dr. Rivas", loc: "San Cristóbal Centro" },
  { name: "Suplidora de Belleza Estrellas", rep: "Estrella Marte", loc: "Bonao" },
  { name: "Distribuidora Global Beauty", rep: "Enrique Santos", loc: "Naco, SD" },
  { name: "Salon Supplies RD", rep: "Victor Hugo", loc: "Villa Juana, SD" },
  { name: "Distribuidora Cosmeticos Los Hermanos", rep: "Ramón García", loc: "Santiago de los Caballeros" },
  { name: "Elite Hair Distribution", rep: "Roberto Caro", loc: "Punta Cana Village" },
  { name: "Caribbean Beauty Supplies", rep: "Isabel Mejia", loc: "La Romana Centro" },
  { name: "Distribuidora Quisqueya Beauty", rep: "Manuel Perdomo", loc: "Higüey" },
  { name: "Laboratorios Star Products", rep: "Gerencia Ventas", loc: "Zona Industrial de Herrera, SD" },
  { name: "Suplidora La Bendición", rep: "Margarita Pérez", loc: "Azua" },
  { name: "Distribuidora de Belleza San Juan", rep: "José Miguel", loc: "San Juan de la Maguana" },
  { name: "Beauty Line RD", rep: "Laura Baez", loc: "Arroyo Hondo, SD" },
  { name: "Distribuidora de Cosmeticos Mary", rep: "María López", loc: "Baní" },
  { name: "Laboratorios Chemel", rep: "Ing. Chemel", loc: "Ensanche La Fe, SD" },
  { name: "Suplidora de Belleza El Sol", rep: "Solange Díaz", loc: "San Pedro de Macorís" },
  { name: "Distribuidora Pro-Hair", rep: "Luis Manuel", loc: "Puerto Plata" },
  { name: "Master Beauty RD", rep: "Daniel Cabrera", loc: "Santiago Oeste" },
  { name: "Distribuidora Altagracia", rep: "Dra. Altagracia", loc: "Higuey" },
  { name: "Laboratorios Boé", rep: "Gerencia Industrial", loc: "Haina, San Cristóbal" },
  { name: "Suplidora de Belleza Milagros", rep: "Milagros Reyes", loc: "Bonao" },
  { name: "Distribuidora de Cosmeticos RD", rep: "Pablo Duarte", loc: "Sánchez Ramírez" },
  { name: "Hair Care Solutions RD", rep: "Elena Rosario", loc: "Santo Domingo Este" },
  { name: "Distribuidora de Belleza Premium", rep: "Julio Cesar", loc: "Santiago Rodriguez" },
  { name: "Laboratorios Zunilda", rep: "Zunilda Peña", loc: "Dajabón" },
  { name: "Suplidora de Belleza Dominicana", rep: "Francisca Ortiz", loc: "Barahona" },
  { name: "Distribuidora de Belleza Real", rep: "Sonia Jiménez", loc: "Monte Plata" },
  { name: "Beauty Trade RD", rep: "Pedro Martínez", loc: "Hato Mayor" },
  { name: "Distribuidora de Cosmeticos Elite", rep: "Fernando Cruz", loc: "Nagua" },
  { name: "Suplidora de Belleza 2000", rep: "Andrés Nuñez", loc: "Samaná" }
];

export const MOCK_SUPPLIERS: Supplier[] = supplierSeeds.map((seed, i) => {
  return {
    id: (1001 + i).toString(),
    businessName: seed.name,
    representative: seed.rep,
    productType: "Belleza & Cosmetología Profesional",
    phone: seed.name === "Salerm Cosmetics RD" ? "8096831004" : getRandomPhone(),
    location: seed.loc,
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
 * CATALOGO DE PRODUCTOS ACTUALIZADO 
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
    const brands = ["Salerm", "Moroccanoil", "L'Oreal", "Wahl", "Parlux", "Olaplex", "Alfaparf", "Wella", "Capilo", "Star Products"];
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
      description: `Producto profesional de alto rendimiento por ${brand}. Distribuido oficialmente en República Dominicana por ${sup.businessName}. Garantía de autenticidad y frescura del lote.`,
      basePrice,
      baseBulkPrice: Math.floor(basePrice * 0.8),
      price: Math.floor(basePrice * PLATFORM_MARKUP),
      bulkPrice: Math.floor(basePrice * 0.8 * PLATFORM_MARKUP),
      bulkThreshold: 6,
      images: [images[itemIdx % images.length]],
      stock: 500,
      hairType: ['Todo Tipo', 'Tropical', 'Procesado'],
      benefits: ['Calidad Premium', 'Distribución Local Autorizada', 'Fidelidad'],
      applicationTime: 'Variable',
      professionalWarning: 'Exclusivo para uso profesional en salones de belleza certificados.',
      rating: 4.9,
      reviews: 150 + itemIdx,
      content: "Pro-Format 1L",
      isPublished: true
    };
  });
});
