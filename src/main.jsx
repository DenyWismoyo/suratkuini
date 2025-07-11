import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './index.css';

// Impor Provider dari lokasi yang benar (PATH DIPERBAIKI)
import { NotificationProvider } from './contexts/NotificationContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NotificationProvider>
      <App />
    </NotificationProvider>
  </React.StrictMode>,
);
