const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3000";

// Tickets API
export async function fetchTickets() {
  const res = await fetch(`${API_URL}/tickets`, {
    method: "GET",
    cache: "no-cache",
  });
  const json = await res.json();
  return json.data || [];
}

export async function createTicket(title: string) {
  const res = await fetch(`${API_URL}/tickets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title }),
  });
  return res.json();
}

// Messages API
export async function fetchMessages(ticketId: number) {
  const res = await fetch(`${API_URL}/tickets/${ticketId}/messages`, {
    method: "GET",
    cache: "no-cache",
  });
  const json = await res.json();
  return json.data || [];
}

export async function sendMessage(ticketId: number, content: string) {
  const res = await fetch(`${API_URL}/tickets/${ticketId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  return res.json();
}
