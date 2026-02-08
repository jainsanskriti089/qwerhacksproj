const statusConfig = {
  active: {
    label: "Active",
    className: "bg-[var(--status-active)]/15 text-[var(--status-active)] border border-[var(--status-active)]/30",
  },
  threatened: {
    label: "Threatened",
    className: "bg-[var(--status-threatened)]/12 text-[var(--status-threatened)] border border-[var(--status-threatened)]/25",
  },
  erased: {
    label: "Erased",
    className: "bg-[var(--status-erased)]/12 text-[var(--status-erased)] border border-[var(--status-erased)]/25",
  },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.erased;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded tracking-wide ${config.className}`}
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
