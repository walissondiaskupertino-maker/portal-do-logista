import { useState } from 'react';
import type { Resource } from '../hooks/useResource';
import { criarCampanha } from '../lib/api';
import { formatDateTime, formatNumber } from '../lib/format';
import type { Campanha, LojaResumo, Periodo } from '../types';
import {
  IconAlert,
  IconArrowRight,
  IconCheckCircle,
  IconInfo,
  IconSparkles,
  IconTicket,
} from './icons';
import { useToast } from './Toast';

const DESCONTO_PERCENTUAL = 15;
const VALIDADE_DIAS = 7;
const JANELA_DIAS: Record<Periodo, number> = { '7d': 7, '30d': 30, '90d': 90 };

type Status = 'idle' | 'enviando' | 'sucesso';

interface CouponCardProps {
  resumo: Resource<LojaResumo>;
  token: string;
  periodo: Periodo;
}

export function CouponCard({ resumo, token, periodo }: CouponCardProps) {
  const toast = useToast();
  const [status, setStatus] = useState<Status>('idle');
  const [campanha, setCampanha] = useState<Campanha | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const publico = resumo.data?.publicoEstimadoCupom ?? null;
  const aguardandoDados = resumo.loading && !resumo.data;
  const semDados = !resumo.loading && (Boolean(resumo.error) || publico === null);
  const enviando = status === 'enviando';
  const semPublico = publico === null || publico <= 0;
  const desabilitado = semPublico || aguardandoDados || enviando;

  const motivoDesabilitado = enviando
    ? 'Disparando o cupom…'
    : aguardandoDados
      ? 'Aguardando os dados da sua loja para calcular o público.'
      : semDados
        ? 'Não foi possível calcular o público do cupom. Atualize os dados e tente novamente.'
        : publico === 0
          ? 'Nenhum cliente elegível para o cupom neste período.'
          : null;

  async function disparar() {
    if (publico === null || publico <= 0 || enviando) return;

    setStatus('enviando');
    setErro(null);

    try {
      const resposta = await criarCampanha(
        {
          titulo: `Cupom ${DESCONTO_PERCENTUAL}% OFF — clientes do horário de pico`,
          descontoPercentual: DESCONTO_PERCENTUAL,
          canal: 'whatsapp',
          validadeDias: VALIDADE_DIAS,
          publicoAlvo: {
            tipo: 'visitantes_horario_pico',
            janelaDias: JANELA_DIAS[periodo],
            estimativa: publico,
          },
        },
        token,
      );

      setCampanha(resposta);
      setStatus('sucesso');
      toast.push({
        variant: 'success',
        title: `Cupom de ${DESCONTO_PERCENTUAL}% disparado!`,
        description: `${formatNumber(resposta.publicoEstimado ?? publico)} clientes vão receber o cupom ${
          resposta.codigoCupom ?? resposta.id
        }.`,
      });
    } catch (error) {
      const mensagem =
        error instanceof Error && error.message
          ? error.message
          : 'Não foi possível disparar o cupom. Tente novamente.';

      setStatus('idle');
      setErro(mensagem);
      toast.push({
        variant: 'error',
        title: 'Falha ao disparar o cupom',
        description: mensagem,
      });
    }
  }

  function reiniciar() {
    setStatus('idle');
    setCampanha(null);
    setErro(null);
  }

  return (
    <article className="card coupon" data-testid="coupon-card">
      <div className="coupon__glow" aria-hidden="true" />
      <span className="coupon__badge">
        <IconSparkles />
        Ação rápida
      </span>

      {status === 'sucesso' && campanha ? (
        <div className="coupon__success" data-testid="coupon-success" role="status">
          <span className="coupon__success-icon">
            <IconCheckCircle />
          </span>
          <h2 className="coupon__title">Cupom disparado!</h2>
          <p className="coupon__lead">
            <strong>{formatNumber(campanha.publicoEstimado ?? 0)} clientes</strong> da sua loja vão
            receber o cupom de {DESCONTO_PERCENTUAL}% OFF nas próximas horas.
          </p>

          <div className="coupon__code">
            <span className="coupon__code-label">Código do cupom</span>
            <strong className="coupon__code-value">{campanha.codigoCupom ?? campanha.id}</strong>
          </div>

          <p className="coupon__meta">
            Campanha {campanha.id} · {campanha.status} · criada em{' '}
            {formatDateTime(campanha.criadaEm)}
          </p>

          <button type="button" className="btn btn--coupon-ghost btn--block" onClick={reiniciar}>
            Disparar outro cupom
            <IconArrowRight />
          </button>
        </div>
      ) : (
        <div className="coupon__content">
          <div className="coupon__head">
            <span className="coupon__icon">
              <IconTicket />
            </span>
            <div>
              <h2 className="coupon__title">Disparar Cupom 15% OFF</h2>
              <p className="coupon__lead">
                Traga de volta quem já visitou sua loja no horário de pico.
              </p>
            </div>
          </div>

          <div className="coupon__stub">
            <div>
              <span className="coupon__stub-label">Oferta</span>
              <strong className="coupon__stub-value">15% OFF</strong>
            </div>
            <span className="coupon__stub-divider" aria-hidden="true" />
            <div>
              <span className="coupon__stub-label">Validade</span>
              <strong className="coupon__stub-value">{VALIDADE_DIAS} dias</strong>
            </div>
            <span className="coupon__stub-divider" aria-hidden="true" />
            <div>
              <span className="coupon__stub-label">Canal</span>
              <strong className="coupon__stub-value">WhatsApp</strong>
            </div>
          </div>

          <div className="coupon__audience">
            <span className="coupon__audience-icon">
              <IconSparkles />
            </span>
            {publico !== null && publico > 0 ? (
              <p>
                Público estimado: <strong>{formatNumber(publico)} clientes</strong> que passaram pela
                loja no horário de pico nos últimos {JANELA_DIAS[periodo]} dias.
              </p>
            ) : publico === 0 ? (
              <p>Nenhum cliente elegível para o cupom neste período.</p>
            ) : (
              <p>Calculando o público elegível com base no fluxo da sua loja…</p>
            )}
          </div>

          {erro && (
            <p className="coupon__error" role="alert">
              <IconAlert />
              {erro}
            </p>
          )}

          <button
            type="button"
            className="btn btn--coupon btn--block"
            onClick={disparar}
            disabled={desabilitado}
            aria-busy={enviando}
            data-testid="coupon-submit"
          >
            {enviando ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Disparando cupom…
              </>
            ) : (
              <>
                Disparar Cupom 15% OFF
                <IconArrowRight />
              </>
            )}
          </button>

          <p className="coupon__note">
            <IconInfo />
            {motivoDesabilitado ??
              'O disparo considera apenas os clientes da sua loja. Nenhum dado individual é exposto.'}
          </p>
        </div>
      )}
    </article>
  );
}
