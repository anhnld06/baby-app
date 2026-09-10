import { describe, expect, it } from "vitest";
import { parseHealthDocument } from "@/features/ocr/parse";

describe("parseHealthDocument", () => {
  it("extracts a Vietnamese ultrasound result", () => {
    const text = `
      PHÒNG KHÁM BÁC SĨ TUYẾT
      Chẩn đoán: THAI KHOẢNG 17 TUẦN 5 NGÀY
      BPD: 40 mm     HC: 146 mm     AC: 129 mm
      FL: 22 mm
      TRỌNG LƯỢNG THAI: 200 gr +/- 30gr
      TIM THAI: 147 lần/phút
      VỊ TRÍ NHAU BÁM: đáy thân mặt trước, độ 1
      III. KẾT LUẬN
      ĐƠN THAI SỐNG KHOẢNG 17 TUẦN 5 NGÀY.
      NHAU ỐI BÌNH THƯỜNG.
      ngày 30 tháng 3 năm 2026
      THS.BSNT LÊ THỊ ÁNH TUYẾT
    `;

    expect(parseHealthDocument(text, "pregnancyCheckup")).toMatchObject({
      visitType: "ULTRASOUND",
      checkedAt: "2026-03-30",
      gestationalWeek: 17,
      gestationalDay: 5,
      fetusCount: 1,
      fetalHeartRate: 147,
      bpdMm: 40,
      hcMm: 146,
      acMm: 129,
      flMm: 22,
      estimatedFetalWeightG: 200,
      placentaPosition: "đáy thân mặt trước",
      placentaGrade: 1,
      facility: "PHÒNG KHÁM BÁC SĨ TUYẾT",
      doctor: "THS.BSNT LÊ THỊ ÁNH TUYẾT",
    });
  });

  it("extracts first-trimester dating and nuchal translucency", () => {
    const text = `
      PHÒNG KHÁM BÁC SĨ TUYẾT
      Chẩn đoán: ĐO ĐỘ MỜ DA GÁY
      SỐ LƯỢNG THAI: đơn thai
      Cử động thai: (+)
      Tim thai đều: 147 lần/phút
      CRL = 53 mm (12 tuần 4 ngày), NT = 1.6 mm
      Lượng nước ối: bình thường
      Vị trí nhau bám: đáy thân mặt trước, độ 0
      III. KẾT LUẬN
      ĐƠN THAI SỐNG TRONG BUỒNG TỬ CUNG KHOẢNG 12 TUẦN 4 NGÀY
      ngày 22 tháng 2 năm 2026
      Bác sĩ siêu âm
    `;

    expect(parseHealthDocument(text, "pregnancyCheckup")).toMatchObject({
      checkedAt: "2026-02-22",
      gestationalWeek: 12,
      gestationalDay: 4,
      fetusCount: 1,
      fetalMovement: "PRESENT",
      fetalHeartRate: 147,
      crlMm: 53,
      ntMm: 1.6,
      placentaPosition: "đáy thân mặt trước",
      placentaGrade: 0,
      amnioticFluid: "bình thường",
    });
  });

  it("keeps ultrasound due date separate from examination date", () => {
    const text = `
      PHÒNG KHÁM BÁC SĨ TUYẾT
      Chẩn đoán: THAI KHOẢNG 10 TUẦN 3 NGÀY
      Lòng tử cung: Có 01 túi thai
      Yolksac (+)
      CRL = 34 mm (tương đương 10 tuần 3 ngày), SDD (2/9/2026)
      Tim thai: 140 lần/phút
      III. KẾT LUẬN
      ĐƠN THAI SỐNG TRONG BUỒNG TỬ CUNG KHOẢNG 10 TUẦN 3 NGÀY.
      ngày 22 tháng 1 năm 2026
    `;

    expect(parseHealthDocument(text, "pregnancyCheckup")).toMatchObject({
      checkedAt: "2026-01-22",
      ultrasoundDueDate: "2026-09-02",
      gestationalWeek: 10,
      gestationalDay: 3,
      fetusCount: 1,
      fetalHeartRate: 140,
      crlMm: 34,
    });
  });

  it("extracts printed vaccination fields", () => {
    const text = `
      TRUNG TÂM Y TẾ QUẬN 1
      Tên vắc xin: Infanrix Hexa
      Mũi số: 2
      Ngày tiêm: 10/09/2026
      Số lô: AB1234
      Ngày hẹn tiêm tiếp: 10/10/2026
    `;

    expect(parseHealthDocument(text, "vaccination")).toEqual({
      vaccineName: "Infanrix Hexa",
      doseNumber: 2,
      administeredAt: "2026-09-10",
      facility: "TRUNG TÂM Y TẾ QUẬN 1",
      batchNumber: "AB1234",
      nextDueAt: "2026-10-10",
    });
  });

  it("extracts a printed prescription", () => {
    const text = `
      PHÒNG KHÁM NHI ĐỒNG
      Chẩn đoán: Viêm họng
      Bác sĩ khám: Nguyễn Văn An
      Ngày kê đơn: 08/09/2026
      1. Amoxicillin 500mg
      Uống 1 viên, ngày 2 lần trong 5 ngày
      2. Siro ho 100ml
      Dùng 5 ml, 2 lần/ngày trong 7 ngày
    `;

    expect(parseHealthDocument(text, "prescription")).toMatchObject({
      prescribedBy: "Nguyễn Văn An",
      diagnosis: "Viêm họng",
      issuedAt: "2026-09-08",
      items: [
        { medicineName: "Amoxicillin 500mg", frequency: "ngay 2 lan", durationDays: 5 },
        { medicineName: "Siro ho 100ml", frequency: "2 lan/ngay", durationDays: 7 },
      ],
    });
  });

  it("preserves unstructured OCR text as notes", () => {
    expect(parseHealthDocument("Nội dung chưa khớp mẫu", "vaccination")).toEqual({
      notes: "Nội dung chưa khớp mẫu",
    });
  });
});
