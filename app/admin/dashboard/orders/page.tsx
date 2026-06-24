'use client';
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/data/translations';
import Translate from '@/components/Translate';

export default function AdminOrders() {
  const { lang } = useLanguage();
  const t = translations[lang] || translations['en'];
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch(err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      fetchOrders();
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder((prev: any) => ({ ...prev, status }));
      }
    } catch(err) {
      console.error(err);
    }
  };

  const handleRowClick = (order: any) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div>
      <h1 className={styles.title}><Translate k="manageOrders">Manage Orders</Translate></h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th><Translate k="orderId">Order ID</Translate></th>
              <th><Translate k="customer">Customer</Translate></th>
              <th><Translate k="phoneNumberLabel">Phone</Translate></th>
              <th><Translate k="amount">Amount</Translate></th>
              <th><Translate k="date">Date</Translate></th>
              <th><Translate k="status">Status</Translate></th>
              <th><Translate k="action">Action</Translate></th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} onClick={() => handleRowClick(order)} className={styles.clickableRow}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.customer?.name || 'Guest'}</td>
                <td>{order.customer?.phone || 'N/A'}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[order.status.toLowerCase()]}`}>
                    {t[order.status.toLowerCase()] || order.status}
                  </span>
                </td>
                <td onClick={(e) => e.stopPropagation()}>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className={styles.statusSelect}
                  >
                    <option value="Pending">{t.pending}</option>
                    <option value="Shipped">{t.shipped}</option>
                    <option value="Delivered">{t.delivered}</option>
                    <option value="Cancelled">{t.cancelled}</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} style={{textAlign:'center', padding:'2rem'}}>
                  <Translate k="noOrdersFound">No orders found.</Translate>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2><Translate k="orderId">Order ID</Translate>: #{selectedOrder._id.substring(0, 8)}</h2>
              <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.detailSection}>
                <h3><Translate k="customerInfo">Customer Information</Translate></h3>
                <div className={styles.infoLine}>
                  <label><Translate k="fullName">Full Name</Translate></label>
                  <p>{selectedOrder.customer?.name || 'N/A'}</p>
                </div>
                <div className={styles.infoLine}>
                  <label><Translate k="phoneNumberLabel">Phone Number</Translate></label>
                  <p>{selectedOrder.customer?.phone || 'N/A'}</p>
                </div>
                <div className={styles.infoLine}>
                  <label><Translate k="addressLabel">Shipping Address</Translate></label>
                  <p>{selectedOrder.customer?.address || 'N/A'}</p>
                </div>
              </div>

              <div className={styles.detailSection}>
                <h3><Translate k="orderItems">Order Items</Translate></h3>
                <table className={styles.orderItemsTable}>
                  <thead>
                    <tr>
                      <th><Translate k="productName">Product</Translate></th>
                      <th><Translate k="quantity">Quantity</Translate></th>
                      <th><Translate k="total">Total</Translate></th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((p: any, idx: number) => (
                      <tr key={idx}>
                        <td>
                          {p.product?.name || 'Deleted Product'}
                          <br />
                          <small style={{color: '#888'}}>
                            {t.sizeDetail}: {p.size} | {t.colorDetail}: {p.color}
                          </small>
                        </td>
                        <td>{p.quantity}</td>
                        <td>${((p.product?.price || 0) * p.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: '1.5rem', borderTop: '2px solid #eee', paddingTop: '1rem', textAlign: 'right' }}>
                  <strong><Translate k="total">Total</Translate>: ${selectedOrder.totalPrice.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <select 
                value={selectedOrder.status} 
                onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                className={styles.statusSelect}
              >
                <option value="Pending">{t.pending}</option>
                <option value="Shipped">{t.shipped}</option>
                <option value="Delivered">{t.delivered}</option>
                <option value="Cancelled">{t.cancelled}</option>
              </select>
              <button className="btn-secondary" onClick={closeModal} style={{ padding: '0.5rem 1rem' }}>
                <Translate k="close">Close</Translate>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
