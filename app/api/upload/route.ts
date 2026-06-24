import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'placeholder',
  api_key: process.env.CLOUDINARY_API_KEY || 'placeholder',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'placeholder',
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const urls: string[] = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Stream upload to Cloudinary
      const uploadResult: any = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'lavander_concrete',
          },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });

      if (uploadResult && uploadResult.secure_url) {
        urls.push(uploadResult.secure_url);
      } else {
        throw new Error('Failed to get secure URL from Cloudinary');
      }
    }

    return NextResponse.json({ urls });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
