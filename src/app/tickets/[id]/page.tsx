// Server Component — 處理靜態匯出 + 渲染 Client Detail
import { mockTickets } from '@/data/mock-tickets';
import TicketDetail from '@/components/TicketDetail';

export function generateStaticParams() {
  return mockTickets.map((t) => ({ id: t.id }));
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const ticketId = decodeURIComponent(params.id);
  return <TicketDetail ticketId={ticketId} />;
}
