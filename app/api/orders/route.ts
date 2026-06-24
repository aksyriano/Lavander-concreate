import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'orders.json');

function getOrders() {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const fileContent = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(fileContent);
  } catch (err) {
    return [];
  }
}

export async function GET() {
  const orders = getOrders();
  // Sort orders by date descending
  const sorted = orders.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return NextResponse.json(sorted);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orders = getOrders();

    const newOrder = {
      _id: 'ORD' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      customer: {
        name: body.customer?.name || 'Guest',
        phone: body.customer?.phone || 'N/A',
        address: body.customer?.address || 'N/A',
      },
      products: body.products || [],
      totalPrice: Number(body.totalPrice) || 0,
      status: body.status || 'Pending',
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    return NextResponse.json(newOrder, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to save order' }, { status: 500 });
  }
}
