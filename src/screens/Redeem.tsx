import { useState } from 'react';
import type { IssuedPromocode, Member, Program, Reward } from '../types';
import { SITE_URL } from '../data/program';
import { formatDate, formatMoney, formatPoints } from '../lib/format';
import { confirmAction, haptic, openLink } from '../telegram';

interface Props {
  member: Member;
  program: Program;
  onRedeem: (reward: Reward) => Promise<void>;
}

const STATUS_LABEL: Record<IssuedPromocode['status'], string> = {
  active: '',
  used: 'Использован',
  expired: 'Истёк',
};

export default function Redeem({ member, program, onRedeem }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const disabled = member.isBlocked || !program.isEnabled;
  const active = member.promocodes.filter((p) => p.status === 'active');
  const past = member.promocodes.filter((p) => p.status !== 'active');

  async function redeem(reward: Reward) {
    haptic();
    const ok = await confirmAction(
      `Обменять ${formatPoints(reward.points)} на промокод на ${formatMoney(reward.discount)}?`,
    );
    if (!ok) return;
    setError(null);
    setBusy(reward.points);
    try {
      await onRedeem(reward);
      haptic('success');
    } catch (err) {
      haptic('error');
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
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

      {active.length > 0 && (
        <section className="codes">
          {active.map((p) => (
            <div key={p.code} className="code">
              <span className="code__label">Ваш промокод на {formatMoney(p.discount)}</span>
              <button className="code__value" onClick={() => copy(p.code)}>
                {p.code}
                <span className="code__copy">{copied === p.code ? 'Скопировано ✓' : 'Скопировать'}</span>
              </button>
              <span className="code__hint">
                Введите при оформлении заказа{p.minOrder ? ` от ${formatMoney(p.minOrder)}` : ''}
                {p.validUntil ? ` · до ${formatDate(p.validUntil)}` : ''}
              </span>
            </div>
          ))}
          <button className="button button--secondary" onClick={() => openLink(`${SITE_URL}/catalog`)}>
            Выбрать мебель на сайте
          </button>
        </section>
      )}

      {error && <p className="notice notice--error">{error}</p>}
      {disabled && <p className="notice">Обмен баллов сейчас недоступен.</p>}

      {program.rewards.length === 0 ? (
        <p className="empty">Варианты обмена скоро появятся.</p>
      ) : (
        <ul className="rewards">
          {program.rewards.map((r) => {
            const lack = r.points - member.balance;
            return (
              <li key={r.points} className="reward">
                <div className="reward__info">
                  <span className="reward__discount">Скидка {formatMoney(r.discount)}</span>
                  <span className="reward__condition">
                    {r.minOrder ? `на заказ от ${formatMoney(r.minOrder)}` : 'на любой заказ'}
                  </span>
                </div>
                <button
                  className="button button--small"
                  disabled={disabled || lack > 0 || busy !== null}
                  onClick={() => redeem(r)}
                >
                  {busy === r.points ? 'Обмениваем…' : lack > 0 ? `Ещё ${formatPoints(lack)}` : formatPoints(r.points)}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {past.length > 0 && (
        <ul className="list">
          {past.map((p) => (
            <li key={p.code} className="row row--pending">
              <span className="row__icon">🎟</span>
              <span className="row__body">
                <span className="row__title">
                  {p.code} · {formatMoney(p.discount)}
                </span>
                <span className="row__date">{STATUS_LABEL[p.status]}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="note">
        Промокод одноразовый и действует {program.promocodeValidDays} дней. Баллы сгорают через{' '}
        {program.pointsLifetimeMonths} месяцев после начисления.
      </p>
    </div>
  );
}
