import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import {
  setView,
  setSearch,
  setStatusFilter,
} from '@/features/patients/patientsSlice';
import type { PatientStatus } from '@/types';
import ViewToggle from '@/components/common/ViewToggle';
import PatientGrid from '@/components/patients/PatientGrid';
import PatientList from '@/components/patients/PatientList';

const STATUSES: (PatientStatus | 'All')[] = [
  'All',
  'Stable',
  'Recovering',
  'Critical',
  'Discharged',
];

export default function PatientsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, view, search, statusFilter } = useAppSelector((s) => s.patients);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((p) => {
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.condition.toLowerCase().includes(q) ||
        p.doctor.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients</h1>
          <p className="text-sm text-slate-500">
            {filtered.length} of {items.length} patients shown
          </p>
        </div>
        <ViewToggle value={view} onChange={(v) => dispatch(setView(v))} />
      </header>

      <section className="card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            placeholder="Search by name, ID, condition or doctor..."
            className="input pl-9"
          />
        </div>

        <div role="tablist" aria-label="Filter by status" className="flex flex-wrap gap-1.5">
          {STATUSES.map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={statusFilter === s}
              onClick={() => dispatch(setStatusFilter(s))}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                statusFilter === s
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </section>

      {view === 'grid' ? (
        <PatientGrid patients={filtered} onSelect={(id) => navigate(`/patients/${id}`)} />
      ) : (
        <PatientList patients={filtered} onSelect={(id) => navigate(`/patients/${id}`)} />
      )}
    </div>
  );
}
