import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    const products = (dbProducts || []).map((p: any) => ({
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
      createdAt: p.created_at || new Date().toISOString(),
    }));

    return NextResponse.json(products);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { data: newRow, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        price: Number(body.price),
        description: body.description,
        images: body.images || [],
        sizes: body.sizes || [],
        colors: body.colors || [],
        category: body.category || "General",
        stock: body.stock !== undefined ? Number(body.stock) : 10,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    const mappedProduct = {
      id: newRow.id,
      _id: String(newRow.id),
      name: newRow.name,
      price: Number(newRow.price),
      description: newRow.description || "",
      images: newRow.images || [],
      image: newRow.images?.[0] || "",
      sizes: newRow.sizes || [],
      colors: newRow.colors || [],
      category: newRow.category || "General",
      stock: newRow.stock,
      createdAt: newRow.created_at,
    };

    return NextResponse.json(mappedProduct, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save product' }, { status: 500 });
  }
}
