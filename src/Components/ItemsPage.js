import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // For getting the logged-in user

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [shopID, setShopID] = useState('');

  useEffect(() => {
    const fetchShopID = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, "cafes", currentUser.uid); // Assuming "cafes" collection stores the shop info
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setShopID(userDocSnap.id); // Set the shop ID of the logged-in user
        }
      }
    };

    fetchShopID();
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      const itemsCollection = collection(db, 'items');
      const itemsSnapshot = await getDocs(itemsCollection);
      const itemsList = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Filter items based on shopID
      const filteredItems = itemsList.filter(item => item.shopID === shopID);
      setItems(filteredItems);
    };

    if (shopID) {
      fetchItems();
    }
  }, [shopID]);

  const handleDelete = async (id) => {
    try {
      const itemDoc = doc(db, 'items', id);
      await deleteDoc(itemDoc);
      setItems(items.filter(item => item.id !== id)); // Remove the deleted item from the list
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
            <h4>{item.title}</h4> {/* Assuming `title` is the item name */}
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
