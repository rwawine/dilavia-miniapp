import { useCallback, useEffect, useState } from 'react';
import type { IssuedPromocode, Member, Program, Reward } from './types';
import { MOCK_MEMBER, MOCK_PROMOS } from './data/mock';
import { DEFAULT_PROGRAM } from './data/program';
import { fetchMe, redeem as redeemApi, register, setReferrer as setReferrerApi } from './api';
import { haptic, insideTelegram, showBackButton, tg } from './telegram';
import Home from './screens/Home';
import History from './screens/History';
import Redeem from './screens/Redeem';
import Levels from './screens/Levels';
import Promos from './screens/Promos';
import Onboarding from './screens/Onboarding';
import Invite from './screens/Invite';
import Orders from './screens/Orders';
import Privacy from './screens/Privacy';

export type Screen = 'home' | 'history' | 'order' | 'redeem' | 'promos' | 'levels' | 'invite' | 'privacy';

/** Экраны, которые открываются кнопкой в сообщении бота: ?screen=order. */
function startScreen(): Screen {
  const wanted = new URLSearchParams(window.location.search).get('screen');
  return wanted === 'order' || wanted === 'privacy' ? wanted : 'home';
}

const TABS: { id: Screen; label: string; icon: string }[] = [
  { id: 'home', label: 'Карта', icon: '💳' },
  { id: 'history', label: 'Баллы', icon: '📋' },
  { id: 'order', label: 'Мой заказ', icon: '📦' },
  { id: 'redeem', label: 'Обмен', icon: '🎟' },
  { id: 'promos', label: 'Акции', icon: '🔥' },
];

/** Вне Telegram — демо на тестовых данных, чтобы можно было посмотреть экраны в браузере. */
const DEMO = !insideTelegram;

type State =
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'onboarding'; program: Program; invitedBy: string | null }
  | { kind: 'ready'; member: Member; program: Program };

function demoMember(): Member {
  return { ...MOCK_MEMBER, firstName: tg?.initDataUnsafe.user?.first_name ?? MOCK_MEMBER.firstName };
}

/** Демо-обмен: списываем баллы локально, промокод не настоящий. */
function demoRedeem(member: Member, program: Program, reward: Reward): Member {
  const code = `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const promocode: IssuedPromocode = {
    code,
    discount: reward.discount,
    minOrder: reward.minOrder,
    validUntil: new Date(Date.now() + program.promocodeValidDays * 86_400_000).toISOString(),
    status: 'active',
  };
  return {
    ...member,
    balance: member.balance - reward.points,
    promocodes: [promocode, ...member.promocodes],
    transactions: [
      {
        id: code,
        type: 'spend',
        status: 'completed',
        points: -reward.points,
        title: `Обмен на промокод ${reward.discount} BYN`,
        date: new Date().toISOString(),
      },
      ...member.transactions,
    ],
  };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>(startScreen);
  // Политика до вступления: человек ещё не участник, вкладок у него нет.
  const [privacyOpen, setPrivacyOpen] = useState(() => startScreen() === 'privacy');
  const [state, setState] = useState<State>(
    DEMO ? { kind: 'ready', member: demoMember(), program: DEFAULT_PROGRAM } : { kind: 'loading' },
  );

  const load = useCallback(async () => {
    if (DEMO) return;
    setState({ kind: 'loading' });
    try {
      const me = await fetchMe();
      setState(me.registered ? { kind: 'ready', member: me.member, program: me.program } : { kind: 'onboarding', program: me.program, invitedBy: me.invitedBy ?? null });
    } catch (err) {
      setState({ kind: 'error', message: (err as Error).message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // «Уровни», «Пригласить друга» и «Политика» — вложенные экраны: в Telegram показываем кнопку «Назад».
  const nested = screen === 'levels' || screen === 'invite' || screen === 'privacy';
  const onboardingPrivacy = state.kind === 'onboarding' && privacyOpen;
  useEffect(() => {
    if (onboardingPrivacy) return showBackButton(() => setPrivacyOpen(false));
    if (!nested) return;
    return showBackButton(() => setScreen('home'));
  }, [nested, onboardingPrivacy]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [screen]);

  function navigate(next: Screen) {
    if (next !== screen) haptic();
    setScreen(next);
  }

  async function join(signedContact: string, referrerCard?: string) {
    const me = await register(signedContact, referrerCard);
    if (me.registered) setState({ kind: 'ready', member: me.member, program: me.program });
  }

  async function setReferrer(card: string) {
    if (state.kind !== 'ready') return;
    if (DEMO) {
      const referral = { ...state.member.referral, invitedBy: 'Демо-друг', canSetReferrer: false };
      setState({ ...state, member: { ...state.member, referral } });
      return;
    }
    const me = await setReferrerApi(card);
    if (me.registered) setState({ kind: 'ready', member: me.member, program: me.program });
  }

  async function redeem(reward: Reward) {
    if (state.kind !== 'ready') return;
    if (DEMO) {
      setState({ ...state, member: demoRedeem(state.member, state.program, reward) });
      return;
    }
    const { member } = await redeemApi(reward.points);
    setState({ ...state, member });
  }

  if (state.kind === 'loading') {
    return (
      <div className="status">
        <div className="spinner" />
      </div>
    );
  }

  if (state.kind === 'error') {
    return (
      <div className="status">
        <p className="status__text">{state.message}</p>
        <button className="button" onClick={load}>
          Повторить
        </button>
      </div>
    );
  }

  if (state.kind === 'onboarding') {
    return (
      <main className="app__content app__content--bare">
        {privacyOpen ? (
          <Privacy />
        ) : (
          <Onboarding
            program={state.program}
            invitedBy={state.invitedBy}
            onContact={join}
            onPrivacy={() => setPrivacyOpen(true)}
          />
        )}
      </main>
    );
  }

  const { member, program } = state;
  const activeTab = nested ? 'home' : screen;

  return (
    <div className="app">
      {DEMO && <div className="demo-banner">Демо-режим: тестовые данные. Откройте приложение в Telegram.</div>}
      <main className="app__content">
        {screen === 'home' && <Home member={member} program={program} onNavigate={navigate} />}
        {screen === 'history' && <History member={member} />}
        {screen === 'order' && <Orders demo={DEMO} />}
        {screen === 'redeem' && <Redeem member={member} program={program} onRedeem={redeem} />}
        {screen === 'promos' && <Promos promos={DEMO ? MOCK_PROMOS : []} />}
        {screen === 'levels' && <Levels program={program} totalSpent={member.totalSpent} />}
        {screen === 'invite' && <Invite member={member} onSetReferrer={setReferrer} />}
        {screen === 'privacy' && <Privacy />}
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
