import { useState } from 'react';
import { haptic } from '../telegram';

interface Props {
  onSubmit: (card: string) => Promise<void>;
}

/** «Вас пригласил друг? Введите номер его карты» — если мини-апп открыли не по ссылке. */
export default function ReferrerForm({ onSubmit }: Props) {
  const [card, setCard] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const digits = card.replace(/\D/g, '');

  async function submit() {
    haptic();
    setError(null);
    setBusy(true);
    try {
      await onSubmit(digits);
      haptic('success');
    } catch (err) {
      haptic('error');
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="referrer">
      <span className="referrer__title">Вас пригласил друг?</span>
      <span className="referrer__hint">Введите номер его карты — он есть у друга в мини-приложении под балансом.</span>
      <div className="referrer__row">
        <input
          className="input"
          inputMode="numeric"
          placeholder="4821 3907"
          maxLength={9}
          value={card}
          onChange={(e) => {
            const d = e.target.value.replace(/\D/g, '').slice(0, 8);
            setCard(d.length > 4 ? `${d.slice(0, 4)} ${d.slice(4)}` : d);
          }}
        />
        <button className="button button--small" disabled={digits.length !== 8 || busy} onClick={submit}>
          {busy ? '…' : 'Готово'}
        </button>
      </div>
      {error && <span className="referrer__error">{error}</span>}
    </section>
  );
}
