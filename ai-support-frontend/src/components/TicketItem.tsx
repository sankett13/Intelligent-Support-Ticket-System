import Link from "next/link";

type Props = {
  id: number;
  title: string;
  status: string;
};

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  open: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  closed: { bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  resolved: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
};

export default function TicketItem({ id, title, status }: Props) {
  const style = statusStyles[status] || statusStyles.open;
  
  return (
    <Link
      href={`/tickets/${id}`}
      className="block bg-white rounded-2xl border border-indigo-100 p-6 hover:border-indigo-300 group"
      style={{ boxShadow: 'var(--shadow)', transition: 'all 0.3s cubic-bezier(0.32, 0.72, 0, 1)' }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-sm font-medium text-slate-400">#{id}</span>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}>
              <span className={`w-2 h-2 rounded-full ${style.dot}`}></span>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 line-clamp-2" style={{ letterSpacing: '-0.01em' }}>
            {title}
          </h3>
        </div>
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100">
          <svg className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
