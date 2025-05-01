import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function HomePage() {
  const [items, setItems] = useState([]);
  
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const itemsList = [];
      querySnapshot.forEach((doc) => {
        itemsList.push({ id: doc.id, ...doc.data() });
      });
      setItems(itemsList);
    };
    fetchItems();
  }, []);

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, "items", id));
      setItems(items.filter(item => item.id !== id));  // Update UI
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="HomePage">
      <div style={{ width: '40%', float: 'left', padding: '20px' }}>
        <h2>Items List</h2>
        <button onClick={() => window.location.href = '/form'}>Add Item</button>
        <div>
          {items.map(item => (
            <div key={item.id} style={{ marginBottom: '20px' }}>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
              <button onClick={() => deleteItem(item.id)}>Delete</button>
              <Link to={`/item/${item.id}`}>
                <button>Edit</button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div style={{ width: '60%', float: 'right', padding: '20px' }}>
        <h2>Orders (Not Implemented)</h2>
      </div>
    </div>
  );
}

export default HomePage;
