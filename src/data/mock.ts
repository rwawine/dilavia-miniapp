import type { Member, Promo } from '../types';

/** Демо-данные: показываются, когда приложение открыто не в Telegram. */
export const MOCK_MEMBER: Member = {
  firstName: 'Анна',
  cardNumber: '4821 3907',
  phone: '+375 29 *** ** 71',
  balance: 137,
  pendingPoints: 74,
  totalSpent: 2650,
  level: 'silver',
  isBlocked: false,
  promocodes: [],
  referral: {
    link: 'https://t.me/dilavia_club_bot?startapp=ref_48213907',
    bonus: 100,
    friends: [
      { firstName: 'Алексей', joinedAt: '2026-10-12', status: 'completed', points: 100 },
      { firstName: 'Марина', joinedAt: '2026-10-20', status: 'pending', points: 100 },
      { firstName: 'Ольга', joinedAt: '2026-10-23', status: 'waiting', points: null },
    ],
  },
  transactions: [
    { id: 't6', type: 'earn', status: 'pending', points: 74, title: 'Заказ №1087', date: '2026-10-21' },
    { id: 't7', type: 'referral', status: 'pending', points: 100, title: 'Бонус за друга: Марина (заказ №1090)', date: '2026-10-22' },
    { id: 't6r', type: 'referral', status: 'completed', points: 100, title: 'Бонус за друга: Алексей (заказ №1061)', date: '2026-10-15' },
    { id: 't5', type: 'earn', status: 'completed', points: 52, title: 'Заказ №1043', date: '2026-09-14' },
    { id: 't4', type: 'spend', status: 'completed', points: -50, title: 'Обмен на промокод 50 BYN', date: '2026-08-30' },
    { id: 't3', type: 'earn', status: 'completed', points: 75, title: 'Заказ №0988', date: '2026-07-02' },
    { id: 't2', type: 'bonus', status: 'completed', points: 30, title: 'Бонус в день рождения', date: '2026-05-11' },
    { id: 't1', type: 'bonus', status: 'completed', points: 20, title: 'Бонус за вступление в программу', date: '2026-04-03' },
    { id: 't0', type: 'earn', status: 'completed', points: 10, title: 'Заказ №0901', date: '2026-04-03' },
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
];
