import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    // Supabase bigint IDs are numeric
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { data: p, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', numericId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!p) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const mappedProduct = {
      id: p.id,
      _id: String(p.id),
      name: p.name,
      price: Number(p.price),
      description: p.description || "",
      images: p.images || [],
      image: p.images?.[0] || "",
      sizes: p.sizes || [],
      colors: p.colors || [],
      category: p.category || "General",
      stock: p.stock !== undefined ? p.stock : 10,
      createdAt: p.created_at,
    };

    return NextResponse.json(mappedProduct);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 });
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', numericId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to delete product' }, { status: 500 });
  }
}
