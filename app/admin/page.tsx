'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, LockKeyhole } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // If already logged in, redirect directly to dashboard
    if (localStorage.getItem('admin_authenticated') === 'true') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'AD@#19877') {
      localStorage.setItem('admin_authenticated', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('كلمة المرور غير صحيحة! / Incorrect password!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4" style={{ fontFamily: 'var(--font-inter)' }}>
      <Card className="w-full max-w-md shadow-2xl border border-gray-100 overflow-hidden">
        <CardHeader className="bg-primary text-primary-foreground py-8 text-center flex flex-col items-center">
          <div className="p-3 bg-white/20 rounded-full mb-4 animate-pulse">
            <LockKeyhole className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-wide">لوحة تحكم المشرف</CardTitle>
          <p className="text-sm opacity-90 mt-1">Admin Dashboard Authentication</p>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block text-right" dir="rtl">
                أدخل كلمة المرور للدخول:
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                className="text-center font-mono py-6 text-lg tracking-widest focus:ring-2"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg" dir="rtl">
                <ShieldAlert className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 text-base shadow-md transition-all duration-300">
              دخول / Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
