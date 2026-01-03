import ChatWindow from "@/components/ChatWindow";
import { fetchTickets } from "@/lib/api";

export default async function TicketChat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tickets = await fetchTickets();
  const ticket = tickets.find((t: any) => t.id === Number(id));

  return <ChatWindow ticketId={Number(id)} ticketTitle={ticket?.title || ""} />;
}
