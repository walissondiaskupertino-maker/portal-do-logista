import { useState, type FormEvent } from 'react';
import { USE_MOCKS } from '../lib/env';
import { IconArrowRight, IconLock, IconLogo, IconShield } from './icons';

interface AccessGateProps {
  expired: boolean;
  onDemo: () => void;
  onToken: (token: string) => void;
}

export function AccessGate({ expired, onDemo, onToken }: AccessGateProps) {
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = token.trim();
    if (value.length < 10) {
      setError('Informe um token de acesso válido.');
      return;
    }
    setError(null);
    onToken(value);
  }

  return (
    <main className="gate">
      <div className="gate__card">
        <div className="gate__brand">
          <span className="brand__mark brand__mark--lg">
            <IconLogo />
          </span>
          <span className="brand__text">
            <strong>Portal do Lojista</strong>
            <small>Shopping Analytics</small>
          </span>
        </div>

        <h1 className="gate__title">
          {expired ? 'Sua sessão expirou' : 'Acesso ao Portal do Lojista'}
        </h1>
        <p className="gate__lead">
          O portal é aberto pelo shopping com um token de acesso. A loja é identificada
          automaticamente pelo seu token — não é preciso escolher a loja.
        </p>

        <ul className="gate__list">
          <li>
            <IconLock />
            Apenas os dados da loja vinculada ao seu acesso são exibidos.
          </li>
          <li>
            <IconShield />
            Médias de categoria respeitam o anonimato (K-Anonymity, k ≥ 3).
          </li>
        </ul>

        {USE_MOCKS && (
          <button type="button" className="btn btn--primary btn--block" onClick={onDemo}>
            Entrar no modo demonstração
            <IconArrowRight />
          </button>
        )}

        <details className="gate__details">
          <summary>Já tenho um token de acesso</summary>
          <form className="gate__form" onSubmit={handleSubmit}>
            <label className="gate__field">
              <span>Token de acesso</span>
              <input
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="Cole aqui o token recebido do shopping"
                autoComplete="off"
                spellCheck={false}
              />
            </label>
            {error && (
              <p className="gate__error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn--primary btn--block" disabled={!token.trim()}>
              Acessar portal
            </button>
          </form>
        </details>

        <p className="gate__foot">
          Dados agregados e anonimizados · Regra ReN05 · K-Anonymity (k ≥ 3)
        </p>
      </div>
    </main>
  );
}
