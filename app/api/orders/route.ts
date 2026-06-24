import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: dbOrders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const orders = (dbOrders || []).map((o: any) => ({
      _id: o.id,
      id: o.id,
      customer: {
        name: o.customer_name,
        phone: o.customer_phone,
        address: o.customer_address,
      },
      products: o.products || [],
      totalPrice: Number(o.total_price),
      status: o.status,
      createdAt: o.created_at,
    }));

    return NextResponse.json(orders);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Generate a unique order ID
    const orderId = 'ORD' + Math.random().toString(36).substring(2, 9).toUpperCase();

    const { data: newRow, error } = await supabase
      .from('orders')
      .insert({
        id: orderId,
        customer_name: body.customer?.name || 'Guest',
        customer_phone: body.customer?.phone || 'N/A',
        customer_address: body.customer?.address || 'N/A',
        products: body.products || [],
        total_price: Number(body.totalPrice) || 0,
        status: body.status || 'Pending',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    const mappedOrder = {
      _id: newRow.id,
      id: newRow.id,
      customer: {
        name: newRow.customer_name,
        phone: newRow.customer_phone,
        address: newRow.customer_address,
      },
      products: newRow.products || [],
      totalPrice: Number(newRow.total_price),
      status: newRow.status,
      createdAt: newRow.created_at,
    };

    return NextResponse.json(mappedOrder, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save order' }, { status: 500 });
  }
}
