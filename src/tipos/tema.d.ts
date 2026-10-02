import 'styled-components';
import type { Tema } from '@/estilos/tema';

// Liga o tema ao styled-components: `props.theme` passa a ter autocomplete e checagem de tipos.
declare module 'styled-components' {
  export interface DefaultTheme extends Tema {}
}
