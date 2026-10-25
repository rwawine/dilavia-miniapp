import type { IssuedPromocode, Member, Program } from './types';
import { tg } from './telegram';

/** Адрес Strapi. Для локальной разработки: VITE_API_URL=http://localhost:1337/api */
const API_URL = (import.meta.env.VITE_API_URL ?? 'https://admin.dilavia.by/api').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(method: 'GET' | 'POST', path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        // Подпись Telegram: по ней сервер узнаёт пользователя.
        Authorization: `tma ${tg?.initData ?? ''}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'NETWORK', 'Нет связи с сервером. Проверьте интернет.');
  }
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.ok) {
    throw new ApiError(res.status, json?.code ?? 'UNKNOWN', json?.message ?? 'Что-то пошло не так. Попробуйте позже.');
  }
  return json as T;
}

export type MeResponse =
  | { registered: false; program: Program; invitedBy?: string | null }
  | { registered: true; member: Member; program: Program };

export const fetchMe = () => request<MeResponse>('GET', '/loyalty/me');

export const register = (contact: string) => request<MeResponse>('POST', '/loyalty/register', { contact });

export const redeem = (points: number) =>
  request<{ promocode: IssuedPromocode; member: Member }>('POST', '/loyalty/redeem', { points });
