import React from 'react';
import { createRoot } from 'react-dom/client';
import Launcher from './Launcher';
import './style.css';

const container = document.createElement('div');
container.id = 'skynet-launcher-container';
document.body.appendChild(container);

const root = createRoot(container);
root.render(<Launcher />);
