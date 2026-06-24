'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import Translate from '@/components/Translate';

export default function AdminProducts() {
  const { lang } = useLanguage();
  const t = translations[lang] || translations['en'];
  const [products, setProducts] = useState<any[]>([]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if(!confirm(t.confirmDelete || 'Are you sure?')) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      });
      fetchProducts();
    } catch(err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}><Translate k="manageProducts">Manage Products</Translate></h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/admin/dashboard/add-product" className="btn-primary">
            ➕ <Translate k="addProductTitle">Add New Product</Translate>
          </Link>
        </div>
      </div>


      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><Translate k="image">Image</Translate></th>
              <th><Translate k="productName">Name</Translate></th>
              <th><Translate k="price">Price</Translate></th>
              <th><Translate k="stock">Stock</Translate></th>
              <th><Translate k="actions">Actions</Translate></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              let displayImage = (p.images[0] || '/images/hero.png').replace(/["']/g, '').trim();
              if (displayImage.includes('public\\images\\')) {
                displayImage = '/images/' + displayImage.split('public\\images\\').pop();
              } else if (displayImage.includes('public/images/')) {
                displayImage = '/images/' + displayImage.split('public/images/').pop();
              }
              displayImage = displayImage.replace(/\\/g, '/');

              return (
                <tr key={p._id}>
                  <td><img src={displayImage} alt={p.name} width="50" height="70" style={{objectFit: 'cover'}}/></td>
                  <td>{p.name}</td>
                  <td>${p.price}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button onClick={() => handleDelete(p._id)} className={styles.deleteBtn}>
                      <Translate k="delete">Delete</Translate>
                    </button>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{textAlign:'center', padding:'2rem'}}>
                  <Translate k="noProductsFound">No products found.</Translate>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
