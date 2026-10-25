export type LevelId = 'base' | 'silver' | 'gold';

export interface Level {
  id: LevelId;
  name: string;
  /** Сумма выполненных заказов (BYN), с которой открывается уровень. */
  minSpent: number;
  /** Процент от суммы заказа, который возвращается баллами. */
  cashbackPercent: number;
  perks: string[];
}

export interface Reward {
  id: string;
  points: number;
  /** Скидка в BYN по промокоду. */
  discount: number;
  /** Минимальная сумма заказа для применения промокода (BYN). */
  minOrder: number;
}

export type TransactionType = 'earn' | 'pending' | 'spend' | 'bonus' | 'expire';

export interface Transaction {
  id: string;
  type: TransactionType;
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
  minOrder: number;
  validUntil: string;
}

export interface Member {
  firstName: string;
  phone: string;
  balance: number;
  pending: number;
  /** Сумма выполненных заказов за всё время (BYN). */
  totalSpent: number;
  transactions: Transaction[];
  promocodes: IssuedPromocode[];
}
