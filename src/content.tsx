import { Buffer } from 'buffer';
// Polyfill Buffer globally for browser
if (!(window as any).Buffer) {
  (window as any).Buffer = Buffer;
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import Launcher from './Launcher';
import './index.css';

const container = document.createElement('div');
document.body.appendChild(container);
createRoot(container).render(<Launcher />);