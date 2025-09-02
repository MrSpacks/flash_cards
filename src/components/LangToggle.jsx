/**
 * @function LanguageSwitcher
 * @description A component that allows the user to switch between different languages.
 * It uses the `useTranslation` hook from `react-i18next` to manage the current language and change it when the user selects a new language from the dropdown.
 * @returns {JSX.Element} A select element containing language options.
 */
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value); // Change the language based on user selection
  };
  const styles = {
    toggle: {},
    select: {
      padding: "5px 10px",
      color: "var(--text-color)",
      border: "1px solid var(--text-color)",
      borderRadius: "5px",
      backgroundColor: "var(--bg-color)",
    },
  };
  return (
    <div style={styles.toggle}>
      <select
        style={styles.select}
        onChange={changeLanguage}
        value={i18n.language}
      >
        <option value="en">English</option>
        <option value="ru">Русский</option>
        <option value="cz">Čeština</option>
        <option value="de">Deutsch</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="it">Italiano</option>
        <option value="uk">Українська</option>
      </select>
    </div>
  );
}

export default LanguageSwitcher;
