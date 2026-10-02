import { TituloSecao } from '@/componentes/comuns/TituloSecao';
import { perfil } from '@/dados/perfil';
import { projetos } from '@/dados/projetos';
import { surgir } from '@/estilos/movimento';
import { CartaoProjeto } from './CartaoProjeto';
import * as E from './Projetos.estilos';

export function Projetos() {
  const total = projetos.length;

  return (
    <E.Secao aria-labelledby="titulo-projetos">
      <title>{`Projetos · ${perfil.nome}`}</title>

      <TituloSecao
        id="titulo-projetos"
        caminho="projetos"
        comando="ls --detalhes"
        descricao="Sistemas construídos do zero, com foco no que não aparece na tela: arquitetura, regras de negócio e resiliência."
      >
        Projetos
      </TituloSecao>

      <E.Contagem variants={surgir}>
        <E.Ponto aria-hidden="true" />
        {total} {total === 1 ? 'projeto' : 'projetos'} · novos em desenvolvimento
      </E.Contagem>

      <E.Grade>
        {projetos.map((projeto, indice) => (
          <CartaoProjeto key={projeto.id} projeto={projeto} indice={indice} />
        ))}
      </E.Grade>
    </E.Secao>
  );
}
