type Props = {
  role: "user" | "ai";
  content: string;
};

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-[70%] rounded-2xl px-5 py-3.5 ${
          isUser
            ? "text-white"
            : "bg-white border border-indigo-100 text-slate-900"
        }`}
        style={isUser ? { background: 'var(--gradient-primary)', boxShadow: 'var(--shadow)' } : { boxShadow: 'var(--shadow)' }}
      >
        <div className="text-base leading-relaxed whitespace-pre-wrap font-light" style={{ letterSpacing: '-0.01em' }}>{content}</div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-200 flex items-center justify-center">
          <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      )}
    </div>
  );
}
