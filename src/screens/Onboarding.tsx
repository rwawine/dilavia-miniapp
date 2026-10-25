import { useState } from 'react';
import type { Program } from '../types';
import { formatPoints } from '../lib/format';
import { haptic, requestPhone } from '../telegram';

interface Props {
  program: Program;
  onContact: (signedContact: string) => Promise<void>;
}

export default function Onboarding({ program, onContact }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const base = [...program.levels].sort((a, b) => a.minSpent - b.minSpent)[0];
  const best = [...program.levels].sort((a, b) => b.cashbackPercent - a.cashbackPercent)[0];

  async function join() {
    haptic();
    setError(null);
    const contact = await requestPhone();
    if (!contact.ok) {
      if (contact.reason === 'unsupported') {
        setError('Обновите Telegram до последней версии — без этого не получится подтвердить номер.');
      }
      return;
    }
    setBusy(true);
    try {
      await onContact(contact.signed);
      haptic('success');
    } catch (err) {
      haptic('error');
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="screen onboarding">
      <div className="onboarding__hero">🛋</div>
      <h1 className="title">{program.name}</h1>
      <p className="subtitle">Программа лояльности мебельной фабрики Dilavia</p>

      <ul className="benefits">
        {program.welcomeBonus > 0 && (
          <li>
            <span>🎁</span>
            {formatPoints(program.welcomeBonus)} сразу после вступления
          </li>
        )}
        {base && (
          <li>
            <span>🛋</span>
            {base.cashbackPercent === best?.cashbackPercent
              ? `${base.cashbackPercent}% от каждого заказа возвращаем баллами`
              : `От ${base.cashbackPercent}% до ${best.cashbackPercent}% от каждого заказа баллами`}
          </li>
        )}
        <li>
          <span>🎟</span>1 балл = 1 BYN скидки по промокоду на сайте
        </li>
      </ul>

      <p className="note">
        Мы найдём ваши заказы по номеру телефона. Номер подтверждает сам Telegram — вводить ничего не нужно.
      </p>

      {error && <p className="notice notice--error">{error}</p>}

      <button className="button" onClick={join} disabled={busy || !program.isEnabled}>
        {busy ? 'Подключаем…' : 'Вступить по номеру телефона'}
      </button>
      {!program.isEnabled && <p className="notice">Программа временно приостановлена.</p>}
    </div>
  );
}
