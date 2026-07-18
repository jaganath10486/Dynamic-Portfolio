"use client";

import { useHome } from "@contexts/home.context";
import { ToastContainer } from "@ui/toast";

function LayoutComponent({ children }: { children: React.ReactNode }) {
  const { toasts, removeToast } = useHome();

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 w-full">
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutComponent>{children}</LayoutComponent>;
}
