import { describe, expect, it } from 'vitest';
import { DEFAULT_K_MINIMO, evaluateBenchmarking } from './benchmarking';

describe('evaluateBenchmarking (ReN05 / K-Anonymity)', () => {
  it('libera a media quando a flag, o ticket e o k minimo estao presentes', () => {
    const state = evaluateBenchmarking({
      benchmarkingDisponivel: true,
      ticketMedioCategoria: 213.9,
      kAnonimato: { k: 7, minimo: 3 },
    });

    expect(state).toEqual({
      disponivel: true,
      ticketCategoria: 213.9,
      k: 7,
      minimo: 3,
      faltam: 0,
    });
  });

  it('bloqueia quando k < minimo mesmo se o backend enviar benchmarkingDisponivel=true', () => {
    const state = evaluateBenchmarking({
      benchmarkingDisponivel: true,
      ticketMedioCategoria: 213.9,
      kAnonimato: { k: 2, minimo: 3 },
    });

    expect(state.disponivel).toBe(false);
    expect(state.faltam).toBe(1);
    expect(state.ticketCategoria).toBe(213.9);
  });

  it('bloqueia quando a flag do backend e false', () => {
    const state = evaluateBenchmarking({
      benchmarkingDisponivel: false,
      ticketMedioCategoria: 213.9,
      kAnonimato: { k: 10, minimo: 3 },
    });

    expect(state.disponivel).toBe(false);
  });

  it('bloqueia quando o ticket da categoria e nulo', () => {
    const state = evaluateBenchmarking({
      benchmarkingDisponivel: true,
      ticketMedioCategoria: null,
      kAnonimato: { k: 10, minimo: 3 },
    });

    expect(state.disponivel).toBe(false);
    expect(state.ticketCategoria).toBeNull();
  });

  it('bloqueia quando o ticket da categoria e invalido', () => {
    const state = evaluateBenchmarking({
      benchmarkingDisponivel: true,
      ticketMedioCategoria: Number.NaN,
      kAnonimato: { k: 10, minimo: 3 },
    });

    expect(state.ticketCategoria).toBeNull();
    expect(state.disponivel).toBe(false);
  });

  it('usa k = 0 e o minimo padrao quando o bloco de anonimato esta ausente', () => {
    const state = evaluateBenchmarking({
      benchmarkingDisponivel: true,
      ticketMedioCategoria: 100,
    });

    expect(state.k).toBe(0);
    expect(state.minimo).toBe(DEFAULT_K_MINIMO);
    expect(state.faltam).toBe(DEFAULT_K_MINIMO);
    expect(state.disponivel).toBe(false);
  });

  it('nao retorna faltam negativo quando k supera o minimo', () => {
    const state = evaluateBenchmarking({
      benchmarkingDisponivel: true,
      ticketMedioCategoria: 100,
      kAnonimato: { k: 9, minimo: 3 },
    });

    expect(state.faltam).toBe(0);
  });

  it('trata fonte nula como bloqueada', () => {
    const state = evaluateBenchmarking(null);

    expect(state.disponivel).toBe(false);
    expect(state.ticketCategoria).toBeNull();
    expect(state.k).toBe(0);
    expect(state.faltam).toBe(DEFAULT_K_MINIMO);
  });
});
