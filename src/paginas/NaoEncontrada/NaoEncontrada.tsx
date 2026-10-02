import { useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { BotaoNeon } from '@/componentes/comuns/BotaoNeon';
import { IconeSeta } from '@/componentes/comuns/Icones';
import { TextoInterferencia } from '@/componentes/efeitos/TextoInterferencia';
import { perfil } from '@/dados/perfil';
import { conteiner, textoNeon } from '@/estilos/fragmentos';
import { comAlfa } from '@/estilos/tema';
import { CAMINHOS } from '@/rotas/caminhos';

export function NaoEncontrada() {
  // O caminho digitado é exibido como texto: o JSX escapa tudo, sem risco de XSS.
  const { pathname } = useLocation();

  return (
    <Secao aria-labelledby="titulo-404">
      <title>{`Sinal perdido · ${perfil.nome}`}</title>
      <Codigo aria-hidden="true">
        <TextoInterferencia texto="404" />
      </Codigo>
      <Titulo id="titulo-404">Sinal perdido</Titulo>

      <Terminal>
        <Linha>
          <Prompt aria-hidden="true">$</Prompt> cd {pathname}
        </Linha>
        <Linha $erro>bash: cd: {pathname}: rota não encontrada</Linha>
      </Terminal>

      <BotaoNeon para={CAMINHOS.inicio} icone={<IconeSeta />}>
        Voltar ao início
      </BotaoNeon>
    </Secao>
  );
}

const Secao = styled.section`
  ${conteiner}
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.espacos[6]};
  padding-block: ${({ theme }) => theme.espacos[16]};
  text-align: center;
`;

const Codigo = styled.p`
  ${({ theme: { cores, tamanhos, pesos } }) => css`
    font-size: calc(${tamanhos.gigante} * 1.4);
    font-weight: ${pesos.extra};
    line-height: 1;
    letter-spacing: -0.04em;
    ${textoNeon(cores.destaque)}
  `}
`;

const Titulo = styled.h1`
  ${({ theme: { cores, tamanhos } }) => css`
    font-size: ${tamanhos.xl};
    ${textoNeon(cores.brilho)}
  `}
`;

const Terminal = styled.div`
  ${({ theme: { cores, raios, espacos, tamanhos } }) => css`
    display: grid;
    gap: ${espacos[1]};
    width: min(100%, 34rem);
    padding: ${espacos[4]} ${espacos[5]};
    border: 1px solid ${cores.borda};
    border-radius: ${raios.md};
    background: ${comAlfa(cores.fundo, 0.7)};
    font-size: ${tamanhos.sm};
    text-align: left;
  `}
`;

const Linha = styled.p<{ $erro?: boolean }>`
  ${({ theme: { cores }, $erro }) => css`
    color: ${$erro ? cores.brilho : cores.texto};
    overflow-wrap: anywhere;
  `}
`;

const Prompt = styled.span`
  color: ${({ theme }) => theme.cores.brilho};
`;
