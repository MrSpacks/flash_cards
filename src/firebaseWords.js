import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

export const changeWordDictionary = async (userId, wordId, newDictionaryId) => {
  if (!userId || !wordId || !newDictionaryId) return;

  const wordRef = doc(db, "users", userId, "words", wordId);

  try {
    await updateDoc(wordRef, {
      dictionaryId: newDictionaryId,
    });
    console.log("Словарь обновлен!");
    // Обновляем список слов
    getWords(userId, newDictionaryId);
  } catch (error) {
    console.error("Ошибка при обновлении словаря:", error);
  }
};

// 1️⃣ Создание нового словаря
export const addDictionary = async (userId, dictionaryName) => {
  try {
    const docRef = await addDoc(
      collection(db, "users", userId, "dictionaries"),
      { name: dictionaryName }
    );
    return docRef.id; // Возвращаем ID созданного словаря
  } catch (error) {
    console.error("Error adding dictionary:", error);
  }
};

// 2️⃣ Получение всех словарей пользователя
export const getDictionaries = async (userId) => {
  const dictionariesRef = collection(db, "users", userId, "dictionaries");
  const snapshot = await getDocs(dictionariesRef);
  if (snapshot.empty) return [{ id: "default", name: "default" }];
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 3️⃣ Удаление словаря и всех его слов
export const deleteDictionary = async (userId, dictionaryId) => {
  try {
    const wordsRef = collection(db, "users", userId, "words");
    const snapshot = await getDocs(
      query(wordsRef, where("dictionaryId", "==", dictionaryId))
    );

    if (!snapshot.empty) {
      await Promise.all(snapshot.docs.map((word) => deleteDoc(word.ref)));
    }

    await deleteDoc(doc(db, "users", userId, "dictionaries", dictionaryId));
    return true;
  } catch (error) {
    console.error("Ошибка при удалении словаря:", error);
  }
};

// 4️⃣ Переименование словаря
export const renameDictionary = async (userId, dictionaryId, newName) => {
  try {
    await updateDoc(doc(db, "users", userId, "dictionaries", dictionaryId), {
      name: newName,
    });
    console.log("Словарь переименован:", dictionaryId);
  } catch (error) {
    console.error("Ошибка при переименовании словаря:", error);
  }
};
// 5️⃣ Добавление слова с присвоением словаря по умолчанию
export const addWord = async (
  userId,
  sourceWord,
  translation,
  dictionaryId
) => {
  try {
    const newWord = {
      sourceWord,
      translation,
      dictionaryId: dictionaryId || "default", // Назначаем "default", если словаря нет
      knowCount: 0,
    };

    const docRef = await addDoc(
      collection(db, "users", userId, "words"),
      newWord
    );
    console.log("Слово добавлено:", docRef.id);
  } catch (error) {
    console.error("Ошибка при добавлении слова:", error);
  }
};

// 6️⃣ Получение слов с поддержкой словаря
export const getWords = async (userId, dictionaryId) => {
  if (!userId) return [];

  try {
    let wordsQuery;
    if (dictionaryId) {
      wordsQuery = query(
        collection(db, "users", userId, "words"),
        where("dictionaryId", "==", dictionaryId)
      );
    } else {
      wordsQuery = collection(db, "users", userId, "words");
    }

    const querySnapshot = await getDocs(wordsQuery);
    let words = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Загруженные слова:", words); // Должно показать массив слов
    return words;
  } catch (error) {
    console.error("⚠ Ошибка загрузки слов:", error);
    return [];
  }
};

// 7️⃣ Удаление слова
export const deleteWord = async (userId, wordId) => {
  try {
    await deleteDoc(doc(db, "users", userId, "words", wordId));
  } catch (error) {
    console.error("Ошибка при удалении слова:", error);
  }
};

// 8️⃣ Обновление слова
export const updateWord = async (
  userId,
  wordId,
  newWord,
  newTranslation,
  dictionaryId,
  newCount
) => {
  try {
    const updateData = {
      sourceWord: newWord,
      translation: newTranslation,
      dictionaryId,
    };
    if (newCount !== undefined) {
      updateData.knowCount = newCount;
    }
    await updateDoc(doc(db, "users", userId, "words", wordId), updateData);
  } catch (error) {
    console.error("Ошибка при обновлении слова:", error);
  }
};

// 9️⃣ Обновление счётчика изучения слова
export const updateKnowCount = async (userId, wordId, newCount) => {
  try {
    console.log(`Обновление Firestore для ${wordId} с количеством ${newCount}`);
    const wordRef = doc(db, "users", userId, "words", wordId);
    await updateDoc(wordRef, { knowCount: newCount });
    console.log("Обновление успешно");
  } catch (error) {
    console.error("Ошибка при обновлении knowCount:", error);
  }
};
// Удаление всех слов из словаря
export const deleteWordsByDictionary = async (userId, dictionaryId) => {
  try {
    const wordsRef = collection(db, "users", userId, "words");
    const q = query(wordsRef, where("dictionaryId", "==", dictionaryId));
    const snapshot = await getDocs(q);

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));

    await Promise.all(deletePromises);
    console.log(`Все слова из словаря ${dictionaryId} удалены.`);
  } catch (error) {
    console.error("Ошибка при удалении слов из словаря:", error);
  }
};
// Получение всех слов в указанном словаре
export const getWordsByDictionary = async (userId, dictionaryId) => {
  try {
    const wordsRef = collection(db, "users", userId, "words");
    const q = query(wordsRef, where("dictionaryId", "==", dictionaryId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Ошибка при получении слов из словаря:", error);
    return [];
  }
};
