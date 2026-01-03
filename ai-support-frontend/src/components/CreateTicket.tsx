"use client";

import { useState } from "react";

type Props = {
  onCreate: (title: string) => void;
};

export default function CreateTicket({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || isCreating) return;
    setIsCreating(true);
    await onCreate(title);
    setTitle("");
    setIsCreating(false);
  };

  return (
    <div className="bg-white rounded-3xl border border-indigo-100 p-8" style={{ boxShadow: 'var(--shadow-md)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-slate-900">New Ticket</h3>
          <p className="text-sm text-slate-500 font-light">Describe your issue or question</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <input
          type="text"
          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-light"
          placeholder="e.g., How do I schedule an appointment?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          disabled={isCreating}
          style={{ letterSpacing: '-0.01em' }}
        />
        
        <button
          onClick={handleCreate}
          disabled={!title.trim() || isCreating}
          className="w-full px-6 py-4 text-white text-base font-semibold rounded-2xl hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          style={{ 
            background: 'var(--gradient-primary)',
            boxShadow: !title.trim() ? 'none' : 'var(--shadow-md)'
          }}
        >
          {isCreating ? (
            <>
              <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating...</span>
            </>
          ) : (
            <>
              <span>Create Ticket</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
