"use client";

import { useState } from "react";

type Props = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

export default function MessageInput({ onSend, disabled = false }: Props) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue("");
  };

  return (
    <div className="p-6">
      <div className="flex gap-3">
        <input
          type="text"
          className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 font-light"
          placeholder="Type your message..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={disabled}
          style={{ letterSpacing: '-0.01em' }}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="px-6 py-4 text-white text-base font-semibold rounded-2xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          style={{ background: 'var(--gradient-primary)', boxShadow: 'var(--shadow)' }}
        >
          <span>Send</span>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
