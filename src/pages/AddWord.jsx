/**
 * @description AddWord component for adding new words with their translations to a selected dictionary.
 * Fetches user-specific dictionaries from Firebase and allows the user to select one for the new word.
 *
 * @component
 * @returns {JSX.Element} AddWord component.
 */
import { useState, useEffect } from "react";
import { addWord, getDictionaries } from "../firebaseWords"; 
import { auth } from "../auth";
import "./AddWord.css";
import { useTranslation } from "react-i18next";

const AddWord = () => { 
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState(""); // State for the word translation
  const [dictionaries, setDictionaries] = useState([]); // State for the list of dictionaries
  const [selectedDictionary, setSelectedDictionary] = useState(""); // State for the selected dictionary
  const { t } = useTranslation();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    const fetchDictionaries = async () => {
      const userDictionaries = await getDictionaries(userId);
      setDictionaries(userDictionaries);
    };
    fetchDictionaries();
  }, [userId]);

  const handleAddWord = async () => { // Function to handle adding a new word
    if (!word || !translation) return;
    if (!userId) return;

    await addWord(userId, word, translation, selectedDictionary); // Add the word to the selected dictionary
    setWord("");
    setTranslation("");
  };

  return (
    <div className="addWord_container">
      <h2 className="addWord_title">{t("header.addWord")}</h2>

      <div className="addWord">
        {/* Input for the word */}
        <label>{t("label.word")}</label>
        <input
          className="input"
          type="text"
          placeholder={t("label.word")}
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />
        { /* Input for the word translation */}
        <label>{t("label.Translation")}</label>
        <input
          className="input"
          type="text"
          placeholder={t("label.Translation")}
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        />

        {/* Dropdown for selecting a dictionary */}
        <label>{t("dictionary.title")}</label>
        <select
          className="input selectInput"
          value={selectedDictionary}
          onChange={(e) => setSelectedDictionary(e.target.value)}
        >
          <option value="">{t("dictionary.defaultDictionary")}</option>
          {dictionaries.map((dict) => (
            <option key={dict.id} value={dict.id}>
              {dict.name}
            </option>
          ))}
        </select>
        {/* Button to add the word */}
        <button onClick={handleAddWord}>{t("button.add")}</button>
      </div>
    </div>
  );
};

export default AddWord;
