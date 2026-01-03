"use client";

import { useEffect, useState, useRef } from "react";
import { fetchMessages, sendMessage } from "@/lib/api";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import TypingIndicator from "./TypingIndicator";
import Link from "next/link";

type Message = {
  id: number;
  role: "user" | "ai";
  content: string;
};

export default function ChatWindow({
  ticketId,
  ticketTitle,
}: {
  ticketId: number;
  ticketTitle: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    const data = await fetchMessages(ticketId);
    setMessages(data);
  };

  useEffect(() => {
    loadMessages();
  }, [ticketId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content }]);
    setIsLoading(true);

    try {
      await sendMessage(ticketId, content);

      const pollInterval = setInterval(async () => {
        const updatedMessages = await fetchMessages(ticketId);
        if (updatedMessages.length > messages.length + 1) {
          setMessages(updatedMessages);
          setIsLoading(false);
          clearInterval(pollInterval);
        }
      }, 2000);

      setTimeout(() => {
        clearInterval(pollInterval);
        setIsLoading(false);
      }, 60000);
    } catch (error) {
      console.error("Error sending message:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div
        className="bg-white border-b border-indigo-100"
        style={{ boxShadow: "var(--shadow-sm)" }}
      >
        <div className="max-w-4xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="w-11 h-11 rounded-2xl border border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link>
              <div>
                <div className="flex items-center gap-3">
                  <h1
                    className="text-xl font-semibold text-slate-900"
                    style={{ letterSpacing: "-0.02em" }}
                  >
                    {ticketTitle || "Support Chat"}
                  </h1>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full">
                    #{ticketId}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <span className="text-sm text-slate-500 font-light">
                    AI Assistant Online
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm text-slate-500 font-medium">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center py-16">
                <div
                  className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-white border border-indigo-100 flex items-center justify-center"
                  style={{ boxShadow: "var(--shadow-md)" }}
                >
                  <svg
                    className="w-12 h-12 text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3
                  className="text-xl font-semibold text-slate-900 mb-2"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  Start a conversation
                </h3>
                <p className="text-base text-slate-600 font-light">
                  Send a message to chat with our AI assistant
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} content={m.content} />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-indigo-100">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSend={handleSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
