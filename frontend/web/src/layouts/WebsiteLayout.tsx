import { Outlet } from 'react-router-dom';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function WebsiteLayout() {
  return (
    <div className="min-h-[100dvh] flex flex-col">
      <Navigation />
      <main className="flex-1 w-full relative">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
