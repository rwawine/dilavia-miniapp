import type { Member, Transaction } from '../types';
import { formatDate, formatMoney, formatPoints } from '../lib/format';

function icon(t: Transaction): string {
  if (t.status === 'pending') return '⏳';
  switch (t.type) {
    case 'earn':
      return '🛋';
    case 'spend':
      return '🎟';
    case 'bonus':
      return '🎁';
    case 'expire':
      return '⌛';
    case 'referral':
      return '👥';
    case 'purchase':
      return '🧾';
    default:
      return '✏️';
  }
}

export default function History({ member }: { member: Member }) {
  return (
    <div className="screen">
      <h1 className="title">Мои баллы</h1>

      <div className="summary">
        <div className="summary__item">
          <span className="summary__value">{member.balance}</span>
          <span className="summary__label">доступно</span>
        </div>
        <div className="summary__item">
          <span className="summary__value summary__value--muted">{member.pendingPoints}</span>
          <span className="summary__label">в ожидании</span>
        </div>
      </div>

      {member.transactions.length === 0 ? (
        <p className="empty">Здесь появятся начисления и списания баллов.</p>
      ) : (
        <ul className="list">
          {member.transactions.map((t) => (
            <li key={t.id} className={`row ${t.status === 'pending' ? 'row--pending' : ''}`}>
              <span className="row__icon">{icon(t)}</span>
              <span className="row__body">
                <span className="row__title">
                  {t.title}
                  {t.status === 'pending' && ' — ожидает выполнения'}
                </span>
                <span className="row__date">{formatDate(t.date)}</span>
              </span>
              {t.points === 0 && t.amount != null ? (
                // Покупка без баллов (корректировка суммы покупок) — показываем сумму.
                <span className="row__points row__points--muted">
                  {t.amount > 0 ? '+' : '−'}
                  {formatMoney(Math.abs(t.amount))}
                </span>
              ) : (
                <span className={`row__points ${t.points < 0 ? 'row__points--minus' : ''}`}>
                  {t.points > 0 ? '+' : '−'}
                  {formatPoints(Math.abs(t.points))}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
