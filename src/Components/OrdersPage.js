// src/components/OrdersPage.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersList);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h3>Orders</h3>
      <div style={{ marginTop: '1rem' }}>
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} style={{ marginBottom: '1rem', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
              <h4>Order ID: {order.id}</h4>
              <p>Status: {order.status}</p>
            </div>
          ))
        ) : (
          <p>No orders available.</p>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
