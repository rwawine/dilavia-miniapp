import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { tg } from './telegram';
import App from './App';
import './index.css';

tg?.ready();
tg?.expand();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
