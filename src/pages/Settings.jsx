/**
 * @function Settings
 * @description A React component that renders the settings page, allowing users to toggle themes, 
 * change languages, view contact information, donate, install PWA and log out.
 * @returns {JSX.Element} The rendered Settings component.
 */
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { auth } from "../auth";
import { signOut } from "firebase/auth";
import { versionApp } from "../components/version";
import "./Settings.css";
import { useTranslation } from "react-i18next";
import LangToggle from "../components/LangToggle";
import InstallPWA from "../components/InstallPWA";


function Settings() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const handleLogout = async () => { // EN: Function to handle user logout
                                     // CZ: Funkce pro odhlášení uživatele
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="settings">
      <div className="themeConteiner">
        <h2>{t("settings.title")}</h2>
        <p>
          {t("settings.text")} {versionApp} <br /> {t("settings.text2")}{" "}
        </p>
        <div>
          <h3>{t("settings.lang")}</h3>
          <LangToggle />
          <p>
            {t("settings.CorrentTheme")} {theme}
          </p>
          <h3>{t("settings.toggle")}</h3>
          {/* EN: Button to toggle between light and dark themes
              CZ: Tlačítko pro přepínání mezi světlým a tmavým motivem */}
          <button 
            onClick={() => toggleTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
          </button>
        </div>
      </div>

      <div className="contactConteiner">
        <h2>{t("settings.title2")}</h2>
        <p>
          {t("login.email")}:{" "}
          <a href="mailto:mr.spacks@seznam.cz">mr.spacks@seznam.cz</a>
        </p>
        <p>
          {t("settings.donate")}:{"    "}
          <a href="https://paypal.me/MrSpacks?country.x=CZ&locale.x=cs_CZ">
            PayPal
          </a>
        </p>
        <img
          className="qrcode"
          style={{ width: "200px" }}
          src="/qrcode.png"
          alt="qrcode"
        />
      </div>
      {/*  user settings */}
      <div className="userLogOut">
        <h2>{t("settings.title3")}</h2>
        <InstallPWA />
        <p>{auth.currentUser?.email} </p>
        <button onClick={handleLogout}>{t("settings.logout")}</button>
      </div>
    </div>
  );
}

export default Settings;
