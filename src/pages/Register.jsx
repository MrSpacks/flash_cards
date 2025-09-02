/**
 * @file Register.jsx
 * @description This component provides a registration form for new users.
 * It allows users to enter their email and password to create a new account.
 * Upon successful registration, the user is redirected to the main page.
 * It also includes language toggle functionality and links to the login page.
 * @component
 * @returns {JSX.Element} The Register component.
 */
import { useState } from "react";
import { registerUser } from "../auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import "./login.css";
import { useTranslation } from "react-i18next";
import LangToggle from "../components/LangToggle";
const Register = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState(""); // State for the user's email
  const [password, setPassword] = useState(""); // State for the user's password
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await registerUser(email, password);
      navigate("/"); // After successful registration, redirect to the main page
    } catch (error) {
      console.error("Error registering:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className="registration_container">
      <div className="text_content">
        <h1>{t("login.title")}</h1>
        <h2>{t("login.subtitle")}</h2>
        <p>{t("login.text")}</p>
        <div className="toggle_lang">
          <h3>{t("settings.lang")}</h3>
          <LangToggle />
        </div>
      </div>
      <div className="register">
        <h2>{t("register.subtitle")}</h2>
        <form className="form" onSubmit={handleRegister}>
          <input
            className="input"
            type="email"
            placeholder={t("login.email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="input"
            type="password"
            placeholder={t("login.password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">{t("button.register")}</button>
        </form>
        <Link to="/login">{t("register.login")}</Link>
      </div>
    </div>
  );
};

export default Register;
