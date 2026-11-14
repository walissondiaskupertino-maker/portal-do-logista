import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BenchmarkCard } from './BenchmarkCard';
import { resourceFixture, resumoFixture } from '../test/fixtures';

describe('BenchmarkCard', () => {
  it('exibe a media da categoria e o comparativo quando o benchmarking esta liberado', () => {
    render(<BenchmarkCard resumo={resourceFixture()} />);

    expect(screen.getByTestId('benchmark-available')).toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-locked')).not.toBeInTheDocument();
    expect(screen.getByText(/213,90/)).toBeInTheDocument();
    expect(screen.getByText(/12,4% em relação à média da categoria/)).toBeInTheDocument();
    expect(screen.getByText(/abaixo da média das lojas de Moda/)).toBeInTheDocument();
    expect(screen.getByText('Benchmarking ativo')).toBeInTheDocument();
  });

  it('bloqueia a media quando k < minimo, mesmo com a flag do backend ligada (ReN05)', () => {
    render(
      <BenchmarkCard
        resumo={resourceFixture({
          data: resumoFixture({
            benchmarkingDisponivel: true,
            kAnonimato: { k: 2, minimo: 3 },
          }),
        })}
      />,
    );

    expect(screen.getByTestId('benchmark-locked')).toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-available')).not.toBeInTheDocument();
    expect(screen.getByText('R$ ••••,••')).toBeInTheDocument();
    expect(screen.getByText(/Dado protegido por K-Anonymity/)).toBeInTheDocument();
    const note = screen.getByRole('note');
    expect(note).toHaveTextContent(/pelo menos 3 lojas/);
    expect(note).toHaveTextContent(/faltam 1/);
    expect(note).toHaveTextContent(/k atual = 2/);
    expect(screen.getByText('Bloqueado · ReN05')).toBeInTheDocument();
  });

  it('nao exibe o comparativo quando o backend sinaliza benchmarkingDisponivel=false', () => {
    render(
      <BenchmarkCard
        resumo={resourceFixture({
          data: resumoFixture({
            benchmarkingDisponivel: false,
            ticketMedioCategoria: null,
          }),
        })}
      />,
    );

    expect(screen.getByTestId('benchmark-locked')).toBeInTheDocument();
    expect(screen.queryByText(/12,4%/)).not.toBeInTheDocument();
  });

  it('mostra erro com acao de tentar novamente', async () => {
    const user = userEvent.setup();
    const reload = vi.fn();

    render(
      <BenchmarkCard
        resumo={resourceFixture({
          data: null,
          error: 'Falha de rede ao carregar o resumo.',
          status: 500,
          reload,
        })}
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Falha de rede ao carregar o resumo.');
    await user.click(screen.getByRole('button', { name: /Tentar novamente/i }));
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('mostra estado vazio quando nao ha dados de ticket medio', () => {
    render(<BenchmarkCard resumo={resourceFixture({ data: null })} />);

    expect(screen.getByText('Sem dados de ticket médio')).toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-available')).not.toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-locked')).not.toBeInTheDocument();
  });

  it('mostra skeleton durante o carregamento inicial', () => {
    render(<BenchmarkCard resumo={resourceFixture({ data: null, loading: true, status: null })} />);

    expect(screen.getByTestId('benchmark-card')).toBeInTheDocument();
    expect(screen.queryByTestId('benchmark-available')).not.toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
