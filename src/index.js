import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Importiamo BrowserRouter per abilitare il routing
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Avvolgiamo l'App con BrowserRouter per abilitare la navigazione basata su URL */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);