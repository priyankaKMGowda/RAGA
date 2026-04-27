import type { Patient } from '@/types';
import Avatar from '@/components/common/Avatar';
import StatusBadge from '@/components/common/StatusBadge';

interface Props {
  patients: Patient[];
  onSelect: (id: string) => void;
}

export default function PatientList({ patients, onSelect }: Props) {
  if (patients.length === 0) {
    return (
      <div className="card p-12 text-center text-slate-500">
        <p className="font-medium">No patients match the current filters.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <Th>Patient</Th>
              <Th>Condition</Th>
              <Th>Doctor</Th>
              <Th>Status</Th>
              <Th>Admitted</Th>
              <Th>Blood</Th>
              <Th />
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
              >
                <Td>
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} color={p.avatarColor} size={36} />
                    <div>
                      <div className="font-medium text-slate-900">{p.name}</div>
                      <div className="text-xs text-slate-500">
                        {p.id} · {p.age}y · {p.gender}
                      </div>
                    </div>
                  </div>
                </Td>
                <Td>{p.condition}</Td>
                <Td className="text-slate-600">{p.doctor}</Td>
                <Td>
                  <StatusBadge status={p.status} />
                </Td>
                <Td className="text-slate-600">
                  {new Date(p.admittedOn).toLocaleDateString()}
                </Td>
                <Td className="text-slate-600">{p.bloodGroup}</Td>
                <Td className="text-right">
                  <span className="text-brand-600 font-medium">View →</span>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile rows */}
      <ul className="md:hidden divide-y divide-slate-100">
        {patients.map((p) => (
          <li
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="flex items-center gap-3 p-4 cursor-pointer hover:bg-slate-50"
          >
            <Avatar name={p.name} color={p.avatarColor} size={40} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium truncate">{p.name}</span>
                <StatusBadge status={p.status} />
              </div>
              <div className="text-xs text-slate-500 truncate">
                {p.condition} · {p.doctor}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return <th className="px-4 py-3 text-left font-medium">{children}</th>;
}
function Td({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className}`}>{children}</td>;
}
