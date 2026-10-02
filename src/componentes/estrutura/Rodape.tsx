import styled, { css } from 'styled-components';
import { IconeCanal } from '@/componentes/comuns/Icones';
import { LinkExterno } from '@/componentes/comuns/LinkExterno';
import { redes } from '@/dados/contatos';
import { perfil } from '@/dados/perfil';
import { conteiner, somenteLeitores } from '@/estilos/fragmentos';
import { midia } from '@/estilos/midias';
import { comAlfa } from '@/estilos/tema';

const ANO_ATUAL = new Date().getFullYear();

export function Rodape() {
  return (
    <RodapeEstilizado>
      <Conteudo>
        <Assinatura>
          <Prompt aria-hidden="true">$</Prompt>
          <span>
            © {ANO_ATUAL} {perfil.nome}
          </span>
          <Separador aria-hidden="true">{'//'}</Separador>
          <Nota>construído do zero com React e TypeScript</Nota>
        </Assinatura>

        <Redes aria-label="Redes sociais">
          {redes.map((canal) => (
            <li key={canal.id}>
              <LinkRede href={canal.href} title={canal.rotulo}>
                <IconeCanal id={canal.id} tamanho="1.1em" />
                <Oculto>{canal.rotulo}</Oculto>
              </LinkRede>
            </li>
          ))}
        </Redes>
      </Conteudo>
    </RodapeEstilizado>
  );
}

const RodapeEstilizado = styled.footer`
  ${({ theme: { cores, camadas, espacos } }) => css`
    position: relative;
    z-index: ${camadas.conteudo};
    padding: ${espacos[6]} 0 max(${espacos[6]}, env(safe-area-inset-bottom));
    border-top: 1px solid ${cores.borda};
    background: linear-gradient(180deg, transparent, ${comAlfa(cores.destaque, 0.025)});
  `}
`;

const Conteudo = styled.div`
  ${conteiner}
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.espacos[4]};

  ${midia.acima('tablet')} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const Assinatura = styled.p`
  ${({ theme: { cores, tamanhos, espacos } }) => css`
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: center;
    gap: 0 ${espacos[2]};
    font-size: ${tamanhos.xs};
    color: ${cores.textoSuave};
    text-align: center;
  `}
`;

const Prompt = styled.span`
  color: ${({ theme }) => theme.cores.brilho};
`;

const Separador = styled.span`
  color: ${({ theme }) => theme.cores.textoApagado};
`;

const Nota = styled.span`
  color: ${({ theme }) => theme.cores.textoApagado};
`;

const Redes = styled.ul`
  display: flex;
  gap: ${({ theme }) => theme.espacos[2]};
  padding: 0;
  list-style: none;
`;

const LinkRede = styled(LinkExterno)`
  ${({ theme: { cores, raios, sombras, duracoes, curvas } }) => css`
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid transparent;
    border-radius: ${raios.sm};
    color: ${cores.textoSuave};
    transition:
      color ${duracoes.media} ${curvas.suave},
      border-color ${duracoes.media} ${curvas.suave},
      box-shadow ${duracoes.media} ${curvas.suave};

    ${midia.ponteiroFino} {
      &:hover {
        border-color: ${cores.bordaBrilho};
        color: ${cores.brilho};
        box-shadow: ${sombras.neonBrilho};
      }
    }
  `}
`;

const Oculto = styled.span`
  ${somenteLeitores}
`;
