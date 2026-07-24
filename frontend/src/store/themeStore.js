import { create } from 'zustand';

const getInitialTheme = () => {
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return true;
};

const useThemeStore = create((set) => ({
  dark: getInitialTheme(),
  toggle: () =>
    set((state) => {
      const next = !state.dark;
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return { dark: next };
    }),
}));

export default useThemeStore;
