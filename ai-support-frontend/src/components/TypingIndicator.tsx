export default function TypingIndicator() {
  return (
    <div className="flex gap-4 animate-fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </div>
      <div className="bg-white border border-indigo-100 rounded-2xl px-6 py-4" style={{ boxShadow: 'var(--shadow)' }}>
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></span>
            <span className="w-2.5 h-2.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
}
