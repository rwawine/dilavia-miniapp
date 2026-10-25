import { LEVELS, PROGRAM, getLevel } from '../data/program';
import { formatMoney } from '../lib/format';

export default function Levels({ totalSpent }: { totalSpent: number }) {
  const current = getLevel(totalSpent);

  return (
    <div className="screen">
      <h1 className="title">Уровни и правила</h1>
      <p className="subtitle">Ваши покупки за всё время: {formatMoney(totalSpent)}</p>

      <ul className="levels">
        {LEVELS.map((l) => (
          <li key={l.id} className={`level level--${l.id} ${l.id === current.id ? 'level--current' : ''}`}>
            <div className="level__head">
              <span className="level__name">{l.name}</span>
              {l.id === current.id ? (
                <span className="level__badge">Ваш уровень</span>
              ) : (
                <span className="level__from">{l.minSpent ? `от ${formatMoney(l.minSpent)}` : 'сразу'}</span>
              )}
            </div>
            <ul className="level__perks">
              {l.perks.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <section className="rules">
        <h2 className="rules__title">Как это работает</h2>
        <ol className="rules__list">
          <li>Оформляйте заказы на сайте с тем же номером телефона, что в Telegram.</li>
          <li>Когда заказ выполнен, баллы начисляются автоматически — процент зависит от уровня.</li>
          <li>1 балл = 1 BYN. Обменивайте баллы на промокод и применяйте его на сайте.</li>
          <li>Уровень растёт от суммы всех выполненных заказов и не сгорает.</li>
          <li>Баллы действуют {PROGRAM.pointsLifetimeMonths} месяцев с момента начисления.</li>
        </ol>
      </section>
    </div>
  );
}
