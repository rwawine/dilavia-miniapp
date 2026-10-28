import { useCallback, useEffect, useRef, useState } from 'react';
import type { ProductionOrder, Stage } from '../types';
import { fetchOrders } from '../api';
import { MOCK_ORDERS, MOCK_STAGES } from '../data/mock';
import { formatDate } from '../lib/format';

/** Как часто обновляем этапы, пока вкладка открыта. */
const REFRESH_MS = 15_000;

function formatPlanned(date: string): string {
  return formatDate(`${date}T12:00:00`);
}

/** Ползунок этапов: заливка и цвет по текущему этапу, на последнем — галочка. */
function StageSlider({ stages, current }: { stages: Stage[]; current: number }) {
  const stage = stages[current];
  const percent = stages.length > 1 ? (current / (stages.length - 1)) * 100 : 100;
  return (
    <div className={`slider slider--${stage.tone}`} role="img" aria-label={`Этап ${current + 1} из ${stages.length}: ${stage.title}`}>
      <div className="slider__track">
        <div className="slider__fill" style={{ width: `${percent}%` }} />
        <div className="slider__knob" style={{ left: `${percent}%` }}>
          {stage.done && '✓'}
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, stages }: { order: ProductionOrder; stages: Stage[] }) {
  const index = Math.max(0, stages.findIndex((s) => s.code === order.stage));
  const stage = stages[index];
  const reachedAt = new Map(order.history.map((h) => [h.stage, h.at]));

  return (
    <section className="order">
      <header className="order__head">
        <div className="order__thumb">{order.image ? <img src={order.image} alt="" /> : '🛋'}</div>
        <div className="order__titles">
          <h2 className="order__title">{order.title}</h2>
          {order.orderNumber && <span className="order__number">Заказ №{order.orderNumber}</span>}
        </div>
      </header>

      <StageSlider stages={stages} current={index} />

      <div className="order__now">
        <span className={`badge badge--${stage.tone}`}>{stage.done ? '✓ ' : ''}{stage.title}</span>
        <span className="order__step">
          этап {index + 1} из {stages.length}
        </span>
      </div>
      <p className="order__hint">{stage.hint}</p>

      {order.note && <p className="notice notice--accent">💬 {order.note}</p>}
      {order.plannedDate && !stage.done && (
        <p className="order__planned">Планируемая дата готовности: {formatPlanned(order.plannedDate)}</p>
      )}

      <ol className="steps">
        {stages.map((s, i) => {
          const state = i < index || (i === index && s.done) ? 'done' : i === index ? 'current' : 'next';
          const at = reachedAt.get(s.code);
          return (
            <li key={s.code} className={`steps__item steps__item--${state}`}>
              <span className={`steps__dot steps__dot--${s.tone}`}>{state === 'done' ? '✓' : ''}</span>
              <span className="steps__title">{s.title}</span>
              {at && state !== 'next' && <span className="steps__date">{formatDate(at)}</span>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export default function Orders({ demo }: { demo: boolean }) {
  const [data, setData] = useState<{ orders: ProductionOrder[]; stages: Stage[] } | null>(
    demo ? { orders: MOCK_ORDERS, stages: MOCK_STAGES } : null,
  );
  const [error, setError] = useState<string | null>(null);
  const busy = useRef(false);

  const load = useCallback(async () => {
    if (demo || busy.current) return;
    busy.current = true;
    try {
      const res = await fetchOrders();
      setData({ orders: res.orders, stages: res.stages });
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      busy.current = false;
    }
  }, [demo]);

  // Этапы меняет менеджер в админке — подтягиваем изменения, пока экран открыт.
  useEffect(() => {
    load();
    const timer = window.setInterval(() => {
      if (!document.hidden) load();
    }, REFRESH_MS);
    const onVisible = () => {
      if (!document.hidden) load();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [load]);

  return (
    <div className="screen">
      <h1 className="title">Мой заказ</h1>

      {!data && !error && (
        <div className="status status--inline">
          <div className="spinner" />
        </div>
      )}
      {error && !data && <p className="notice notice--error">{error}</p>}

      {data && data.orders.length === 0 && (
        <p className="empty">
          Здесь появится ваш заказ, когда мы начнём его изготовление. Следим за каждым этапом и сообщим вам в Telegram.
          <br />
          <br />
          Не видите свой заказ? Мы ищем его по номеру телефона, который вы указали при оформлении.
        </p>
      )}

      {data?.orders.map((o) => <OrderCard key={o.id} order={o} stages={data.stages} />)}
    </div>
  );
}
