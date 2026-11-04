# Prenatal records

A visit may combine an examination and an ultrasound report. Changing its display type must preserve already recorded values, including fields temporarily hidden by the form.

- `fetalHeartRate` stores the measurement on the primary report; `clinicalFetalHeartRate` separately stores the fetal heart rate transcribed from the examination booklet. Neither overwrites the other.
- `maternalPulse` is the mother's pulse, independent of both fetal measurements.
- Optional values remain null when the supplied document does not record a measurement. Null edema differs from explicitly absent edema. A blank urine result is not a negative result.
- `checkedAtTimeKnown = false` means the timestamp stores the calendar date at UTC midnight solely as a date carrier. Render its UTC date and omit time. Existing records default to true for compatibility.
- `placentaGrade` is the lower or exact grade; optional `placentaGradeUpper` represents a recorded range, such as 2–3.
- `afiMm` stores AFI in millimetres, separately from the descriptive `amnioticFluid` field. Doppler measurements, estimated-weight percentile/error, and nuchal-cord loops have independent optional fields.
- `followupInstruction` preserves relative intervals, gestational-age milestones, symptom-triggered returns, and explicit calendar dates. Use a separate line such as `Ngày tái khám: 25/11/2026` for a dated reminder. No calendar date is inferred from an interval.
- `treatment` and `careInstructions` hold the recorded medication instructions and clinician advice. File names, OCR bookkeeping, and confirmation transcripts belong in `sourceMetadata`, not clinical text.
- `sourceMetadata` stores document references, per-field sources, confirmed fields, missing-data reasons, and import history. It is not accepted from the editable form. Imports must retain a backup and verify both intended changes and preservation of unrelated fields within a transaction.

The record list includes expandable details, and completed pregnancies are displayed as historical records without current-pregnancy assessment prompts. The four unused columns listed below have been retired as requested; other clinical measurements remain optional.

## Estimated due date from a dated gestational age

The checkup form automatically fills a read-only estimated-date input as examination date + (280 − completed weeks × 7 − additional days) calendar days. The calendar date is handled in UTC after selecting the examination's local date, avoiding time-of-day and daylight-saving shifts. Missing/invalid age or dates produce no estimate.

The estimate is labelled separately from the due date recorded on an ultrasound report and does not overwrite it. When the pregnancy profile has no established due date, its date input is automatically populated from the earliest dated age; the estimate is submitted when the user saves the profile. An existing profile due date is preserved. Historical database records are not rewritten to pretend a calculated estimate was recorded on the original report.

Reference: [ACOG — Methods for Estimating the Due Date](https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date). ACOG describes the conventional 280-day baseline and reserves subsequent revisions of an established EDD for rare, documented circumstances.

## Retiring unused columns

Migration `20261103230000_remove_unused_prenatal_fields` drops `PregnancyCheckup.fundalHeightCm`, `vaginalExamination`, `nextCheckupAt`, and `notes`. The migration takes a table lock and runs atomically. It refuses to remove a recorded fundal height, a nonblank vaginal-examination result, or a nonblank personal note: those must be exported and reviewed first. It preserves any explicit appointment date by appending `Ngày tái khám: dd/mm/yyyy` to the existing follow-up instructions.

Reminder generation reads explicit calendar dates from the follow-up instructions. It declines invalid or conflicting dates and never converts a relative interval or gestational-age milestone into an inferred appointment. Medication and clinician advice retain their dedicated fields. The recorded ultrasound due date and the pregnancy's last menstrual period are retained.

Deployment order for this contract migration:

1. Back up the affected table and confirm the preflight on the deployment database.
2. Deploy the regenerated Prisma client and application code that no longer reads the four retired columns, while the columns still exist. If the platform automatically runs all pending migrations during its build, defer this particular migration until after that application release.
3. Apply the migration, then verify reminders and prenatal forms. A failed preflight rolls the whole migration back; inspect the flagged values before resolving a failed Prisma migration and retrying.

Do not edit the earlier `20261103210000_complete_prenatal_observations` migration: it has already been applied. Restoring the old application after this contract migration requires restoring its expected columns first.

## Pregnancy hub

