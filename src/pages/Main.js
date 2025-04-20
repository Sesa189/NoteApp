import { useParams } from "react-router-dom";
import { useNotes } from "../context/NotesContext";
import { useEffect } from "react";

function Main() {
    
  // Usiamo useParams per accedere al parametro noteId nell'URL
  const { noteId } = useParams();
  const { getActiveNote, updateNote, setActiveNote, categories, addCategory, categoryColors, updateCategoryColor } = useNotes();
  
  const defaultCategoryColors = {
    Lavoro: "#2196f3",     // blu
    Studio: "#4caf50",     // verde
    Casa: "#ff9800",       // arancio
    Personale: "#e91e63",  // rosa
    Altro: "#9e9e9e"       // grigio
  };
  
  // Sincronizziamo lo stato activeNote con il parametro dell'URL
  useEffect(() => {
    if (noteId) {
      setActiveNote(noteId);
    }
  }, [noteId, setActiveNote]);
  
  const activeNote = getActiveNote();
  
  // Prima di tutto faccio un if che controlla se ho una nota selezionata, se si allora fa il display di quella nota, altrimenti scrive a schermo "No note selected"
  if (!activeNote) return <div className="no-active-note">No note selected</div>;
    
  const onEditField = (key, value) => {
    updateNote({
      ...activeNote,
      [key]: value,
      lastModified: Date.now()
    });
  };

    return (
        <div className="app-main single-note-edit">
            <div className="note-header">
                <input
                    type="text"
                    id="title"
                    value={activeNote.title}
                    onChange={(e) => onEditField("title", e.target.value)}
                    autoFocus
                    placeholder="Note title"
                />

                <div className="category-selector">
                    <input
                        type="color"
                        className="color-picker"
                        value={
                        categoryColors[activeNote.category] ||
                        defaultCategoryColors[activeNote.category] ||
                        "#666666"
                        }
                        onChange={(e) =>
                        updateCategoryColor(activeNote.category, e.target.value)
                        }
                    />

                    <select
                        value={activeNote.category}
                        onChange={(e) => {
                        if (e.target.value === "__add_new__") {
                            const newCat = prompt("Inserisci il nome della nuova categoria:");
                            if (newCat && newCat.trim()) {
                            addCategory(newCat.trim());
                            onEditField("category", newCat.trim());
                            }
                        } else {
                            onEditField("category", e.target.value);
                        }
                        }}
                    >
                        {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                        ))}
                        <option value="__add_new__">➕ Aggiungi nuova categoria...</option>
                    </select>
                </div>
            </div>
            <textarea
              id="body"
              className="note-body"
              placeholder="Scrivi qui la tua nota..."
              onChange={(e) => onEditField("body", e.target.value)}
              value={activeNote.body}
            />
        </div>
    );    
}

export default Main;