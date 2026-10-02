import { AnimatePresence } from 'framer-motion';
import { useId, useState } from 'react';
import { BotaoNeon } from '@/componentes/comuns/BotaoNeon';
import { EtiquetaTecnologia } from '@/componentes/comuns/EtiquetaTecnologia';
import { IconeCamadas, IconeGithub, IconeSetaExterna } from '@/componentes/comuns/Icones';
import { aoEntrarNaTela, curvaSuave, surgir } from '@/estilos/movimento';
import { useHolofote } from '@/ganchos/useHolofote';
import type { Projeto } from '@/tipos/dominio';
import { CapaProjeto } from './CapaProjeto';
import * as E from './CartaoProjeto.estilos';

interface Propriedades {
  projeto: Projeto;
  indice: number;
}

const doisDigitos = (valor: number) => String(valor).padStart(2, '0');

export function CartaoProjeto({ projeto, indice }: Propriedades) {
  const refHolofote = useHolofote<HTMLElement>();
  const [arquiteturaAberta, setArquiteturaAberta] = useState(false);
  const idTitulo = useId();
  const idArquitetura = useId();

  const destaque = projeto.destaque ?? false;
  const { repositorio, demonstracao } = projeto.links;
  const temArquitetura = Boolean(projeto.camadas?.length || projeto.decisoes?.length);

  return (
    <E.Cartao ref={refHolofote} $destaque={destaque} variants={surgir} {...aoEntrarNaTela} aria-labelledby={idTitulo}>
      <E.Capa $destaque={destaque}>
        <CapaProjeto projeto={projeto} />
      </E.Capa>

      <E.Corpo>
        <E.Topo>
          <E.Categoria>{projeto.categoria}</E.Categoria>
          <E.Numero aria-hidden="true">{doisDigitos(indice + 1)}</E.Numero>
        </E.Topo>

        <E.Titulo id={idTitulo}>{projeto.titulo}</E.Titulo>
        {projeto.lema && <E.Lema>{projeto.lema}</E.Lema>}
        <E.Resumo>{projeto.resumo}</E.Resumo>

        <E.Tecnologias>
          {projeto.tecnologias.map(({ grupo, itens }) => (
            <E.Grupo key={grupo}>
              <E.RotuloGrupo>{grupo}</E.RotuloGrupo>
              <E.ListaEtiquetas aria-label={`Tecnologias: ${grupo}`}>
                {itens.map((item) => (
                  <EtiquetaTecnologia key={item}>{item}</EtiquetaTecnologia>
                ))}
              </E.ListaEtiquetas>
            </E.Grupo>
          ))}
        </E.Tecnologias>

        <E.Acoes>
          {repositorio ? (
            <BotaoNeon href={repositorio} variante="secundario" icone={<IconeGithub />}>
              Código
            </BotaoNeon>
          ) : (
            <E.Pendente>
              <IconeGithub />
              Código em breve
            </E.Pendente>
          )}

          {demonstracao && (
            <BotaoNeon href={demonstracao} icone={<IconeSetaExterna />}>
              Demo
            </BotaoNeon>
          )}

          {temArquitetura && (
            <E.BotaoDetalhes
              type="button"
              aria-expanded={arquiteturaAberta}
              aria-controls={idArquitetura}
              onClick={() => setArquiteturaAberta((aberta) => !aberta)}
            >
              <IconeCamadas />
              {arquiteturaAberta ? 'Ocultar arquitetura' : 'Ver arquitetura'}
            </E.BotaoDetalhes>
          )}
        </E.Acoes>
      </E.Corpo>

      <AnimatePresence initial={false}>
        {arquiteturaAberta && (
          <E.Detalhes
            key="arquitetura"
            id={idArquitetura}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: curvaSuave }}
          >
            <E.DetalhesInterno>
              {projeto.camadas && (
                <div>
                  <E.Subtitulo>Como funciona</E.Subtitulo>
                  <E.ListaCamadas>
                    {projeto.camadas.map((camada, posicao) => (
                      <E.Camada key={camada.nome}>
                        <E.NumeroCamada aria-hidden="true">{doisDigitos(posicao + 1)}</E.NumeroCamada>
                        <div>
                          <E.NomeCamada>
                            {camada.nome} <E.Metafora>— {camada.metafora}</E.Metafora>
                          </E.NomeCamada>
                          <E.DescricaoCamada>{camada.descricao}</E.DescricaoCamada>
                        </div>
                      </E.Camada>
                    ))}
                  </E.ListaCamadas>
                </div>
              )}

              {projeto.decisoes && (
                <div>
                  <E.Subtitulo>Decisões técnicas</E.Subtitulo>
                  <E.ListaDecisoes>
                    {projeto.decisoes.map((decisao) => (
                      <li key={decisao}>{decisao}</li>
                    ))}
                  </E.ListaDecisoes>
                </div>
              )}
            </E.DetalhesInterno>
          </E.Detalhes>
        )}
      </AnimatePresence>
    </E.Cartao>
  );
}
