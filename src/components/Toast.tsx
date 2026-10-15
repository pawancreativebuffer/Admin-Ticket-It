"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";

// top-right success toast like vue-toast-notification (bootstrap theme) in New-Frontend
type Toast = { id: number; message: string };
const ToastContext = createContext<(message: string) => void>(() => {});

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const show = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message }]);
    setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 3000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="toast-stack" aria-live="polite">
        {toasts.map((toast) => (
          <div key={toast.id} className="toast-item">
            <i className="fa-solid fa-circle-check"></i>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
