import React, { createContext, useCallback, useContext, useState } from 'react';

const DEFAULT_ACCENT = '#E8C36B';
interface ThemeCtx { accent: string; setAccent: (hex: string) => void; resetAccent: () => void; }
const Ctx = createContext<ThemeCtx>({ accent: DEFAULT_ACCENT, setAccent: () => {}, resetAccent: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accent, setAccentState] = useState(DEFAULT_ACCENT);
  const setAccent = useCallback((hex: string) => {
    setAccentState(hex);
    document.documentElement.style.setProperty('--accent', hex);
  }, []);
  const resetAccent = useCallback(() => setAccent(DEFAULT_ACCENT), [setAccent]);
  return <Ctx.Provider value={{ accent, setAccent, resetAccent }}>{children}</Ctx.Provider>;
};
export const useTheme = () => useContext(Ctx);
export { DEFAULT_ACCENT };
