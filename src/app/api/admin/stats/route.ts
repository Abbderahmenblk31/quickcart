import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store/orders-store';

export async function GET() {
  try {
    const metrics = store.getMetrics();
    return NextResponse.json({ success: true, data: metrics });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}
