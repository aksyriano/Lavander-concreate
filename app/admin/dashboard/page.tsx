'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import Translate from '@/components/Translate';

export default function DashboardOverview() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    // In a real app we would fetch the stats summary from the backend
    // Since we don't have a stats endpoint yet, we'll fake it or fetch array lengths
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/orders')
        ]);


        const products = await productsRes.json();
        const orders = await ordersRes.json();

        const revenue = Array.isArray(orders) 
          ? orders.reduce((sum, ord) => sum + ord.totalPrice, 0)
          : 0;

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: Array.isArray(orders) ? orders.length : 0,
          revenue
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <h1 className={styles.title}><Translate k="dashboardOverview">Dashboard Overview</Translate></h1>
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3><Translate k="totalProducts">Total Products</Translate></h3>
          <p>{stats.products}</p>
        </div>
        <div className={styles.statCard}>
          <h3><Translate k="totalOrders">Total Orders</Translate></h3>
          <p>{stats.orders}</p>
        </div>
        <div className={styles.statCard}>
          <h3><Translate k="totalRevenue">Total Revenue</Translate></h3>
          <p>${stats.revenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
