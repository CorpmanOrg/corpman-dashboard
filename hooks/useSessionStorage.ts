export const useStorage = () => {
  const isBrowser = typeof window !== "undefined";

  const setSessionStorage = (key: string, value: unknown): void => {
    if (!isBrowser) return;
    sessionStorage.setItem(`__${key}`, JSON.stringify(value));
  };

  const getSessionStorage = <T = unknown>(key: string): T | null => {
    if (!isBrowser) return null;
    const item = sessionStorage.getItem(`__${key}`);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      return null;
    }
  };

  const removeSessionItem = (key: string): void => {
    if (!isBrowser) return;
    sessionStorage.removeItem(`__${key}`);
  };

  const clearSessionItem = (): void => {
    if (!isBrowser) return;
    sessionStorage.clear();
  };

  const setLocalStorage = (key: string, value: unknown): void => {
    if (!isBrowser) return;
    localStorage.setItem(`__${key}`, JSON.stringify(value));
  };

  const getLocalStorage = <T = unknown>(key: string): T | null => {
    if (!isBrowser) return null;
    const item = localStorage.getItem(`__${key}`);
    if (!item) return null;
    try {
      return JSON.parse(item) as T;
    } catch (error) {
      return null;
    }
  };

  const removeLocalItem = (key: string): void => {
    if (!isBrowser) return;
    localStorage.removeItem(`__${key}`);
  };

  const clearLoaclItem = (): void => {
    if (!isBrowser) return;

    localStorage.clear();
  };

  return {
    setSessionStorage,
    getSessionStorage,
    removeSessionItem,
    clearSessionItem,
    setLocalStorage,
    getLocalStorage,
    removeLocalItem,
    clearLoaclItem,
  };
};
