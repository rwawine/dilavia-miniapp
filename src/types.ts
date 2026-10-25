export interface Level {
  /** Код уровня из админки (base, silver, gold…). */
  code: string;
  name: string;
  /** Сумма выполненных заказов (BYN), с которой открывается уровень. */
  minSpent: number;
  /** Процент от суммы заказа, который возвращается баллами. */
  cashbackPercent: number;
  perks: string[];
}

export interface Reward {
  points: number;
  /** Скидка в BYN по промокоду. */
  discount: number;
  /** Минимальная сумма заказа для применения промокода (BYN). */
  minOrder: number | null;
}

/** Правила программы — приходят из админки («Лояльность: настройки»). */
export interface Program {
  name: string;
  isEnabled: boolean;
  levels: Level[];
  rewards: Reward[];
  pointsLifetimeMonths: number;
  welcomeBonus: number;
  birthdayBonus: number;
  promocodeValidDays: number;
  /** Баллы за приглашённого друга (0 — программа приглашений выключена). */
  referralBonus: number;
}

export type TransactionType = 'earn' | 'spend' | 'bonus' | 'adjust' | 'expire' | 'referral';
export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  points: number;
  title: string;
  date: string;
}

export interface Promo {
  id: string;
  title: string;
  description: string;
  badge?: string;
  until?: string;
}

export interface IssuedPromocode {
  code: string;
  discount: number;
  minOrder: number | null;
  validUntil: string | null;
  status: 'active' | 'used' | 'expired';
}

export interface InvitedFriend {
  firstName: string;
  joinedAt: string;
  /** waiting — ждём первый заказ, pending — заказ в работе, completed — бонус начислен. */
  status: 'waiting' | 'pending' | 'completed';
  points: number | null;
}

export interface Referral {
  /** Ссылка-приглашение; null — программа приглашений выключена. */
  link: string | null;
  bonus: number;
  friends: InvitedFriend[];
}

export interface Member {
  firstName: string;
  /** Номер карты: «4821 3907». */
  cardNumber: string;
  phone: string;
  balance: number;
  pendingPoints: number;
  /** Сумма выполненных заказов за всё время (BYN). */
  totalSpent: number;
  level: string;
  isBlocked: boolean;
  transactions: Transaction[];
  promocodes: IssuedPromocode[];
  referral: Referral;
}
