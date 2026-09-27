export function formatK(amount: number): string {
  const value = Number.isFinite(amount) ? amount : 0;
  return `K${value.toLocaleString("en-ZM", {
    maximumFractionDigits: 0,
  })}`;
}
