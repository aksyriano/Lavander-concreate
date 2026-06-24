import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'images');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const ext = path.extname(file.name) || '.jpg';
      const filename = `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
      const destPath = path.join(uploadDir, filename);

      fs.writeFileSync(destPath, buffer);
      urls.push(`/images/${filename}`);
    }

    return NextResponse.json({ urls });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
