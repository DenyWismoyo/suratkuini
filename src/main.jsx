import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app.jsx';
// Gunakan path relatif dari file ini
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { UIProvider } from './context/UIContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
