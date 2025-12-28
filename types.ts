
export enum Category {
  TRATAMIENTOS = 'Tratamientos',
  SHAMPOO = 'Shampoo & Acondicionador',
  TINTES = 'Tintes & Color',
  KERATINA = 'Keratina & Alisado',
  EQUIPOS = 'Equipos',
  OFERTAS = 'Ofertas del Día',
  LINEAS_CAPILARES = 'Líneas Capilares'
}

export type PaymentMethod = 'CARD' | 'TRANSFER' | 'CASH';
export type PaymentStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface Product {
  id: string;
  supplierId: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  basePrice: number; 
  baseBulkPrice: number; 
  price: number; 
  bulkPrice: number; 
  bulkThreshold: number;
  images: string[];
  stock: number;
  hairType: string[];
  benefits: string[];
  applicationTime: string;
  professionalWarning: string;
  rating: number;
  reviews: number;
  content?: string;
  isPublished?: boolean; // Control de exposición en catálogo
  steps?: number;
}

export interface Supplier {
  id: string;
  businessName: string;
  representative: string;
  productType: string;
  phone: string;
  location: string;
  balance: number; // Ganancias acumuladas
  isAuthorized: boolean; // Autorización por Admin Maestro
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StylistProfile {
  name: string;
  salonName: string;
  phone: string;
  city: string;
  registeredAt: number;
}

export interface RegistrationRecord extends StylistProfile {
  id: string;
  status: 'NEW' | 'CONTACTED' | 'VERIFIED';
}

export interface Order {
  id: string;
  invoiceNumber: string;
  stylist: StylistProfile;
  items: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: 'PENDING' | 'DISPATCHED' | 'COMPLETED';
  timestamp: number;
  platformEarning: number; // 20% Markup de la app
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
