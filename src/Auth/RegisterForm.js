// src/Auth/RegisterForm.js
import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase/config';
import { doc, setDoc } from "firebase/firestore";

export default function RegisterForm({ toggleForm, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Optional shop fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [paymentUrl, setPaymentUrl] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Add to 'shops' collection
      await setDoc(doc(db, "shops", uid), {
        email,
        name,
        location,
        photoUrl,
        paymentUrl,
        createdAt: new Date().toISOString(),
      });

      // Also add to 'cafes' collection
      await setDoc(doc(db, "cafes", uid), {
        email,
        name,
        location,
        photoUrl,
        paymentUrl,
        shopId: uid,
        createdAt: new Date().toISOString(),
      });

      onRegister(uid);
    } catch (err) {
      alert("Registration Error: " + err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleRegister}>
      <h2>Create a New Account</h2>
      <div className="input-field">
        <input
          type="text"
          placeholder="Shop Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="input-field">
        <input
          type="text"
          placeholder="Shop Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
      </div>
      <div className="input-field">
        <input
          type="text"
          placeholder="Photo URL"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />
      </div>
      <div className="input-field">
        <input
          type="text"
          placeholder="Payment URL"
          value={paymentUrl}
          onChange={(e) => setPaymentUrl(e.target.value)}
        />
      </div>
      <div className="input-field">
        <input
          type="email"
          placeholder="Enter your E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="input-field">
        <input
          type="password"
          placeholder="Enter your Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="auth-button">Register</button>
      <p>
        Already have an account? <span onClick={toggleForm}>Log In!</span>
      </p>
    </form>
  );
}
