import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // To get the current logged-in user

function HomePage() {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [shopId, setShopId] = useState(''); // Will store shopId from Firebase
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShopId = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, "cafes", currentUser.uid); // Assuming "cafes" collection stores shop data
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setShopId(userDocSnap.id); // Set the shopId from Firestore
        }
      }
    };

    fetchShopId();
  }, []);

  // Fetch Items for the shop
  useEffect(() => {
    const fetchItems = async () => {
      if (shopId) {
        const querySnapshot = await getDocs(collection(db, "items"));
        const shopItems = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((item) => item.shopID === shopId);
        setItems(shopItems);
      }
    };
    fetchItems();
  }, [shopId]);

  // Fetch Orders for the shop
  useEffect(() => {
    const fetchOrders = async () => {
      if (shopId) {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const shopOrders = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((order) => order.cafeId === shopId);
        setOrders(shopOrders);
      }
    };
    fetchOrders();
  }, [shopId]);

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, "orders", orderId), { status: newStatus });
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
    <div className="HomePage" style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      {/* Items Section */}
      <div style={{ width: '75%', padding: '20px' }}>
        <h2>Items List</h2>
        <button onClick={() => navigate('/form')}>Add Item</button>
        {items.length === 0 ? (
          <p>No items yet :&lt;</p>
        ) : (
          items.map(item => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#fff',
                padding: '20px',
                marginBottom: '20px',
                borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ flex: 1 }}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <p><strong>Price:</strong> ${item.price}</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => deleteItem(item.id)}>Delete</button>
                <Link to={`/item/${item.id}`}>
                  <button>Edit</button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Orders Section */}
      <div style={{ width: '25%', padding: '20px' }}>
        <h2>Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          orders.map(order => (
            <div key={order.id} style={{ borderBottom: '1px solid #ccc', marginBottom: '10px' }}>
              <p><strong>ID:</strong> {order.id}</p>
              <p><strong>Total:</strong> {order.total}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <select
                value={order.status}
                onChange={(e) => updateOrderStatus(order.id, e.target.value)}
              >
                <option value="Waiting">Waiting</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          ))
        )}
      </div>

      {/* Log Out */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
        <button onClick={() => navigate('/auth')}>Log Out</button>
      </div>
    </div>
  );
}

export default HomePage;
