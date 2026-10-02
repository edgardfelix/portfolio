import { BotaoNeon } from '@/componentes/comuns/BotaoNeon';
import { IconeWhatsapp } from '@/componentes/comuns/Icones';
import { TituloSecao } from '@/componentes/comuns/TituloSecao';
import { redes, whatsapp } from '@/dados/contatos';
import { perfil } from '@/dados/perfil';
import { surgir } from '@/estilos/movimento';
import * as E from './Contato.estilos';
import { FotoPerfil } from './FotoPerfil';
import { ListaRedes } from './ListaRedes';

export function Contato() {
  return (
    <E.Secao aria-labelledby="titulo-contato">
      <title>{`Contato · ${perfil.nome}`}</title>

      <TituloSecao
        id="titulo-contato"
        caminho="contato"
        comando={`ping ${perfil.apelido} --direto`}
        descricao="Sem formulários e sem intermediários: escolha o canal e fale direto comigo."
      >
        Contato
      </TituloSecao>

      <E.Painel variants={surgir}>
        <E.Perfil>
          <FotoPerfil />

          <E.Identidade>
            <E.Nome>{perfil.nome}</E.Nome>
            <E.Cargo>
              <E.Seta aria-hidden="true">{'>'}</E.Seta>
              {perfil.cargo}
            </E.Cargo>
            <E.Status>
              <E.Pulso aria-hidden="true" />
              {perfil.status}
            </E.Status>
          </E.Identidade>

          {whatsapp && (
            <E.BlocoWhatsapp>
              <BotaoNeon href={whatsapp.href} tamanho="lg" icone={<IconeWhatsapp />}>
                Chamar no WhatsApp
              </BotaoNeon>
              <E.Telefone>{whatsapp.exibicao}</E.Telefone>
            </E.BlocoWhatsapp>
          )}
        </E.Perfil>

        {redes.length > 0 && (
          <E.Canais>
            <E.RotuloCanais aria-hidden="true">{'// outros canais'}</E.RotuloCanais>
            <ListaRedes canais={redes} />
          </E.Canais>
        )}
      </E.Painel>
    </E.Secao>
  );
}
