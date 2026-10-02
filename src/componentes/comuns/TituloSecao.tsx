import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { textoNeon } from '@/estilos/fragmentos';
import { cascata, surgir } from '@/estilos/movimento';
import { comAlfa } from '@/estilos/tema';

interface Propriedades {
  /** Pasta exibida no prompt: "~/projetos $" */
  caminho: string;
  /** Comando decorativo: "ls --detalhes" */
  comando: string;
  /** Texto do <h1>. */
  children: ReactNode;
  descricao?: ReactNode;
  id?: string;
}

/** Cabeçalho de página no estilo terminal: prompt + título neon + traço de luz. */
export function TituloSecao({ caminho, comando, children, descricao, id }: Propriedades) {
  return (
    <Cabecalho variants={cascata(0.09)}>
      <Comando variants={surgir} aria-hidden="true">
        <Prompt>~/{caminho} $</Prompt> {comando}
      </Comando>

      <LinhaTitulo variants={surgir}>
        <Titulo id={id}>{children}</Titulo>
        <Traco aria-hidden="true" />
      </LinhaTitulo>

      {descricao && <Descricao variants={surgir}>{descricao}</Descricao>}
    </Cabecalho>
  );
}

const Cabecalho = styled(motion.header)`
  display: grid;
  gap: ${({ theme }) => theme.espacos[3]};
`;

const Comando = styled(motion.p)`
  ${({ theme: { cores, tamanhos } }) => css`
    color: ${cores.textoSuave};
    font-size: ${tamanhos.sm};
  `}
`;

const Prompt = styled.span`
  color: ${({ theme }) => theme.cores.brilho};
`;

const LinhaTitulo = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.espacos[6]};
`;

const Titulo = styled.h1`
  ${({ theme: { cores, tamanhos, pesos } }) => css`
    font-size: ${tamanhos.xxl};
    font-weight: ${pesos.extra};
    letter-spacing: -0.03em;
    text-transform: uppercase;
    ${textoNeon(cores.destaque)}
  `}
`;

const Traco = styled.span`
  ${({ theme: { cores } }) => css`
    flex: 1;
    height: 1px;
    margin-top: 0.4em;
    background: linear-gradient(90deg, ${cores.bordaForte}, ${comAlfa(cores.brilho, 0.5)} 40%, transparent);
    box-shadow: 0 0 10px ${comAlfa(cores.brilho, 0.35)};
  `}
`;

const Descricao = styled(motion.p)`
  ${({ theme: { cores, tamanhos, medidas, espacos } }) => css`
    max-width: ${medidas.larguraTexto};
    margin-top: ${espacos[2]};
    color: ${cores.textoSuave};
    font-size: ${tamanhos.md};
  `}
`;
