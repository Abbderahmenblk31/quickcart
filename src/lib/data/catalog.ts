// =============================================================================
// QuickCart Headless E-Commerce - Product Catalog & Initial Store Inventory
// =============================================================================

import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- AUDIO ---
  {
    id: 'prod-01',
    title: 'AuraWave Pro Wireless ANC Headphones',
    slug: 'aurawave-pro-anc-headphones',
    description: 'Studio-grade acoustic architecture with active hybrid noise cancellation, 45-hour battery life, and ultra-plush memory foam earcups.',
    price: 299.99,
    comparePrice: 349.99,
    category: 'audio',
    stockQuantity: 24,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewCount: 142,
    specs: {
      Driver: '40mm Custom Beryllium',
      Battery: '45 Hours (Fast Charge: 15m = 5h)',
      Connectivity: 'Bluetooth 5.3 + 3.5mm Hi-Res',
      Weight: '254g',
    },
    isFeatured: true,
  },
  {
    id: 'prod-02',
    title: 'PulseBuds Titanium True Wireless Earbuds',
    slug: 'pulsebuds-titanium-tws',
    description: 'Compact IPX7 waterproof earbuds with dynamic spatial audio, dual beamforming microphones, and Qi wireless charging case.',
    price: 159.0,
    comparePrice: 189.0,
    category: 'audio',
    stockQuantity: 42,
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.8,
    reviewCount: 88,
    specs: {
      Latency: '< 40ms Gaming Mode',
      Waterproof: 'IPX7 Certified',
      Battery: '8h + 28h with case',
      NoiseCancel: '32dB Adaptive ANC',
    },
    isFeatured: true,
  },

  // --- WEARABLES ---
  {
    id: 'prod-03',
    title: 'Apex Horizon Titanium Smartwatch Ultra',
    slug: 'apex-horizon-smartwatch-ultra',
    description: 'Aerospace-grade titanium case with sapphire crystal glass, precision dual-frequency GPS, ECG monitor, and 100m dive rating.',
    price: 549.0,
    comparePrice: 620.0,
    category: 'wearables',
    stockQuantity: 15,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 5.0,
    reviewCount: 96,
    specs: {
      Display: '1.96" Sapphire AMOLED 2000 nits',
      Sensors: 'Optical Heart, SpO2, ECG, Depth',
      Battery: 'Up to 7 Days typical',
      Material: 'Grade 5 Aerospace Titanium',
    },
    isFeatured: true,
  },
  {
    id: 'prod-04',
    title: 'Onyx Smart Bio-Sensing Health Ring',
    slug: 'onyx-smart-health-ring',
    description: 'Discreet smart ring engineered from polished ceramic and medical titanium. Monitors continuous sleep cycles, recovery score, and stress indices.',
    price: 249.99,
    category: 'wearables',
    stockQuantity: 30,
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.7,
    reviewCount: 65,
    specs: {
      Battery: '6 Days on single charge',
      WaterResistance: '100m (Waterproof)',
      Weight: '4 to 6 grams',
      Compatibility: 'iOS & Android via BLE',
    },
  },

  // --- ELECTRONICS ---
  {
    id: 'prod-05',
    title: 'Vertex Creator 34" Curved 4K OLED Monitor',
    slug: 'vertex-creator-34-curved-oled',
    description: 'Immersive 1800R curved ultra-wide OLED display with 99.3% DCI-P3 color accuracy, 175Hz refresh rate, and 90W USB-C single cable docking.',
    price: 899.0,
    comparePrice: 999.0,
    category: 'electronics',
    stockQuantity: 8,
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewCount: 52,
    specs: {
      Panel: 'Quantum Dot OLED (3440 x 1440)',
      RefreshRate: '175Hz / 0.03ms GtG',
      Ports: 'Thunderbolt 4, HDMI 2.1, DP 1.4',
      HDR: 'DisplayHDR True Black 400',
    },
    isFeatured: true,
  },
  {
    id: 'prod-06',
    title: 'NovaKey Custom Hot-Swap Mechanical Keyboard',
    slug: 'novakey-custom-mechanical-keyboard',
    description: 'Solid CNC anodized aluminum chassis, gasket-mounted sound dampening, pre-lubed Gateron linear switches, and customizable per-key RGB.',
    price: 189.5,
    category: 'electronics',
    stockQuantity: 35,
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.9,
    reviewCount: 110,
    specs: {
      Layout: '75% Compact (82 Keys)',
      Switches: 'Gateron Oil King (Hot-swappable)',
      Keycaps: 'Double-shot PBT Cherry Profile',
      Connectivity: 'Tri-mode: 2.4G, BT 5.1, USB-C',
    },
  },

  // --- ACCESSORIES ---
  {
    id: 'prod-07',
    title: 'VoltCore 140W GaN Fast Charging Dock',
    slug: 'voltcore-140w-gan-dock',
    description: 'Next-generation Gallium Nitride (GaN III) fast charger capable of charging two MacBook Pros and an iPhone simultaneously at peak velocity.',
    price: 89.0,
    comparePrice: 110.0,
    category: 'accessories',
    stockQuantity: 50,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.8,
    reviewCount: 94,
    specs: {
      TotalOutput: '140W Max PD 3.1',
      Ports: '3x USB-C + 1x USB-A',
      Tech: 'GaNFast III with ThermalGuard',
      Certification: 'CE, FCC, RoHS, UL',
    },
  },
  {
    id: 'prod-08',
    title: 'Strata Ergonomic Aluminum Laptop Stand',
    slug: 'strata-ergonomic-aluminum-laptop-stand',
    description: 'Precision-machined unibody aircraft-grade aluminum riser with silicone anti-slip buffers and passive heat dissipation ventilation.',
    price: 59.99,
    category: 'accessories',
    stockQuantity: 65,
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    ],
    rating: 4.7,
    reviewCount: 78,
    specs: {
      Material: 'Sandblasted Anodized Aluminum',
      Compatibility: 'All laptops 11" to 17"',
      Angle: 'Ergonomic 18° Eye-Level Elevation',
      Weight: '410g',
    },
  },
];
