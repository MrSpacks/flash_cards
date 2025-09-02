/**
 * @description Login component for user authentication.
 * Allows users to log in with their email and password.
 * On successful login, redirects the user to the main page.
 * Handles login errors and displays error messages to the user.
 * Includes language toggle functionality.
 *
 * @component
 * @returns {JSX.Element} The Login component.
 */
import { useState } from "react";
import { loginUser } from "../auth";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { useTranslation } from "react-i18next";
import LangToggle from "../components/LangToggle";

const Login = () => {
  const [email, setEmail] = useState(""); // State for the user's email
  const [password, setPassword] = useState(""); // State for the user's password
  const navigate = useNavigate(); 
  const { t } = useTranslation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(email, password);
      navigate("/"); // After successful login, redirect to the main page
    } catch (error) {
      console.error("Error logging in:", error.message);
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

        <p></p>
      </div>
      <div className="register">
        <h2>Enter</h2>
        <form className="form" onSubmit={handleLogin}>
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
          <button type="submit">{t("register.enter")}</button>
        </form>
        <Link to="/register">{t("register.register")}</Link>
      </div>
    </div>
  );
};

export default Login;
