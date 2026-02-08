const statusConfig = {
  active: {
    label: "Active",
    className: "bg-[var(--status-active)]/18 text-[var(--status-active)] border border-[var(--status-active)]/40",
  },
  threatened: {
    label: "Threatened",
    className: "bg-[var(--status-threatened)]/18 text-[#8a6b1a] border border-[var(--status-threatened)]/40",
  },
  erased: {
    label: "Erased",
    className: "bg-[var(--status-erased)]/18 text-[#8b4545] border border-[var(--status-erased)]/40",
  },
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.erased;
  return (
    <span
      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full tracking-wide ${config.className}`}
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </span>
  );
}
