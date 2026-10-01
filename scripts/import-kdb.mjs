import { randomUUID } from "node:crypto";
import { readFile, rename, rm, writeFile } from "node:fs/promises";

const sourceUrl =
  "https://raw.githubusercontent.com/s7tya/kdb-crawler/master/dist/kdb.min.json";
const destination = new URL("../src/resources/kdb2026.json", import.meta.url);
const requiredFields = [
  "科目番号",
  "科目名",
  "単位数",
  "標準履修年次",
  "実施学期",
  "曜時限",
];

const response = await fetch(sourceUrl, {
  signal: AbortSignal.timeout(60_000),
});
if (!response.ok) {
  throw new Error(`Failed to download KdB data: HTTP ${response.status}`);
}

const content = await response.text();
const courses = JSON.parse(content);
if (!Array.isArray(courses) || courses.length === 0) {
  throw new Error("KdB data must be a non-empty array of courses.");
}
for (const [index, course] of courses.entries()) {
  if (
    !course ||
    requiredFields.some((field) => typeof course[field] !== "string")
  ) {
    throw new Error(`Invalid KdB course at index ${index}.`);
  }
}

if ((await readFile(destination, "utf8")) === content) {
  console.log("KdB data is already up to date.");
} else {
  const temporaryFile = new URL(`kdb2026.${randomUUID()}.tmp`, destination);
  try {
    await writeFile(temporaryFile, content, { flag: "wx" });
    await rename(temporaryFile, destination);
  } finally {
    await rm(temporaryFile, { force: true });
  }
  console.log(
    `Imported ${courses.length} courses into src/resources/kdb2026.json.`,
  );
}
