import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

export function PublicLayout() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className={isHome ? '' : 'flex-1'}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
