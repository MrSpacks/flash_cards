import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Твой Firebase-конфиг
const firebaseConfig = {
  apiKey: "AIzaSyAGnnWVzYuEoG2U4OSa_of_yIVS2plnlEw",
  authDomain: "flash-card-e78b2.firebaseapp.com",
  projectId: "flash-card-e78b2",
  storageBucket: "flash-card-e78b2.appspot.com",
  messagingSenderId: "138787733559",
  appId: "1:138787733559:web:ff7670ea8e4551016b7fb2",
};

// **Сначала инициализируем Firebase**
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // <-- Теперь getAuth() получает app

console.log("Current User:", auth.currentUser);

const words = [
  { sourceWord: "achieve", translation: "достигать" },
  { sourceWord: "advice", translation: "совет" },
  { sourceWord: "afford", translation: "позволить себе" },
  { sourceWord: "against", translation: "против" },
  { sourceWord: "ambition", translation: "амбиция" },
  { sourceWord: "anxious", translation: "тревожный" },
  { sourceWord: "apologize", translation: "извиняться" },
  { sourceWord: "appointment", translation: "встреча, назначение" },
  { sourceWord: "attend", translation: "посещать" },
  { sourceWord: "attitude", translation: "отношение" },
  { sourceWord: "attract", translation: "привлекать" },
  { sourceWord: "average", translation: "средний" },
  { sourceWord: "avoid", translation: "избегать" },
  { sourceWord: "aware", translation: "осведомленный" },
  { sourceWord: "basic", translation: "основной" },
  { sourceWord: "behavior", translation: "поведение" },
  { sourceWord: "benefit", translation: "выгода" },
  { sourceWord: "challenge", translation: "вызов, испытание" },
  { sourceWord: "charge", translation: "заряжать, плата" },
  { sourceWord: "complain", translation: "жаловаться" },
  { sourceWord: "confident", translation: "уверенный" },
  { sourceWord: "consider", translation: "рассматривать" },
  { sourceWord: "contain", translation: "содержать" },
  { sourceWord: "contribute", translation: "вносить вклад" },
  { sourceWord: "convenient", translation: "удобный" },
  { sourceWord: "create", translation: "создавать" },
  { sourceWord: "criticize", translation: "критиковать" },
  { sourceWord: "curious", translation: "любопытный" },
  { sourceWord: "decide", translation: "решать" },
  { sourceWord: "definitely", translation: "определенно" },
  { sourceWord: "deliberate", translation: "преднамеренный" },
  { sourceWord: "deserve", translation: "заслуживать" },
  { sourceWord: "determined", translation: "решительный" },
  { sourceWord: "develop", translation: "развивать" },
  { sourceWord: "discuss", translation: "обсуждать" },
  { sourceWord: "efficient", translation: "эффективный" },
  { sourceWord: "encourage", translation: "поощрять" },
  { sourceWord: "enthusiastic", translation: "восторженный" },
  { sourceWord: "environment", translation: "окружающая среда" },
  { sourceWord: "essential", translation: "существенный" },
  { sourceWord: "eventually", translation: "в конце концов" },
  { sourceWord: "examine", translation: "исследовать" },
  { sourceWord: "expect", translation: "ожидать" },
  { sourceWord: "experience", translation: "опыт" },
  { sourceWord: "explain", translation: "объяснять" },
  { sourceWord: "express", translation: "выражать" },
  { sourceWord: "familiar", translation: "знакомый" },
  { sourceWord: "fascinating", translation: "увлекательный" },
  { sourceWord: "feature", translation: "особенность" },
  { sourceWord: "flexible", translation: "гибкий" },
  { sourceWord: "frustrated", translation: "разочарованный" },
  { sourceWord: "generous", translation: "щедрый" },
  { sourceWord: "hesitate", translation: "колебаться" },
  { sourceWord: "identify", translation: "определять" },
  { sourceWord: "ignore", translation: "игнорировать" },
  { sourceWord: "imagine", translation: "представлять" },
  { sourceWord: "impress", translation: "впечатлять" },
  { sourceWord: "increase", translation: "увеличивать" },
  { sourceWord: "independent", translation: "независимый" },
  { sourceWord: "influence", translation: "влиять" },
  { sourceWord: "inform", translation: "информировать" },
  { sourceWord: "inhabitant", translation: "житель" },
  { sourceWord: "instead", translation: "вместо" },
  { sourceWord: "intention", translation: "намерение" },
  { sourceWord: "interrupt", translation: "прерывать" },
  { sourceWord: "investigate", translation: "исследовать" },
  { sourceWord: "involve", translation: "включать в себя" },
  { sourceWord: "jealous", translation: "ревнивый" },
  { sourceWord: "knowledge", translation: "знание" },
];

const uploadWords = async () => {
  const userId = "0FIYFzxJWTRt0TG6wFvhFUqG8Dk1"; // Укажи ID пользователя

  for (const word of words) {
    try {
      await addDoc(collection(db, "users", userId, "words"), word);
      console.log(`Добавлено слово: ${word.sourceWord}`);
    } catch (error) {
      console.error("Ошибка при добавлении слова:", error);
    }
  }
};

uploadWords();
