import { useMemo } from 'react';
import { useAppSelector } from '@/app/hooks';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';

const monthly = [
  { m: 'Nov', admissions: 120, discharges: 95 },
  { m: 'Dec', admissions: 152, discharges: 130 },
  { m: 'Jan', admissions: 165, discharges: 142 },
  { m: 'Feb', admissions: 138, discharges: 128 },
  { m: 'Mar', admissions: 178, discharges: 161 },
  { m: 'Apr', admissions: 201, discharges: 175 },
];

const satisfaction = [
  { week: 'W1', score: 84 },
  { week: 'W2', score: 86 },
  { week: 'W3', score: 89 },
  { week: 'W4', score: 91 },
];

const STATUS_COLORS: Record<string, string> = {
  Stable: '#10B981',
  Recovering: '#0EA5E9',
  Critical: '#EF4444',
  Discharged: '#94A3B8',
};

export default function AnalyticsPage() {
  const patients = useAppSelector((s) => s.patients.items);

  const byStatus = useMemo(() => {
    const map = new Map<string, number>();
    patients.forEach((p) => map.set(p.status, (map.get(p.status) ?? 0) + 1));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [patients]);

  const byDoctor = useMemo(() => {
    const map = new Map<string, number>();
    patients.forEach((p) => map.set(p.doctor, (map.get(p.doctor) ?? 0) + 1));
    return Array.from(map, ([name, count]) => ({ name, count })).sort(
      (a, b) => b.count - a.count,
    );
  }, [patients]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <p className="text-sm text-slate-500">Hospital performance and patient outcomes.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Avg. occupancy" value="78%" sub="+3% vs last month" tone="up" />
        <KpiCard title="Avg. LOS" value="4.6d" sub="-0.4d vs last month" tone="up" />
        <KpiCard title="Readmission rate" value="6.2%" sub="-0.8% vs last month" tone="up" />
        <KpiCard title="Mortality rate" value="1.1%" sub="+0.1% vs last month" tone="down" />
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Admissions vs Discharges" subtitle="Past 6 months">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="m" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="admissions" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                <Bar dataKey="discharges" fill="#A5F3FC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Patient status distribution" subtitle="Current census">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={byStatus}
                  innerRadius={60}
                  outerRadius={95}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {byStatus.map((entry) => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#94A3B8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Patient satisfaction (NPS)" subtitle="Trend by week">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={satisfaction}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={[60, 100]} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="score" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Caseload by doctor" subtitle="Active patients">
          <ul className="divide-y divide-slate-100">
            {byDoctor.map((d) => {
              const max = byDoctor[0]?.count || 1;
              const pct = (d.count / max) * 100;
              return (
                <li key={d.name} className="py-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-700">{d.name}</span>
                    <span className="text-slate-500">{d.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-5">
      <div className="mb-4">
        <h2 className="font-semibold">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function KpiCard({
  title,
  value,
  sub,
  tone,
}: {
  title: string;
  value: string;
  sub: string;
  tone: 'up' | 'down';
}) {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className={`mt-1 text-xs ${tone === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
        {sub}
      </p>
    </div>
  );
}
