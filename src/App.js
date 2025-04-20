import { Routes, Route, Navigate } from "react-router-dom"; // Importiamo i componenti di React Router
import "./App.css";
import Main from "./pages/Main";
import Sidebar from "./pages/Sidebar";
import { NotesProvider } from "./context/NotesContext";

function App() {
  return (
    <NotesProvider>
      <div className="App">
        <Sidebar />
        {/* Definiamo le rotte dell'applicazione */}
        <Routes>
          {/* Redirect dalla home alla pagina delle note */}
          <Route path="/" element={<Navigate to="/notes" replace />} />
          {/* Rotta per la visualizzazione delle note senza una nota specifica selezionata */}
          <Route path="/notes" element={<Main />} />
          {/* Rotta per la visualizzazione di una nota specifica con il suo ID */}
          <Route path="/notes/:noteId" element={<Main />} />
        </Routes>
      </div>
    </NotesProvider>
  );
}

export default App;