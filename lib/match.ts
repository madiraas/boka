/** True when two titles mean the same project ("Retreat & Itinerary Proposal" and "Retreat and itinerary proposal"). */
const words = (t: string) =>
  new Set(
    t
      .toLowerCase()
      .replace(/&/g, " and ")
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.replace(/s$/, ""))
  );

export function alike(a: string, b: string) {
  const x = words(a);
  const y = words(b);
  const both = [...x].filter((w) => y.has(w)).length;
  return both / (new Set([...x, ...y]).size || 1) >= 0.6;
}
