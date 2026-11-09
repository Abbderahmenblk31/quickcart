import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/store/orders-store';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      paymentMethod,
      discountCode,
    } = body;

    if (!customerName || !customerEmail || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Incomplete checkout parameters. Please provide full contact and shipping details.' },
        { status: 400 }
      );
    }

    const order = store.createOrder({
      customerName,
      customerEmail,
      customerPhone: customerPhone || '+216 00 000 000',
      shippingAddress,
      items,
      paymentMethod: paymentMethod || 'CARD',
      discountCode,
    });

    return NextResponse.json({
      success: true,
      message: 'Order placed and inventory reserved successfully.',
      data: order,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process checkout.' },
      { status: 400 }
    );
  }
}
