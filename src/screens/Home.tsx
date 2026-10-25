import type { Member } from '../types';
import { PROGRAM, getLevel, getNextLevel } from '../data/program';
import { formatMoney, formatPoints, pointsWord } from '../lib/format';
import { openLink } from '../telegram';
import type { Screen } from '../App';

interface Props {
  member: Member;
  onNavigate: (screen: Screen) => void;
}

export default function Home({ member, onNavigate }: Props) {
  const level = getLevel(member.totalSpent);
  const next = getNextLevel(level.id);
  const progress = next
    ? Math.min(100, ((member.totalSpent - level.minSpent) / (next.minSpent - level.minSpent)) * 100)
    : 100;

  return (
    <div className="screen">
      <header className="greeting">
        <span className="greeting__hello">Здравствуйте, {member.firstName}!</span>
        <span className="greeting__program">{PROGRAM.name}</span>
      </header>

      <section className={`card card--${level.id}`}>
        <div className="card__top">
          <span className="card__level">{level.name}</span>
          <span className="card__cashback">{level.cashbackPercent}% баллами</span>
        </div>
        <div className="card__balance">
          <span className="card__balance-value">{member.balance.toLocaleString('ru-RU')}</span>
          <span className="card__balance-label">{pointsWord(member.balance)} · 1 балл = 1 BYN</span>
        </div>
        {member.pending > 0 && (
          <div className="card__pending">+{formatPoints(member.pending)} начислим после выполнения заказа</div>
        )}
      </section>

      <button className="tile" onClick={() => onNavigate('levels')}>
        {next ? (
          <>
            <div className="tile__row">
              <span>До уровня «{next.name}»</span>
              <strong>{formatMoney(next.minSpent - member.totalSpent)}</strong>
            </div>
            <div className="progress">
              <div className="progress__bar" style={{ width: `${progress}%` }} />
            </div>
            <span className="tile__hint">
              На «{next.name}» — {next.cashbackPercent}% баллами. Все уровни →
            </span>
          </>
        ) : (
          <div className="tile__row">
            <span>У вас максимальный уровень</span>
            <span className="tile__hint">Все уровни →</span>
          </div>
        )}
      </button>

      <div className="actions">
        <button className="button" onClick={() => onNavigate('redeem')}>
          Потратить баллы
        </button>
        <button className="button button--secondary" onClick={() => openLink(`${PROGRAM.siteUrl}/catalog`)}>
          Перейти в каталог
        </button>
      </div>
    </div>
  );
}
