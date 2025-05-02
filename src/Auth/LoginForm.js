import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase/config';
import { doc, getDoc } from "firebase/firestore"; 

export default function LoginForm({ toggleForm, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      // Check for cafe registration
      const cafeDoc = await getDoc(doc(db, "cafes", uid));
      if (!cafeDoc.exists()) {
        alert("You are not registered as a store :(");
        return;
      }

      onLogin(uid);
    } catch (err) {
      alert("Login Error: " + err.message);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleLogin}>
      <h2>Panini Go!</h2>
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
      <button type="submit" className="auth-button">Log In</button>
      <p>
        Need an account? <span onClick={toggleForm}>Register</span>
      </p>
    </form>
  );
}
