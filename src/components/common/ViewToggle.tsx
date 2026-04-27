import type { ViewMode } from '@/types';

interface Props {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}

/**
 * Accessible 2-state toggle: Grid ⇄ List.
 * Implemented as a radiogroup so it works with keyboard / screen readers.
 */
export default function ViewToggle({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Toggle patient view"
      className="inline-flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm"
    >
      <ToggleButton
        active={value === 'grid'}
        onClick={() => onChange('grid')}
        label="Grid view"
      >
        <GridIcon />
        <span className="hidden sm:inline">Grid</span>
      </ToggleButton>
      <ToggleButton
        active={value === 'list'}
        onClick={() => onChange('list')}
        label="List view"
      >
        <ListIcon />
        <span className="hidden sm:inline">List</span>
      </ToggleButton>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition ${
        active
          ? 'bg-brand-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-50'
      }`}
    >
      {children}
    </button>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
    </svg>
  );
}
