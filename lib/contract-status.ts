export type ContractLight = "none" | "green" | "orange" | "red";

// groen: loopt nog, langer dan 30 dagen
// oranje: loopt af binnen 30 dagen
// rood: al verlopen
// none: geen einddatum ingesteld (onbekende duur, geen signaal)
export function getContractLight(endDate: string | null | undefined): ContractLight {
  if (!endDate) return "none";

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysLeft = Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return "red";
  if (daysLeft <= 30) return "orange";
  return "green";
}

export function daysUntil(endDate: string): number {
  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
