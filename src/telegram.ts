// Minimal typings for the Telegram WebApp object injected by telegram-web-app.js.
// Extend as needed: https://core.telegram.org/bots/webapps

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

interface BackButton {
  show(): void;
  hide(): void;
  onClick(cb: () => void): void;
  offClick(cb: () => void): void;
}

interface HapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
  notificationOccurred(type: 'error' | 'success' | 'warning'): void;
  selectionChanged(): void;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: { user?: TelegramUser };
  colorScheme: 'light' | 'dark';
  version: string;
  ready(): void;
  expand(): void;
  isVersionAtLeast(version: string): boolean;
  openLink(url: string): void;
  showConfirm(message: string, cb: (ok: boolean) => void): void;
  requestContact(cb: (shared: boolean, result?: { status?: string; response?: string }) => void): void;
  BackButton: BackButton;
  HapticFeedback: HapticFeedback;
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebApp };
  }
}

export const tg = window.Telegram?.WebApp;

/** Открыто ли приложение внутри Telegram (скрипт есть и в обычном браузере, но без initData). */
export const insideTelegram = Boolean(tg?.initData);

const supports = (version: string) => insideTelegram && tg!.isVersionAtLeast(version);

export function haptic(kind: 'tap' | 'success' | 'error' = 'tap') {
  if (!supports('6.1')) return;
  if (kind === 'tap') tg!.HapticFeedback.impactOccurred('light');
  else tg!.HapticFeedback.notificationOccurred(kind);
}

export function confirmAction(message: string): Promise<boolean> {
  if (!supports('6.2')) return Promise.resolve(window.confirm(message));
  return new Promise((resolve) => tg!.showConfirm(message, resolve));
}

export function openLink(url: string) {
  if (insideTelegram) tg!.openLink(url);
  else window.open(url, '_blank', 'noopener');
}

export type ContactResult =
  | { ok: true; signed: string }
  | { ok: false; reason: 'cancelled' | 'unsupported' };

/**
 * Просит пользователя поделиться номером. Возвращает строку, подписанную Telegram:
 * сервер проверяет подпись, поэтому номер нельзя подделать.
 */
export function requestPhone(): Promise<ContactResult> {
  if (!supports('6.9')) return Promise.resolve({ ok: false, reason: 'unsupported' });
  return new Promise((resolve) => {
    tg!.requestContact((shared, result) => {
      if (!shared) return resolve({ ok: false, reason: 'cancelled' });
      // Старые клиенты Telegram не возвращают подписанный ответ — только отправляют контакт боту.
      if (!result?.response) return resolve({ ok: false, reason: 'unsupported' });
      resolve({ ok: true, signed: result.response });
    });
  });
}

/** Кнопка «Назад» в шапке Telegram. Возвращает функцию отписки. */
export function showBackButton(onBack: () => void): () => void {
  if (!supports('6.1')) return () => {};
  tg!.BackButton.onClick(onBack);
  tg!.BackButton.show();
  return () => {
    tg!.BackButton.offClick(onBack);
    tg!.BackButton.hide();
  };
}
