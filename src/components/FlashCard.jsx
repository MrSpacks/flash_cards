import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { updateKnowCount } from "../firebaseWords";
import "./FlashCard.css";
import { useTranslation } from "react-i18next";

const FlashCard = ({ word, onNext, userId }) => {
  const [flipped, setFlipped] = useState(false);
  const { t } = useTranslation();

  const handleKnow = async () => {
    if (!userId || !word?.id) {
      console.error("Missing userId or word.id");
      return;
    }

    try {
      const newCount = (word.knowCount || 0) + 1;
      await updateKnowCount(userId, word.id, newCount);

      setTimeout(() => {
        setFlipped(false);
        onNext();
      }, 100);
    } catch (error) {
      console.error("Error updating knowCount:", error.message);
    }
  };

  const getTranslationString = (translation) => {
    if (Array.isArray(translation)) {
      return translation.join(", ");
    }
    return translation;
  };

  return (
    <AnimatePresence mode="wait">
      <div className="flashcard-container">
        <motion.div
          key={word.id}
          className="flashcard"
          initial={{ opacity: 0, x: 500 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -1000000000 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className={`inner ${flipped ? "flipped" : ""}`}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {!flipped ? (
              <div className="front">
                <h2>
                  {word.knowCount < 5
                    ? word.sourceWord
                    : getTranslationString(word.translation)}
                </h2>
                <div className="buttons">
                  <button className="know-button" onClick={handleKnow}>
                    {t("button.know")}
                  </button>
                  <button
                    className="dont-know-button"
                    onClick={() => setFlipped(true)}
                  >
                    {t("button.dontKnow")}
                  </button>
                </div>
              </div>
            ) : (
              <div className="back">
                <h2>
                  {word.knowCount < 5
                    ? getTranslationString(word.translation)
                    : word.sourceWord || "Translation not found"}
                </h2>
                <div className="buttons">
                  <button className="know-button" onClick={handleKnow}>
                    {t("button.remember")}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

FlashCard.propTypes = {
  word: PropTypes.shape({
    id: PropTypes.string.isRequired,
    sourceWord: PropTypes.string.isRequired,
    translation: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    knowCount: PropTypes.number.isRequired,
  }).isRequired,
  onNext: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default FlashCard;
