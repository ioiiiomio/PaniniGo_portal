// src/components/ItemsPage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ItemsPage = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const itemsCollection = collection(db, 'items');
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(itemsList);
    };

    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      const itemDoc = doc(db, 'items', id);
      await deleteDoc(itemDoc);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <h3>Items</h3>
      <Link to="/form">
        <button>Add New Item</button>
      </Link>

      <div style={{ marginTop: '1rem' }}>
        {items.map(item => (
          <div key={item.id} style={{ marginBottom: '1rem', padding: '0.5rem', borderBottom: '1px solid #ccc' }}>
            <h4>{item.name}</h4>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
            <Link to={`/item/${item.id}`}>
              <button>Edit</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsPage;
