import type { PatientStatus } from '@/types';

const map: Record<PatientStatus, string> = {
  Stable: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100',
  Recovering: 'bg-sky-50 text-sky-700 ring-1 ring-sky-100',
  Critical: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100',
  Discharged: 'bg-slate-100 text-slate-600 ring-1 ring-slate-200',
};

export default function StatusBadge({ status }: { status: PatientStatus }) {
  return <span className={`badge ${map[status]}`}>{status}</span>;
}
