/**
 * One-off asset optimiser.
 *
 * The repo shipped ~18 MB of full-size PNGs that were all downloaded on the
 * first paint. This converts every raster asset to WebP at a sensible max
 * width and writes it next to the original, so the app can import the much
 * smaller .webp files.
 *
 * Run with:  node scripts/optimize-assets.mjs
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIRS = [join(ROOT, "src", "assets"), join(ROOT, "public")];

const MAX_WIDTH = 1600;
const QUALITY = 82;

async function convert(file) {
  const input = join(file);
  const output = join(dirname(input), `${basename(input, extname(input))}.webp`);

  if (extname(input) === ".webp") return null;
  if (![".png", ".jpg", ".jpeg"].includes(extname(input).toLowerCase())) return null;

  const before = (await stat(input)).size;
  const info = await sharp(input)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(output);

  const after = (await stat(output)).size;
  const saved = before - after;
  const pct = ((saved / before) * 100).toFixed(1);

  // Only drop the original once the Webp is safely written and smaller.
  if (after < before) await unlink(input);

  return { file: basename(input), before, after, saved, pct, width: info.width };
}

let totalBefore = 0;
let totalAfter = 0;
const rows = [];

for (const dir of DIRS) {
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    continue;
  }

  for (const entry of entries) {
    if (![".png", ".jpg", ".jpeg", ".webp"].includes(extname(entry).toLowerCase())) continue;
    try {
      const result = await convert(join(dir, entry));
      if (!result) continue;
      totalBefore += result.before;
      totalAfter += result.after;
      rows.push(result);
    } catch (err) {
      console.error(`  ! skipped ${entry}: ${err.message}`);
    }
  }
}

if (!rows.length) {
  console.log("Nothing to optimise.");
} else {
  console.log("file".padEnd(30), "before".padStart(11), "after".padStart(11), "saved".padStart(9));
  console.log("-".repeat(63));
  for (const r of rows.sort((a, b) => b.saved - a.saved)) {
    console.log(
      r.file.padEnd(30),
      `${(r.before / 1024).toFixed(0)}K`.padStart(11),
      `${(r.after / 1024).toFixed(0)}K`.padStart(11),
      `${r.pct}%`.padStart(9)
    );
  }
  console.log("-".repeat(63));
  console.log(
    "TOTAL".padEnd(30),
    `${(totalBefore / 1024 / 1024).toFixed(2)}M`.padStart(11),
    `${(totalAfter / 1024 / 1024).toFixed(2)}M`.padStart(11),
    `${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%`.padStart(9)
  );
}
