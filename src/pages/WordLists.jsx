/**
 * @file WordLists.jsx
 * @module WordLists
 * @description This module defines the WordLists component, which displays a list of words
 *  and allows users to edit and delete them. It also includes the WordItem component,
 *  which represents a single word in the list.
 * @function WordLists
 * @returns {JSX.Element} - A list of words.
 */
import { useEffect, useState, memo } from "react";
import PropTypes from "prop-types";
import {
  getWords,
  deleteWord,
  updateWord,
  getDictionaries,
} from "../firebaseWords";
import { auth } from "../auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPen, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./WordLists.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

library.add(faPen, faTrash, faTimes);

const WordItem = memo(
  ({
    word,
    editingWord,
    updatedWord,
    updatedTranslations,
    handleUpdate,
    handleDelete,
    handleEdit,
    t,
    setUpdatedWord,
    setUpdatedTranslations,
    dictionaries,
    resetCount,
    setResetCount,
    setEditingWord,
  }) => {
    const [localSelectedDictionary, setLocalSelectedDictionary] = useState(
      word.dictionaryId
    );

    return (
      <li
        key={word.id}
        className={`${word.knowCount >= 5 ? "learned" : ""} ${
          word.knowCount >= 10 ? "mastered" : ""
        }`}
      >
        {editingWord === word.id ? (
          <div className="updateWord">
            <input
              className="input"
              value={updatedWord}
              onChange={(e) => setUpdatedWord(e.target.value)}
            />
            <input
              className="input"
              value={updatedTranslations}
              onChange={(e) => setUpdatedTranslations(e.target.value)}
            />
            <h3 className="title_list">{t("dictionary.listTitle")}</h3>
            <select
              className="select input"
              value={localSelectedDictionary}
              onChange={(e) => setLocalSelectedDictionary(e.target.value)}
            >
              {dictionaries.map((dict) => (
                <option key={dict.id} value={dict.id}>
                  {dict.name}
                </option>
              ))}
            </select>

            <label>
              <input
                type="checkbox"
                checked={resetCount}
                onChange={(e) => setResetCount(e.target.checked)}
              />
              {t("wordList.resetCount")}
            </label>

            <div className="update-buttons">
              <button onClick={() => handleUpdate(localSelectedDictionary)}>
                {t("wordList.save")}
              </button>
              <button
                onClick={() => setEditingWord(null)}
                className="cancel_button"
              >
                <FontAwesomeIcon icon="times" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="word">
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <p>{word.sourceWord}</p>
                <p>
                  {Array.isArray(word.translation)
                    ? word.translation.join(", ")
                    : word.translation}
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  padding: "0px",
                  fontSize: "10px",
                }}
              >
                <button onClick={() => handleEdit(word)}>
                  <FontAwesomeIcon icon="pen" />
                </button>
                <button onClick={() => handleDelete(word.id)}>
                  <FontAwesomeIcon icon="trash" />
                </button>
              </div>
            </div>
            <div className="line"></div>
          </div>
        )}
      </li>
    );
  }
);

WordItem.propTypes = {
  word: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sourceWord: PropTypes.string.isRequired,
    translation: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    knowCount: PropTypes.number.isRequired,
    dictionaryId: PropTypes.string.isRequired,
  }).isRequired,
  editingWord: PropTypes.string,
  updatedWord: PropTypes.string,
  updatedTranslations: PropTypes.string,
  handleUpdate: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  setUpdatedWord: PropTypes.func.isRequired,
  setUpdatedTranslations: PropTypes.func.isRequired,
  dictionaries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  resetCount: PropTypes.bool.isRequired,
  setResetCount: PropTypes.func.isRequired,
  setEditingWord: PropTypes.func.isRequired,
};

WordItem.displayName = "WordItem";

const WordLists = () => {
  const { t } = useTranslation();
  const [words, setWords] = useState([]);
  const [dictionaries, setDictionaries] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState("default");
  const [editingWord, setEditingWord] = useState(null);
  const [updatedWord, setUpdatedWord] = useState("");
  const [updatedTranslations, setUpdatedTranslations] = useState("");
  const [resetCount, setResetCount] = useState(false);
  const userId = auth.currentUser?.uid;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userDictionaries = await getDictionaries(userId);
        const allWords = await getWords(userId);

        if (Array.isArray(userDictionaries)) {
          const hasDefault = userDictionaries.some(
            (dict) => dict.id === "default"
          );
          setDictionaries(
            hasDefault
              ? userDictionaries
              : [{ id: "default", name: "default" }, ...userDictionaries]
          );

          let initialDictionary = "default";
          for (const dict of userDictionaries) {
            if (allWords.some((word) => word.dictionaryId === dict.id)) {
              initialDictionary = dict.id;
              break;
            }
          }
          setSelectedDictionary(initialDictionary);
        }
        setWords(allWords);
      } catch (error) {
        console.error("⚠ Ошибка загрузки данных:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!userId || !selectedDictionary) return;
    fetchWords();
  }, [userId, selectedDictionary]);

  const handleDelete = async (wordId) => {
    await deleteWord(userId, wordId);
    setWords(words.filter((word) => word.id !== wordId));
  };

  const handleEdit = (word) => {
    setEditingWord(word.id);
    setUpdatedWord(word.sourceWord);
    setUpdatedTranslations(word.translation);
  };

  const handleUpdate = async (selectedDictionary) => {
    if (!editingWord) return;
    try {
      const newTranslations = updatedTranslations;
      const newKnowCount = resetCount ? 0 : undefined;
      await updateWord(
        userId,
        editingWord,
        updatedWord,
        newTranslations,
        selectedDictionary,
        newKnowCount
      );
      await fetchWords();
      setEditingWord(null);
    } catch (error) {
      console.error("⚠ Ошибка обновления слова:", error);
    }
  };

  const fetchWords = async () => {
    try {
      let userWords;
      if (selectedDictionary === "default") {
        const allWords = await getWords(userId);
        userWords = allWords.filter(
          (word) => !word.dictionaryId || word.dictionaryId === "default"
        );
      } else {
        userWords = await getWords(userId, selectedDictionary);
      }
      setWords(userWords || []);
    } catch (error) {
      console.error("⚠ Ошибка загрузки слов:", error);
    }
  };

  return (
    <div className="container">
      <h2 className="list_title">{t("wordList.title")}</h2>

      <label htmlFor="dictionary-select">{t("dictionary.listTitle")}</label>
      <select
        className="input"
        id="dictionary-select"
        value={selectedDictionary || ""}
        onChange={(e) => setSelectedDictionary(e.target.value)}
        disabled={isLoading}
      >
        {dictionaries.map((dict) => (
          <option key={dict.id} value={dict.id}>
            {dict.name}
          </option>
        ))}
      </select>

      {isLoading && <p>Загрузка...</p>}

      {!isLoading && words.length === 0 && (
        <div className="noWords">
          <p>{t("title.card")}</p>
          <Link className="btn" to="/add-word">
            {t("button.add")} +
          </Link>
        </div>
      )}

      {!isLoading && words.length > 0 && (
        <ul className="wordList">
          {words.map((word) => (
            <WordItem
              key={word.id}
              word={word}
              editingWord={editingWord}
              updatedWord={updatedWord}
              updatedTranslations={updatedTranslations}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              t={t}
              setUpdatedWord={setUpdatedWord}
              setUpdatedTranslations={setUpdatedTranslations}
              dictionaries={dictionaries}
              resetCount={resetCount}
              setResetCount={setResetCount}
              setEditingWord={setEditingWord}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default WordLists;
