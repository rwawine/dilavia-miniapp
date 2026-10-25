function plural(n: number, one: string, few: string, many: string): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export const pointsWord = (n: number) => plural(n, 'балл', 'балла', 'баллов');

export const formatPoints = (n: number) => `${n.toLocaleString('ru-RU')} ${pointsWord(n)}`;

export const formatMoney = (n: number) => `${n.toLocaleString('ru-RU')} BYN`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
