

export function formatPrice(value) {
  const amount = Number(value || 0);
  if (!amount) return "Price on request";
  if (amount >= 10000000)
    return `₹${(amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(0)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(value) {
  return value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
}

export function formatRelative(value) {
  if (!value) return "Just now";
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(value)) / 60000),
  );
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

export function lines(text = "") {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}
