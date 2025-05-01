import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';

function ItemViewPage() {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItem = async () => {
      const docRef = doc(db, "items", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setItem(data);
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setQuantity(data.quantity);
        setPhotoUrl(data.photoUrl);
      } else {
        console.log("No such document!");
      }
    };

    fetchItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const docRef = doc(db, "items", id);
    await updateDoc(docRef, {
      title,
      description,
      price: parseInt(price),
      quantity: parseInt(quantity),
      photoUrl,
    });

    navigate('/');
  };

  return (
    <div className="ItemViewPage">
      <h2>Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
        />

        <label>Photo URL</label>
        <input
          type="text"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default ItemViewPage;
