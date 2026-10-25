import type { Level, Program } from '../types';
import { pointsWord } from '../lib/format';

export type Metal = 'bronze' | 'silver' | 'gold';

/** Металл карты по уровню: base/silver/gold, а для своих кодов — по месту уровня. */
export function metalFor(program: Program, level: Level): Metal {
  if (level.code === 'gold') return 'gold';
  if (level.code === 'silver') return 'silver';
  if (level.code === 'base' || level.code === 'bronze') return 'bronze';
  const index = [...program.levels].sort((a, b) => a.minSpent - b.minSpent).findIndex((l) => l.code === level.code);
  return index <= 0 ? 'bronze' : index === 1 ? 'silver' : 'gold';
}

interface Props {
  metal: Metal;
  levelName: string;
  cashbackPercent: number;
  balance: number;
  cardNumber?: string;
}

/** Металлическая карта участника: грани, блёстки, блик, чип и надпись DILAVIA. */
export default function LoyaltyCard({ metal, levelName, cashbackPercent, balance, cardNumber }: Props) {
  return (
    <section className={`lcard lcard--${metal}`} aria-label={`Карта ${levelName}, ${balance} ${pointsWord(balance)}`}>
      <span className="lcard__glow" aria-hidden />
      <span className="lcard__facet lcard__facet--dark" aria-hidden />
      <span className="lcard__facet lcard__facet--light" aria-hidden />
      <span className="lcard__glitter" aria-hidden />
      <span className="lcard__sheen" aria-hidden />

      <div className="lcard__content">
        <div className="lcard__top">
          <span className="lcard__brand">DILAVIA</span>
          <span className="lcard__level">{levelName}</span>
        </div>

        <div className="lcard__middle">
          <span className="lcard__chip" aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <div className="lcard__balance">
            <span className="lcard__balance-value">{balance.toLocaleString('ru-RU')}</span>
            <span className="lcard__balance-label">{pointsWord(balance)}</span>
          </div>
        </div>

        <div className="lcard__bottom">
          <span className="lcard__number">{cardNumber ? `№ ${cardNumber}` : ''}</span>
          <span className="lcard__cashback">{cashbackPercent}% баллами</span>
        </div>
      </div>
    </section>
  );
}
