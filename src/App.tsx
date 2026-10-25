import { useEffect, useState } from 'react';
import type { IssuedPromocode, Member, Reward } from './types';
import { MOCK_MEMBER, MOCK_PROMOS } from './data/mock';
import { haptic, showBackButton, tg } from './telegram';
import Home from './screens/Home';
import History from './screens/History';
import Redeem from './screens/Redeem';
import Levels from './screens/Levels';
import Promos from './screens/Promos';

export type Screen = 'home' | 'history' | 'redeem' | 'promos' | 'levels';

const TABS: { id: Screen; label: string; icon: string }[] = [
  { id: 'home', label: 'Карта', icon: '💳' },
  { id: 'history', label: 'Баллы', icon: '📋' },
  { id: 'redeem', label: 'Обмен', icon: '🎟' },
  { id: 'promos', label: 'Акции', icon: '🔥' },
];

const PROMOCODE_DAYS = 30;

function generateCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const random = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]);
  return `DLV-${random.join('')}`;
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [member, setMember] = useState<Member>(() => ({
    ...MOCK_MEMBER,
    firstName: tg?.initDataUnsafe.user?.first_name ?? MOCK_MEMBER.firstName,
  }));

  // «Уровни» — вложенный экран: в Telegram показываем системную кнопку «Назад».
  useEffect(() => {
    if (screen !== 'levels') return;
    return showBackButton(() => setScreen('home'));
  }, [screen]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  function navigate(next: Screen) {
    if (next !== screen) haptic();
    setScreen(next);
  }

  // Пока без сервера: списываем баллы и выдаём промокод локально.
  function redeem(reward: Reward): IssuedPromocode {
    const validUntil = new Date(Date.now() + PROMOCODE_DAYS * 86_400_000).toISOString();
    const promocode: IssuedPromocode = {
      code: generateCode(),
      discount: reward.discount,
      minOrder: reward.minOrder,
      validUntil,
    };
    setMember((m) => ({
      ...m,
      balance: m.balance - reward.points,
      promocodes: [promocode, ...m.promocodes],
      transactions: [
        {
          id: promocode.code,
          type: 'spend',
          points: -reward.points,
          title: `Обмен на промокод ${reward.discount} BYN`,
          date: new Date().toISOString(),
        },
        ...m.transactions,
      ],
    }));
    return promocode;
  }

  const activeTab = screen === 'levels' ? 'home' : screen;

  return (
    <div className="app">
      <main className="app__content">
        {screen === 'home' && <Home member={member} onNavigate={navigate} />}
        {screen === 'history' && <History member={member} />}
        {screen === 'redeem' && <Redeem member={member} onRedeem={redeem} />}
        {screen === 'promos' && <Promos promos={MOCK_PROMOS} />}
        {screen === 'levels' && <Levels totalSpent={member.totalSpent} />}
      </main>

      <nav className="tabbar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tabbar__item ${activeTab === t.id ? 'tabbar__item--active' : ''}`}
            onClick={() => navigate(t.id)}
          >
            <span className="tabbar__icon">{t.icon}</span>
            <span className="tabbar__label">{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
