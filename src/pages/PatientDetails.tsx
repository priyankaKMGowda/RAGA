import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { pushNotification } from '@/features/notifications/notificationsSlice';
import { showNotification, requestNotificationPermission } from '@/services/notifications';
import Avatar from '@/components/common/Avatar';
import StatusBadge from '@/components/common/StatusBadge';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const vitals = [
  { t: '08:00', hr: 78, bp: 120 },
  { t: '10:00', hr: 82, bp: 122 },
  { t: '12:00', hr: 88, bp: 128 },
  { t: '14:00', hr: 90, bp: 132 },
  { t: '16:00', hr: 86, bp: 130 },
  { t: '18:00', hr: 80, bp: 124 },
];

export default function PatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const patient = useAppSelector((s) => s.patients.items.find((p) => p.id === id));

  const meds = useMemo(
    () => [
      { name: 'Lisinopril', dosage: '10mg', schedule: '1x daily' },
      { name: 'Metformin', dosage: '500mg', schedule: '2x daily' },
      { name: 'Atorvastatin', dosage: '20mg', schedule: '1x at night' },
    ],
    [],
  );

  if (!patient) {
    return (
      <div className="card p-12 text-center">
        <h2 className="text-lg font-semibold">Patient not found</h2>
        <p className="mt-1 text-sm text-slate-500">
          The patient you're looking for doesn't exist or was removed.
        </p>
        <Link to="/patients" className="btn-primary mt-4 inline-flex">Back to patients</Link>
      </div>
    );
  }

  async function notifyDoctor() {
    const perm = await requestNotificationPermission();
    if (perm !== 'granted') {
      // Even if browser perms are denied, fall back to in-app notification.
      dispatch(
        pushNotification({
          title: `Reminder created for ${patient!.name}`,
          body: 'Browser notifications are off — alert saved in-app.',
          level: 'warning',
        }),
      );
      return;
    }
    await showNotification({
      title: `Check-in reminder: ${patient!.name}`,
      body: `${patient!.id} · ${patient!.condition} — please review vitals.`,
      level: 'info',
      data: { url: `/patients/${patient!.id}` },
    });
    dispatch(
      pushNotification({
        title: `Reminder sent for ${patient!.name}`,
        body: 'A push notification was dispatched via service worker.',
        level: 'success',
      }),
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
        >
          ← Back
        </button>
      </div>

      <header className="card p-6 flex flex-wrap items-center gap-5">
        <Avatar name={patient.name} color={patient.avatarColor} size={72} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">{patient.name}</h1>
            <StatusBadge status={patient.status} />
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {patient.id} · {patient.age}y · {patient.gender} · {patient.bloodGroup}
          </p>
          <p className="text-sm text-slate-600 mt-1">
            Under care of <span className="font-medium">{patient.doctor}</span> · Admitted on{' '}
            {new Date(patient.admittedOn).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button onClick={notifyDoctor} className="btn-primary">
            Send check-in reminder
          </button>
          <a href={`tel:${patient.contact}`} className="btn-secondary">
            Call {patient.contact}
          </a>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Vitals — last 12 hours</h2>
              <p className="text-xs text-slate-500">Heart rate (bpm) and Systolic BP (mmHg)</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={vitals}>
                <CartesianGrid stroke="#eef2f7" vertical={false} />
                <XAxis dataKey="t" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                <Line type="monotone" dataKey="hr" stroke="#EF4444" strokeWidth={2} dot={{ r: 3 }} name="HR" />
                <Line type="monotone" dataKey="bp" stroke="#0EA5E9" strokeWidth={2} dot={{ r: 3 }} name="BP" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="card p-5">
            <h2 className="font-semibold">Diagnosis</h2>
            <p className="mt-2 text-sm text-slate-700">{patient.condition}</p>
            <dl className="mt-4 space-y-2 text-sm">
              <Row label="Status" value={<StatusBadge status={patient.status} />} />
              <Row label="Doctor" value={patient.doctor} />
              <Row label="Admitted" value={new Date(patient.admittedOn).toLocaleDateString()} />
              <Row label="Contact" value={patient.contact} />
            </dl>
          </section>

          <section className="card p-5">
            <h2 className="font-semibold">Medications</h2>
            <ul className="mt-2 divide-y divide-slate-100">
              {meds.map((m) => (
                <li key={m.name} className="py-2 flex items-center justify-between text-sm">
                  <div>
                    <div className="font-medium">{m.name}</div>
                    <div className="text-xs text-slate-500">{m.dosage} · {m.schedule}</div>
                  </div>
                  <span className="badge bg-brand-50 text-brand-700">Active</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-800 font-medium">{value}</dd>
    </div>
  );
}
