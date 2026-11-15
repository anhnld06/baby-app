-- Đánh dấu rõ ràng bản ghi tiêm được tạo ra khi xác nhận "Đã tiêm" cho một lịch hẹn.
-- Thay cho cách cũ (đặt createdAt của bản ghi = createdAt của lịch hẹn). Chỉ thêm cột và điền
-- dữ liệu; không xóa hay sửa dữ liệu khác.
ALTER TABLE "VaccinationRecord" ADD COLUMN "createdByAppointmentId" TEXT;
ALTER TABLE "MotherVaccinationRecord" ADD COLUMN "createdByAppointmentId" TEXT;

-- Backfill: chỉ bản ghi đang liên kết với lịch hẹn VÀ mang dấu cũ (createdAt trùng tới mili giây
-- với createdAt của lịch hẹn đó). Mọi bản ghi khác giữ NULL = an toàn: bỏ đánh dấu chỉ gỡ liên kết,
-- không bao giờ xóa.
UPDATE "VaccinationRecord" AS r
SET "createdByAppointmentId" = a."id"
FROM "VaccinationAppointment" AS a
WHERE a."vaccinationRecordId" = r."id"
  AND r."createdAt" = a."createdAt";

UPDATE "MotherVaccinationRecord" AS r
SET "createdByAppointmentId" = a."id"
FROM "VaccinationAppointment" AS a
WHERE a."motherVaccinationRecordId" = r."id"
  AND r."createdAt" = a."createdAt";
