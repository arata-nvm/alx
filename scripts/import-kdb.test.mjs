import assert from "node:assert/strict";
import {
  copyFile,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

const validContent = JSON.stringify([
  {
    科目番号: "GB10101",
    科目名: "情報科学概論",
    単位数: "1.0",
    標準履修年次: "1",
    実施学期: "春A",
    曜時限: "月1",
  },
]);

async function fixture(
  t,
  content,
  { status = 200, existing = "previous data" } = {},
) {
  const directory = await mkdtemp(join(tmpdir(), "alx-import-kdb-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const scripts = join(directory, "scripts");
  const resources = join(directory, "src/resources");
  await mkdir(scripts);
  await mkdir(resources, { recursive: true });
  const script = join(scripts, "import-kdb.mjs");
  await copyFile(new URL("./import-kdb.mjs", import.meta.url), script);
  const destination = join(resources, "kdb2026.json");
  await writeFile(destination, existing);
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(
      url,
      "https://raw.githubusercontent.com/s7tya/kdb-crawler/master/dist/kdb.min.json",
    );
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(content, { status });
  });
  return {
    destination,
    resources,
    run: () => import(pathToFileURL(script).href),
  };
}

test("imports the upstream content unchanged and removes the temporary file", async (t) => {
  const { destination, resources, run } = await fixture(t, validContent);
  await run();
  assert.equal(await readFile(destination, "utf8"), validContent);
  assert.deepEqual(await readdir(resources), ["kdb2026.json"]);
});

test("does not rewrite an unchanged file", async (t) => {
  const { destination, run } = await fixture(t, validContent, {
    existing: validContent,
  });
  const before = await stat(destination);
  await run();
  const after = await stat(destination);
  assert.equal(after.ino, before.ino);
  assert.equal(after.mtimeMs, before.mtimeMs);
});

for (const [name, content, status, error] of [
  ["HTTP failure", "Not Found", 404, /HTTP 404/],
  ["invalid JSON", "<html>error</html>", 200, SyntaxError],
  ["empty array", "[]", 200, /non-empty array/],
  ["non-array JSON", "{}", 200, /non-empty array/],
  ["missing fields", '[{"科目番号":"GB10101"}]', 200, /Invalid KdB course/],
  ["null course", "[null]", 200, /Invalid KdB course/],
  [
    "wrong field type",
    validContent.replace('"1.0"', "1.0"),
    200,
    /Invalid KdB course/,
  ],
]) {
  test(`preserves existing data on ${name}`, async (t) => {
    const { destination, resources, run } = await fixture(t, content, {
      status,
    });
    await assert.rejects(run(), error);
    assert.equal(await readFile(destination, "utf8"), "previous data");
    assert.deepEqual(await readdir(resources), ["kdb2026.json"]);
  });
}

test("preserves existing data on a network failure", async (t) => {
  const { destination, run } = await fixture(t, validContent);
  t.mock.method(globalThis, "fetch", async () => {
    throw new Error("Network unavailable");
  });
  await assert.rejects(run(), /Network unavailable/);
  assert.equal(await readFile(destination, "utf8"), "previous data");
});
