// Regenerate/check bundled data from the exact upstream commit, never from HEAD.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const directory = new URL("../src/features/growth/data/", import.meta.url);
const provenance = JSON.parse(await readFile(new URL("provenance.json", directory), "utf8"));
const check = process.argv.includes("--check");
for (const name of ["wei", "len", "hc", "bmi", "wfl", "wfh"]) {
  const file = `${name}anthro.txt`;
  const response = await fetch(`https://raw.githubusercontent.com/WorldHealthOrganization/anthro/${provenance.commit}/data-raw/growthstandards/${file}`);
  if (!response.ok) throw new Error(`${file}: HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const hash = createHash("sha256").update(bytes).digest("hex");
  if (hash !== provenance.sha256[file]) throw new Error(`${file}: source checksum mismatch`);
  const [header, ...lines] = bytes.toString("utf8").trim().split(/\r?\n/);
  const columns = header.split("\t");
  const rows = { "1": [], "2": [] };
  for (const line of lines) {
    const values = line.split("\t");
    const row = Object.fromEntries(columns.map((column, i) => [column, values[i]]));
    const index = "age" in row ? row.age : "length" in row ? row.length : row.height;
    rows[row.sex].push([index, row.l, row.m, row.s].map(Number));
  }
  const text = `${JSON.stringify(rows)}\n`;
  const target = new URL(`${name}.json`, directory);
  if (check) {
    if (JSON.stringify(JSON.parse(await readFile(target, "utf8"))) !== JSON.stringify(rows)) throw new Error(`${name}.json: generated output differs`);
  } else await writeFile(target, text);
}
console.log(`WHO reference data ${check ? "verified" : "generated"} at ${provenance.commit}.`);
