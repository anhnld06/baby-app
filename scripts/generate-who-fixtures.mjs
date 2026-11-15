// Optional development tool: WebR is not an application dependency.
const { WebR } = await import(process.env.WEBR_MODULE || 'webr');
import fs from 'node:fs';
const webR = new WebR(); await webR.init();
const root = process.env.WHO_ANTHRO_SOURCE;
if (!root) throw new Error('Set WHO_ANTHRO_SOURCE to the pinned WHO anthro checkout.');
await webR.evalRVoid('ANTHRO_DAYS_OF_MONTH <- 30.4375');
for (const file of ['utils.R','assertions.R','z-score-helper.R','z-score-weight-for-age.R','z-score-length-for-age.R','z-score-weight-for-lenhei.R','z-score-bmi-for-age.R','z-score-head-circumference-for-age.R']) {
  await webR.evalRVoid(fs.readFileSync(`${root}/R/${file}`, 'utf8'));
}
for (const name of ['wei','len','wfl','wfh','bmi','hc']) {
  await webR.FS.writeFile(`/${name}.txt`, new Uint8Array(fs.readFileSync(`${root}/data-raw/growthstandards/${name}anthro.txt`)));
  await webR.evalRVoid(`growthstandards_${name}anthro <- read.delim('/${name}.txt'); growthstandards_${name}anthro$sex <- as.integer(growthstandards_${name}anthro$sex)`);
}
const inputs = [];
for (const sex of [1,2]) for (const age of [0,1,7,30,100,273,274,365,730,731,987,1522,1826,1827]) {
  for (const measure of ['L','H',null]) {
    const cm = age < 365 ? 50 + age / 20 : 75 + age / 80;
    inputs.push({sex: String(sex), ageInDays:age, weightKg: age < 365 ? 3 + age / 50 : 10 + age / 200, lengthHeightCm:cm, headCircumferenceCm:34 + Math.min(age,900)/70, measure});
  }
}
// Explicit interpolation, outliers, missing values, and boundary lengths.
for (const sex of [1,2]) for (const cm of [44.9,45,45.05,60.123,87,109.99,110,110.1]) for (const weight of [1,5,15]) inputs.push({sex:String(sex),ageInDays:100,weightKg:weight,lengthHeightCm:cm,headCircumferenceCm:null,measure:'L'});
for (const sex of [1,2]) for (const cm of [64.9,65,65.05,87.123,119.99,120,120.1]) inputs.push({sex:String(sex),ageInDays:900,weightKg:15,lengthHeightCm:cm,headCircumferenceCm:45,measure:'H'});
const fixtures = [];
for (const input of inputs) {
  const rnum = v => v == null ? 'NA_real_' : String(v);
  const rmeasure = input.measure ? JSON.stringify(input.measure.toLowerCase()) : 'NA_character_';
  const code = `{
    sex <- as.integer(${input.sex}); age <- ${input.ageInDays}; months <- age/30.4375;
    weight <- ${rnum(input.weightKg)}; cm <- ${rnum(input.lengthHeightCm)}; measure <- ${rmeasure}; head <- ${rnum(input.headCircumferenceCm)};
    posflag <- !is.na(measure) && measure == 'h' && months < 9;
    if (posflag) measure <- NA_character_;
    adjusted <- adjust_lenhei(age, measure, cm);
    w <- anthro_zscore_weight_for_age(weight,age,months,sex,'n');
    h <- anthro_zscore_length_for_age(adjusted,age,months,sex);
    wh <- anthro_zscore_weight_for_lenhei(weight,adjusted,measure,age,months,sex,'n');
    b <- anthro_zscore_bmi_for_age(weight/((adjusted/100)^2),age,months,sex,'n');
    hc <- anthro_zscore_head_circumference_for_age(head,age,months,sex);
    c(w$zwei,h$zlen,wh$zwfl,b$zbmi,hc$zhc,w$fwei,h$flen,wh$fwfl,b$fbmi,hc$fhc,as.integer(posflag))
  }`;
  const values = await (await webR.evalR(code)).toArray();
  fixtures.push({input,expected:values.map(v => Number.isFinite(v) ? v : null)});
}
fs.writeFileSync(new URL('../src/features/growth/fixtures/anthro-golden.json', import.meta.url),JSON.stringify(fixtures));
console.log(`Generated ${fixtures.length} independent WHO R fixtures.`);
await webR.close();
