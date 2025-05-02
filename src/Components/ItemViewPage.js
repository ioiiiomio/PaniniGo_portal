import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // To get the current user

function ItemViewPage() {
  const { id } = useParams();
  const [item, setItem] = useState({});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [shopID, setShopID] = useState('');
  
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
        setShopID(data.shopID);
      } else {
        console.log("No such document!");
      }
    };

    fetchItem();
  }, [id]);

  useEffect(() => {
    const checkUserShopID = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(db, "cafes", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const currentUserShopID = userDocSnap.id;
          if (currentUserShopID !== shopID) {
            alert("You are not authorized to edit this item.");
            navigate('/'); // Redirect to home if the shop IDs don't match
          }
        }
      }
    };

    if (shopID) {
      checkUserShopID();
    }
  }, [shopID, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const docRef = doc(db, "items", id);
    await updateDoc(docRef, {
      title,
      description,
      price: parseInt(price),
      quantity: parseInt(quantity),
      photoUrl
    });

    navigate('/');
  };

  return (
    <div className="ItemViewPage">
      <h2>Item Details</h2>
      <div>
        <h3>{item.title}</h3>
        <img src={item.photoUrl} alt={item.title} style={{ maxWidth: '200px' }} />
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Price:</strong> ${item.price}</p>
        <p><strong>Quantity:</strong> {item.quantity}</p>
        <p><strong>Shop ID:</strong> {item.shopID}</p>
      </div>

      <h2>Edit Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
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
