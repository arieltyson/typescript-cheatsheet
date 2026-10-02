import assert from "node:assert/strict";
import { test } from "node:test";
import { highlight } from "../tools/highlight.ts";

function plainLines(rendered: string): string[] {
  return [
    ...rendered.matchAll(
      /<span class="line i\d">(.*?)<\/span>(?=<span class="line|$)/g,
    ),
  ].map((match) =>
    (match[1] as string)
      .replace(/<[^>]+>/g, "")
      .replaceAll("&lt;", "<")
      .replaceAll("&gt;", ">")
      .replaceAll("&amp;", "&"),
  );
}

test("round-trips source exactly", () => {
  const source = [
    "function total(values: number[]): number {",
    "  // Sum <values> & return",
    "  return values.reduce((sum, value) => sum + value, 0);",
    "}",
    "const label = `multi",
    "line ${`nested`}`;",
  ].join("\n");
  assert.deepEqual(plainLines(highlight(source)), source.split("\n"));
});

test("classifies tokens", () => {
  const rendered = highlight(
    "function area(side: number): number {\n  return Math.abs(side) * 2; // ok\n}",
  );
  for (const expected of [
    '<span class="kw">function</span>',
    '<span class="fn">area</span>',
    '<span class="bi">number</span>',
    '<span class="kw">return</span>',
    '<span class="bi">Math</span>',
    '<span class="num">2</span>',
    '<span class="com">// ok</span>',
  ]) {
    assert.ok(rendered.includes(expected), expected);
  }
});

test("user types use the function colour", () => {
  assert.ok(
    highlight("let node: ListNode | null = null;").includes(
      '<span class="fn">ListNode</span>',
    ),
  );
});

test("escapes html", () => {
  const rendered = highlight('const tag = "<script>";');
  assert.ok(!rendered.includes("<script>"));
  assert.ok(rendered.includes("&lt;script&gt;"));
});

test("marks two-space indent levels", () => {
  const rendered = highlight("if (x) {\n  if (y) {\n    z();\n  }\n}");
  for (const level of [0, 1, 2]) {
    assert.ok(rendered.includes(`class="line i${level}"`));
  }
});
