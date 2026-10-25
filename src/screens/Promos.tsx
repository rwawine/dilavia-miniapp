import type { Promo } from '../types';
import { formatDate } from '../lib/format';

export default function Promos({ promos }: { promos: Promo[] }) {
  return (
    <div className="screen">
      <h1 className="title">Акции</h1>
      {promos.length === 0 ? (
        <p className="empty">Скоро здесь появятся персональные предложения.</p>
      ) : (
        <ul className="promos">
          {promos.map((p) => (
            <li key={p.id} className="promo">
              {p.badge && <span className="promo__badge">{p.badge}</span>}
              <div className="promo__body">
                <span className="promo__title">{p.title}</span>
                <span className="promo__text">{p.description}</span>
                {p.until && <span className="promo__until">до {formatDate(p.until)}</span>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
