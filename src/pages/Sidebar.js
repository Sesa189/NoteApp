import React from "react";
import { useState } from "react";
import { useNotes } from "../context/NotesContext";

function Sidebar() {
    // Ora usiamo selectNote invece di setActiveNote per gestire sia lo stato che la navigazione
    const { notes, activeNote, addNote, deleteNote, selectNote } = useNotes();
  
    const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified); // Mediante un ciclo va a comparare ogni volta (l'attributo lastModified della) la nota a ed (l'attributo lastModified della) la nota b

    const [searchText, setSearchText] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("Tutte");

    const { categories, categoryColors, removeCategory } = useNotes();
    
    const filteredNotes = sortedNotes.filter(note => {
        const matchesSearch =
            note.title.toLowerCase().includes(searchText.toLowerCase()) ||
            note.body.toLowerCase().includes(searchText.toLowerCase());
        
        const matchesCategory =
            selectedCategory === "Tutte" || note.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });      

    const defaultCategoryColors = {
        Lavoro: "#2196f3",     // blu
        Studio: "#4caf50",     // verde
        Casa: "#ff9800",       // arancio
        Personale: "#e91e63",  // rosa
        Altro: "#9e9e9e"       // grigio
    };
      

    return (
        <div className="app-sidebar">
            <div className="app-sidebar-header">
                <h1>Notes</h1>
                <button className="add-note-button" onClick={addNote}>
                    <span className="add-note-icon">+</span>
                </button>
            </div>

            <input
                type="text"
                placeholder="Search notes..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
            />

            <div className="app-sidebar-notes">
                <div className="category-filters">
                    {["Tutte", ...categories].map((cat) => (
                        <div key={cat} className="category-filter-wrapper">
                            <button
                                onClick={() => setSelectedCategory(cat)}
                                className={`category-filter-button ${selectedCategory === cat ? "active" : ""}`}
                            >                    
                                <span
                                    className="category-dot"
                                    style={{
                                        backgroundColor: categoryColors[cat] || defaultCategoryColors[cat] || "#777",
                                        borderRadius: "6px"
                                    }}
                                ></span>
                                {cat}
                            </button>
                            {/* Rimuovibile solo se non è una categoria predefinita */}
                            {!["Tutte", "Lavoro", "Studio", "Casa", "Personale", "Altro"].includes(cat) && (
                                <button
                                    onClick={() => {
                                        const confirmDelete = window.confirm(`Sei sicuro di voler eliminare la categoria "${cat}"?\nLe note con questa categoria non verranno eliminate.`);
                                        if (confirmDelete) {
                                            removeCategory(cat);
                                        }
                                    }}                                  
                                    className="remove-category-button"
                                    title="Rimuovi categoria"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                
                {filteredNotes.map((note) => ( // In questo modo stamperà lo stesso formato per ogni nota in "notes"
                // Aggiungo una condizione che in base a se la nota è la activeNote, allora cambia colore grazie allo stile:
                <div 
                    key={note.id} // Aggiungiamo key per evitare warning React
                    className={`app-sidebar-note ${note.id === activeNote && "active"}`} 
                    onClick={() => selectNote(note.id)} // Ora usa selectNote invece di setActiveNote
                > 
                    <div className="sidebar-note-title">
                        <strong>{note.title}</strong>
                        <span
                        role="button"
                        aria-label="Delete note"
                        onClick={(e) => {
                            e.stopPropagation(); // Previene la propagazione dell'evento al div padre
                            deleteNote(note.id); // Elimina la nota
                        }}
                        style={{
                            color: "crimson",
                            cursor: "pointer",
                            fontSize: "1rem",
                            marginLeft: "10px",
                            lineHeight: "1"
                        }}
                        >
                            🗑️
                        </span>
                    </div>
                    <p>{note.body && note.body.substr(0, 100) + "..."}</p>
                    <small className="note-meta">
                    Last modified {new Date(note.lastModified).toLocaleDateString("it-IT", {
                        hour: "2-digit",
                        minute: "2-digit"
                    })}
                    </small>
                </div> 
                ))}
            </div>
        </div>
    );
}

export default Sidebar;