`/mother/pregnancy` is the overview. Its child routes are `baby`, `health`,
`checkups`, and `memories`; they remain inside the mother's module. A shared
layout renders the module header and horizontally scrollable top navigation,
with the current route highlighted; overview cards no longer duplicate navigation. Existing
`/mother/pregnancy?edit=...` bookmarks redirect to the checkup editor.

Migration `20261104000000_pregnancy_journal` adds `PregnancyJournalEntry` for
health notes and written memories. Entries belong to a pregnancy, never to an
unrelated selected baby. Calendar dates use UTC date carriers. Actions validate
ownership on both writes and deletes; updates also scope the entry kind. Deploy
the additive migration before serving the journal pages.

The established profile due date is preferred for current gestational age,
falling back to LMP. Closed pregnancies never advance their displayed age.
Appointment pickers preserve clinician prose and write the explicit appointment
line understood by the reminder parser. Only active pregnancies generate those
reminders. Missing screening measurements return UNKNOWN and bypass AI notes.

## Daily tracking and visual journey

The pregnancy overview keeps the top navigation and adds a week selector,
original illustrated hero, direct links to movement/contraction tools, upcoming
appointments, recorded measurements, memories and topic-filtered articles from
the existing knowledge catalog. Historical pregnancies remain clearly labelled.

- `pregnancy-week-reference.json` records factual size comparisons and lengths
  from the linked NHS week guides (weeks 4–41). The measurement basis changes
  from head-to-bottom to head-to-heel at week 20; these references must not be
  plotted as a continuous personal growth trend. Missing length at week 41 stays
  missing. The artwork is conceptual and is not a clinical week-specific model.
- `PregnancyTrackingSession` stores timestamped movement events or completed
  contractions. The client UUID makes retries idempotent within a pregnancy.
  Validate chronological/non-overlapping events and enforce ownership on the
  server. Only active pregnancies can start/save new timed sessions. Drafts stay
  in the current browser tab's session storage until saved or discarded; the
  in-memory fallback does not survive reload when storage is unavailable.
- `PregnancyMeasurement` stores one editable daily snapshot of weight, abdominal
  circumference and notes. Saving the same date replaces that day's snapshot.
  Charts retain separate clinic and home readings, including on the same date.
  Summary cards prefer the clinic on tied dates and never infer a clinical target
  or status. Home readings never replace measurements on the original checkup.
- Movement guidance links to NHS and deliberately has no universal numerical
  success threshold. Contraction tools report timing, not labour diagnoses.

Migration `20261104010000_pregnancy_tracking_tools` is additive. Generate Prisma
Client, apply the migration and restart an already-running dev server before
checking the live pages.

Run the pregnancy tools browser suite against an isolated server whose
`APP_USERNAME` starts with `e2e-pregnancy-`, and set `E2E_TEST_USERNAME` to that
same value in the runner. Its fixtures create and remove a separate test family;
the normal user's profile is never switched to a synthetic active pregnancy.

## Baby tab: individual ultrasound progression

The week explorer belongs only to Overview. The Baby tab reads every ULTRASOUND
and COMBINED report in the selected pregnancy, with chronological measurement
charts, an optional comparison table and links to original reports. PRENATAL_VISIT
records do not enter this ultrasound series.

Charts use the recorded examination calendar date; known times use the user's
timezone and date-only records retain their UTC date carrier. Keep separate
same-day reports. Missing measurements remain null and break the chart line.
Differences identify the previous report that actually recorded the chosen
metric; no percentiles, growth rates or clinical status are inferred. Existing
percentiles can be displayed only as recorded values. If a report identifies
multiple fetuses, disable combined curves and differences because the schema
does not identify measurements per fetus; retain the table and report details.

## Chart dashboards and clinical source records

Baby presents a grid of comparison charts by default: estimated weight, HC, AC,
FL, BPD, CRL, fetal heart rate and amniotic fluid when recorded. Charts show the
latest measurement, first-to-last change across distinct dates, and selectable
points linked to the original report. The comparison table is optional.

Only Checkups renders `PregnancyVisitTimeline`, with visit markers, measurements,
clinician conclusions and original details. It loads comparison context beyond
the visible page. Baby links to these original records instead of repeating the
clinical timeline. Prenatal-only visits never enter fetal-size comparisons.

