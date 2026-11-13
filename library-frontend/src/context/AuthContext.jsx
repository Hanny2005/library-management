import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authService, AUTH_MODE } from '../services/authService';
import { setMockCurrentUser } from '../services/mockStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const applyUser = useCallback((u) => {
    setMockCurrentUser(u);
    setUser(u);
  }, []);

  useEffect(() => {
    let active = true;
    authService
      .getCurrentUser()
      .then((u) => active && applyUser(u))
      .finally(() => active && setInitializing(false));
    const unsubscribe = authService.onChange((u) => active && applyUser(u));
    return () => {
      active = false;
      unsubscribe();
    };
  }, [applyUser]);

  const signIn = useCallback(async (email, password) => {
    const u = await authService.signIn(email, password);
    applyUser(u);
    return u;
  }, [applyUser]);

  const signUp = useCallback(async (payload) => {
    const result = await authService.signUp(payload);
    if (result.user) applyUser(result.user);
    return result;
  }, [applyUser]);

  const signOut = useCallback(async () => {
    await authService.signOut();
    applyUser(null);
  }, [applyUser]);

  const value = useMemo(
    () => ({
      user,
      initializing,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'ADMIN',
      authMode: AUTH_MODE,
      signIn,
      signUp,
      signOut,
    }),
    [user, initializing, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth phải được dùng bên trong <AuthProvider>');
  return ctx;
}
