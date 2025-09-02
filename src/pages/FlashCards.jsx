/**
 * @description FlashCards component for displaying flashcards and managing dictionaries.
 * Fetches words and dictionaries from Firebase based on the user ID.
 * Allows users to select a dictionary and view flashcards from that dictionary.
 * @component
 * @returns {JSX.Element} The FlashCards component.
 */
import { useLayoutEffect, useState } from "react";
import FlashCard from "../components/FlashCard";
import { getWords, getDictionaries } from "../firebaseWords";
import { auth } from "../auth";
import { Link } from "react-router-dom";
import "./FlashCards.css";
import { useTranslation } from "react-i18next";

const FlashCards = () => {
  const [words, setWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dictionaries, setDictionaries] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState("default");
  const [isLoading, setIsLoading] = useState(true);

  const userId = auth.currentUser?.uid;
  const { t } = useTranslation();

  // Fetch dictionaries and words when the component mounts or userId changes
  useLayoutEffect(() => {
    if (!userId) { 
      setIsLoading(false);
      return;
    }
    // Fetch dictionaries and words from Firebase
    const fetchData = async () => {
      try {
        const userDictionaries = await getDictionaries(userId);
        let updatedDictionaries = userDictionaries || [];

        // Ensure the default dictionary is always present
        const hasDefault = updatedDictionaries.some(
          (dict) => dict.id === "default"
        );
        if (!hasDefault) {
          updatedDictionaries = [
            { id: "default", name: "default" },
            ...updatedDictionaries,
          ];
        }

        setDictionaries(updatedDictionaries);

        // Fetch all words
        const allWords = await getWords(userId);

        // Find the first dictionary that has words
        let foundDictWithWords = "default";
        for (const dict of updatedDictionaries) {
          const filtered = allWords
            .filter((word) => {
              if (dict.id === "default") {
                return !word.dictionaryId || word.dictionaryId === "default";
              } else {
                return word.dictionaryId === dict.id;
              }
            })
            .filter((word) => word.knowCount < 10);

          if (filtered.length > 0) {
            foundDictWithWords = dict.id;
            break;
          }
        }

        setSelectedDictionary(foundDictWithWords);
      } catch (error) {
        console.error("⚠ Ошибка загрузки словарей или слов:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Fetch words based on the selected dictionary when userId or selectedDictionary changes
  useLayoutEffect(() => {
    if (!userId || !selectedDictionary) {
      setIsLoading(false);
      return;
    }
    // Function to fetch words based on the selected dictionary
    const fetchWords = async () => {
      try {
        const allWords = await getWords(userId);
        const filteredWords = allWords.filter((word) => {
          if (selectedDictionary === "default") {
            return !word.dictionaryId || word.dictionaryId === "default";
          } else {
            return word.dictionaryId === selectedDictionary;
          }
        });
        const filteredWordsWithKnowCount = filteredWords.filter(
          (word) => word.knowCount < 10
        );
        setWords(filteredWordsWithKnowCount);
      } catch (error) {
        console.error("⚠ Ошибка загрузки слов:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchWords();
  }, [userId, selectedDictionary]);
  // Function to handle the next card
  const handleNext = () => {
    if (words.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
    }
  };

  return (
    <div className="flashCards">
      <h2 className="card_title">{t("title.card2")}</h2>

      <select
        className="dictionary_select input"
        value={selectedDictionary}
        onChange={(e) => {
          setSelectedDictionary(e.target.value);
        }}
        disabled={isLoading}
      >
        {dictionaries.length > 0 ? (
          dictionaries.map((dict, index) => (
            <option key={dict.id || index} value={dict.id || "default"}>
              {dict.name || `Словарь ${index + 1}`}
            </option>
          ))
        ) : (
          <option disabled>{t("dictionary.noDictionaries")}</option>
        )}
      </select>

      {words.length === 0 && (
        <div className="noWords">
          <p>{t("title.card")}</p>
          <Link className="btn" to="/add-word">
            {t("button.add")} +
          </Link>
        </div>
      )}

      {words.length > 0 && (
        <FlashCard
          key={words[currentIndex].id}
          word={words[currentIndex]}
          userId={userId}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default FlashCards;
