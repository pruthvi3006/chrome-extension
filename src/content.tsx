import React from 'react';
import { createRoot } from 'react-dom/client';
import Launcher from './Launcher';
import './index.css';

const container = document.createElement('div');
document.body.appendChild(container);
createRoot(container).render(<Launcher />);