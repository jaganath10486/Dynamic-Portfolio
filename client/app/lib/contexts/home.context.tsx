"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

export type ToastType = "error" | "warning";

export type ToastPosition = "top-right" | "top-left";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
}

interface HomeContextValue {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const HomeContext = createContext<HomeContextValue | null>(null);

export function HomeProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const counter = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => removeToast(id), toast.duration);
    },
    [removeToast],
  );

  return (
    <HomeContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </HomeContext.Provider>
  );
}

const noopHomeContext: HomeContextValue = {
  toasts: [],
  addToast: () => {},
  removeToast: () => {},
};

export function useHome(): HomeContextValue {
  return useContext(HomeContext) ?? noopHomeContext;
}
