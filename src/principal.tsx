import '@fontsource-variable/jetbrains-mono';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Aplicacao } from './Aplicacao';

const raiz = document.getElementById('raiz');
if (!raiz) throw new Error('Elemento #raiz não encontrado no index.html');

createRoot(raiz).render(
  <StrictMode>
    <Aplicacao />
  </StrictMode>,
);
