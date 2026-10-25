import { tg } from './telegram';

export default function App() {
  const user = tg?.initDataUnsafe.user;

  return (
    <main className="app">
      <h1>Dilavia</h1>
      <p>{user ? `Привет, ${user.first_name}!` : 'Откройте приложение в Telegram'}</p>
    </main>
  );
}
