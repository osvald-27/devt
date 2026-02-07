import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppController from './AppController'; // Import your new controller

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <AppController />
    </StrictMode>
  );
}