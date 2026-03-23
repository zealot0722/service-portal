// 工單狀態管理（使用 React Context，純前端 mock）
'use client';

import { createContext, useContext } from 'react';
import { Ticket, mockTickets } from './mock-tickets';

/** 工單 Store Context 型別 */
export interface TicketStore {
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  addTicket: (ticket: Ticket) => void;
  updateTicket: (id: string, updates: Partial<Ticket>) => void;
}

export const TicketContext = createContext<TicketStore>({
  tickets: mockTickets,
  setTickets: () => {},
  addTicket: () => {},
  updateTicket: () => {},
});

export const useTickets = () => useContext(TicketContext);
