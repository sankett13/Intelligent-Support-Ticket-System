export function listenToAIStream(
  ticketId: number,
  onToken: (token: string) => void,
  onDone: () => void
) {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "http://localhost:3000";

  const url = `${API_URL}/stream/tickets/${ticketId}/stream`;
  console.log("🔌 Connecting to SSE stream:", url);

  const eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log("✅ SSE connection established");
  };

  eventSource.onmessage = (event) => {
    console.log("📨 SSE message received:", event.data);

    try {
      const data = JSON.parse(event.data);

      if (data.done) {
        console.log("✅ Stream completed");
        eventSource.close();
        onDone();
      } else if (data.token) {
        onToken(data.token);
      }
    } catch (err) {
      console.error("Error parsing SSE message:", err);
    }
  };

  eventSource.onerror = (error) => {
    console.error("❌ SSE error:", error);
    eventSource.close();
  };

  return eventSource;
}
