import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../app/globals.css';
import { ReferencePortfolio } from '../app/reference-portfolio';

const root = document.getElementById('root');

if (!root) {
  throw new Error('The application root is missing.');
}

createRoot(root).render(
  <StrictMode>
    <ReferencePortfolio />
  </StrictMode>,
);
