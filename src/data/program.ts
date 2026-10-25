import type { Level, LevelId, Reward } from '../types';

/**
 * Правила программы по умолчанию. Позже будут приходить из админки
 * («Лояльность → Настройки программы») — здесь только стартовые значения.
 */
export const PROGRAM = {
  name: 'Dilavia Club',
  /** 1 балл = 1 BYN скидки. */
  pointValue: 1,
  /** Сколько месяцев действуют баллы. */
  pointsLifetimeMonths: 12,
  welcomeBonus: 20,
  birthdayBonus: 30,
  siteUrl: 'https://dilavia.by',
};

export const LEVELS: Level[] = [
  {
    id: 'base',
    name: 'Базовый',
    minSpent: 0,
    cashbackPercent: 3,
    perks: ['3% от заказа баллами', `${PROGRAM.welcomeBonus} баллов за регистрацию`],
  },
  {
    id: 'silver',
    name: 'Серебро',
    minSpent: 1500,
    cashbackPercent: 5,
    perks: ['5% от заказа баллами', `${PROGRAM.birthdayBonus} баллов в день рождения`],
  },
  {
    id: 'gold',
    name: 'Золото',
    minSpent: 4000,
    cashbackPercent: 7,
    perks: ['7% от заказа баллами', 'Бесплатная доставка по Минску', 'Ранний доступ к акциям'],
  },
];

export const REWARDS: Reward[] = [
  { id: 'r50', points: 50, discount: 50, minOrder: 500 },
  { id: 'r100', points: 100, discount: 100, minOrder: 1000 },
  { id: 'r200', points: 200, discount: 200, minOrder: 1800 },
];

export function getLevel(totalSpent: number): Level {
  return [...LEVELS].reverse().find((l) => totalSpent >= l.minSpent) ?? LEVELS[0];
}

export function getNextLevel(id: LevelId): Level | undefined {
  return LEVELS[LEVELS.findIndex((l) => l.id === id) + 1];
}
