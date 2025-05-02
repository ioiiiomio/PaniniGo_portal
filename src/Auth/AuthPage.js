import React, { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [shopId, setShopId] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleLogin = (uid) => {
    setShopId(uid);
  };

  const handleRegister = (uid) => {
    setShopId(uid);
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="auth-container">
      {shopId ? (
        <div style={{ textAlign: "center" }}>
          <h2>
            You're logged in! <br /> Shop ID: <code>{shopId}</code>
          </h2>
          <button
            className="auth-button"
            onClick={() => navigate("/")}
            style={{ marginTop: "20px" }}
          >
            Go to Home
          </button>
        </div>
      ) : (
        isLogin ? (
          <LoginForm toggleForm={toggleForm} onLogin={handleLogin} />
        ) : (
          <RegisterForm toggleForm={toggleForm} onRegister={handleRegister} />
        )
      )}
    </div>
  );
}
