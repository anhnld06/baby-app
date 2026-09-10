# Nguồn tham khảo (Authoritative Sources)

Danh sách này liệt kê các nguồn Tier A/B đã được dùng để xây dựng nội dung trong
`src/features/knowledge/articles.ts` (bảng `KnowledgeArticle` của ứng dụng). Ứng dụng
hiện lưu kiến thức trực tiếp trong code (`curatedArticles`), không dùng file JSON/Markdown
riêng — vì vậy đây là bản mục lục kèm ghi chú, không phải nguồn dữ liệu runtime.

Quy ước tier:
- **Tier A** — WHO, UNICEF, CDC, AAP/HealthyChildren.org, NHS, NICE, FDA, NHTSA, cơ quan y tế quốc gia.
- **Tier B** — Cochrane, hội chuyên khoa, tổ chức hỗ trợ lâm sàng có bằng chứng (La Leche League USA/Intl., Academy of Breastfeeding Medicine).
- **Tier C** — bệnh viện/trung tâm y khoa uy tín (Mayo Clinic) dùng khi Tier A/B không có nội dung dành cho phụ huynh ở mức chi tiết tương đương.

## Đã sử dụng trước Batch 1 (đã có trong articles.ts)

| Key trong `sources` | Organization | Title | Tier |
|---|---|---|---|
| planning | CDC | Planning for Pregnancy | A |
| pregnancyNutrition | ACOG | Healthy Eating During Pregnancy | A/B |
| antenatal | WHO | WHO recommendations on antenatal care for a positive pregnancy experience | A |
| alcohol | CDC | About Alcohol Use During Pregnancy | A |
| maternalWarnings | ACOG | Urgent Maternal Warning Signs | A/B |
| postnatal | WHO | WHO recommendations on maternal and newborn care for a positive postnatal experience | A |
| postpartumPain | ACOG | Postpartum Pain Management | A/B |
| newbornCare | WHO | Caring for a newborn | A |
| newbornDanger | WHO | Recommendations on maternal and newborn care after birth | A |
| feeding | WHO | Infant and young child feeding | A |
| breastfeedingVi | UNICEF Việt Nam | Những điều lưu ý khi nuôi con bằng sữa mẹ | A |
| safeSleep | CDC | Providing Care for Babies to Sleep Safely | A |
| crying | NHS | Soothing a crying baby | A |
| colic | NHS | Colic | A |
| vitaminD | CDC | Vitamin D and Breastfeeding | A |
| solids | CDC | When, What, and How to Introduce Solid Foods | A |
| complementary | WHO | Guideline for complementary feeding of infants and young children 6–23 months | A |
| menuVi | UNICEF Việt Nam | Thực đơn cho con từ 6 đến 12 tháng tuổi | A |
| choking | CDC | Choking Hazards | A |
| milestones | CDC | Infants & Toddlers: Milestones & Schedules | A |
| toddler | CDC | Positive Parenting Tips: Toddlers (1–2 years) | A |
| vaccines | WHO | Recommended Routine Immunizations for Children | A |
| jaundiceAAP | HealthyChildren.org (AAP) | Jaundice in Newborns | A |
| jaundiceMayo | Mayo Clinic | Infant jaundice - Symptoms & causes | C |
| skinRashesAAP | HealthyChildren.org (AAP) | Newborn Rashes and Birthmarks | A |
| babyAcneMayo | Mayo Clinic | Baby acne - Symptoms & causes | C |
| diaperRashAAP | HealthyChildren.org (AAP) | Common Diaper Rashes & Treatments | A |
| diaperRashMayo | Mayo Clinic | Diaper rash - Symptoms & causes | C |
| spitUpAAP | HealthyChildren.org (AAP) | Baby Burping, Hiccups & Spit-Up | A |
| pyloricMayo | Mayo Clinic | Pyloric stenosis - Symptoms and causes | C |
| stoolMayo | Mayo Clinic | Baby poop: color, consistency and sometimes surprises! | C |
| feverAAP | HealthyChildren.org (AAP) | Fever and Your Baby | A |
| coldAAP | HealthyChildren.org (AAP) | How to Care for Your Child's Cold | A |
| coldMedsFDA | FDA | Use Caution When Giving Cough and Cold Products to Kids | A |
| cesareanACOG | ACOG | Cesarean Birth | A/B |
| unplannedCesareanACOG | ACOG | What to Know About Unplanned Cesarean Births | A/B |
| hospitalBagNHS | NHS | Hospital bag checklist | A |
| carSeatNHTSA | NHTSA | Hospital Discharge Recommendations for Safe Transportation of Children | A |
| laborSignsACOG | ACOG | How to Tell When Labor Begins | A/B |
| laborSignsNHS | NHS | Signs that labour has begun | A |
| episiotomyNHS | NHS | Episiotomy and perineal tears | A |
| mastitisLLL | La Leche League USA | Mastitis, Slowed Milk Flow, and Milk Blisters | B |
| engorgementLLL | La Leche League USA | Engorgement | B |
| postpartumConditionsACOG | ACOG | 3 Conditions to Watch for After Childbirth | A/B |
| lochiaNHS | NHS Healthier Together | Blood loss - what to expect after birth | A |
| teethingAAP | HealthyChildren.org (AAP) | Teething & Tooth Care | A |
| teethingReliefAAP | HealthyChildren.org (AAP) | How to Help Teething Symptoms without Medications | A |
| benzocaineFDA | FDA | FDA takes action against OTC benzocaine teething products | A |
| homeopathicRecallFDA | FDA | FDA announces Standard Homeopathic Company's nationwide recall of Hyland's teething tablets | A |

## Bổ sung trong Batch 1 (Newborn 0–28 ngày)

Kết quả từ 5 nhánh nghiên cứu song song (giấc ngủ, bú sâu, bài tiết/phản xạ, thân nhiệt/khám
sàng lọc, rốn/thị giác/thính giác), mỗi nhánh dùng WebFetch/WebSearch trực tiếp vào nguồn
Tier A/B. Đã đưa vào `articles.ts` dưới dạng 12 bài viết mới.

