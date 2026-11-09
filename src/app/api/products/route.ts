import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store/orders-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const sort = searchParams.get('sort') || undefined;

    const products = store.listProducts(category, search, sort);

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to list products' },
      { status: 500 }
    );
  }
}
