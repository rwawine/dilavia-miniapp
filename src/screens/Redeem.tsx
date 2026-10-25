import { useState } from 'react';
import type { IssuedPromocode, Member, Reward } from '../types';
import { PROGRAM, REWARDS } from '../data/program';
import { formatDate, formatMoney, formatPoints } from '../lib/format';
import { confirmAction, haptic, openLink } from '../telegram';

interface Props {
  member: Member;
  onRedeem: (reward: Reward) => IssuedPromocode;
}

export default function Redeem({ member, onRedeem }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  async function redeem(reward: Reward) {
    haptic();
    const ok = await confirmAction(
      `Обменять ${formatPoints(reward.points)} на промокод на ${formatMoney(reward.discount)}?`,
    );
    if (!ok) return;
    onRedeem(reward);
    haptic('success');
  }

  async function copy(code: string) {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      haptic('success');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt('Скопируйте промокод', code);
    }
  }

  return (
    <div className="screen">
      <h1 className="title">Обменять баллы</h1>
      <p className="subtitle">
        Доступно: <strong>{formatPoints(member.balance)}</strong>
      </p>

      {member.promocodes.length > 0 && (
        <section className="codes">
          {member.promocodes.map((p) => (
            <div key={p.code} className="code">
              <span className="code__label">Ваш промокод на {formatMoney(p.discount)}</span>
              <button className="code__value" onClick={() => copy(p.code)}>
                {p.code}
                <span className="code__copy">{copied === p.code ? 'Скопировано ✓' : 'Скопировать'}</span>
              </button>
              <span className="code__hint">
                Введите при оформлении заказа от {formatMoney(p.minOrder)} · до {formatDate(p.validUntil)}
              </span>
            </div>
          ))}
          <button className="button button--secondary" onClick={() => openLink(`${PROGRAM.siteUrl}/catalog`)}>
            Выбрать мебель на сайте
          </button>
        </section>
      )}

      <ul className="rewards">
        {REWARDS.map((r) => {
          const lack = r.points - member.balance;
          return (
            <li key={r.id} className="reward">
              <div className="reward__info">
                <span className="reward__discount">Скидка {formatMoney(r.discount)}</span>
                <span className="reward__condition">на заказ от {formatMoney(r.minOrder)}</span>
              </div>
              <button className="button button--small" disabled={lack > 0} onClick={() => redeem(r)}>
                {lack > 0 ? `Не хватает ${lack}` : formatPoints(r.points)}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="note">
        Промокод одноразовый и действует 30 дней. Баллы сгорают через {PROGRAM.pointsLifetimeMonths} месяцев
        после начисления.
      </p>
    </div>
  );
}
