import AppRoutes from './routes/AppRoutes';
import { useAuth } from './context/AuthContext';
import { FullPageSpinner } from './components/ui/Spinner';

export default function App() {
  const { initializing } = useAuth();
  if (initializing) return <FullPageSpinner />;
  return <AppRoutes />;
}
