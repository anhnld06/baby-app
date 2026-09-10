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
      checkedAt: "2026-03-30",
      gestationalWeek: 17,
      fetalHeartRate: 147,
      facility: "PHÒNG KHÁM BÁC SĨ TUYẾT",
      doctor: "THS.BSNT LÊ THỊ ÁNH TUYẾT",
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
