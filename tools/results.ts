// Show demo asserts as `expression; // result` lines.
//
// Snippet files keep real node:assert calls so the documented results
// are executed by the tests. On the page `assert.equal(total, 3);`
// reads as `total; // 3`, which is shorter and still runs when copied.
import { tokenize } from "./lexer.ts";

const MAX_LINE_LENGTH = 72;
const COMMENT_GAP = "; // ";
const OPENERS = new Set(["(", "[", "{"]);
const CLOSERS = new Set([")", "]", "}"]);

interface Rewrite {
  indent: string;
  expression: string;
  result: string;
}

export function assertsAsResults(source: string): string {
  const lines = collapseAsserts(source.split("\n"));
  const rewrites = new Map<number, Rewrite>();
  for (const [index, line] of lines.entries()) {
    const rewrite = parseAssertLine(line);
    if (rewrite) rewrites.set(index, rewrite);
  }
  for (const run of consecutiveRuns([...rewrites.keys()])) {
    const parts = run.map((index) => rewrites.get(index) as Rewrite);
    const width = Math.max(
      ...parts.map((part) => (part.indent + part.expression).length),
    );
    const fits = parts.every(
      (part) =>
        width + COMMENT_GAP.length + part.result.length <=
        MAX_LINE_LENGTH,
    );
    for (const [position, index] of run.entries()) {
      const { indent, expression, result } = parts[position] as Rewrite;
      const statement = `${indent}${expression};`;
      const padded = fits ? statement.padEnd(width + 1) : statement;
      lines[index] = `${padded} // ${result}`;
    }
  }
  return lines.join("\n");
}

function parseAssertLine(line: string): Rewrite | null {
  const match = /^(\s*)assert\.(equal|deepEqual|ok)\((.*)\);$/.exec(
    line,
  );
  if (!match) return null;
  const [, indent = "", method, inner = ""] = match;
  const args = splitArguments(inner);
  if (args === null) return null;
  if (method === "ok" && args.length === 1) {
    return { indent, expression: args[0] as string, result: "true" };
  }
  if (method !== "ok" && args.length === 2) {
    const [expression, result] = args as [string, string];
    return { indent, expression, result };
  }
  return null;
}

/**
 * Join asserts that Prettier wrapped over several lines back into one
 * line, but only when the rewritten result line fits.
 */
function collapseAsserts(lines: string[]): string[] {
  const output: string[] = [];
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index] as string;
    const opener = /^(\s*)assert\.\w+\($/.exec(line);
    const end = lines.findIndex(
      (candidate, at) =>
        at > index && candidate === `${opener?.[1] ?? ""});`,
    );
    if (!opener || end === -1) {
      output.push(line);
      continue;
    }
    const joined = joinLines(lines.slice(index, end + 1));
    const rewrite = parseAssertLine(joined);
    const width = rewrite
      ? `${rewrite.indent}${rewrite.expression}; // ${rewrite.result}`
          .length
      : Infinity;
    if (width <= MAX_LINE_LENGTH) {
      output.push(joined);
      index = end;
    } else {
      output.push(line);
    }
  }
  return output;
}

/** Join Prettier-wrapped lines the way Prettier prints them flat. */
export function joinLines(lines: string[]): string {
  let joined = lines[0] as string;
  for (const raw of lines.slice(1)) {
    const next = raw.trim();
    if (/^[)\]}]/.test(next)) joined = joined.replace(/,$/, "");
    const tight = /[([]$/.test(joined) || /^[)\]]/.test(next);
    joined += tight ? next : ` ${next}`;
  }
  return joined;
}

/** Split on top-level commas; null if the brackets do not balance. */
export function splitArguments(text: string): string[] | null {
  const args: string[] = [];
  let depth = 0;
  let start = 0;
  for (const token of tokenize(text)) {
    if (token.kind !== "punctuation") continue;
    if (OPENERS.has(token.text)) depth++;
    else if (CLOSERS.has(token.text)) depth--;
    else if (token.text === "," && depth === 0) {
      args.push(text.slice(start, token.start).trim());
      start = token.end;
    }
    if (depth < 0) return null;
  }
  if (depth !== 0) return null;
  const last = text.slice(start).trim();
  if (last) args.push(last);
  return args;
}

function consecutiveRuns(indexes: number[]): number[][] {
  const runs: number[][] = [];
  for (const index of indexes) {
    const last = runs.at(-1);
    if (last && last.at(-1) === index - 1) last.push(index);
    else runs.push([index]);
  }
  return runs;
}
