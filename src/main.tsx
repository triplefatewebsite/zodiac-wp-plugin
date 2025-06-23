import React from 'react';
import ReactDOM from 'react-dom/client';
import { ZodiacApp } from './components/ZodiacApp';

import './index.css';

const rootElement = document.getElementById('zodiac-app-root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ZodiacApp />
    </React.StrictMode>
  );
}
