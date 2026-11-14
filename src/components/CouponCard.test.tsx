import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { criarCampanha } from '../lib/api';
import type { Campanha } from '../types';
import { resourceFixture, resumoFixture } from '../test/fixtures';
import { CouponCard } from './CouponCard';
import { ToastProvider } from './Toast';

vi.mock('../lib/api', () => ({
  criarCampanha: vi.fn(),
}));

const mockedCriarCampanha = vi.mocked(criarCampanha);

const campanhaFixture: Campanha = {
  id: 'cmp_abc123',
  titulo: 'Cupom 15% OFF — clientes do horário de pico',
  descontoPercentual: 15,
  status: 'agendada',
  publicoEstimado: 312,
  criadaEm: '2026-11-14T12:00:00',
  codigoCupom: 'PICO15-ABCD',
};

function renderCard(overrides: Parameters<typeof resourceFixture>[0] = {}) {
  return render(
    <ToastProvider>
      <CouponCard resumo={resourceFixture(overrides)} token="token-de-teste" periodo="30d" />
    </ToastProvider>,
  );
}

describe('CouponCard', () => {
  beforeEach(() => {
    mockedCriarCampanha.mockReset();
  });

  it('mostra o publico estimado e o CTA habilitado', () => {
    renderCard();

    expect(screen.getByText(/312 clientes/)).toBeInTheDocument();
    expect(screen.getByTestId('coupon-submit')).toBeEnabled();
    expect(
      screen.getByRole('heading', { name: 'Disparar Cupom 15% OFF' }),
    ).toBeInTheDocument();
  });

  it('cria a campanha, mostra o sucesso e dispara o toast', async () => {
    const user = userEvent.setup();
    mockedCriarCampanha.mockResolvedValue(campanhaFixture);

    renderCard();

    await user.click(screen.getByTestId('coupon-submit'));

    expect(await screen.findByTestId('coupon-success')).toBeInTheDocument();
    expect(screen.getByText('PICO15-ABCD')).toBeInTheDocument();
    expect(screen.getAllByText(/312 clientes/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Cupom de 15% disparado!/)).toBeInTheDocument();

    expect(mockedCriarCampanha).toHaveBeenCalledTimes(1);
    expect(mockedCriarCampanha).toHaveBeenCalledWith(
      {
        titulo: 'Cupom 15% OFF — clientes do horário de pico',
        descontoPercentual: 15,
        canal: 'whatsapp',
        validadeDias: 7,
        publicoAlvo: {
          tipo: 'visitantes_horario_pico',
          janelaDias: 30,
          estimativa: 312,
        },
      },
      'token-de-teste',
    );
  });

  it('usa a janela de 7 dias quando o periodo e 7d', async () => {
    const user = userEvent.setup();
    mockedCriarCampanha.mockResolvedValue(campanhaFixture);

    render(
      <ToastProvider>
        <CouponCard resumo={resourceFixture()} token="token-de-teste" periodo="7d" />
      </ToastProvider>,
    );

    await user.click(screen.getByTestId('coupon-submit'));

    expect(mockedCriarCampanha).toHaveBeenCalledWith(
      expect.objectContaining({
        publicoAlvo: expect.objectContaining({ janelaDias: 7 }),
      }),
      'token-de-teste',
    );
  });

  it('mostra erro e permite tentar de novo quando a API falha', async () => {
    const user = userEvent.setup();
    mockedCriarCampanha.mockRejectedValue(new Error('Serviço indisponível no momento.'));

    renderCard();

    await user.click(screen.getByTestId('coupon-submit'));

    expect(await screen.findByRole('alert')).toHaveTextContent('Serviço indisponível no momento.');
    expect(screen.getByText('Falha ao disparar o cupom')).toBeInTheDocument();
    expect(screen.queryByTestId('coupon-success')).not.toBeInTheDocument();
    expect(screen.getByTestId('coupon-submit')).toBeEnabled();
  });

  it('desabilita o CTA quando o publico estimado e zero', () => {
    renderCard({ data: resumoFixture({ publicoEstimadoCupom: 0 }) });

    expect(screen.getByTestId('coupon-submit')).toBeDisabled();
    expect(screen.getAllByText(/Nenhum cliente elegível para o cupom neste período\./)).toHaveLength(2);
  });

  it('desabilita o CTA enquanto o resumo carrega', () => {
    renderCard({ data: null, loading: true, status: null });

    expect(screen.getByTestId('coupon-submit')).toBeDisabled();
    expect(screen.getByText(/Aguardando os dados da sua loja/)).toBeInTheDocument();
  });

  it('desabilita o CTA quando o resumo falhou', () => {
    renderCard({ data: null, error: 'Falha de rede.', status: 500 });

    expect(screen.getByTestId('coupon-submit')).toBeDisabled();
    expect(screen.getByText(/Não foi possível calcular o público do cupom/)).toBeInTheDocument();
  });
});
