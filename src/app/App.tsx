import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CircuitsProvider } from './context/CircuitsContext';
import { LeaderboardProvider } from './context/LeaderboardContext';

export default function App() {
  return (
    <CircuitsProvider>
      <LeaderboardProvider>
        <RouterProvider router={router} />
      </LeaderboardProvider>
    </CircuitsProvider>
  );
}