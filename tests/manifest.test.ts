import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { test } from "node:test";
import {
  type Entry,
  ManifestError,
  parseCodeRef,
  validateSite,
} from "../tools/manifest.ts";

const root = `${mkdtempSync(`${tmpdir()}/manifest-`)}/`;
writeFileSync(`${root}search.ts`, "export function find() {}\n");

function siteWith(entry: Entry) {
  return [
    {
      id: "algorithms",
      title: "Algorithms",
      sections: [{ id: "search", title: "Search", entries: [entry] }],
    },
  ];
}

test("accepts a valid algorithm entry", () => {
  validateSite(
    siteWith({
      id: "binary-search",
      title: "Binary search",
      code: ["search.ts:find"],
      time: "O(log n)",
      space: "O(1)",
    }),
    root,
  );
});

test("classifies code refs", () => {
  assert.deepEqual(parseCodeRef("a.ts:demoSort"), {
    path: "a.ts",
    name: "demoSort",
    isDemo: true,
    isType: false,
  });
  assert.equal(parseCodeRef("a.ts:ListNode").isType, true);
  assert.throws(() => parseCodeRef("a.ts"), ManifestError);
});

const invalid: [string, Entry, RegExp][] = [
  [
    "duplicate ids",
    { id: "search", title: "Dup", code: ["search.ts:demoX"] },
    /duplicate/,
  ],
  [
    "algorithm without complexity",
    { id: "find", title: "Find", code: ["search.ts:find"] },
    /time\/space/,
  ],
  [
    "missing file",
    { id: "find", title: "Find", code: ["missing.ts:demoX"] },
    /missing file/,
  ],
  [
    "code and table",
    {
      id: "find",
      title: "Find",
      code: ["search.ts:demoX"],
      table: { header: ["a"], rows: [["b"]] },
    },
    /exactly one/,
  ],
  [
    "ragged table",
    {
      id: "costs",
      title: "Costs",
      table: { header: ["a", "b"], rows: [["only"]] },
    },
    /match the header/,
  ],
];

for (const [name, entry, message] of invalid) {
  test(`rejects ${name}`, () => {
    assert.throws(() => validateSite(siteWith(entry), root), message);
  });
}
