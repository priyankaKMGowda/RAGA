import { Link } from 'react-router-dom';
import { useAppSelector } from '@/app/hooks';
import StatusBadge from '@/components/common/StatusBadge';
import Avatar from '@/components/common/Avatar';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const trend = [
  { day: 'Mon', visits: 42 },
  { day: 'Tue', visits: 58 },
  { day: 'Wed', visits: 51 },
  { day: 'Thu', visits: 73 },
  { day: 'Fri', visits: 88 },
  { day: 'Sat', visits: 67 },
  { day: 'Sun', visits: 49 },
];

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const patients = useAppSelector((s) => s.patients.items);

  const stats = {
    total: patients.length,
    critical: patients.filter((p) => p.status === 'Critical').length,
    recovering: patients.filter((p) => p.status === 'Recovering').length,
    discharged: patients.filter((p) => p.status === 'Discharged').length,
  };

  const recent = [...patients]
    .sort((a, b) => +new Date(b.admittedOn) - +new Date(a.admittedOn))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Welcome back, {user?.displayName?.split(' ')[1] ?? 'Doctor'} 👋
          </h1>
          <p className="text-sm text-slate-500">
            Here's a real-time overview of your wards and patients today.
          </p>
        </div>
        <Link to="/patients" className="btn-primary">View all patients</Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total patients" value={stats.total} delta="+4.2%" tone="brand" />
        <StatCard label="Critical" value={stats.critical} delta="-1.1%" tone="rose" />
        <StatCard label="Recovering" value={stats.recovering} delta="+2.8%" tone="sky" />
        <StatCard label="Discharged" value={stats.discharged} delta="+0.6%" tone="emerald" />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold">Patient visits — this week</h2>
              <p className="text-xs text-slate-500">Trend across out-patient and in-patient.</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="visits" stroke="#0EA5E9" strokeWidth={2} fill="url(#g1)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-semibold mb-4">Recent admissions</h2>
          <ul className="divide-y divide-slate-100">
            {recent.map((p) => (
              <li key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                <Avatar name={p.name} color={p.avatarColor} size={36} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs text-slate-500 truncate">{p.condition}</div>
                </div>
                <StatusBadge status={p.status} />
              </li>
            ))}
          </ul>
          <Link
            to="/patients"
            className="mt-4 inline-flex text-sm font-medium text-brand-600 hover:text-brand-700"
          >
            View all →
          </Link>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  delta,
  tone,
}: {
  label: string;
  value: number | string;
  delta: string;
  tone: 'brand' | 'rose' | 'sky' | 'emerald';
}) {
  const tones = {
    brand: 'bg-brand-50 text-brand-700',
    rose: 'bg-rose-50 text-rose-700',
    sky: 'bg-sky-50 text-sky-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  };
  const positive = delta.startsWith('+');
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <div className="mt-2 flex items-end justify-between">
        <span className="text-2xl font-bold tracking-tight">{value}</span>
        <span className={`badge ${tones[tone]}`}>{label.split(' ')[0]}</span>
      </div>
      <p className={`mt-2 text-xs ${positive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {delta} vs. last week
      </p>
    </div>
  );
}
