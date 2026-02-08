import "./PlaceMarker.css";

export function PlaceMarker({
  status,
  isSelected = false,
  onClick,
  "aria-label": ariaLabel,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={[
        "place-marker",
        `place-marker--${status}`,
        isSelected ? "place-marker--selected" : "",
        status === "threatened" ? "pulse" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={
        isSelected
          ? { width: 20, height: 20 }
          : { width: 16, height: 16 }
      }
    />
  );
}
