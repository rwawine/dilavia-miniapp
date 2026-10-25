import type { Member, Promo } from '../types';

/** Тестовые данные до подключения к админке. */
export const MOCK_MEMBER: Member = {
  firstName: 'Анна',
  phone: '+375 29 *** ** 71',
  balance: 137,
  pending: 74,
  totalSpent: 2650,
  promocodes: [],
  transactions: [
    { id: 't6', type: 'pending', points: 74, title: 'Заказ №1087 — ожидает выполнения', date: '2026-10-21' },
    { id: 't5', type: 'earn', points: 52, title: 'Заказ №1043', date: '2026-09-14' },
    { id: 't4', type: 'spend', points: -50, title: 'Обмен на промокод 50 BYN', date: '2026-08-30' },
    { id: 't3', type: 'earn', points: 75, title: 'Заказ №0988', date: '2026-07-02' },
    { id: 't2', type: 'bonus', points: 30, title: 'Бонус в день рождения', date: '2026-05-11' },
    { id: 't1', type: 'bonus', points: 20, title: 'Бонус за регистрацию', date: '2026-04-03' },
    { id: 't0', type: 'earn', points: 10, title: 'Заказ №0901', date: '2026-04-03' },
  ],
};

export const MOCK_PROMOS: Promo[] = [
  {
    id: 'p1',
    title: 'Двойные баллы на угловые диваны',
    description: 'Оформите угловой диван до конца месяца — начислим в 2 раза больше баллов.',
    badge: '×2',
    until: '2026-10-31',
  },
  {
    id: 'p2',
    title: '+50 баллов за отзыв',
    description: 'Оставьте отзыв о покупке на сайте с фото — начислим 50 баллов после проверки.',
    badge: '+50',
  },
  {
    id: 'p3',
    title: 'Приведи друга',
    description: 'Друг получит 20 баллов, а вы — 100 баллов после его первого заказа.',
    badge: '+100',
  },
];
