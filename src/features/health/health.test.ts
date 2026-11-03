import { describe, expect, it } from "vitest";
import { medicationSchema, scheduledOn, temperatureSchema } from "./validation";
import { medicationCalendar } from "./calendar";
const base={name:"Vitamin D",dosage:"Theo đơn đã có",startDate:"2026-11-02",endDate:"2026-11-03",times:"18:00, 08:00 08:00"};
const schedule={id:"schedule-1",name:"Vitamin D, A",dosage:"Liều đã nhập",instructions:"Ghi chú;\nxem lại",startDate:new Date("2026-11-02"),endDate:new Date("2026-11-03"),times:["08:00","18:00"],active:true};
describe("health records",()=>{
  it("validates decimal temperatures including Vietnamese decimal separator without accepting empty values",()=>{
    expect(temperatureSchema.parse({celsius:"36,7",method:"AXILLARY",measuredAt:"2026-11-02T08:00"}).celsius).toBe(36.7);
    for(const celsius of ["", "abc", "24", "46"]) expect(temperatureSchema.safeParse({celsius,method:"AXILLARY",measuredAt:"2026-11-02T08:00"}).success).toBe(false);
  });
  it("normalizes daily slots and rejects invalid times, dates and reversed ranges",()=>{
    expect(medicationSchema.parse(base).times).toEqual(["08:00","18:00"]);
    for(const fields of [{times:"24:00"},{times:"8:30"},{times:""},{startDate:"2026-02-30"},{endDate:"2026-11-01"},{dosage:""}]) expect(medicationSchema.safeParse({...base,...fields}).success).toBe(false);
    expect(scheduledOn(schedule,"2026-11-02")).toBe(true);
    expect(scheduledOn(schedule,"2026-11-03")).toBe(true);
    expect(scheduledOn(schedule,"2026-11-04")).toBe(false);
    expect(scheduledOn({...schedule,active:false},"2026-11-02")).toBe(false);
  });
  it("exports only upcoming doses in account timezone, with native calendar alarms and escaped text",()=>{
    const calendar=medicationCalendar([schedule],"Asia/Ho_Chi_Minh",new Date("2026-11-02T02:00Z"));
    expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(3);
    expect(calendar).toContain("DTSTART:20261102T110000Z");
    expect(calendar).not.toContain("DTSTART:20261102T010000Z");
    expect(calendar).toContain("TRIGGER:PT0S");
    expect(calendar).toContain("SUMMARY:Vitamin D\\, A");
    expect(calendar).toContain("Ghi chú\\;\\nxem lại");
    expect(medicationCalendar([{...schedule,active:false}],"Asia/Ho_Chi_Minh",new Date("2026-11-02"))).not.toContain("BEGIN:VEVENT");
  });
  it("limits open-ended calendars to 30 days and folds Vietnamese UTF-8 lines safely",()=>{
    const calendar=medicationCalendar([{...schedule,endDate:null,name:"Thuốc của bé ".repeat(40)}],"Asia/Ho_Chi_Minh",new Date("2026-11-01T17:00Z"));
    expect(calendar.match(/BEGIN:VEVENT/g)).toHaveLength(60);
    for(const line of calendar.split("\r\n"))expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75);
  });
});
