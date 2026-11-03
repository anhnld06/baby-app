import { describe, expect, it } from "vitest";
import { BABY_SCHEDULE, MOTHER_PRENATAL_SCHEDULE } from "./schedule";
import { vaccineGroupName } from "./groups";
describe("vaccine dose presentation",()=>{
  it("groups oral Rota and OPV doses without merging injectable IPV or alternative products",()=>{
    const groups=new Map<string,string[]>();
    for(const entry of BABY_SCHEDULE){const group=vaccineGroupName(entry);groups.set(group,[...(groups.get(group)??[]),entry.key]);}
    expect(groups.get("Rota (tiêu chảy do Rotavirus)")).toEqual(["rotavirus-1","rotavirus-2"]);
    expect(groups.get("Bại liệt uống (OPV)")).toEqual(["polio-1","polio-2","polio-3"]);
    expect(groups.get("Bại liệt tiêm (IPV)")).toEqual(["polio-ipv","polio-ipv-2"]);
    expect(groups.get("5 trong 1 / 6 trong 1")).toEqual(["5in1-1","5in1-2","5in1-3"]);
    expect([...groups.values()].flat()).toHaveLength(BABY_SCHEDULE.length);
    expect(new Set([...groups.values()].flat()).size).toBe(BABY_SCHEDULE.length);
  });
  it("preserves shared names containing hyphens and booster identities",()=>{
    const dpt=BABY_SCHEDULE.find(entry=>entry.key==="5in1-booster")!;
    expect(vaccineGroupName(dpt)).toBe("Bạch hầu - ho gà - uốn ván (DPT)");
    expect(new Set(MOTHER_PRENATAL_SCHEDULE.map(vaccineGroupName)).size).toBe(1);
  });
});
