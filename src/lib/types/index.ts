// =============================================================================
// QuickCart Headless E-Commerce - Core Domain Models & Type System
// =============================================================================

export type ProductCategory = 'electronics' | 'audio' | 'wearables' | 'accessories';

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  category: ProductCategory;
  stockQuantity: number;
  images: string[];
  rating: number;
  reviewCount: number;
  specs: Record<string, string>;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'PLACED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string; // e.g. "QC-84920"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state?: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: 'CARD' | 'APPLE_PAY' | 'COD';
  paymentStatus: 'PAID' | 'PENDING';
  trackingNumber: string;
  estimatedDelivery: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreMetrics {
  totalRevenue: number;
  totalOrders: number;
  activeProducts: number;
  lowStockCount: number;
  recentOrders: Order[];
}
