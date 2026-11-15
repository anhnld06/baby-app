# Bundled WHO Child Growth Standards

These are the WHO 2006/2007 LMS reference tables from
[WorldHealthOrganization/anthro](https://github.com/WorldHealthOrganization/anthro),
pinned at commit `b776d8a12b1c97369c748b561159fd2ec4f4db58`.
Original tables: `data-raw/growthstandards/{wei,len,hc,bmi,wfl,wfh}anthro.txt`.
`provenance.json` records original file SHA-256 hashes, row layout and source.

Rows are `[ageDays or lengthHeightCm, L, M, S]`, separated by sex (`1`, `2`).
Age tables contain every day 0–1826; weight-for-length/height tables use 0.1 cm steps.
The server imports this data directly; runtime requests do not access WHO websites
or require the separate R adapter. Only results/labels reach client components.

`who-local.ts` adapts the upstream LMS equations, ±3 SD tail adjustment,
length/height adjustment and quality flags, for known integer ages under 60 months.
It is a local TypeScript implementation, not execution of the R package.
Unknown sex, pre-birth dates and preterm infants are not classified with term charts.
The preterm policy is deliberately separate from the chronological-age WHO engine.

Source copyright: World Health Organization. Upstream authors include Dirk
Schumacher, Elaine Borghi, Jonathan Polonsky and Giovanna Gatica Dominguez.
The adapted calculation and bundled upstream data are distributed under GPL-3.0;
see `LICENSE-WHO-anthro.md`. Modifications: conversion to JSON and TypeScript,
2026. Preserve upstream attribution and license when distributing derived work.

## Reproduction and verification

- Run `node scripts/update-who-reference.mjs --check` to verify data against the
  pinned source and SHA-256 hashes. Omit `--check` to regenerate JSON.
- `../fixtures/anthro-golden.json` contains 146 outputs produced independently by
  the upstream R routines in WebR, not by the TypeScript implementation. Each
  expected array is `[zwei,zlen,zwfl,zbmi,zhc,fwei,flen,fwfl,fbmi,fhc,c9mo_flag]`.
- To regenerate fixtures, check out the pinned WHO repository, install `webr` in a
  temporary development directory, set `WHO_ANTHRO_SOURCE` to that checkout and
  `WEBR_MODULE` to the installed WebR ESM entry, then run
  `node scripts/generate-who-fixtures.mjs`. WebR is not a production dependency.
- Run `npm test -- src/features/growth` for golden-fixture, boundary, unsupported
  input, classification and persistence tests.
