import type { Program } from '../types';
import { getLevel } from '../data/program';
import { formatMoney } from '../lib/format';

export default function Levels({ program, totalSpent }: { program: Program; totalSpent: number }) {
  const current = getLevel(program, totalSpent);
  const levels = [...program.levels].sort((a, b) => a.minSpent - b.minSpent);

  return (
    <div className="screen">
      <h1 className="title">Уровни и правила</h1>
      <p className="subtitle">Ваши покупки за всё время: {formatMoney(totalSpent)}</p>

      <ul className="levels">
        {levels.map((l) => (
          <li key={l.code} className={`level ${l.code === current.code ? 'level--current' : ''}`}>
            <div className="level__head">
              <span className="level__name">{l.name}</span>
              {l.code === current.code ? (
                <span className="level__badge">Ваш уровень</span>
              ) : (
                <span className="level__from">{l.minSpent ? `от ${formatMoney(l.minSpent)}` : 'сразу'}</span>
              )}
            </div>
            <ul className="level__perks">
              {(l.perks.length ? l.perks : [`${l.cashbackPercent}% от заказа баллами`]).map((p) => (
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
          <li>Уровень растёт от суммы всех выполненных заказов.</li>
          <li>Баллы действуют {program.pointsLifetimeMonths} месяцев с момента начисления.</li>
        </ol>
      </section>
    </div>
  );
}
