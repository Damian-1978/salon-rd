
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
export type PaymentStatus = 'PENDING' | 'PAID';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  description: string;
  price: number;
  bulkPrice: number;
  bulkThreshold: number;
  images: string[];
  stock: number;
  hairType: string[];
  benefits: string[];
  applicationTime: string;
  professionalWarning: string;
  videoUrl?: string;
  rating: number;
  reviews: number;
  includedItems?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface StylistProfile {
  name: string;
  salonName: string;
  phone: string;
  rnc?: string;
  registeredAt: number;
}

export interface RegistrationRecord extends StylistProfile {
  id: string;
  status: 'NEW' | 'CONTACTED' | 'VERIFIED';
}

export interface Order {
  id: string;
  stylist: StylistProfile;
  items: CartItem[];
  subtotal: number;
  savings: number;
  type: 'ORDER' | 'ASSISTANCE';
  status: 'PENDING' | 'CONTACTED' | 'COMPLETED';
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  timestamp: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}
