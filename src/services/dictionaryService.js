import { db } from "../firebaseConfig";
import { collection, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Получение словаря пользователя
export const getUserDictionary = async (userId) => {
  const userRef = doc(collection(db, "dictionaries"), userId);
  const docSnap = await getDoc(userRef);

  return docSnap.exists() ? docSnap.data().words : {};
};

// Добавление или обновление слова
export const addOrUpdateWord = async (
  userId,
  sourceWord,
  sourceLanguage,
  targetLanguage,
  translation
) => {
  const userRef = doc(collection(db, "dictionaries"), userId);
  const docSnap = await getDoc(userRef);

  let words = docSnap.exists() ? docSnap.data().words : {};

  if (!words[sourceWord]) {
    words[sourceWord] = { sourceLanguage, translations: {} };
  }

  words[sourceWord].translations[targetLanguage] = translation;

  await setDoc(userRef, { words }, { merge: true });
};

// Удаление слова
export const deleteWord = async (userId, sourceWord) => {
  const userRef = doc(collection(db, "dictionaries"), userId);
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    let words = docSnap.data().words;
    delete words[sourceWord];

    await updateDoc(userRef, { words });
  }
};