| Key trong `sources` | Organization | Title | Tier | Ghi chú xác minh |
|---|---|---|---|---|
| sleepStagesAAP | HealthyChildren.org (AAP) | Stages of Newborn Sleep | A | Fetch trực tiếp |
| daynightAAP | HealthyChildren.org (AAP) | Reversing Day-Night Reversal | A | Fetch trực tiếp |
| helpingSleepNHS | NHS | Helping your baby to sleep | A | Fetch trực tiếp |
| stridorAAP | HealthyChildren.org (AAP) | Stridor & Laryngomalacia | A | Fetch trực tiếp |
| swaddlingAAP | HealthyChildren.org (AAP) | Swaddling: Is it Safe for Your Baby? | A | Fetch trực tiếp |
| safeSleepPolicyAAP | AAP (Moon/Carlin/Hand) | Sleep-Related Infant Deaths: Updated 2022 Recommendations | A | Toàn văn đã đọc trực tiếp bởi agent; URL dùng DOI chuẩn 10.1542/peds.2022-057990 |
| pacifierCochrane | Cochrane | Pacifiers for reducing the risk of SIDS | B | Trích qua PMC, DOI ghi theo quy ước Cochrane chuẩn — nên xác minh lại link khi có dịp |
| clusterFeedingABM | Academy of Breastfeeding Medicine | Clinical Protocol #9 (Supplementation, rev. 2017) | A/B | Fetch trực tiếp (PDF) |
| newbornBreastfeedingCDC | CDC | Newborn Breastfeeding Basics | A | Fetch trực tiếp |
| llliFrequency / llliOversupply / llliLowSupply | La Leche League International | Frequency FAQs / Oversupply / Enough Milk | B | Fetch trực tiếp |
| formulaAmountAAP | HealthyChildren.org (AAP) | Amount and Schedule of Baby Formula Feedings | A | Fetch trực tiếp |
| formulaPrepNHS | NHS | How to make up baby formula | A | Fetch trực tiếp |
| formulaHowMuchCDC | CDC | How Much and How Often to Feed Infant Formula | A | Fetch trực tiếp |
| bottleFeedingCDC | CDC | About Feeding From a Bottle | A | Fetch trực tiếp |
| breastfeedingWarningAAP | HealthyChildren.org (AAP) | Warning Signs of Breastfeeding Problems | A | Fetch trực tiếp |
| wetDiapersNorfolk | Just One Norfolk (NHS) | What's In The Nappy | A | Fetch trực tiếp |
| enoughMilkAAP | HealthyChildren.org (AAP) | How to Tell if Baby is Getting Enough Milk | A | Fetch trực tiếp |
| dehydrationNHS | NHS | Dehydration | A | Fetch trực tiếp |
| reflexesAAP | HealthyChildren.org (AAP) | Newborn Reflexes | A | Fetch trực tiếp |
| reflexesJournal | Int J Pediatr (Futagi et al. 2012) | Grasp Reflex and Moro Reflex hierarchy | B | Fetch trực tiếp qua PMC |
| thermalWHO | WHO | Thermal protection of the newborn | A | URL đúng nhưng fetch toàn văn bị chặn (403) — nội dung qua tóm tắt tìm kiếm/nguồn phụ trích dẫn WHO |
| cchdCDC | CDC | Critical Congenital Heart Defects Screening | A | Fetch trực tiếp |
| ehdiCDC | CDC | EHDI 1-3-6 Benchmarks | A | Fetch trực tiếp |
| hearingScreeningNHS | NHS | Newborn hearing screening | A | Fetch trực tiếp |
| newbornVisitAAP | HealthyChildren.org (AAP) | Checkup Checklist: Newborn Visit | A | Fetch trực tiếp |
| moh2246 | Bộ Y tế Việt Nam | QĐ 2246/QĐ-BYT (2024) | A | Fetch qua trang tổng hợp luật (LuatVietnam); moh.gov.vn không truy cập được trực tiếp trong phiên nghiên cứu |
| cordCareAAP / cordDelayedAAP | HealthyChildren.org / AAP | Umbilical Cord Care / Delayed Separation | A | Fetch trực tiếp |
| granulomaSheffield | Sheffield Children's NHS FT | Umbilical granuloma | A | Fetch trực tiếp |
| omphalitisKingston | Kingston & Richmond NHS FT | Umbilical disorders in children | A | Fetch trực tiếp |
| cordAntisepticsCochrane | Cochrane | Umbilical cord antiseptics review | B | Fetch trực tiếp |
| cordCareAAPPolicy | AAP | Umbilical Cord Care in the Newborn Infant (2016) | A | URL xác nhận qua search index, quote trực tiếp từ bài |
| visionAAP / visionWarningAAP | HealthyChildren.org (AAP) | Infant Vision Development / Warning Signs | A | Fetch trực tiếp |
| redReflexMoorfields | Moorfields Eye Hospital NHS FT | Red reflex | A | Fetch trực tiếp |
| stickyEyeNHS / squintFrimley | NHS (West London / Frimley) | Sticky eye / Vision | A | Fetch trực tiếp |
| hearingScreeningAAP | HealthyChildren.org (AAP) | Hearing Screening Purpose | A | Fetch trực tiếp |

## Điểm CONFLICTING_EVIDENCE đã ghi nhận trong nội dung (không tự chọn một bên)

1. **Số tã ướt ngày 3**: CDC ghi 5 tã ướt/ngày; NHS/UNICEF UK ghi 3 tã ướt/ngày. Trình bày cả
   hai, không lấy trung bình hay "sửa" một nguồn theo nguồn kia.
2. **Tuổi hết phản xạ Moro**: AAP (HealthyChildren) nói mờ dần sau ~2 tháng; tài liệu bình
   duyệt (Futagi 2012) nói biến mất hoàn toàn tới ~6 tháng. Trình bày như một quá trình mờ
   dần trong khoảng vài tháng.
3. **Nhiệt độ phòng ngủ**: AAP chủ động từ chối đưa ra một con số cụ thể (lý do: các nghiên
   cứu định nghĩa "quá nóng" khác nhau); NHS đưa ra 16–20°C. Con số "68–72°F" lan truyền phổ
   biến trên mạng KHÔNG xác minh được là khuyến cáo chính thức của AAP/CDC — không đưa vào
   app.
4. **Núm ti giả và SIDS**: AAP xếp đây là khuyến nghị mức "A" (bằng chứng nhất quán) dù dữ
   liệu nền là quan sát, không phải RCT; Cochrane nhấn mạnh chưa có RCT nào xác nhận và cơ
   chế bảo vệ chưa rõ. Cả hai đang mô tả cùng một tập bằng chứng nhưng khác mức độ tin tưởng
   hành động — trình bày cả hai góc nhìn.
5. **Rốn: chlorhexidine (WHO) vs dry cord care (AAP)**: không thực sự mâu thuẫn — khác nhau
   theo bối cảnh (sinh tại nhà, vùng tử vong sơ sinh cao vs. sinh tại viện, nguồn lực tốt).
   Đã giải thích rõ trong bài để tránh hiểu nhầm là hai khuyến cáo đối lập.

## Known gap — thuật ngữ không có căn cứ chính thức

"Wake windows" (khung giờ thức giữa các giấc ngủ theo độ tuổi) được xác nhận là **NO_EVIDENCE**
từ AAP/NHS/CDC/NICHD/WHO/UNICEF/NICE — chỉ xuất hiện trên các trang thương mại về huấn luyện
giấc ngủ. Không đưa khái niệm hay con số "khung giờ thức" vào app dưới danh nghĩa khuyến cáo
y tế chính thức.

## Bổ sung trong Batch 2 (Breastfeeding chuyên sâu)

Kết quả từ 5 nhánh nghiên cứu song song (sản xuất sữa/let-down, khớp ngậm/đầu ti/từ chối bú,
hút sữa & bảo quản, thực tế cho mẹ (thuốc/tránh thai/rượu/caffeine/ngủ khi bú), thời gian bú
mẹ & cai sữa/chống chỉ định). Đã đưa vào `articles.ts` dưới dạng 12 bài viết mới.

