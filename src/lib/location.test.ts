import { describe, expect, it } from "vitest";

import { formatLocality } from "@/lib/location";

describe("formatLocality", () => {
  it("formats a Vietnamese ward and city", () => {
    expect(
      formatLocality({
        suburb: "Phường Tân Sơn",
        city: "Thành phố Hồ Chí Minh",
        country: "Việt Nam",
      }),
    ).toBe("Phường Tân Sơn, Thành phố Hồ Chí Minh");
  });

  it("formats a commune, district and province", () => {
    expect(
      formatLocality({
        village: "Xã Tân Lập",
        county: "Huyện Đan Phượng",
        state: "Hà Nội",
      }),
    ).toBe("Xã Tân Lập, Huyện Đan Phượng, Hà Nội");
  });

  it("does not repeat the same administrative name", () => {
    expect(formatLocality({ city: "Đà Nẵng", state: "Đà Nẵng" })).toBe("Đà Nẵng");
  });

  it("returns null when no locality information is available", () => {
    expect(formatLocality({ country: "Việt Nam" })).toBeNull();
  });
});
