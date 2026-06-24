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

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    const body = await req.json();
    const status = body.status;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const orders = getOrders();
    const orderIndex = orders.findIndex((o: any) => String(o._id) === String(id));

    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    orders[orderIndex].status = status;
    fs.writeFileSync(filePath, JSON.stringify(orders, null, 2));

    return NextResponse.json(orders[orderIndex]);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
