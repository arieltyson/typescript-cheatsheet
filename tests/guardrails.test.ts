// Content rules that keep every snippet interview-ready.
import assert from "node:assert/strict";
import { test } from "node:test";
import { tokenize } from "../tools/lexer.ts";
import { allEntries, parseCodeRef } from "../tools/manifest.ts";
import { SNIPPETS } from "../tools/paths.ts";
import {
  exportedNames,
  importedModules,
  readSnippet,
  snippetFiles,
} from "../tools/snippets.ts";
import { extract } from "../tools/source.ts";
import { site } from "../content/site.ts";

const MAX_LINE_LENGTH = 72;
const MAX_FUNCTION_LINES = 25;
const BANNED_WORDS = new Set(["any", "var", "enum", "namespace"]);
const FUNCTION_START =
  /^\s*(?:export\s+)?(?:async\s+)?(?:function\b|(?:static\s+)?(?:get\s+|set\s+)?#?\w+\s*(?:<[^>]*>)?\(.*\)\s*(?::[^=]*)?\{$)|=>\s*\{$/;
const CONTROL_START =
  /^\s*(?:\}\s*)?(?:if|for|while|switch|catch|else)\b/;

test("snippets exist", () => {
  assert.ok(snippetFiles().length > 0);
});

test("imports are node:assert/strict or other snippets", () => {
  for (const path of snippetFiles()) {
    for (const module of importedModules(readSnippet(path))) {
      const allowed =
        module === "node:assert/strict" || module.startsWith(".");
      assert.ok(allowed, `${path} imports ${module}`);
    }
  }
});

test("lines fit a half-width window", () => {
  for (const path of snippetFiles()) {
    for (const [index, line] of readSnippet(path)
      .split("\n")
      .entries()) {
      assert.ok(
        line.length <= MAX_LINE_LENGTH,
        `${path}:${index + 1} is ${line.length} characters`,
      );
    }
  }
});

test("no any, var, enum or namespace", () => {
  for (const path of snippetFiles()) {
    for (const token of tokenize(readSnippet(path))) {
      if (token.kind !== "identifier") continue;
      assert.ok(
        !BANNED_WORDS.has(token.text),
        `${path} uses ${token.text}`,
      );
    }
  }
});

test("functions fit one glance", () => {
  for (const path of snippetFiles()) {
    const lines = readSnippet(path).split("\n");
    for (const [start, line] of lines.entries()) {
      if (!FUNCTION_START.test(line) || CONTROL_START.test(line))
        continue;
      const length = blockLength(lines, start);
      assert.ok(
        length <= MAX_FUNCTION_LINES,
        `${path}:${start + 1} function is ${length} lines`,
      );
    }
  }
});

/** Lines from the one opening a block to the one closing it. */
function blockLength(lines: string[], start: number): number {
  let depth = 0;
  for (let index = start; index < lines.length; index++) {
    for (const token of tokenize(lines[index] as string)) {
      if (token.kind !== "punctuation") continue;
      if (token.text === "{") depth++;
      if (token.text === "}") depth--;
    }
    if (depth === 0) return index - start + 1;
  }
  return lines.length - start;
}

test("every manifest code ref resolves", () => {
  for (const entry of allEntries(site)) {
    for (const ref of entry.code ?? []) {
      assert.ok(extract(SNIPPETS, parseCodeRef(ref)).trim(), ref);
    }
  }
});

test("every exported definition is on the page", () => {
  const shown = new Set(
    allEntries(site).flatMap((entry) => entry.code ?? []),
  );
  for (const path of snippetFiles()) {
    for (const name of exportedNames(readSnippet(path))) {
      assert.ok(
        shown.has(`${path}:${name}`),
        `${path}:${name} is not in site.ts`,
      );
    }
  }
});
