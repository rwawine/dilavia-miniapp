import { useState } from 'react';
import type { InvitedFriend, Member } from '../types';
import { formatDate, formatPoints } from '../lib/format';
import { haptic, shareLink } from '../telegram';

const STATUS: Record<InvitedFriend['status'], { label: string; className: string }> = {
  waiting: { label: 'Ждём первый заказ', className: '' },
  pending: { label: 'Заказ в работе — бонус в ожидании', className: 'friend__status--pending' },
  completed: { label: 'Бонус начислен', className: 'friend__status--done' },
};

export default function Invite({ member }: { member: Member }) {
  const [copied, setCopied] = useState(false);
  const { link, bonus, friends } = member.referral;
  const earned = friends.filter((f) => f.status === 'completed').reduce((sum, f) => sum + (f.points ?? 0), 0);

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      haptic('success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Скопируйте ссылку', link);
    }
  }

  function share() {
    if (!link) return;
    haptic();
    shareLink(link, 'Дарю вступление в Dilavia Club — баллы за покупку мебели Dilavia 🛋');
  }

  return (
    <div className="screen">
      <h1 className="title">Пригласить друга</h1>

      {!link ? (
        <p className="notice">Программа приглашений сейчас не работает.</p>
      ) : (
        <>
          <section className="invite">
            <span className="invite__bonus">+{formatPoints(bonus)}</span>
            <span className="invite__text">
              за каждого друга, который вступит по вашей ссылке и оформит первый заказ
            </span>
          </section>

          <ol className="steps">
            <li>Отправьте другу ссылку.</li>
            <li>Друг открывает её в Telegram и вступает в программу.</li>
            <li>Когда его первый заказ выполнен — {formatPoints(bonus)} на вашу карту.</li>
          </ol>

          <div className="actions">
            <button className="button" onClick={share}>
              Отправить приглашение
            </button>
            <button className="button button--secondary" onClick={copy}>
              {copied ? 'Ссылка скопирована ✓' : 'Скопировать ссылку'}
            </button>
          </div>
        </>
      )}

      <section className="friends">
        <div className="friends__head">
          <h2 className="rules__title">Мои друзья</h2>
          {earned > 0 && <span className="friends__earned">заработано {formatPoints(earned)}</span>}
        </div>
        {friends.length === 0 ? (
          <p className="empty">Здесь появятся друзья, которые вступили по вашей ссылке.</p>
        ) : (
          <ul className="list">
            {friends.map((f, i) => (
              <li key={`${f.firstName}-${i}`} className="row">
                <span className="row__icon">👤</span>
                <span className="row__body">
                  <span className="row__title">{f.firstName}</span>
                  <span className={`row__date friend__status ${STATUS[f.status].className}`}>
                    {STATUS[f.status].label} · с {formatDate(f.joinedAt)}
                  </span>
                </span>
                {f.points != null && f.status !== 'waiting' && (
                  <span className={`row__points ${f.status === 'pending' ? 'row__points--muted' : ''}`}>
                    +{formatPoints(f.points)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
