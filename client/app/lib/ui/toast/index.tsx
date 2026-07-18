"use client";

import { useEffect, useRef } from "react";
import type { ToastItem, ToastPosition } from "@contexts/home.context";
import { XCircle, TriangleAlert, X } from "lucide-react";
import Button from "@ui/button";
import "./styles.scss";

const POSITIONS: ToastPosition[] = ["top-right", "top-left"];

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <>
      {POSITIONS.map((pos) => {
        const group = toasts.filter((t) => t.position === pos);
        if (group.length === 0) return null;
        return (
          <div key={pos} className={`toast-container toast-container--${pos}`}>
            {group.map((toast) => (
              <SingleToast key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
          </div>
        );
      })}
    </>
  );
}

interface SingleToastProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const TOAST_ICON = {
  error: XCircle,
  warning: TriangleAlert,
} as const;

function SingleToast({ toast, onRemove }: SingleToastProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const ToastIcon = TOAST_ICON[toast.type];

  useEffect(() => {
    const el = progressRef.current;
    if (!el) return;
    el.style.animationDuration = `${toast.duration}ms`;
  }, [toast.duration]);

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast-icon">
        <ToastIcon size={18} />
      </span>
      <div className="toast-body">
        <p className="toast-message">{toast.message}</p>
      </div>
      <Button className="toast-close" onClick={() => onRemove(toast.id)}>
        <X size={12} />
      </Button>
      <div ref={progressRef} className="toast-progress" />
    </div>
  );
}
