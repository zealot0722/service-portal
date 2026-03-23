// 客戶端佈局包裝 — 包含 TicketProvider 與 Sidebar
'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TicketProvider from './TicketProvider';

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <TicketProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-slate-50 overflow-auto">{children}</main>
      </div>
    </TicketProvider>
  );
}
