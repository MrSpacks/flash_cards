import "./Footer.css";
import InstallPWA from "./InstallPWA";

const Footer = () => {
  return (
    <footer className="footer">
      <InstallPWA className="footer_PWA" />
      <a
        className="footer_link"
        target="_blank"
        href="https://www.instagram.com/mr.spacks/"
      >
        © 2025 Mr.Spacks
      </a>
    </footer>
  );
};

export default Footer;
