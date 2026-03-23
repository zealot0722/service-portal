// 工單 Context Provider — 管理所有工單的狀態
'use client';

import { useState, useCallback, ReactNode } from 'react';
import { Ticket, mockTickets } from '@/data/mock-tickets';
import { TicketContext } from '@/data/ticket-store';

export default function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);

  // 新增工單
  const addTicket = useCallback((ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  }, []);

  // 更新工單
  const updateTicket = useCallback((id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  return (
    <TicketContext.Provider value={{ tickets, setTickets, addTicket, updateTicket }}>
      {children}
    </TicketContext.Provider>
  );
}
