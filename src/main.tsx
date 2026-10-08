import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './styles/global.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App path={window.location.pathname.replace(/\/$/, '') || '/'} />
  </StrictMode>
);

if (root.children.length) hydrateRoot(root, app);
else createRoot(root).render(app);
