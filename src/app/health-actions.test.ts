import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks=vi.hoisted(()=>({user:vi.fn(),baby:vi.fn(),tempCreate:vi.fn(),tempUpdate:vi.fn(),tempDelete:vi.fn(),medCreate:vi.fn(),medUpdate:vi.fn(),medDelete:vi.fn(),schedule:vi.fn(),dose:vi.fn(),doseDelete:vi.fn(),babyBirth:vi.fn(),schedules:vi.fn()}));
vi.mock("@/lib/auth",()=>({requireUser:mocks.user}));
vi.mock("@/lib/db",()=>({db:{baby:{findFirst:mocks.baby,findUniqueOrThrow:mocks.babyBirth},temperatureEntry:{create:mocks.tempCreate,updateMany:mocks.tempUpdate,deleteMany:mocks.tempDelete},medicationSchedule:{create:mocks.medCreate,updateMany:mocks.medUpdate,deleteMany:mocks.medDelete,findFirst:mocks.schedule,findMany:mocks.schedules},medicationDose:{upsert:mocks.dose,deleteMany:mocks.doseDelete}}}));
vi.mock("next/cache",()=>({revalidatePath:vi.fn()}));
vi.mock("next/navigation",()=>({redirect:vi.fn(),RedirectType:{replace:"replace"}}));
import { toDateTimeLocal } from "@/lib/date";
import {saveTemperatureAction,saveMedicationAction,setMedicationTakenAction,deleteTemperatureAction,deleteMedicationAction} from "./health-actions";
function form(fields:Record<string,string>){const data=new FormData();Object.entries(fields).forEach(([key,value])=>data.set(key,value));return data;}
beforeEach(()=>{vi.resetAllMocks();mocks.user.mockResolvedValue({id:"user-1",timezone:"Asia/Ho_Chi_Minh"});mocks.baby.mockResolvedValue({id:"baby-1"});});
describe("health action ownership and actual records",()=>{
  it("checks baby ownership before writing temperature or schedules",async()=>{
    mocks.baby.mockResolvedValue(null);
    await expect(saveTemperatureAction(form({babyId:"other"}))).rejects.toThrow();
    await expect(saveMedicationAction(form({babyId:"other"}))).rejects.toThrow();
    expect(mocks.tempCreate).not.toHaveBeenCalled();expect(mocks.medCreate).not.toHaveBeenCalled();
  });
  it("converts the real measurement time using account timezone and rejects invalid or future times",async()=>{
    const fields={babyId:"baby-1",celsius:"36.8",method:"EAR",measuredAt:"2026-01-01T08:00"};
    await saveTemperatureAction(form(fields));
    expect(mocks.tempCreate).toHaveBeenCalledWith({data:expect.objectContaining({babyId:"baby-1",celsius:36.8,measuredAt:new Date("2026-01-01T01:00Z")})});
    for(const measuredAt of ["2026-02-30T08:00","2099-01-01T08:00"]) await expect(saveTemperatureAction(form({...fields,measuredAt}))).rejects.toThrow();
  });
  it("cannot edit or delete another user's temperature or medication",async()=>{
    mocks.tempUpdate.mockResolvedValue({count:0});mocks.medUpdate.mockResolvedValue({count:0});
    await expect(saveTemperatureAction(form({id:"other",babyId:"baby-1",celsius:"36.7",method:"EAR",measuredAt:"2026-01-01T08:00"}))).rejects.toThrow();
    await expect(saveMedicationAction(form({id:"other",babyId:"baby-1",name:"Vitamin",dosage:"Theo đơn",startDate:"2026-01-01",times:"08:00",active:"on"}))).rejects.toThrow();
    await deleteTemperatureAction(form({id:"other"}));await deleteMedicationAction(form({id:"other"}));
    expect(mocks.tempDelete).toHaveBeenCalledWith({where:{id:"other",baby:{userId:"user-1"}}});expect(mocks.medDelete).toHaveBeenCalledWith({where:{id:"other",baby:{userId:"user-1"}}});
  });
  it("uses an idempotent dose key, preserves completion time and rejects unscheduled/future doses",async()=>{
    mocks.schedule.mockResolvedValue({active:true,startDate:new Date("2026-01-01"),endDate:null,times:["08:00"]});
    const fields={scheduleId:"schedule-1",day:"2026-01-01",time:"08:00",taken:"true"};
    await setMedicationTakenAction(form(fields));await setMedicationTakenAction(form(fields));
    expect(mocks.schedule).toHaveBeenCalledWith({where:{id:"schedule-1",baby:{userId:"user-1"}}});
    expect(mocks.dose).toHaveBeenLastCalledWith({where:{scheduleId_day_time:{scheduleId:"schedule-1",day:new Date("2026-01-01"),time:"08:00"}},create:{scheduleId:"schedule-1",day:new Date("2026-01-01"),time:"08:00"},update:{}});
    for(const extra of [{time:"09:00"},{day:"2099-01-01"}])await expect(setMedicationTakenAction(form({...fields,...extra}))).rejects.toThrow();
    await setMedicationTakenAction(form({...fields,taken:"false"}));expect(mocks.doseDelete).toHaveBeenCalledOnce();
    mocks.schedule.mockResolvedValue(null);await expect(setMedicationTakenAction(form(fields))).rejects.toThrow();
  });
});

describe("age-based supplement setup", () => {
  const fields = () => ({ babyId: "baby-1", preset: "vitamin-d", name: "Vitamin D", dosage: "Sản phẩm và liều đã xác nhận", startDate: toDateTimeLocal(new Date(), "Asia/Ho_Chi_Minh").slice(0, 10), times: "08:00", active: "on", confirmed: "on" });
  it("requires confirmation, an eligible age and the catalog name before creating a schedule", async () => {
    mocks.babyBirth.mockResolvedValue({ dateOfBirth: new Date(fields().startDate) });
    for (const changes of [{ confirmed: "" }, { name: "Tên bị sửa" }, { preset: "unknown" }]) {
      await expect(saveMedicationAction(form({ ...fields(), ...changes }))).rejects.toThrow();
    }
    mocks.babyBirth.mockResolvedValue({ dateOfBirth: new Date("2020-01-01") });
    await expect(saveMedicationAction(form(fields()))).rejects.toThrow();
    expect(mocks.medCreate).not.toHaveBeenCalled();
  });
  it("creates a configured daily schedule, without a default dosage", async () => {
    mocks.babyBirth.mockResolvedValue({ dateOfBirth: new Date(fields().startDate) });
    mocks.schedules.mockResolvedValue([]);
    await saveMedicationAction(form(fields()));
    expect(mocks.medCreate).toHaveBeenCalledWith({ data: expect.objectContaining({ name: "Vitamin D", dosage: fields().dosage, times: ["08:00"], active: true }) });
  });
});
