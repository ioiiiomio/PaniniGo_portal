// src/AuthPage.js
import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import "./AuthPage.css"

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopId, setShopId] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        setShopId(userCred.user.uid);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCred.user.uid;
        await setDoc(doc(db, "shops", uid), {
          email: email,
          createdAt: new Date().toISOString(),
        });
        setShopId(uid);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      {shopId ? (
        <h2 style={{ textAlign: "center" }}>
          You're logged in. <br /> Shop ID: <code>{shopId}</code>
        </h2>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>{isLogin ? "Panini Go!" : "Create a New Account"}</h2>
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
          <button type="submit" className="auth-button">
            {isLogin ? "Log In" : "Register"}
          </button>
          <p>
            {isLogin ? "Need an account?" : "Already have an account?"}{" "}
            <span onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Register" : "Log In!"}
            </span>
          </p>
        </form>
      )}
    </div>
  );
}
