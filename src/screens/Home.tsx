import type { Member, Program } from '../types';
import { SITE_URL, getLevel, getNextLevel } from '../data/program';
import { formatMoney, formatPoints, pointsWord } from '../lib/format';
import { openLink } from '../telegram';
import type { Screen } from '../App';

interface Props {
  member: Member;
  program: Program;
  onNavigate: (screen: Screen) => void;
}

export default function Home({ member, program, onNavigate }: Props) {
  const level = getLevel(program, member.totalSpent);
  const next = getNextLevel(program, level.code);
  const progress = next
    ? Math.min(100, ((member.totalSpent - level.minSpent) / (next.minSpent - level.minSpent)) * 100)
    : 100;

  return (
    <div className="screen">
      <header className="greeting">
        <span className="greeting__hello">
          {member.firstName ? `Здравствуйте, ${member.firstName}!` : 'Здравствуйте!'}
        </span>
        <span className="greeting__program">
          {program.name} · {member.phone}
        </span>
      </header>

      {member.isBlocked && (
        <p className="notice notice--error">Начисление баллов приостановлено. Обратитесь к менеджеру.</p>
      )}
      {!program.isEnabled && <p className="notice">Программа лояльности временно приостановлена.</p>}

      <section className={`card card--${level.code}`}>
        <div className="card__top">
          <span className="card__level">{level.name}</span>
          <span className="card__cashback">{level.cashbackPercent}% баллами</span>
        </div>
        <div className="card__balance">
          <span className="card__balance-value">{member.balance.toLocaleString('ru-RU')}</span>
          <span className="card__balance-label">{pointsWord(member.balance)} · 1 балл = 1 BYN</span>
        </div>
        {member.pendingPoints > 0 && (
          <div className="card__pending">
            +{formatPoints(member.pendingPoints)} начислим после выполнения заказа
          </div>
        )}
        {member.cardNumber && <div className="card__number">№ {member.cardNumber}</div>}
      </section>

      {member.referral.link && (
        <button className="tile tile--invite" onClick={() => onNavigate('invite')}>
          <div className="tile__row">
            <span>🎁 Пригласите друга</span>
            <strong>+{formatPoints(member.referral.bonus)}</strong>
          </div>
          <span className="tile__hint">
            {member.referral.canSetReferrer
              ? 'Вас самих пригласил друг? Укажите номер его карты →'
              : 'За первый заказ каждого друга — на вашу карту →'}
          </span>
        </button>
      )}

      <button className="tile" onClick={() => onNavigate('levels')}>
        {next ? (
          <>
            <div className="tile__row">
              <span>До уровня «{next.name}»</span>
              <strong>{formatMoney(Math.ceil(next.minSpent - member.totalSpent))}</strong>
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
        <button className="button button--secondary" onClick={() => openLink(`${SITE_URL}/catalog`)}>
          Перейти в каталог
        </button>
      </div>
    </div>
  );
}
