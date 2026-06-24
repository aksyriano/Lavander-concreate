import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'products.json');

function getProducts() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    const products = JSON.parse(fileContent);
    return products.map((p: any) => ({
      ...p,
      _id: p._id || String(p.id),
      id: p.id || parseInt(p._id) || Math.floor(Math.random() * 1000000),
      image: p.image || p.images?.[0] || "",
      images: p.images || (p.image ? [p.image] : []),
      stock: p.stock !== undefined ? p.stock : 10,
    }));
  } catch (err) {
    return [];
  }
}

export async function GET() {
  const products = getProducts();
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const products = getProducts();
    
    // Generate new unique ID
    const nextId = products.length > 0 ? Math.max(...products.map((p: any) => p.id)) + 1 : 1;
    const newProduct = {
      id: nextId,
      _id: String(nextId),
      name: body.name,
      price: Number(body.price),
      description: body.description,
      images: body.images || [],
      image: body.images?.[0] || "",
      sizes: body.sizes || [],
      colors: body.colors || [],
      category: body.category || "General",
      stock: body.stock !== undefined ? Number(body.stock) : 10,
      createdAt: new Date().toISOString(),
    };

    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));

    return NextResponse.json(newProduct, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save product' }, { status: 500 });
  }
}
