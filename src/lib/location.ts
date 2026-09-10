export type AddressParts = Record<string, string | undefined>;

function firstAvailable(address: AddressParts, keys: string[]) {
  return keys.map((key) => address[key]?.trim()).find(Boolean);
}

export function formatLocality(address: AddressParts): string | null {
  const wardOrCommune = firstAvailable(address, [
    "suburb",
    "quarter",
    "neighbourhood",
    "village",
    "municipality",
    "hamlet",
  ]);
  const district = firstAvailable(address, ["city_district", "district", "county", "borough"]);
  const cityOrProvince = firstAvailable(address, ["city", "town", "state"]);

  const parts = [wardOrCommune, district, cityOrProvince].filter(
    (part, index, all): part is string => Boolean(part) && all.indexOf(part) === index,
  );

  return parts.length > 0 ? parts.join(", ") : null;
}