| Key trong `sources` | Organization | Title | Tier | Ghi chú xác minh |
|---|---|---|---|---|
| colostrumAAP | HealthyChildren.org (AAP) | Colostrum: Your Baby's First Meal | A | Fetch trực tiếp |
| whatToExpectCDC | CDC | What to Expect While Breastfeeding | A | Fetch trực tiếp |
| firstDaysNHS | NHS | Breastfeeding: the first few days | A | Fetch trực tiếp |
| transitionalMatureAAP | HealthyChildren.org (AAP) | Transitional Milk and Mature Milk | A | Fetch trực tiếp (trang gốc năm 2009, vẫn đang active) |
| increasingSupplyLLLI | La Leche League International | Increasing Breastmilk Supply | B | Fetch trực tiếp |
| foremilkHindmilkLLLI | La Leche League International | Foremilk and Hindmilk – Myths and Facts | B | Fetch trực tiếp |
| relactationLLLI | La Leche League International | Relactation | B | Fetch trực tiếp |
| positionsNHS | NHS | Breastfeeding positions | A | Fetch trực tiếp |
| positioningLLLI | La Leche League International | Breastfeeding Positions, Latch, and Positioning | B | Fetch trực tiếp |
| latchAAP | HealthyChildren.org (AAP) | Ensuring Proper Latch On While Breastfeeding | A | Fetch trực tiếp |
| soreNipplesNHS | NHS | Sore or cracked nipples when breastfeeding | A | Fetch trực tiếp |
| persistentPainLLLI | La Leche League International | Persistent Pain When Breastfeeding | B | Fetch trực tiếp (tóm tắt ABM Protocol #26, PDF gốc không đọc được) |
| nursingStrikeNHS | Cambridgeshire & Peterborough Children's Health (NHS) | Sudden breast refusal and nursing strikes | A | Fetch trực tiếp |
| nursingStrikeLLLGB | La Leche League GB | Nursing strikes | B | Fetch trực tiếp |
| tenStepsWHO | WHO | Ten steps to successful breastfeeding | A | Fetch trực tiếp |
| pumpingMethodsCochrane | Cochrane | Methods of milk expression for lactating women | B | Fetch trực tiếp (trang tóm tắt Cochrane) |
| pumpingCDC | CDC | Pumping Breast Milk | A | Fetch trực tiếp |
| workplaceCDC | CDC | Breastfeeding and Returning to Your Workplace | A | Fetch trực tiếp |
| storageCDC | CDC | Breast Milk Storage and Preparation | A | Fetch trực tiếp |
| storageFAQCDC | CDC | Breast Milk Storage Questions and Answers | A | Fetch trực tiếp |
| storageNHS | NHS | Storing breast milk | A | Fetch trực tiếp |
| pumpHygieneCDC | CDC | How to Clean and Sanitize Breast Pumps | A | Fetch trực tiếp |
| medSafetyAAP | HealthyChildren.org (AAP) | Medication Safety Tips for Breastfeeding Parents | A | Fetch trực tiếp |
| medSafetyCDC | CDC | Prescription Medication Use | A | Fetch trực tiếp |
| lactmedFactSheet | NIH — LactMed | Fact Sheet: Drugs and Lactation Database | A | URL đúng nhưng NCBI Bookshelf chặn fetch trực tiếp (bot-detection); nội dung qua chỉ mục tìm kiếm |
| contraceptionCDCMEC | CDC | U.S. MEC 2024 — Combined Hormonal Contraceptives | A | Fetch trực tiếp |
| alcoholCDCBreastfeeding | CDC | Alcohol (Breastfeeding Special Circumstances) | A | Fetch trực tiếp — đây là nguồn xác nhận rõ nhất trong cả Batch 2 |
| maternalDietCDC | CDC | Maternal Diet and Breastfeeding | A | Fetch trực tiếp |
| safeSleepSevenLLLGB | La Leche League GB | Safer Sleep & the Breastfed Baby | B | Fetch trực tiếp |
| weaningNHS / weaningAAP / weaningLLLI | NHS / HealthyChildren.org (AAP) / LLLI | How to stop breastfeeding / Weaning Your Baby / Weaning - How To | A/B | ⚠️ URL suy luận theo mẫu cấu trúc của các trang cùng nhóm đã được agent xác nhận (agent chỉ xác nhận tiêu đề + ngày cập nhật qua fetch trực tiếp, không dán lại URL đầy đủ) — nên xác minh lại đường dẫn chính xác trước khi hiển thị công khai cho người dùng |
| contraindicationsCDC | CDC | Contraindications to Breastfeeding | A | ⚠️ Agent xác nhận đã fetch trực tiếp trang này nhưng không dán lại URL cụ thể; URL dùng ở đây là trang mục lớn "Breastfeeding Special Circumstances" của CDC (chắc chắn tồn tại) thay vì đường dẫn con — nên tìm và cập nhật lại đường dẫn chính xác |

## Điểm CONFLICTING_EVIDENCE mới ghi nhận trong Batch 2

1. **Thời hạn bảo quản sữa mẹ trong tủ lạnh**: CDC nói 4 ngày; NHS nói tới 8 ngày. Trình bày
   cả hai, khuyến nghị dùng mốc ngắn hơn (CDC) nếu không chắc chắn điều kiện bảo quản.
2. **Vai trò của nấm miệng (thrush) trong đau đầu ti**: một số nguồn xem đây là nguyên nhân
   thường gặp; tổng hợp của ABM/LLLI cho rằng vai trò này có thể bị đánh giá quá mức so với
   nguyên nhân cơ học/co thắt mạch máu.
3. **"Nhầm lẫn núm vú" (nipple confusion)**: WHO/UNICEF đã đổi Step 9 của "10 bước nuôi con
   bằng sữa mẹ thành công" từ cấm tuyệt đối sang tư vấn nguy cơ — cho thấy bằng chứng nhân quả
   không đủ mạnh để duy trì lệnh cấm, dù vẫn khuyến nghị thận trọng.
4. **Thời điểm an toàn dùng tránh thai kết hợp estrogen sau sinh**: WHO và CDC (MEC 2024) đưa
   ra khung mốc thời gian hơi khác nhau (WHO nhấn mạnh khía cạnh bú mẹ, CDC 2024 nhấn mạnh
   nguy cơ huyết khối theo số ngày hậu sản) — không tự chọn một mốc, khuyến nghị hỏi bác sĩ.
5. **HIV và bú mẹ**: CDC (Mỹ, bối cảnh có sữa công thức an toàn) khuyến cáo không bú mẹ trực
   tiếp nếu chưa ức chế virus ổn định; WHO (bối cảnh nguồn lực thấp, tử vong trẻ em do suy
   dinh dưỡng/nhiễm trùng còn cao) khuyến khích bú mẹ hoàn toàn kèm ARV suốt đời. Đã giải
   thích rõ đây là khác biệt theo bối cảnh, không phải mâu thuẫn cần chọn phe.

## Myth đã xác nhận rõ ràng (đáng đưa vào Batch 13 — Myth vs Fact)

- **"Vắt bỏ sữa sau khi uống rượu giúp đào thải cồn nhanh hơn"** — CDC xác nhận trực tiếp đây
  là SAI; vắt bỏ chỉ hữu ích để giảm căng tức/giữ nguồn sữa, không làm cồn biến mất nhanh hơn.
- **"Sữa loãng, màu trong là sữa không có chất"** — LLLI xác nhận đây là hiểu lầm; không có
  "sữa đầu/sữa cuối" tách biệt về chất lượng, độ béo là một quá trình liên tục trong cữ bú.

## Bổ sung trong Batch 3 (Mang thai)

5 nhánh nghiên cứu song song (tam cá nguyệt/phát triển thai/lịch khám, nghén/đau lưng/phù,
tăng huyết áp & tiểu đường thai kỳ, ra máu & biến chứng nhau thai & thiếu máu, chuyển dạ sinh
non & vỡ ối & giảm thai máy). 12 bài viết mới, phần lớn nguồn ACOG được fetch qua bản sao
AAFP/SMFM/GuidelineCentral vì acog.org chặn fetch trực tiếp (HTTP 402) trong suốt batch này —
nội dung vẫn đáng tin vì các bản sao trích dẫn nguyên văn ACOG, nhưng nên lưu ý khi cần đối
chiếu wording chính xác tuyệt đối. Điểm ⚠️ URL suy luận theo mẫu: `antenatalAppointmentsNHS`
(agent xác nhận đã fetch trực tiếp trang NHS lịch khám nhưng không dán lại URL chính xác).

### Điểm CONFLICTING_EVIDENCE / thay đổi guideline đáng chú ý trong Batch 3
1. **Sàng lọc tiểu đường thai kỳ — 1 bước vs 2 bước**: ACOG (Mỹ) chủ yếu dùng 2 bước (glucose
   50g → nếu bất thường làm tiếp 100g/3 giờ); WHO/IADPSG (quốc tế) dùng 1 bước (75g/2 giờ, chỉ
   cần 1 giá trị bất thường). Hai cách cho tỷ lệ chẩn đoán khác nhau đáng kể — không tự chọn.
2. **Liều aspirin dự phòng tiền sản giật**: Mỹ (ACOG/USPSTF) cố định 81mg/ngày; Anh (NICE)
   khoảng 75-150mg/ngày.
3. **Ceton niệu trong đánh giá nôn nghén nặng**: hướng dẫn RCOG 2024 (mới nhất) nói KHÔNG nên
   dùng ceton niệu để đánh giá mức độ nặng; một số tài liệu cũ hơn (AAFP) vẫn liệt kê đây là
   dấu hiệu đi kèm — đây là một thay đổi hướng dẫn theo thời gian, không phải hai nguồn mâu thuẫn.
4. **Đếm cử động thai (kick counts)**: hướng dẫn hiện tại (NICE, thử nghiệm AFFIRM, Cochrane
   2021) không ủng hộ việc đếm cử động theo con số cố định như một biện pháp có bằng chứng
   giảm thai lưu — khác với quan niệm phổ biến trước đây. ACOG cũng không đưa số cụ thể trên
   trang dành cho bệnh nhân hiện tại.
5. **Số lần khám thai**: WHO tối thiểu 8 lần (ngưỡng toàn cầu, không phải mức lý tưởng cho nơi
   có nguồn lực tốt); NHS/NICE 10 lần (con so)/7 lần (con rạ); ACOG truyền thống ~12-15 lần
   nhưng năm 2025 đã chuyển hướng cho phép cá thể hóa/giảm số lần khám trực tiếp.
6. **Lịch khám 41-42 tuần/chuyển dạ**: không phải xung đột, nhưng đáng chú ý rằng khuyến nghị
   thay đổi rõ theo mốc tuần cụ thể (theo dõi từ tuần 41, cân nhắc khởi phát từ 41, khuyến
   nghị khởi phát trước/trong 42-42 tuần 6 ngày).

## Bổ sung trong Batch 4 (Chuyển dạ & Sinh)

5 nhánh (giai đoạn chuyển dạ & theo dõi tim thai, khởi phát chuyển dạ, giảm đau, rách tầng
sinh môn & VBAC, kẹp rốn/da kề da/giai đoạn 3/Apgar). 10 bài mới. acog.org, nice.org.uk,
cochranelibrary.com/cochrane.org (trang "/full") và ncbi.nlm.nih.gov/books bị chặn fetch trực
tiếp nhiều hơn hẳn các batch trước — phần lớn nội dung ACOG/NICE/Cochrane trong batch này đến
từ bản sao AAFP/SMFM/GuidelineCentral/OPQIC (đã fetch trực tiếp) hoặc tóm tắt tìm kiếm đã đối
chiếu chéo ≥2 nguồn độc lập.

⚠️ **URL suy luận theo mẫu (cần xác minh lại trước khi hiển thị công khai):** `acogCPG8`,
`acogCO814CordClamping`, `acogApgarScore` (mẫu theo cấu trúc acog.org/clinical/.../articles/
YYYY/MM/slug đã dùng ở các Committee Opinion khác); `whoCordClamping`, `whoIntrapartumCare`
(mã định danh IRIS của WHO ghi theo trí nhớ về tài liệu nổi tiếng, không phải agent dán lại);
`cochraneCordClamping`, `cochraneSkinToSkin`, `cochraneThirdStage` (mã CD suy theo mẫu URL
cochrane.org/evidence/ đã thấy ở các review khác cùng phiên); `unicefBFISkinToSkin` (URL theo
mẫu cấu trúc trang UNICEF UK Baby Friendly).

### Điểm CONFLICTING_EVIDENCE / thay đổi guideline đáng chú ý trong Batch 4
1. **Khởi phát chủ động ở tuần 39**: ACOG (Mỹ, sau thử nghiệm ARRIVE) đồng ý là hợp lý cho
   con so nguy cơ thấp; NICE (Anh) không áp dụng mốc này cho thai kỳ không biến chứng (bản dự
   thảo từng đề xuất một dạng hẹp hơn nhưng đã rút lại).
2. **Mốc bắt đầu pha hoạt động của chuyển dạ**: ACOG/SMFM (2014) đổi từ 4cm lên 6cm; NICE vẫn
   mô tả khoảng 4-5cm.
3. **Sinh dưới nước**: Cochrane khá cởi mở về ngâm nước giai đoạn 1; ACOG khuyến cáo rõ nên
   sinh trên cạn (giai đoạn 2), không sinh dưới nước, vì an toàn chưa được xác lập đầy đủ.
4. **Xử trí tích cực giai đoạn 3**: giảm mất máu ≥500ml có bằng chứng trung bình, nhưng giảm
   băng huyết NẶNG ≥1000ml được Cochrane đánh giá "chưa chắc chắn" (chất lượng bằng chứng rất
   thấp) — không phải một chiến thắng rõ ràng, có đánh đổi (buồn nôn, đau, tăng huyết áp).
5. **Định nghĩa băng huyết sau sinh (500ml/1000ml)**: WHO đang trong quá trình xem xét lại,
   từng tự nhận ngưỡng 500ml là "mang tính quy ước".
6. **Bằng chứng VBAC**: các con số nguy cơ vỡ tử cung chủ yếu từ nghiên cứu quan sát; Cochrane
   so sánh trực tiếp VBAC vs mổ lại chủ động chỉ có 2 thử nghiệm/320 sản phụ — bằng chứng RCT
   thực sự rất mỏng dù số liệu quan sát khá nhất quán.

## Bổ sung trong Batch 5 (Hậu sản sâu hơn)

5 nhánh (tử cung/táo bón-trĩ/vệ sinh-vận động, tình dục/tránh thai/kinh nguyệt, baby
blues/PPD/lo âu, loạn thần sau sinh & huyết khối, nhiễm trùng hậu sản & sepsis). 10 bài mới.
Đáng chú ý: **ACOG Clinical Practice Guideline No. 4 và No. 5 (2023, sức khỏe tâm thần chu
sinh)** được agent đọc TOÀN VĂN qua bản PDF mirror trên ilpqc.org (không phải chỉ tóm tắt) —
đây là nguồn chất lượng cao nhất trong batch này.

⚠️ **URL suy luận theo mẫu (cần xác minh lại):** `acogCO736`, `rcogVTE`, `nhsDVTPregnancy`,
`cdcVTEToolkit` (agent mô tả nội dung đã fetch/tương đương nhưng không dán lại URL chính xác
byte-for-byte; URL dùng ở đây theo đúng mẫu cấu trúc các trang cùng nhóm đã xác nhận).

### Điểm CONFLICTING_EVIDENCE / thay đổi guideline đáng chú ý trong Batch 5
1. **Thời gian nguy cơ huyết khối tĩnh mạch tăng cao sau sinh**: NHS/RCOG nói 6 tuần; CDC nói
   tới 3 tháng.
2. **Khoảng cách khuyến nghị giữa các lần sinh**: WHO tối thiểu 24 tháng; ACOG (Mỹ) linh hoạt
   hơn nhiều (tránh dưới 6 tháng, cân nhắc kỹ nếu dưới 18 tháng).
3. **Hiệu quả của LAM (vô kinh cho con bú)**: số liệu quan sát hay trích dẫn "trên 98%" vs.
   tổng quan Cochrane thận trọng hơn (không thấy khác biệt rõ so với chỉ bú mẹ vô kinh không
   tư vấn riêng).
4. **Cửa sổ chẩn đoán DSM-5 của trầm cảm sau sinh**: chính thức chỉ tính trong 4 tuần đầu sau
   sinh, nhưng CDC và đa số chuyên gia lâm sàng mở rộng theo dõi đến 12 tháng trong thực hành —
   đã ghi rõ đây là một khác biệt thuật ngữ có chủ đích, không phải nhầm lẫn.
5. **Tỷ lệ trầm cảm sau sinh**: ACOG ghi "1/7" (14%), CDC ghi "1/8" (~12.5%) — phương pháp đo
   khác nhau, không tự chọn một số.
6. **Nguy cơ tái phát loạn thần sau sinh nếu có tiền sử rối loạn lưỡng cực**: dao động rất rộng
   giữa các nghiên cứu (7%-46%+) — trình bày định tính ("tăng đáng kể") thay vì một con số duy nhất.

## Bổ sung trong Batch 6 (Trẻ 1–6 tháng)

5 nhánh (giấc ngủ & sleep regression, thị giác/thính giác/mốc xã hội, phát triển vận động,
biểu đồ tăng trưởng & tiêm chủng, quấy khóc/trào ngược/bập bẹ). 9 bài mới.

### Phát hiện quan trọng nhất của Batch 6: CDC đã cập nhật bảng mốc phát triển năm 2021-2022
Nhiều mốc quen thuộc đã bị DỜI SANG TUỔI MUỘN HƠN so với các bảng cũ vẫn còn lưu hành phổ biến:
- Ngồi vững không cần đỡ: cũ ~6 tháng → hiện tại **9 tháng**.
- Chuyển đồ vật qua hai tay: cũ ~6-8 tháng → hiện tại **9 tháng**.
- Phản ứng khi được gọi tên: cũ ~6 tháng → hiện tại **9 tháng**.
- Bập bẹ lặp âm rõ ràng "ba-ba"/"ma-ma": cũ ~6 tháng → hiện tại **9 tháng**.
- CDC cũng đã BỎ danh sách "dấu hiệu cảnh báo" liệt kê riêng theo từng mốc tháng, thay bằng
  khung câu hỏi mở chung ("có điều gì khiến bạn lo lắng không?").

Toàn bộ nội dung Batch 6 đã viết theo đúng các mốc CẬP NHẬT này, và chủ động ghi chú sự khác
biệt để không gây hiểu lầm cho phụ huynh đọc phải tài liệu cũ ở nơi khác.

⚠️ **Khuyến nghị rà soát lại 2 bài cũ đã có trước batch này** (`choi-va-phat-trien-1-3-thang`,
`phat-trien-3-6-thang`) để xác nhận không dùng các mốc tuổi cũ đã lỗi thời — chưa chỉnh sửa
trong batch này vì đây là quyết định cần rà soát riêng, không tự ý sửa nội dung đã publish.

### Điểm khác biệt khác đáng chú ý
- "Sleep regression 4 tháng" xác nhận KHÔNG phải thuật ngữ chính thức (AAP/NHS/NICHD không dùng).
- Nghiên cứu Pennestri 2018 định nghĩa "ngủ xuyên đêm" chỉ là mạch ngủ liên tục 6 giờ, không
  phải nguyên đêm 10-12 giờ.
- CDC xác nhận chính thức KHÔNG khuyến nghị dùng hạ sốt dự phòng trước/ngay lúc tiêm chủng.
- Lịch tiêm 2-3-4 tháng của Việt Nam (Quyết định 845/QĐ-BYT) chỉ xác minh ở mức độ vừa phải do
  không truy cập trực tiếp được moh.gov.vn/tiemchungmorong.vn trong phiên nghiên cứu.

## Bổ sung trong Batch 7 (Trẻ 6–12 tháng)

5 nhánh (BLW/ọe-hóc/nước uống, vận động thô, nhận thức-xã hội, ngôn ngữ, sữa tiếp
tục/mọc răng). 10 bài mới.

### Tiếp tục xu hướng từ Batch 6: nhiều mốc CDC còn muộn hơn nữa
- Bò (crawling): KHÔNG còn là mốc trong bảng CDC hiện tại (bỏ hẳn).
- Đi vài bước độc lập: mốc 15 tháng (không phải 12 tháng).
- Đi vững hoàn toàn: mốc 18 tháng.
- Chỉ trỏ để yêu cầu: mốc 15 tháng; chỉ trỏ để chia sẻ: mốc 18 tháng (cả hai ngoài phạm vi
  6-12 tháng, dễ bị gán nhầm là mốc sớm hơn).
- Trang tư vấn tiêu dùng của AAP (HealthyChildren.org) về vận động 8-12 tháng vẫn dùng khung
  "khoảng 1 tuổi biết đi" — CHƯA cập nhật theo bảng CDC 2022 mới hơn — đây là độ trễ thật giữa
  hai loại tài liệu của cùng một hệ thống (CDC vs AAP consumer site).

### Điểm CONFLICTING_EVIDENCE / đáng chú ý khác
1. **BLW và lượng sắt/tăng trưởng**: kết quả nghiên cứu mâu thuẫn thật sự giữa các tổng quan —
   không tự chọn bên.
2. **Mọc răng và chán ăn**: một phân tích tổng hợp bình duyệt (Pediatrics) tìm thấy liên quan
   với giảm ăn thức ăn đặc, nhưng NHS/AAP KHÔNG liệt kê đây là triệu chứng chính thức — khoảng
   trống thật giữa bằng chứng khoa học và tài liệu tư vấn phổ thông.
3. **Thời điểm cai bình sữa**: AAP 12-18 tháng; NHS khuyến nghị hạn chế ngay từ 1 tuổi.
4. **AAP kêu gọi cấm xe tập đi có bánh** — không giúp biết đi sớm hơn, thậm chí có thể làm
   chậm, và nguy cơ chấn thương cao (chủ yếu ngã cầu thang).

## Bổ sung trong Batch 8 (Trẻ 1–3 tuổi)

5 nhánh (mốc vận động 15-36 tháng, tập ngồi bô, ngôn ngữ-nhận thức & màn hình, sức khỏe răng
miệng, kỷ luật tích cực & sàng lọc tự kỷ). 8 bài mới. Nhánh sức khỏe răng miệng đọc trực tiếp
toàn văn nhiều PDF chính sách AAPD (2022-2024) — nguồn chất lượng cao nhất batch này.

### Tiếp tục hiệu chỉnh mốc phát triển CDC
- Nói cụm 2 từ: mốc 24 tháng (không phải 18 tháng).
- Làm theo hướng dẫn 2 bước, chơi giả vờ: mốc 30 tháng (không phải 24 tháng).
- Ném bóng qua vai, leo cầu thang luân phiên chân: KHÔNG còn trong bảng mốc CDC hiện tại.
- Tay thuận xuất hiện RẤT SỚM (6-8 tháng, không phải 12-18 tháng như batch trước từng ghi) là
  dấu hiệu cần lưu ý — đã sửa lại chính xác hơn trong batch này.

### Điểm CONFLICTING_EVIDENCE / thay đổi guideline đáng chú ý
1. **Thời điểm bắt đầu tập ngồi bô**: NHS nói cứ bắt đầu trong 18 tháng-2.5 tuổi không cần
   chờ dấu hiệu; AAP nhấn mạnh nên chờ dấu hiệu sẵn sàng — khác biệt thật.
2. **Phương pháp tập ngồi bô**: thường được gọi là "review Cochrane" nhưng thực ra là báo cáo
   bằng chứng AHRQ (2006), không phải Cochrane thật — đã ghi chú rõ để tránh gọi sai tên.
3. **Sàng lọc tự kỷ đại trà**: AAP khuyến nghị sàng lọc mọi trẻ ở 18&24 tháng; USPSTF xếp mức
   "I" (chưa đủ bằng chứng) cho trẻ không có dấu hiệu nghi ngờ.
4. **Thời gian màn hình**: WHO (2019) vẫn giữ mốc 1 giờ/ngày cho 2-5 tuổi; AAP có vẻ đã đổi
   hướng năm 2026 sang không giới hạn giờ cố định — cần cập nhật lại khi có xác nhận chắc chắn
   hơn từ toàn văn chính sách AAP (agent không fetch được toàn văn, chỉ qua báo chí thứ cấp).
5. **Công thức "time-out 1 phút/tuổi"**: là hướng dẫn thực hành của AAP, chưa có thử nghiệm
   liều lượng riêng kiểm chứng con số này.

## Chưa xử lý / cần nghiên cứu thêm

- Viện Dinh dưỡng Quốc gia Việt Nam — chưa có nguồn được trích dẫn trong batch này.
- Danh sách đầy đủ "Acceptable medical reasons for use of breast-milk substitutes" của
  WHO/UNICEF (WHO/FCH/CAH/09.01, 2009) — xác nhận tài liệu tồn tại nhưng chưa fetch được
  toàn văn (403 trên iris.who.int, PAHO, NCBI Bookshelf). Không trích dẫn danh sách chi tiết
  trong app cho tới khi xác minh được toàn văn.
- Bảng RUSP (Recommended Uniform Screening Panel) số lượng bệnh sàng lọc chính xác hiện tại —
  HRSA trang chính thức bị chặn fetch (403), số liệu giữa các nguồn phụ không khớp nhau hoàn
  toàn — không đưa số lượng cụ thể vào app.

## Bổ sung trong Batch 9 (Dinh dưỡng chuyên sâu)

5 nhánh (cá biển/thủy ngân/caffeine; i-ốt/choline/B12; thảo dược & chất tạo ngọt; quan niệm dân
gian rau ngót/dứa/nước dừa/mè đen/đu đủ/hải sản; đồ cay/đồ lạnh & chế độ ăn mẹ ảnh hưởng sữa &
kiêng khem sau sinh). 13 bài mới. acog.org, nice.org.uk, ods.od.nih.gov, iris.who.int, và nhiều
trang ncbi.nlm.nih.gov/PMC bị chặn fetch trực tiếp (402/403) xuyên suốt batch này — phần lớn
nội dung liên quan các trang này được xác nhận qua trích dẫn tìm kiếm (search snippet) thay vì
đọc toàn văn, đã ghi chú rõ trong từng bài nghiên cứu gốc của agent.

### ⚠️ URL suy luận theo mẫu / cần xác minh thêm
- `acogSeafoodAdvisory2017` — agent không fetch được acog.org trực tiếp (402); URL được suy luận
  theo mẫu đặt tên trang ACOG Practice Advisory tương tự các trang khác đã xác nhận trong các
  batch trước. Cần xác minh thủ công trước khi hiển thị công khai.

### Điểm CONFLICTING_EVIDENCE / thay đổi guideline đáng chú ý
1. **Caffeine khi mang thai**: ACOG và NHS thực ra ĐỒNG THUẬN ở mức <200mg/ngày (không phải 3
   ngưỡng khác nhau như đôi khi truyền miệng); nhưng Cochrane 2015 không thấy hạn chế caffeine
   thay đổi kết cục thai kỳ rõ ràng, trong khi nghiên cứu quan sát mới hơn gợi ý nguy cơ tăng
   theo liều — chưa xác định ngưỡng an toàn tuyệt đối. Ghi CONFLICTING trong nội dung bài.
2. **I-ốt**: con số khuyến nghị khác nhau thật sự giữa CDC/NIH Hoa Kỳ (220-290mcg/ngày) và WHO
   (250mcg/ngày) — không giải quyết, trình bày cả hai.
3. **Chất tạo ngọt nhân tạo**: FDA cho là an toàn trong giới hạn ADI kể cả khi mang thai; WHO
   (2023) khuyến cáo KHÔNG dùng để kiểm soát cân nặng/bệnh, áp dụng cho mọi người kể cả phụ nữ
   mang thai, dựa trên tín hiệu độ tin cậy thấp từ nghiên cứu quan sát — khác biệt thật, đã ghi
   rõ trong bài, không thiên vị bên nào.
4. **Rau ngót/papaverine**: có cơ sở hóa thực vật (alkaloid được xác định là papaverine trong
   một xét nghiệm cũ) nhưng KHÔNG có nghiên cứu lâm sàng trên người xác nhận nguy cơ sảy thai —
   agent còn lưu ý việc xác định hóa học "papaverine" trong rau ngót chưa được tái xác nhận
   bằng phương pháp hiện đại.
5. **Đu đủ xanh vs chín**: bằng chứng thực nghiệm (mô hình chuột, 2002) cho thấy nhựa mủ đu đủ
   XANH gây co bóp tử cung, đu đủ CHÍN thì không — nhưng đây là dữ liệu động vật, chưa có
   nghiên cứu người; chưa rõ ảnh hưởng của việc nấu chín đến hoạt tính nhựa mủ.
6. **Kiêng khem sau sinh**: khuyến nghị chính thức (NICE/CDC) yêu cầu TĂNG calo và ĐA DẠNG thực
   phẩm sau sinh, ngược hướng với kiêng khem nghiêm ngặt truyền thống; một nghiên cứu khu vực
   (Lào, không phải Việt Nam) cho thấy kiêng khem nghiêm ngặt thực sự làm giảm đa dạng dinh
   dưỡng đã thấp sẵn — dữ liệu khu vực gần nhất tìm được, không phải nghiên cứu trên phụ nữ
   Việt Nam.
7. **Dị ứng đạm sữa bò qua sữa mẹ**: là hiện tượng THẬT, hẹp, có bằng chứng lâm sàng mạnh (ABM
   Protocol #24, Children 2025) — khác hẳn quan niệm dân gian rộng "mẹ ăn gì con bị vậy"; cần
   phân biệt rõ trong nội dung để không hợp thức hóa kiêng khem quá mức.
8. **Thảo dược lợi sữa (galactagogue)**: Cochrane 2020 chỉ tìm thấy bằng chứng ĐỘ TIN CẬY THẤP
   cho mọi loại (thảo dược lẫn dược phẩm) — không phải "không hiệu quả" mà "chưa đủ bằng chứng
   chất lượng cao".

## Chưa xử lý / cần nghiên cứu thêm (Batch 9)

- Chưa xác minh trực tiếp được từ acog.org: nội dung herbal products, galactagogue, seafood
  advisory — mọi trích dẫn ACOG trong batch này đều qua nguồn thứ cấp, cần một lượt xác minh
  lại khi có công cụ fetch khác vượt được chặn truy cập.
- Chưa tìm được nghiên cứu Việt Nam cụ thể (không phải khu vực lân cận) cho chủ đề kiêng khem
  sau sinh và an toàn vi sinh hải sản có vỏ tại Việt Nam.

## Bổ sung trong Batch 10 (Tiêm chủng chi tiết)

4 nhánh (lịch TCMR Việt Nam + so sánh quốc tế; HPV/não mô cầu/cúm/COVID; huyền thoại an toàn
vaccine MMR-tự kỷ/thimerosal/nhôm/quá tải miễn dịch; do dự vaccine & lịch tiêm chậm tại Việt
Nam). 10 bài mới. Văn bản gốc Thông tư 52/2025/TT-BYT và Quyết định 1575/QĐ-BYT tồn tại dưới
dạng PDF/hình ảnh hoặc bị chặn fetch trực tiếp — lịch TCMR được đối chiếu từ nhiều nguồn thứ
cấp (HCDC, VNVC, bệnh viện nhi) thay vì đọc trực tiếp văn bản pháp quy gốc.

### ⚠️ Cần xác minh thêm / lưu ý đặc biệt
- Toàn bộ lịch TCMR chi tiết theo tháng tuổi (bài `lich-tiem-chung-mo-rong-tcmr-chi-tiet-theo-thang-tuoi`)
  nên được một người rành tiếng Việt xác nhận lại với văn bản Thông tư 52/2025/TT-BYT gốc trước
  khi hiển thị công khai — agent bị chặn fetch (403/PDF-hình ảnh) văn bản chính, chỉ đối chiếu
  qua nguồn thứ cấp.
- **Lịch tiêm chủng ở Mỹ đang trong tranh chấp pháp lý thật (2025-2026)**: ACIP được tái cấu trúc
  dưới Bộ trưởng Y tế Mỹ mới đã đổi một số khuyến nghị (HPV 1 liều, hạ cấp một số vắc-xin xuống
  "quyết định lâm sàng chia sẻ"); AAP kiện và ra lịch tiêm riêng của mình (khác CDC lần đầu từ
  1995); tòa án liên bang đã tạm đình chỉ các thay đổi này (16/3/2026) nhưng đang kháng cáo. Nội
  dung app phản ánh lịch ĐÃ ĐƯỢC KHÔI PHỤC theo phán quyết tòa (gần với lịch trước 6/2025), có
  ghi chú rõ đây là lĩnh vực đang biến động, không khẳng định một lịch "vĩnh viễn đúng".
- HPV tại Việt Nam: ngày thí điểm/mở rộng toàn quốc (1/7/2026) dựa trên báo chí trong nước trích
  dẫn quyết định Bộ Y tế — chưa đọc trực tiếp văn bản Quyết định 2780/QĐ-BYT.

### Điểm CONFLICTING_EVIDENCE / thay đổi guideline đáng chú ý
1. **Số liều HPV**: CDC/ACIP (hành động tháng 4/2025) hướng tới 1 liều đủ cho hầu hết trẻ 9-14
   tuổi; AAP trong lịch 2026 riêng vẫn giữ 2 liều — bất đồng thật giữa hai cơ quan lớn.
2. **Nhôm trong vắc-xin và hen suyễn**: một nghiên cứu Mỹ nhỏ hơn (2022) từng gợi ý tín hiệu;
   nghiên cứu Đan Mạch lớn hơn nhiều (2025, 1,2 triệu trẻ/24 năm) không xác nhận tín hiệu này ở
   hen suyễn/tự miễn/rối loạn phát triển thần kinh — trình bày trung thực là câu hỏi khoa học đã
   được đặt ra và sau đó trả lời bằng dữ liệu lớn hơn, không giấu tín hiệu ban đầu.
3. **COVID-19 cho trẻ tại Mỹ**: đang trong giai đoạn tranh cãi/thay đổi liên tục giữa CDC và AAP
   — ghi nhận trung lập, không thiên vị bên nào, và nêu rõ Việt Nam có cách tiếp cận riêng (chỉ
   khuyến nghị nhóm nguy cơ cao).
4. **Ngưỡng hoãn tiêm khi ốm nhẹ**: CDC/WHO dùng ngôn ngữ định tính ("bệnh cấp tính vừa-nặng");
   Việt Nam (Quyết định 1575/QĐ-BYT) quy định ngưỡng số cụ thể (38°C/35,5°C, 2000g, 34 tuần thai)
   — khác biệt về cách trình bày, không phải khác biệt nguyên tắc.

## Chưa xử lý / cần nghiên cứu thêm (Batch 10)

- Chưa xác nhận được liệu Thông tư 52/2025/TT-BYT có bao gồm COVID-19 trong danh mục vắc-xin
  bắt buộc cho trẻ em hay không — nguồn tìm được không đề cập rõ chi tiết này.
- Chưa tìm được dữ liệu dịch ho gà (pertussis) cụ thể tại Việt Nam gần đây — chỉ có dữ liệu về
  tỷ lệ bao phủ tiêm chủng phục hồi (DTP1 99%, DTP3 97% năm 2024), không có số ca dịch cụ thể.
- Chưa tìm được tài liệu Bộ Y tế Việt Nam đặt tên trực tiếp quan niệm "quá tải miễn dịch" hoặc
  "hoãn tiêm khi con bị cảm nhẹ" như một lầm tưởng được liệt kê chính thức — có thể do giới hạn
  tìm kiếm, không phải bằng chứng quan niệm này không tồn tại ở Việt Nam.

## Bổ sung trong Batch 11 (Sơ cứu & An toàn)

4 nhánh (hóc nghẹn/CPR/đuối nước; bỏng/chấn thương đầu/ngộ độc/pin cúc áo; ghế ô tô & xe máy &
an toàn trong nhà tại Việt Nam; an toàn thuốc & số cấp cứu Việt Nam). 13 bài mới. Đây là batch
có yêu cầu độ chính xác cao nhất trong toàn dự án (nội dung sơ cứu sai chi tiết có thể gây hại
thật) — mọi số liệu/kỹ thuật đều được đối chiếu ít nhất 1 nguồn Tier A/B, và các điểm KHÔNG xác
minh được (đặc biệt số điện thoại) đều KHÔNG đưa vào app thay vì đoán.

### ⚠️ Quyết định quan trọng: KHÔNG đưa số điện thoại Trung tâm Chống độc Bạch Mai vào app
Agent tìm thấy 2 số điện thoại khác nhau từ 2 lần fetch trang chính thức Bệnh viện Bạch Mai,
không thể xác minh số nào đúng. Theo đúng nguyên tắc "không bịa số điện thoại/liều thuốc", app
CHỈ dùng số **115** (đã xác minh qua Thông tư 22/2014/TT-BTTTT) làm số cấp cứu chung, không đưa
ra số trung tâm chống độc cụ thể nào.

### ⚠️ Hướng dẫn sơ cứu hóc nghẹn/CPR vừa được AHA/AAP cập nhật lớn (22/10/2025)
Đây là lần sửa đổi toàn diện đầu tiên kể từ 2020 — nội dung app đã cập nhật theo hướng dẫn MỚI
NHẤT: (1) hóc nghẹn trẻ ≥1 tuổi nay dùng vỗ lưng + ép bụng xen kẽ (trước đây AHA chỉ dùng ép
bụng); (2) ép ngực trẻ sơ sinh đổi từ kỹ thuật 2 ngón tay sang gót bàn tay/2 ngón cái ôm quanh
ngực; (3) mốc chuyển tỷ lệ CPR 2 người cứu hộ từ "8 tuổi cố định" sang "dấu hiệu dậy thì". Một
số trang nguồn gốc (ahajournals.org, professional.heart.org) bị chặn fetch trực tiếp — nội dung
đối chiếu qua thông cáo báo chí AHA + một bài tổng quan bình duyệt độc lập.

### Điểm CONFLICTING_EVIDENCE / khác biệt đáng chú ý
1. **Thời gian xả nước khi bỏng**: NHS khuyến nghị 20 phút; AAP/Hiệp hội Bỏng Hoa Kỳ khuyến
   nghị tối thiểu 5 phút — khác biệt thật giữa hai nguồn uy tín, đã trình bày cả hai kèm xu
   hướng nghiên cứu mới nghiêng về 20 phút.
2. **Xen kẽ/kết hợp paracetamol-ibuprofen**: hướng dẫn AAP truyền thống khuyên chỉ dùng một
   loại; phân tích gộp 2024 (chính AAP công bố) + Cochrane cho thấy có thể có lợi ích hạ sốt
   thêm — nhưng AAP vẫn thận trọng vì nguy cơ nhầm liều. App giữ khuyến nghị thận trọng làm mặc
   định, có giải thích rõ đây là do an toàn liều dùng chứ không phải "không hiệu quả".
3. **Ghế ô tô trẻ em tại Việt Nam**: luật mới có hiệu lực 1/7/2026 nhưng mức phạt đã giảm xuống
   chỉ còn cảnh cáo từ 15/8/2026 — một quy định đang trong giai đoạn điều chỉnh nhanh, đã ghi rõ
   để tránh app trở nên lỗi thời.
4. **"Đuối nước khô/thứ phát"**: không phải điểm gây tranh cãi khoa học thật — WHO/AAP/Hội Chữ
   thập đỏ đồng thuận đây không phải bệnh lý có thật, đã trình bày dứt khoát thay vì mập mờ.

## Chưa xử lý / cần nghiên cứu thêm (Batch 11)

- Số điện thoại chính xác của Trung tâm Chống độc Bạch Mai cần một người gọi trực tiếp xác
  nhận trước khi có thể đưa vào app.
- Chưa tìm được thống kê chính thức tại Việt Nam cho bỏng nước nóng và té ngã ban công/cửa sổ
  — chỉ có bằng chứng cơ chế/vụ việc thực tế, không có số liệu thống kê quốc gia.
- Chưa tìm được hướng dẫn chính thức về độ tuổi tối thiểu chở trẻ nhỏ/sơ sinh trên xe máy tại
  Việt Nam.
- Văn bản gốc quy tắc quyết định lâm sàng PECARN (Lancet 2009) chưa được đọc trực tiếp toàn văn
  — nội dung đối chiếu qua các nguồn thứ cấp/tổng quan bình duyệt độc lập.

## Bổ sung trong Batch 12 (Thực hành dân gian Việt Nam, mở rộng)

4 nhánh (nằm than/tắm lá/kiêng tắm/thực hành sơ sinh; cạo gió/giật kinh phong/quan niệm vía/
mọc răng; nặn mũi/chân vòng kiềng/bụ bẫm-ép ăn/tập ngồi-đứng sớm; lễ đầy tháng-thôi nôi/dự đoán
giới tính/kiêng cữ xã hội & sức khỏe tâm thần). 14 bài mới. Đây là batch có nhiều ca việc thật
được ghi nhận nhất trong dự án (tử vong/thương tích thật tại Việt Nam), đồng thời có 2 bài
mang tính văn hóa thuần túy (quan niệm vía, lễ đầy tháng/thôi nôi) được xử lý tôn trọng, không
gán nhãn khoa học sai chỗ.

### ⚠️ URL suy luận theo mẫu / cần xác minh thêm
- `camphorToxicityCoinRubbing2002` (JAMA 2002;288(1):45, ca ngộ độc long não do cạo gió) — agent
  chỉ cung cấp trích dẫn tạp chí/số trang, không có URL trực tiếp; URL hiện dùng suy luận theo
  mẫu jamanetwork.com, cần xác minh trước khi hiển thị công khai.
- `tuoiTreSoCuuSaiCachCoGiat` (cảnh báo sơ cứu sai cách khi trẻ co giật, BS. Dương Thị Huyền
  Trang) — agent không cung cấp URL bài viết cụ thể; hiện chỉ trỏ về trang chủ tuoitre.vn, cần
  tìm lại đường dẫn chính xác trước khi hiển thị công khai.

### Điểm đáng chú ý / phân loại quan trọng
1. **Nằm than sau sinh**: khác với phần lớn quan niệm dân gian khác trong dự án, đây có HỒ SƠ
   TỬ VONG THẬT (Gia Lai, Việt Nam + 2 ca tại Brunei theo báo cáo y văn) — gắn nhãn
   POTENTIALLY_HARMFUL dứt khoát, không mập mờ.
2. **Quấn chân thẳng "chống vòng kiềng"**: phát hiện quan trọng — đây là yếu tố nguy cơ THẬT của
   loạn sản khớp háng (DDH), tức niềm tin dân gian không chỉ vô ích mà còn có hại theo hướng
   ngược lại hoàn toàn với ý định ban đầu.
3. **Cạo gió và nhầm lẫn bạo hành trẻ em ("pseudobattering")**: đây là hiện tượng lâm sàng có
   tên riêng, y văn ghi nhận từ 1976, không phải suy đoán — đã trình bày với đầy đủ trích dẫn
   lịch sử.
4. **Quan niệm "vía" và lễ đầy tháng/thôi nôi**: xử lý khác với các bài "myth vs fact" khác —
   đây là niềm tin/nghi lễ văn hóa thuần túy, KHÔNG gán nhãn "đúng/sai khoa học", chỉ nêu góc độ
   thực hành liên quan (quá tải kích thích khi tiệc đông khách) nếu có.
5. **Dự đoán giới tính dân gian**: phân biệt rõ 2 phương pháp ĐÃ bị bác bỏ bằng nghiên cứu thật
   (nhịp tim thai, lịch âm — cả hai đều có nghiên cứu dân số lớn) với các phương pháp CHƯA được
   kiểm chứng trực tiếp (hình dáng bụng, thèm ăn, nam tả nữ hữu) — tránh gộp chung thành "đã bác
   bỏ" khi thực ra chỉ là "chưa nghiên cứu".
6. **Kiêng cữ xã hội & sức khỏe tâm thần**: bằng chứng khu vực (Trung Quốc/Hàn Quốc, KHÔNG phải
   Việt Nam) cho thấy chất lượng hỗ trợ/mức độ cô đơn quan trọng hơn bản thân việc kiêng cữ —
   phát hiện phức tạp hơn "kiêng cữ tốt" hay "có hại" đơn giản, đã trình bày đầy đủ sắc thái.

## Chưa xử lý / cần nghiên cứu thêm (Batch 12)

- Chưa tìm được nghiên cứu xác nhận niềm tin "vía"/tâm linh khiến gia đình trì hoãn điều trị y
  khoa thật sự tại Việt Nam — đã nêu rõ đây là khoảng trống, không khẳng định.
- Chưa tìm được nghiên cứu dịch tễ học trực tiếp tại Việt Nam về kiêng cữ và trầm cảm sau sinh
  — chỉ có bằng chứng khu vực (Trung Quốc, Hàn Quốc).
- Bài báo Springer (Viero et al. 2019, tổng quan y pháp về thương tích do thực hành dân gian)
  và tóm tắt PubMed của Aydemir et al. 2009 chưa đọc được toàn văn — chỉ qua tóm tắt.

## Bổ sung trong Batch 13 (Myth vs Fact)

4 nhánh (huyền thoại nuôi con chung: đường-tăng động/bế nhiều-hư/đọc sách sớm/ướt tóc-cảm lạnh/
cry-it-out/mốc phát triển cũ; huyền thoại thực hành cụ thể: sữa loãng/bụ bẫm tự gầy/wake windows/
bú hết bình/mọc răng-trí tuệ/dồn vắc-xin; huyền thoại thai kỳ/chuyển dạ: ợ nóng-tóc/giơ tay-dây
rốn/quan hệ khi mang thai/ngày dự sinh/gây chuyển dạ tự nhiên/gây tê ngoài màng cứng; huyền
thoại cho con bú/cơ thể: ngực nhỏ-ít sữa/vệ sinh núm vú/chảy xệ/LAM/bó bụng/stress-mất sữa).
24 huyền thoại được nghiên cứu, gộp thành 4 bài dạng myth-vs-fact (mỗi bài 6 mục CLAIM/VERDICT/
EXPLANATION). Đây là batch duy nhất dùng định dạng verdict rõ ràng (ĐÚNG/SAI/ĐÚNG MỘT PHẦN/
KHÔNG ĐỒNG NHẤT) thay vì văn phong hai lớp thông thường.

### Điểm đáng chú ý
1. **"Ợ nóng = con nhiều tóc"**: hiếm hoi trong số các quan niệm dân gian — CÓ một nghiên cứu
   bình duyệt thật (Johns Hopkins 2006, n=64) tìm thấy tương quan có ý nghĩa thống kê, dù cỡ mẫu
   nhỏ và chưa lặp lại — verdict "ĐÚNG MỘT PHẦN", không phải "hoàn toàn bịa đặt".
2. **"Đường gây tăng động"**: bác bỏ triệt để bằng 23 thử nghiệm mù đôi (JAMA 1995); nghiên cứu
   đi kèm cho thấy hiệu ứng thực chất đến từ KỲ VỌNG của cha mẹ, không phải sinh lý — một trong
   những phát hiện "vì sao huyền thoại vẫn tồn tại" rõ ràng nhất trong dự án.
3. **Mốc "biết đi" — sửa lại chính xác**: CDC 2022 đổi ngưỡng bách phân vị (50%→75%), khiến mốc
   biết đi độc lập chuyển từ ~12 tháng (bảng cũ) sang 18 tháng (hiện tại) — đây là mốc phổ biến
   nhất còn bị hiểu sai theo bảng cũ, được chọn làm ví dụ myth-vs-fact vì tác động thực tế lớn
   đến lo lắng của cha mẹ.
4. **"Wake window"**: xác nhận đây là thuật ngữ do ngành tư vấn giấc ngủ tạo ra (không có trong
   y văn nhi khoa chính thức, 0 kết quả PubMed) — cần nói rõ với phụ huynh hay tham khảo nội
   dung mạng xã hội về "khung giờ thức" chính xác theo phút.
5. **"Dồn vắc-xin lại tiêm 1 lần cho đỡ đau"**: mục tiêu chính đáng nhưng cách hiểu sai — CDC/
   ACIP đã khuyến nghị tiêm ĐỒNG THỜI mọi mũi đến hạn trong CÙNG một lần khám (không phải hoãn
   lịch để gộp); thử nghiệm ngẫu nhiên cho thấy tiêm đồng thời còn ít đau hơn tiêm tuần tự.
6. **LAM (vô kinh cho con bú)**: là phương pháp tránh thai có thật, ~98% hiệu quả, nhưng CHỈ khi
   đủ 3 tiêu chuẩn Bellagio đồng thời — quan niệm phổ biến bỏ qua các điều kiện này.

## Chưa xử lý / cần nghiên cứu thêm (Batch 13)

- Myth 2 (bé bụ bẫm/béo phì sau này) — con số hiệu ứng chính xác của Baird et al. 2005 (BMJ)
  chưa xác minh trực tiếp, chỉ qua trích dẫn thứ cấp.
- Myth 5 (mọc răng và IQ) — nghiên cứu duy nhất tìm được về chủ đề này bị chặn fetch toàn văn
  (chỉ qua tóm tắt ResearchGate), độ tin cậy thấp, không nên trích dẫn số liệu cụ thể.
- Một số nguồn ABM Protocol #36, Cochrane CD011248, LLL/Cregan-Hartmann PDF bị chặn fetch toàn
  văn (cookie wall/402/403) — nội dung đối chiếu qua tóm tắt tìm kiếm, cần xác minh lại nếu cần
  trích dẫn chính xác từng câu.

## Bổ sung trong Batch 14 (Parent FAQ) — BATCH CUỐI CÙNG CỦA DỰ ÁN

4 nhánh (tình huống sơ sinh thực tế: nấc cụt/đảo ngày-đêm/rốn/vàng da/hăm tã/đầy hơi; ăn uống-
hành vi-phát triển trẻ tập đi: biếng ăn/táo bón/cắn bạn/nói lắp/ti giả/ăn vạ; thai kỳ-hậu sản
thực tế: ốm nghén nặng/tiểu đường thai kỳ/tập thể dục sau sinh/nứt núm vú/hỗ trợ gia đình/baby
blues-PPD; hậu cần chăm con: tuổi đi nhà trẻ/ốm có nên đi học/chuẩn bị có em/màn hình lúc ăn/
tranh giành anh chị em/đi máy bay). 24 câu hỏi thực tế, gộp thành 5 bài dạng Hỏi-Đáp.

### ⚠️ Cần xác minh thêm
- Chính sách AAPD về ti giả (mốc 3 tuổi) chỉ xác nhận qua tóm tắt tìm kiếm, PDF gốc không
  parse được trực tiếp — đối chiếu độc lập qua Hiệp hội Chỉnh nha Hoa Kỳ nên độ tin cậy vẫn khá
  cao, nhưng nên xác minh lại nếu cần trích dẫn chính xác.
- Ngưỡng sốt cụ thể để nghỉ học tại Việt Nam (VIHEMA) không fetch được trực tiếp (403) — app chỉ
  dùng ngưỡng CDC/AAP/CFOC đã xác minh, không đưa ra con số riêng cho Việt Nam.
- "5mm" ngưỡng đỏ lan quanh rốn (nghi viêm rốn) không xác minh được từ StatPearls gốc — chỉ dùng
  mô tả định tính (đỏ lan rộng), không dùng con số cụ thể trong nội dung app.

### Điểm đáng chú ý
1. **Vàng da tại nhà**: cách kiểm tra thực tế bằng ánh sáng tự nhiên + quy luật lan đầu-xuống-
   chân là hướng dẫn hành động cụ thể nhất có thể đưa cho cha mẹ, thay vì chỉ nói "theo dõi".
2. **Đầy hơi/rặn sơ sinh**: xác nhận tiêu chuẩn Rome IV — điểm quyết định là TÍNH CHẤT PHÂN
   (mềm/màu bình thường), không phải mức độ ồn ào/gắng sức khi rặn.
3. **Nhà trẻ và gắn kết mẹ-con**: nghiên cứu NICHD lớn nhất về chủ đề này xác nhận CHẤT LƯỢNG
   chăm sóc/độ nhạy cảm của mẹ quan trọng hơn tuổi bắt đầu đi nhà trẻ — bác bỏ trực tiếp lo ngại
   phổ biến "gửi trẻ sớm sẽ hại gắn kết".
4. **Xử lý tranh giành anh chị em**: phát hiện phản trực giác — luôn bênh vực em nhỏ hơn khi
   tranh giành có liên quan đến việc hai anh chị em SAU ĐÓ chơi với nhau ÍT hơn, không phải
   nhiều hơn.

## Tổng kết cuối dự án
Đây là batch thứ 14 và cũng là batch CUỐI CÙNG theo kế hoạch ban đầu (14 batch). Xem báo cáo
tổng kết toàn dự án ở cuối `RESEARCH_STATUS.md`.
