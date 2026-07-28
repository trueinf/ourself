import { ChevronLeft } from './Icons';

/** §6 BackLink — top of every detail page; real <button>, visible focus (§12). */
export function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="back" onClick={onClick}>
      <ChevronLeft /> {label}
    </button>
  );
}