Health presents weight, two-series blood pressure and maternal pulse charts,
with optional home belly measurements. Source filters distinguish clinic and
home readings. Latest clinician notes are collapsed; personal journal entries
live at `/mother/pregnancy/health/journal`. Legacy Health edit/new URLs redirect
to that journal. The measurements page provides a source table and optional home
entry form, without repeating the dashboard charts or visit timeline.

## One clinical record, multiple derived views

The Health tab and measurements page read `getMaternalData`, a request-scoped
projection of all pregnancy checkups and optional home measurements. Weight,
blood pressure, maternal pulse, edema, urine results, maternal health notes,
treatment, follow-up and clinician advice are never copied into a second log.
Editing or removing the original checkup updates the derived views. Each field
uses the latest record that actually contains it; a newer ultrasound with blank
maternal fields must not erase older observations.

Clinic and home readings on the same date remain separate, with explicit source
links and filters. A date-only home reading cannot establish an intraday order;
summary cards prefer the clinic on tied dates and numeric differences use an
earlier calendar day. Invalid pressure text remains visible as source text and
is excluded from numeric pressure series. Maternal pulse never uses fetal heart
rate. Clinical notes preserve their own dates and can be compared across visits.

Manual entry is collapsed and explicitly optional for additional measurements
at home. It only edits `PregnancyMeasurement`, never the clinical source. The
Overview uses the same maternal projection; its ultrasound summary fields also
retain the latest nonmissing reading and their individual dates. Baby separately
shows clinical fetal-heart readings without merging them into maternal pulse or
ultrasound heart measurements. Multiple-fetus readings remain unmerged.

## Actionable pregnancy journey

Overview's week explorer includes `PregnancyJourneyCare`. It follows the selected
week (1–41), with stage-specific screening/preparation tasks and ongoing wellbeing
and supplement-plan reviews. Upcoming stages and all other stages are accessible
without changing the pregnancy's actual age. Tasks spanning multiple weeks share
one state, rather than repeating a completion obligation every week.

`PregnancyJourneyTask` stores a unique pregnancy/task key, maternal confirmation,
free-text notes and an optional calendar reminder date. Every write validates the
catalogue key, real date and note length, and checks pregnancy ownership. It never
writes clinical measurements or marks a screening complete from an ultrasound.
Related checkups link to their originals; missing records are labelled unknown.
The latest nonempty clinician care instructions retain a link to their source.

Unfinished dated tasks enter the existing calendar/push pipeline with a same-day
push offset. Completed tasks and inactive pregnancies produce no task reminders.
Push still depends on the existing notification opt-in, subscription and cron;
these reminders are one-off tasks, not a daily medication regimen. Private notes
are excluded from reminder payloads. Existing historical dates can be reviewed
and edited. The active dashboard identifies overdue reminders.

Content references NHS antenatal appointments, supplements and fetal movements
(reviewed 2026-11-04), linked on each card. Timing is educational and the local
clinician's plan takes priority. No personalized dose, diagnosis or completed
screening is inferred. Memories remain optional and link to the existing journal.

## Prenatal starting reference for baby growth

Baby profiles can explicitly link to an owned delivered pregnancy (`Baby.pregnancyId`).
There is no automatic matching by date or latest pregnancy, which could assign
another child's report. Growth displays the last unambiguously pre-birth
ULTRASOUND/COMBINED report next to actual birth measurements. Same-day reports
require both examination and birth times. Date-only ties are not guessed.

The reference reads the source each request: EFW grams become kilograms and HC
millimetres become centimetres. Missing fields stay missing, without fallback to
an older report; FL/CRL never become birth length. Multiple-fetus records or a
pregnancy linked to multiple babies cannot provide an individual fetal baseline.
Editing the original report updates this reference. Links can open the owned
historical pregnancy even when another pregnancy is currently active.

No growth entry, birth measurement or WHO assessment is fabricated. Ultrasound
estimates remain labelled prenatal estimates, separate from actual postnatal
charts and growth-rate calculations. Source rationale: ISUOG fetal biometry and
growth guidance (https://doi.org/10.1002/uog.20272).

The initial baseline resolves each field independently: actual birth measurement
first, otherwise the corresponding value from the last prenatal report. Each
fallback retains its estimated source and report date. Entering an actual birth
value immediately replaces the estimate in this reference; nothing is copied
into Baby birth columns or GrowthEntry. Birth length has no ultrasound fallback.
The postnatal charts and WHO inputs continue to use actual measurements only.
