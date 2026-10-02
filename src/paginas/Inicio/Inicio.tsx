import { lazy, Suspense } from 'react';
import { BotaoNeon } from '@/componentes/comuns/BotaoNeon';
import { IconeSeta } from '@/componentes/comuns/Icones';
import { BrilhoLente } from '@/componentes/efeitos/BrilhoLente';
import { EfeitoMatrix } from '@/componentes/efeitos/EfeitoMatrix/EfeitoMatrix';
import { TextoDigitado } from '@/componentes/efeitos/TextoDigitado';
import { TextoInterferencia } from '@/componentes/efeitos/TextoInterferencia';
import { perfil } from '@/dados/perfil';
import { cascata, surgir } from '@/estilos/movimento';
import { CAMINHOS } from '@/rotas/caminhos';
import * as E from './Inicio.estilos';

/** Sob demanda: o runtime do Rive fica fora do bundle principal da página de entrada. */
const AnimacaoRive = lazy(() =>
  import('@/componentes/efeitos/AnimacaoRive').then((modulo) => ({ default: modulo.AnimacaoRive })),
);

/** Cena isométrica do computador (Rive), servida de public/. */
const ARQUIVO_COMPUTADOR = '/28579-54143-computer.riv';
const MAQUINA_COMPUTADOR = 'State Machine 1';

export function Inicio() {
  const espera = (
    <E.Espera>
      aguardando sinal
      <E.CursorEspera />
    </E.Espera>
  );

  return (
    <E.Heroi aria-labelledby="titulo-inicio">
      <title>{`${perfil.nome} · ${perfil.cargo}`}</title>

      <E.Fundo aria-hidden="true">
        <EfeitoMatrix />
      </E.Fundo>
      <E.BrilhoPrincipal x="84%" y="20%" tamanho="46rem" comFaixa />
      <BrilhoLente x="6%" y="92%" tamanho="34rem" cor="destaque" intensidade={0.7} comNucleo={false} />

      {/* Os filhos herdam "oculto → visivel" da transição de página e entram em cascata */}
      <E.Conteudo variants={cascata(0.11, 0.08)}>
        <E.Texto>
          <E.Status variants={surgir}>
            <E.Pulso aria-hidden="true" />
            {perfil.status}
          </E.Status>

          <E.Comando variants={surgir} aria-hidden="true">
            <E.Prompt>visitante@portfolio:~$</E.Prompt>
            whoami
          </E.Comando>

          <E.Titulo id="titulo-inicio" variants={surgir}>
            <TextoInterferencia texto={perfil.nome} />
          </E.Titulo>

          <E.Cargo variants={surgir}>
            <E.Seta aria-hidden="true">{'>'}</E.Seta>
            <TextoDigitado texto={perfil.cargo} atraso={1000} />
          </E.Cargo>

          <E.Chamada variants={surgir}>{perfil.chamada}</E.Chamada>

          <E.Acoes variants={surgir}>
            <BotaoNeon para={CAMINHOS.projetos} tamanho="lg" icone={<IconeSeta />}>
              Ver projetos
            </BotaoNeon>
            <BotaoNeon para={CAMINHOS.contato} tamanho="lg" variante="secundario">
              Fale comigo
            </BotaoNeon>
          </E.Acoes>

          <E.Especialidades variants={surgir} aria-label="Principais tecnologias">
            {perfil.especialidades.map((tecnologia) => (
              <li key={tecnologia}>{tecnologia}</li>
            ))}
          </E.Especialidades>
        </E.Texto>

        {/* Decorativa: fica fora da árvore de acessibilidade */}
        <E.Janela variants={surgir} aria-hidden="true">
          <E.BarraJanela>
            <E.RotuloJanela>
              <E.PontoVivo />
              ~/fintech
            </E.RotuloJanela>
            <span>render.riv</span>
          </E.BarraJanela>

          <E.Tela>
            <Suspense fallback={espera}>
              <AnimacaoRive src={ARQUIVO_COMPUTADOR} stateMachine={MAQUINA_COMPUTADOR} reserva={espera} />
            </Suspense>
          </E.Tela>
        </E.Janela>
      </E.Conteudo>
    </E.Heroi>
  );
}
