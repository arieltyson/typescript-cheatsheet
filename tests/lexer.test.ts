import assert from "node:assert/strict";
import { test } from "node:test";
import { tokenize } from "../tools/lexer.ts";
import { extractFromSource } from "../tools/source.ts";
import { parseCodeRef } from "../tools/manifest.ts";

const kinds = (source: string) =>
  tokenize(source)
    .filter((token) => token.kind !== "whitespace")
    .map((token) => `${token.kind}:${token.text}`);

test("tokens cover the source exactly", () => {
  const source =
    'const label = `a ${b ? `c${"}"}` : "d"} e`; // done\n/* x */ y / 2;';
  const joined = tokenize(source)
    .map((token) => token.text)
    .join("");
  assert.equal(joined, source);
});

test("template literals with nested braces are one token", () => {
  assert.deepEqual(kinds("`${ { a: `}` }.a }`;"), [
    "template:`${ { a: `}` }.a }`",
    "punctuation:;",
  ]);
});

test("regex versus division", () => {
  assert.deepEqual(kinds("text.split(/\\s+/)"), [
    "identifier:text",
    "punctuation:.",
    "identifier:split",
    "punctuation:(",
    "regex:/\\s+/",
    "punctuation:)",
  ]);
  assert.deepEqual(kinds("total / count / 2"), [
    "identifier:total",
    "punctuation:/",
    "identifier:count",
    "punctuation:/",
    "number:2",
  ]);
});

test("strings and comments hide their contents", () => {
  assert.deepEqual(kinds("\"// not a comment\" // 'not a string'"), [
    'string:"// not a comment"',
    "comment:// 'not a string'",
  ]);
});

test("numbers, bigints and private names", () => {
  assert.deepEqual(kinds("1_000 0xff 2.5e3 10n #count"), [
    "number:1_000",
    "number:0xff",
    "number:2.5e3",
    "number:10n",
    "identifier:#count",
  ]);
});

const SAMPLE = `import assert from "node:assert/strict";

/** Return the sum. */
export function add(left: number, right: number): number {
  const braces = "}{";
  return left + right;
}

export function demoNumbers(): void {
  // Comments stay
  const total = add(1, 2);
  assert.equal(total, 3);
}

export class Box<T> {
  readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
}

export type Pair = [first: number, second: number];
`;

test("extracts a function with its JSDoc, without export", () => {
  assert.equal(
    extractFromSource(SAMPLE, parseCodeRef("s.ts:add")),
    [
      "/** Return the sum. */",
      "function add(left: number, right: number): number {",
      '  const braces = "}{";',
      "  return left + right;",
      "}",
    ].join("\n"),
  );
});

test("extracts a demo body, dedented", () => {
  assert.equal(
    extractFromSource(SAMPLE, parseCodeRef("s.ts:demoNumbers")),
    "// Comments stay\nconst total = add(1, 2);\nassert.equal(total, 3);",
  );
});

test("extracts classes and type aliases", () => {
  const box = extractFromSource(SAMPLE, parseCodeRef("s.ts:Box"));
  assert.ok(box.startsWith("class Box<T> {"));
  assert.ok(box.endsWith("  }\n}"));
  assert.equal(
    extractFromSource(SAMPLE, parseCodeRef("s.ts:Pair")),
    "type Pair = [first: number, second: number];",
  );
});

test("reports a missing definition", () => {
  assert.throws(
    () => extractFromSource(SAMPLE, parseCodeRef("s.ts:missing")),
    /has no missing/,
  );
});
