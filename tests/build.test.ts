import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { build, fill } from "../tools/build.ts";

test("fills slots", () => {
  assert.equal(fill("a<!-- slot:x -->b", { x: "1" }), "a1b");
});

test("rejects unknown and unfilled slots", () => {
  assert.throws(() => fill("ab", { x: "1" }), /no slot/);
  assert.throws(
    () => fill("<!-- slot:x --><!-- slot:y -->", { x: "1" }),
    /unfilled/,
  );
});

test("keeps $ patterns in slot values literal", () => {
  assert.equal(fill("<!-- slot:x -->", { x: "$&$1" }), "$&$1");
});

test("build writes index.html", () => {
  const output = `${mkdtempSync(`${tmpdir()}/build-`)}/dist/`;
  const index = build(output);
  assert.ok(readFileSync(index, "utf8").includes("<main"));
});
