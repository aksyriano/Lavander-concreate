import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await req.json();
    const status = body.status;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const { data: updatedRow, error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!updatedRow) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const mappedOrder = {
      _id: updatedRow.id,
      id: updatedRow.id,
      customer: {
        name: updatedRow.customer_name,
        phone: updatedRow.customer_phone,
        address: updatedRow.customer_address,
      },
      products: updatedRow.products || [],
      totalPrice: Number(updatedRow.total_price),
      status: updatedRow.status,
      createdAt: updatedRow.created_at,
    };

    return NextResponse.json(mappedOrder);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to update order status' }, { status: 500 });
  }
}
