import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import './FormPage.css';

function FormPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('None');
  const [price, setPrice] = useState(0);
  const [imageURL, setImageURL] = useState('None');
  const [isAvailable, setIsAvailable] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [shopID, setShopID] = useState(''); // Automatically set shopID

  const navigate = useNavigate();

  // Get the current logged-in user and fetch their shopID
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Optionally, you can fetch the shopID from Firestore if needed
      // For example, fetching shop info using the current user's UID
      const fetchShopID = async () => {
        const userDocRef = doc(db, "cafes", currentUser.uid); // Assuming "cafes" collection has the shop info
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          setShopID(userDocSnap.id); // Or retrieve the shopID from the document fields if it's stored in the doc
        }
      };

      fetchShopID();
    } else {
      console.log("No user logged in");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create a new document in Firestore under the "items" collection
      const docRef = await addDoc(collection(db, "items"), {
        title,
        description,
        price,
        imageURL,
        isAvailable,
        quantity,
        shopID,  // Automatically filled shopID
      });

      console.log("Document written with ID: ", docRef.id);
      navigate('/'); // Redirect to the homepage after adding the item
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate to HomePage when the back button is clicked
  };

  return (
    <div className="FormPage">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter item title"
        />

        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter item description"
        />

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter item price"
        />

        <label>Image URL</label>
        <input
          type="text"
          value={imageURL}
          onChange={(e) => setImageURL(e.target.value)}
          placeholder="Enter image URL"
        />

        <label>Is Available</label>
        <input
          type="checkbox"
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
        />

        <label>Quantity</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder="Enter item quantity"
        />

        {/* Remove shopID input from form */}
        {/* shopID is set programmatically and will be hidden from the user */}

        <button type="submit">Save Item</button>
      </form>

      {/* Back Button */}
      <button onClick={handleBack} className="back-button">
        Back to Home
      </button>
      
    </div>
  );
}

export default FormPage;
