import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Make sure path is correct
import './index.css'; // Optional if you use it
import { Buffer } from 'buffer';

// Polyfill Buffer globally for browser
if (!(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
