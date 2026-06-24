'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './layout.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const t = translations[lang] || translations['en'];
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated');
    if (isAuth !== 'true') {
      router.push('/admin');
    } else {
      setAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    router.push('/admin');
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  const isRtl = lang === 'ar';

  if (!authorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={styles.adminContainer} dir={isRtl ? "rtl" : "ltr"} style={{ fontFamily: 'var(--font-body)' }}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <h2>{t.brandName}</h2>
          <span>{t.adminPanel}</span>
        </div>
        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={styles.navLink}>
            {t.dashboardLink}
          </Link>
          <Link href="/admin/dashboard/products" className={styles.navLink}>
            {t.productsLink}
          </Link>
          <Link href="/admin/dashboard/add-product" className={styles.navLink}>
            {t.addProductLink}
          </Link>
          <Link href="/admin/dashboard/orders" className={styles.navLink}>
            {t.ordersLink}
          </Link>
        </nav>
        
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button onClick={toggleLang} className={styles.navLink} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#fff', textAlign: isRtl ? 'right' : 'left' }}>
            🌐 {t.toggleLanguage}
          </button>
          <button onClick={handleLogout} className={styles.logoutBtn} style={{ border: 'none', cursor: 'pointer', textAlign: isRtl ? 'right' : 'left' }}>
            {t.logoutBtn}
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
