import { getContractLight } from "@/lib/contract-status";

const STYLES: Record<string, { dot: string; pulse: boolean; label: string }> = {
  none: { dot: "bg-line", pulse: false, label: "Geen einddatum" },
  green: { dot: "bg-success", pulse: false, label: "Loopt nog" },
  orange: { dot: "bg-amber-500", pulse: true, label: "Loopt binnenkort af" },
  red: { dot: "bg-danger", pulse: true, label: "Verlopen" },
};

export default function ContractLight({
  endDate,
  showLabel = false,
}: {
  endDate: string | null | undefined;
  showLabel?: boolean;
}) {
  const light = getContractLight(endDate);
  const style = STYLES[light];

  return (
    <span className="inline-flex items-center gap-1.5" title={style.label}>
      <span className="relative flex h-2 w-2">
        {style.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${style.dot} opacity-60`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`} />
      </span>
      {showLabel && <span className="text-[11px] text-muted">{style.label}</span>}
    </span>
  );
}
