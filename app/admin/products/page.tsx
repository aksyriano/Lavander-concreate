'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminProductsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/dashboard/products');
  }, [router]);
  return null;
}
