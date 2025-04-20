import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Cambiamo useParams con useLocation
import useLocalStorage from "../hooks/useLocalStorage";
import uuid from "react-uuid";

// Creazione del contesto per la gestione centralizzata delle note
const NotesContext = createContext();

// Custom hook per accedere facilmente al contesto in qualsiasi componente
export const useNotes = () => useContext(NotesContext);

// Funzione helper per estrarre l'ID della nota dall'URL corrente
const getNoteIdFromPath = (pathname) => {
  const match = pathname.match(/\/notes\/([^]+)$/);
  return match ? match[1] : null;
};

// Provider component che incapsula tutta la logica di gestione delle note
export const NotesProvider = ({ children }) => {
  const removeCategory = (catToRemove) => {
    const baseCategories = ["Lavoro", "Studio", "Casa", "Personale", "Altro"];
    if (baseCategories.includes(catToRemove)) return;
  
    // Rimuovo la categoria dalla lista
    setCategories((prev) => prev.filter((cat) => cat !== catToRemove));
  
    // Rimuovo il colore della categoria
    const updatedColors = { ...categoryColors };
    delete updatedColors[catToRemove];
    setCategoryColors(updatedColors);
  
    // Aggiorno le note: se una nota aveva quella categoria, la metto in "Altro"
    const updatedNotes = notes.map((note) =>
      note.category === catToRemove ? { ...note, category: "Altro" } : note
    );
    setNotes(updatedNotes);
  };

  // Creo lo stato relativo all'array di note, recuperandolo da localStorage se disponibile
  const [notes, setNotes] = useLocalStorage("notes", []);

  // Stato globale per le categorie disponibili, recuperate da localStorage o default
  const [categories, setCategories] = useLocalStorage("categories", [
    "Lavoro", "Studio", "Casa", "Personale", "Altro"
  ]);  
  
  // Stato per i colori associati alle categorie, recuperati da localStorage o vuoto
  const [categoryColors, setCategoryColors] = useLocalStorage("categoryColors", {});

  // Funzione per aggiornare il colore di una categoria
  const updateCategoryColor = (category, color) => {
    setCategoryColors((prev) => ({
      ...prev,
      [category]: color
    }));
  };
    

  // Funzione per aggiungere nuove categorie personalizzate
  const addCategory = (newCat) => {
    const trimmed = newCat.trim();
    if (trimmed && trimmed !== "Tutte" && !categories.includes(trimmed)) {
      setCategories((prev) => [...prev, trimmed]);
    }
  };

  // Hook per la navigazione programmatica
  const navigate = useNavigate();

  // Usiamo useLocation invece di useParams per accedere all'URL corrente
  const location = useLocation();

  // Estrai l'ID della nota dall'URL corrente
  const urlNoteId = getNoteIdFromPath(location.pathname);

  // La nota attiva ora è determinata dall'URL
  const [activeNote, setActiveNote] = useState(urlNoteId || false);

  // Aggiorno activeNote quando cambia l'URL
  useEffect(() => {
    if (urlNoteId) {
      setActiveNote(urlNoteId);
    } else if (location.pathname === "/notes" && notes.length > 0) {
      // Se siamo sulla route /notes senza ID specifico e ci sono note disponibili
      // non impostiamo un activeNote, lasciamo che sia la navigazione a gestirlo
      setActiveNote(false);
    }
  }, [urlNoteId, location.pathname, notes.length]);

  // Utilizzo l'hook di React useEffect per mettere in local storage la coppia chiave valore
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  // Reindirizzo alla prima nota se siamo su /notes senza ID e ci sono note disponibili
  useEffect(() => {
    if (location.pathname === "/notes" && notes.length > 0 && !activeNote) {
      navigate(`/notes/${notes[0].id}`, { replace: true });
    }
  }, [location.pathname, notes, activeNote, navigate]);

  // Creo il metodo per aggiungere le note
  const addNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
      category: "Altro"
    };

    setNotes([newNote, ...notes]); // Modifico lo stato settando l'array "notes" come NewNote + valore precedente dell'array
    navigate(`/notes/${newNote.id}`); // Navigo alla nuova nota dopo averla creata
  };

  // Metodo per aggiornare una nota esistente
  const updateNote = (updatedNote) => {
    const updatedNotesArray = notes.map((note) => {
      // Cicla attraverso tutte le note nell'array con .map()
      if (note.id === activeNote) {
        // Se ciclando arrivo all'activeNote
        return updatedNote; // Sostituisco l'oggetto note nell'iterazione corrente, con l'oggetto updatedNote che appunto contiene le modifiche apportate alla nota
      }
      return note; // Altrimenti sostituisce la nota con se stessa, quindi non cambia niente
    });
    setNotes(updatedNotesArray); // Alla fine del ciclo aggiorniamo l'array nello stato con l'array aggiornato
  };

  // Metodo per eliminare una nota
  const deleteNote = (idToDelete) => {
    // Trova l'indice della nota da eliminare per poter navigare a quella precedente o successiva
    const noteIndex = notes.findIndex((note) => note.id === idToDelete);

    // Cicla in ogni nota nell'array "notes", se l'id è diverso da idToRemove ritorna True e la nota rimane lì, 
    // se l'id è uguale ad idToRemove ritorna False e la nota viene rimossa
    const updatedNotes = notes.filter((note) => note.id !== idToDelete);
    setNotes(updatedNotes);

    // Se la nota eliminata è quella attiva, naviga ad un'altra nota
    if (idToDelete === activeNote) {
      if (updatedNotes.length > 0) {
        // Se ci sono altre note, naviga alla prima disponibile
        // Preferibilmente alla nota precedente o successiva
        const newIndex = noteIndex > 0 ? noteIndex - 1 : 0;
        navigate(`/notes/${updatedNotes[newIndex].id}`);
      } else {
        // Se non ci sono più note, naviga alla route base
        navigate("/notes");
      }
    }
  };

  // È una funzione di "aiuto" che ritorna quella con l'"id" uguale all'"id" di "activeNote", e ritorna l'oggetto "nota"
  const getActiveNote = () => {
    return notes.find((note) => note.id === activeNote);
  };

  // Funzione per selezionare una nota (ora aggiorna anche l'URL)
  const selectNote = (id) => {
    setActiveNote(id);
    navigate(`/notes/${id}`); // Naviga all'URL della nota selezionata
  };

  // Valore da passare al provider
  const value = {
    notes,
    activeNote,
    setActiveNote,
    addNote,
    updateNote,
    deleteNote,
    getActiveNote,
    selectNote,
    categories,
    addCategory,
    categoryColors,
    updateCategoryColor,
    removeCategory
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
};
