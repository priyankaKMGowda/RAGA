import type { Patient } from '@/types';
import Avatar from '@/components/common/Avatar';
import StatusBadge from '@/components/common/StatusBadge';

interface Props {
  patients: Patient[];
  onSelect: (id: string) => void;
}

export default function PatientGrid({ patients, onSelect }: Props) {
  if (patients.length === 0) return <Empty />;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {patients.map((p) => (
        <article
          key={p.id}
          onClick={() => onSelect(p.id)}
          className="card p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md transition group"
        >
          <div className="flex items-start gap-3">
            <Avatar name={p.name} color={p.avatarColor} size={48} />
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold text-slate-900 group-hover:text-brand-700">
                {p.name}
              </h3>
              <p className="text-xs text-slate-500">
                {p.id} · {p.age}y · {p.gender}
              </p>
            </div>
            <StatusBadge status={p.status} />
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <Row label="Condition" value={p.condition} />
            <Row label="Doctor" value={p.doctor} />
            <Row label="Admitted" value={new Date(p.admittedOn).toLocaleDateString()} />
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
            <span>Blood: {p.bloodGroup}</span>
            <span className="text-brand-600 font-medium group-hover:underline">View →</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-800 truncate text-right">{value}</span>
    </div>
  );
}

function Empty() {
  return (
    <div className="card p-12 text-center text-slate-500">
      <p className="font-medium">No patients match the current filters.</p>
      <p className="text-sm mt-1">Try clearing the search or status filter.</p>
    </div>
  );
}
