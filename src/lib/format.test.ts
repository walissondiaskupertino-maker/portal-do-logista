import { describe, expect, it } from 'vitest';
import {
  firstName,
  formatCompact,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
  formatSignedPercent,
  hourLabel,
  hourRangeLabel,
  initials,
} from './format';

/** Intl usa NBSP entre "R$" e o valor; normaliza para comparar sem depender do browser. */
function plain(value: string): string {
  return value.replace(/\u00a0/g, ' ');
}

describe('formatCurrency', () => {
  it('formata valores em BRL', () => {
    expect(plain(formatCurrency(187.4))).toBe('R$ 187,40');
  });

  it('retorna travessao para nulo, indefinido ou invalido', () => {
    expect(formatCurrency(null)).toBe('—');
    expect(formatCurrency(undefined)).toBe('—');
    expect(formatCurrency(Number.NaN)).toBe('—');
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe('—');
  });

  it('formata zero como moeda', () => {
    expect(plain(formatCurrency(0))).toBe('R$ 0,00');
  });
});

describe('formatNumber', () => {
  it('usa separador de milhar pt-BR e arredonda', () => {
    expect(formatNumber(1284)).toBe('1.284');
    expect(formatNumber(1284.9)).toBe('1.285');
  });

  it('retorna travessao para valores invalidos', () => {
    expect(formatNumber(null)).toBe('—');
  });
});

describe('formatCompact', () => {
  it('compacta grandes volumes', () => {
    expect(plain(formatCompact(1284))).toBe('1,3 mil');
    expect(plain(formatCompact(1250000))).toBe('1,3 mi');
  });

  it('retorna travessao para valores invalidos', () => {
    expect(formatCompact(null)).toBe('—');
  });
});

describe('formatPercent', () => {
  it('formata com uma casa decimal por padrao', () => {
    expect(formatPercent(21.9)).toBe('21,9%');
    expect(formatPercent(12.345, 1)).toBe('12,3%');
    expect(formatPercent(0)).toBe('0,0%');
  });

  it('formata sem decimais quando digits = 0', () => {
    expect(formatPercent(42.6, 0)).toBe('43%');
  });

  it('retorna travessao para valores invalidos', () => {
    expect(formatPercent(undefined)).toBe('—');
  });
});

describe('formatSignedPercent', () => {
  it('adiciona sinal positivo e preserva o negativo', () => {
    expect(formatSignedPercent(6.2)).toBe('+6,2%');
    expect(formatSignedPercent(-3.5)).toBe('-3,5%');
    expect(formatSignedPercent(0)).toBe('0,0%');
  });

  it('retorna travessao para valores invalidos', () => {
    expect(formatSignedPercent(null)).toBe('—');
  });
});

describe('rotulos de hora', () => {
  it('formata horas com dois digitos', () => {
    expect(hourLabel(9)).toBe('09h');
    expect(hourLabel(19)).toBe('19h');
  });

  it('formata faixas de horario', () => {
    expect(hourRangeLabel(19, 20)).toBe('19h–20h');
  });
});

describe('datas', () => {
  it('formata data e hora pt-BR', () => {
    expect(formatDateTime('2026-11-14T12:30:00')).toBe('14/11, 12:30');
  });

  it('formata data pt-BR', () => {
    expect(formatDate('2026-11-14T12:30:00')).toBe('14/11/2026');
  });

  it('retorna travessao para vazio ou invalido', () => {
    expect(formatDateTime(null)).toBe('—');
    expect(formatDateTime('nao-e-data')).toBe('—');
    expect(formatDate(undefined)).toBe('—');
    expect(formatDate('invalida')).toBe('—');
  });
});

describe('helpers de nome', () => {
  it('extrai iniciais', () => {
    expect(initials('Studio Aura')).toBe('SA');
    expect(initials('Aura')).toBe('A');
    expect(initials(null)).toBe('PL');
  });

  it('extrai o primeiro nome', () => {
    expect(firstName('Maria Eduarda')).toBe('Maria');
    expect(firstName(null)).toBe('lojista');
  });
});
