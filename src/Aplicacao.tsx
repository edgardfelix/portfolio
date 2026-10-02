import { MotionConfig } from 'framer-motion';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { LayoutBase } from '@/componentes/estrutura/LayoutBase';
import { EstilosGlobais } from '@/estilos/EstilosGlobais';
import { tema } from '@/estilos/tema';

/** Flags da v7 ligadas: comportamento já alinhado ao React Router 7 (e sem avisos no console). */
const futuroRoteador = { v7_startTransition: true, v7_relativeSplatPath: true } as const;

export function Aplicacao() {
  return (
    <ThemeProvider theme={tema}>
      <EstilosGlobais />
      {/* reducedMotion="user": quem pede menos movimento no sistema recebe só transições de opacidade */}
      <MotionConfig reducedMotion="user">
        <BrowserRouter future={futuroRoteador}>
          <LayoutBase />
        </BrowserRouter>
      </MotionConfig>
    </ThemeProvider>
  );
}
