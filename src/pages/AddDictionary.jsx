/**
 * @component AddDictionary
 * @description A component that allows users to add, edit, and delete dictionaries.
 * It fetches dictionaries from Firebase, displays them in a list, and provides
 * functionality to rename and delete them. A confirmation modal is displayed before
 * deleting a dictionary.
 *
 * @returns {JSX.Element} The AddDictionary component.
 */
import { useState, useEffect } from "react";
import {
  addDictionary,
  getDictionaries,
  renameDictionary,
  deleteDictionary,
  getWordsByDictionary,
  deleteWordsByDictionary,
} from "../firebaseWords";
import { auth } from "../auth";
import { useTranslation } from "react-i18next";
import "./addDictionary.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBook,
  faEdit,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";


const AddDictionary = () => {
  const [dictionaryName, setDictionaryName] = useState("");
  const [dictionaries, setDictionaries] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [dictToDelete, setDictToDelete] = useState(null);
  const { t } = useTranslation();
  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!userId) return;

    const fetchDictionaries = async () => {
      try {
        const userDictionaries = await getDictionaries(userId);
        setDictionaries(userDictionaries);
      } catch (error) {
        console.error("Error fetching dictionaries:", error);
      }
    };

    fetchDictionaries();
  }, [userId]);

  const handleAddDictionary = async () => {
    if (!dictionaryName || !userId) return;

    await addDictionary(userId, dictionaryName);
    setDictionaryName("");

    const userDictionaries = await getDictionaries(userId);
    setDictionaries(userDictionaries);
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setNewName(currentName);
  };

  const handleUpdate = async (id) => {
    if (!newName.trim()) return;
    await renameDictionary(userId, id, newName);
    setEditingId(null);

    const userDictionaries = await getDictionaries(userId);
    setDictionaries(userDictionaries);
  };

  const handleDelete = async () => {
    if (!dictToDelete) return;

    const words = await getWordsByDictionary(userId, dictToDelete);
    if (words.length > 0) {
      await deleteWordsByDictionary(userId, dictToDelete);
    }

    await deleteDictionary(userId, dictToDelete);
    setDictToDelete(null);
    setShowConfirm(false);

    const userDictionaries = await getDictionaries(userId);
    setDictionaries(userDictionaries);
  };

  return (
    <div className="container ">
      <h2>{t("dictionary.add")}</h2>
      <div className="addDictionary">
        <input
          className="input"
          type="text"
          placeholder={t("dictionary.placeholder")}
          value={dictionaryName}
          onChange={(e) => setDictionaryName(e.target.value)}
        />
        <button onClick={handleAddDictionary}>{t("dictionary.add")}</button>
      </div>

      <h3>{t("dictionary.listTitle")}</h3>
      <ul className="dictionaries">
        {dictionaries.map((dict) => (
          <div className="dictionary" key={dict.id}>
            <div className="dict">
              <FontAwesomeIcon className="icon" icon={faBook} />
              {editingId === dict.id ? (
                <input
                  className="input"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={() => handleUpdate(dict.id)}
                  autoFocus
                />
              ) : (
                <li className="name">{dict.name}</li>
              )}
            </div>
            <div className="edit">
              <button onClick={() => handleEdit(dict.id, dict.name)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => {
                  setDictToDelete(dict.id);
                  setShowConfirm(true);
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </ul>

      {showConfirm && (
        <div className="modal">
          <p>{t("dictionary.confirmDelete")}</p>
          <div className="modal__buttons">
            <button onClick={() => setShowConfirm(false)}>
              {t("button.cancel")}
            </button>
            <button className="delete" onClick={handleDelete}>
              <FontAwesomeIcon className="icon_delete" icon={faTrash} />
              {t("dictionary.delete")}
            </button>
          </div>
          <button className="close" onClick={() => setShowConfirm(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddDictionary;
