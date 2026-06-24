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

export async function GET(req: Request, { params }: { params: any }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const products = getProducts();
  const product = products.find((p: any) => String(p.id) === String(id) || String(p._id) === String(id));
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json(product);
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const products = getProducts();
    const filteredProducts = products.filter((p: any) => String(p.id) !== String(id) && String(p._id) !== String(id));
    
    fs.writeFileSync(filePath, JSON.stringify(filteredProducts, null, 2));
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
