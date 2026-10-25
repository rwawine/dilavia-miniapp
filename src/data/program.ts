import type { Level, Program } from '../types';

export const SITE_URL = 'https://dilavia.by';

/**
 * Правила по умолчанию — для демо-режима вне Telegram.
 * Внутри Telegram правила приходят из админки вместе с профилем.
 */
export const DEFAULT_PROGRAM: Program = {
  name: 'Dilavia Club',
  isEnabled: true,
  pointsLifetimeMonths: 12,
  welcomeBonus: 20,
  birthdayBonus: 30,
  promocodeValidDays: 30,
  levels: [
    { code: 'base', name: 'Базовый', minSpent: 0, cashbackPercent: 3, perks: ['3% от заказа баллами', '20 баллов за вступление'] },
    { code: 'silver', name: 'Серебро', minSpent: 1500, cashbackPercent: 5, perks: ['5% от заказа баллами', '30 баллов в день рождения'] },
    {
      code: 'gold',
      name: 'Золото',
      minSpent: 4000,
      cashbackPercent: 7,
      perks: ['7% от заказа баллами', 'Бесплатная доставка по Минску', 'Ранний доступ к акциям'],
    },
  ],
  rewards: [
    { points: 50, discount: 50, minOrder: 500 },
    { points: 100, discount: 100, minOrder: 1000 },
    { points: 200, discount: 200, minOrder: 1800 },
  ],
};

const sorted = (program: Program) => [...program.levels].sort((a, b) => a.minSpent - b.minSpent);

export function getLevel(program: Program, totalSpent: number): Level {
  const levels = sorted(program);
  return [...levels].reverse().find((l) => totalSpent >= l.minSpent) ?? levels[0];
}

export function getNextLevel(program: Program, code: string): Level | undefined {
  const levels = sorted(program);
  return levels[levels.findIndex((l) => l.code === code) + 1];
}
