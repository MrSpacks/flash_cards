/**
 * @component Layout
 * @description Provides the main layout for the application, including navigation and content rendering.
 *              It uses React Router for navigation and framer-motion for animations.
 *              The layout includes a navigation bar with links to different sections of the application,
 *              an Outlet for rendering the content of the current route, and a Footer component.
 *
 * @returns {JSX.Element} The Layout component.

 */
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faList,
  faPlus,
  faCog,
  faFolderPlus,
} from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";
import "./Layout.css";
// EN: Layout component for the application, providing navigation and content rendering
// CZ: Komponent rozložení pro aplikaci, poskytující navigaci a vykreslování obsahu
const Layout = () => {
  const location = useLocation(); // Get the current location from the router
  const { t } = useTranslation(); // Initialize the translation function

  return (
    <div className="container Layout__container">
      <AnimatePresence mode="wait"> {/* AnimatePresence allows for exit animations when components are removed */}
        <motion.div
          key={location.pathname} 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 1, x: -1000000000 }}
          transition={{ duration: 0.5 }}
          className="content"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
{/* Render the Outlet component to display the current route's content */}
      <nav className="nav">
        <NavLink
          to="/words"
          style={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
        >
          <FontAwesomeIcon className="icon" icon={faList} />
          <span className="btnTitle">{t("Layout.words")}</span>
        </NavLink>
        <NavLink
          to="/add-word"
          style={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
        >
          <FontAwesomeIcon className="icon" icon={faPlus} />
          <span className="btnTitle">{t("button.add")}</span>
        </NavLink>
        <NavLink
          to="/add-dictionary"
          style={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
        >
          <FontAwesomeIcon className="icon" icon={faFolderPlus} />
          <span className="btnTitle">{t("dictionary.title")}</span>
        </NavLink>
        <NavLink
          to="/flash-cards"
          style={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
        >
          <FontAwesomeIcon className="icon" icon={faBook} />
          <span className="btnTitle">{t("Layout.FlashCards")}</span>
        </NavLink>
        <NavLink
          to="/settings"
          style={({ isActive }) => (isActive ? styles.linkActive : styles.link)}
        >
          <FontAwesomeIcon className="icon" icon={faCog} />
          <span className="btnTitle">{t("settings.title")}</span>
        </NavLink>
      </nav>

      <Footer />
    </div>
  );
};

const styles = {
  link: {
    color: "white",
    textDecoration: "none",
    transition: "all 0.3s ease-in-out",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  linkActive: {
    color: "#FFD700",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
};

export default Layout;
