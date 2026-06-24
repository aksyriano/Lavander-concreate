'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminOrdersRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/dashboard/orders');
  }, [router]);
  return null;
}
