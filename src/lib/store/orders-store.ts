// =============================================================================
// QuickCart Headless E-Commerce - Inventory & Order Fulfillment Store
// =============================================================================

import { Product, Order, OrderStatus, StoreMetrics } from '../types';
import { INITIAL_PRODUCTS } from '../data/catalog';

class ECommerceStore {
  products: Product[] = [...INITIAL_PRODUCTS];

  orders: Order[] = [
    {
      id: 'QC-1092',
      customerName: 'Karim Mansour',
      customerEmail: 'karim.m@gmail.com',
      customerPhone: '+216 98 123 456',
      shippingAddress: {
        street: 'Avenue Habib Bourguiba, Appt 4B',
        city: 'Tunis',
        zipCode: '1001',
        country: 'Tunisia',
      },
      items: [
        {
          productId: 'prod-01',
          title: 'AuraWave Pro Wireless ANC Headphones',
          price: 299.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        },
      ],
      subtotal: 299.99,
      shippingFee: 15.0,
      discount: 0,
      totalAmount: 314.99,
      status: 'DELIVERED',
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      trackingNumber: 'QC-TRK-771092',
      estimatedDelivery: 'Delivered on Nov 6, 2026',
      createdAt: '2026-11-04T10:15:00Z',
      updatedAt: '2026-11-06T14:30:00Z',
    },
    {
      id: 'QC-1093',
      customerName: 'Yassine Ben Salem',
      customerEmail: 'yassine.bs@tech.io',
      customerPhone: '+216 22 456 789',
      shippingAddress: {
        street: 'Rue du Lac Victoria, Les Berges du Lac',
        city: 'Tunis',
        zipCode: '1053',
        country: 'Tunisia',
      },
      items: [
        {
          productId: 'prod-03',
          title: 'Apex Horizon Titanium Smartwatch Ultra',
          price: 549.0,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
        },
        {
          productId: 'prod-07',
          title: 'VoltCore 140W GaN Fast Charging Dock',
          price: 89.0,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        },
      ],
      subtotal: 638.0,
      shippingFee: 0.0, // Free shipping tier over $200
      discount: 25.0, // Promo code
      totalAmount: 613.0,
      status: 'SHIPPED',
      paymentMethod: 'CARD',
      paymentStatus: 'PAID',
      trackingNumber: 'QC-TRK-771093',
      estimatedDelivery: 'Estimated by Tomorrow, 3 PM',
      createdAt: '2026-11-08T09:40:00Z',
      updatedAt: '2026-11-09T08:00:00Z',
    },
  ];

  listProducts(category?: string, search?: string, sort?: string): Product[] {
    let list = [...this.products];

    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (sort === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }

  getProductById(id: string): Product | null {
    return this.products.find((p) => p.id === id) || null;
  }

  createOrder(dto: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: {
      street: string;
      city: string;
      zipCode: string;
      country: string;
    };
    items: Array<{ productId: string; quantity: number }>;
    paymentMethod: 'CARD' | 'APPLE_PAY' | 'COD';
    discountCode?: string;
  }): Order {
    const orderItems: Array<any> = [];
    let subtotal = 0;

    // Verify stock & reserve inventory
    for (const it of dto.items) {
      const product = this.getProductById(it.productId);
      if (!product) {
        throw new Error(`Product ${it.productId} not found in store.`);
      }
      if (product.stockQuantity < it.quantity) {
        throw new Error(`Insufficient inventory for "${product.title}". Only ${product.stockQuantity} remaining.`);
      }

      product.stockQuantity -= it.quantity; // Decrement inventory
      const total = product.price * it.quantity;
      subtotal += total;

      orderItems.push({
        productId: product.id,
        title: product.title,
        price: product.price,
        quantity: it.quantity,
        image: product.images[0],
      });
    }

    const shippingFee = subtotal > 200 ? 0 : 15.0; // Free shipping over $200
    const discount = dto.discountCode?.toUpperCase() === 'SAVE15' ? subtotal * 0.15 : 0;
    const totalAmount = Math.max(0, subtotal + shippingFee - discount);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderId = `QC-${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      customerName: dto.customerName,
      customerEmail: dto.customerEmail,
      customerPhone: dto.customerPhone,
      shippingAddress: dto.shippingAddress,
      items: orderItems,
      subtotal: Math.round(subtotal * 100) / 100,
      shippingFee,
      discount: Math.round(discount * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: 'PLACED',
      paymentMethod: dto.paymentMethod,
      paymentStatus: dto.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
      trackingNumber: `QC-TRK-${randomSuffix}`,
      estimatedDelivery: 'Estimated within 2-3 business days',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);
    return newOrder;
  }

  getOrderById(id: string): Order | null {
    const cleanId = id.trim().toUpperCase();
    return this.orders.find((o) => o.id === cleanId || o.trackingNumber === cleanId) || null;
  }

  updateOrderStatus(orderId: string, status: OrderStatus): Order {
    const order = this.getOrderById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found.`);
    }
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  getMetrics(): StoreMetrics {
    const totalRevenue = this.orders
      .filter((o) => o.paymentStatus === 'PAID')
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const lowStockCount = this.products.filter((p) => p.stockQuantity < 10).length;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders: this.orders.length,
      activeProducts: this.products.length,
      lowStockCount,
      recentOrders: this.orders.slice(0, 8),
    };
  }
}

export const store = new ECommerceStore();
