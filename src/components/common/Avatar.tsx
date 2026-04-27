interface Props {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export default function Avatar({ name, color = '#0EA5E9', size = 40, className = '' }: Props) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center rounded-full font-semibold text-white ${className}`}
      style={{ backgroundColor: color, width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </span>
  );
}
