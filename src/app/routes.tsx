import { createBrowserRouter, Outlet } from 'react-router';
import { BottomNav } from './components/BottomNav';
import RandomizerPage from './pages/RandomizerPage';
import CircuitsPage from './pages/CircuitsPage';
import InfoPage from './pages/InfoPage';
import LeaderboardPage from './pages/LeaderboardPage';

function Root() {
  return (
    <div className="fixed inset-0 flex justify-center items-start overflow-hidden bg-black">
      <div
        className="relative w-full max-w-[430px] h-full flex flex-col overflow-hidden"
        style={{ background: '#0f0c29' }}
      >
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: RandomizerPage },
      { path: 'circuits', Component: CircuitsPage },
      { path: 'scores', Component: LeaderboardPage },
      { path: 'info', Component: InfoPage },
    ],
  },
]);