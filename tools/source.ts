// Extract a definition's source by name, the way the page shows it:
// leading comments kept, `export` dropped, demo functions as body only.
import { readFileSync } from "node:fs";
import { type Token, tokenize } from "./lexer.ts";
import type { CodeRef } from "./manifest.ts";

const DECLARATIONS = new Set([
  "function",
  "class",
  "interface",
  "type",
  "const",
  "let",
]);
const OPENERS = new Map([
  ["(", ")"],
  ["[", "]"],
  ["{", "}"],
]);

function isOpener(token: Token): boolean {
  return token.kind === "punctuation" && OPENERS.has(token.text);
}

export class SnippetNotFoundError extends Error {}

export function extract(snippetsRoot: string, ref: CodeRef): string {
  const source = readFileSync(`${snippetsRoot}${ref.path}`, "utf8");
  return extractFromSource(source, ref);
}

export function extractFromSource(
  source: string,
  ref: CodeRef,
): string {
  const tokens = tokenize(source);
  const significant = tokens.filter(
    (token) => token.kind !== "whitespace" && token.kind !== "comment",
  );
  const keywordIndex = findDeclaration(significant, ref.name);
  if (keywordIndex === -1) {
    throw new SnippetNotFoundError(`${ref.path} has no ${ref.name}`);
  }
  const keyword = significant[keywordIndex] as Token;
  const exportToken = significant[keywordIndex - 1];
  const first = exportToken?.text === "export" ? exportToken : keyword;
  const { bodyStart, end } = findExtent(significant, keywordIndex);
  if (ref.isDemo) {
    return dedent(source.slice(bodyStart + 1, end - 1));
  }
  const commentStart = leadingCommentStart(tokens, first);
  const declaration = source
    .slice(first.start, end)
    .replace(/^export\s+/, "");
  return source.slice(commentStart, first.start) + declaration;
}

function findDeclaration(tokens: Token[], name: string): number {
  let depth = 0;
  for (const [index, token] of tokens.entries()) {
    if (isOpener(token)) depth++;
    else if (
      ")]}".includes(token.text) &&
      token.kind === "punctuation"
    ) {
      depth--;
    }
    if (depth !== 0 || !DECLARATIONS.has(token.text)) continue;
    const next = tokens[index + 1];
    const named = next?.text === "*" ? tokens[index + 2] : next;
    if (named?.text === name) return index;
  }
  return -1;
}

function findExtent(
  tokens: Token[],
  keywordIndex: number,
): { bodyStart: number; end: number } {
  const keyword = (tokens[keywordIndex] as Token).text;
  const endsAtSemicolon = ["type", "const", "let"].includes(keyword);
  const stack: string[] = [];
  let bodyStart = -1;
  for (const token of tokens.slice(keywordIndex + 1)) {
    if (token.kind !== "punctuation") continue;
    if (isOpener(token)) {
      const opensBody =
        token.text === "{" && stack.length === 0 && !endsAtSemicolon;
      if (opensBody && bodyStart === -1) bodyStart = token.start;
      stack.push(OPENERS.get(token.text) as string);
    } else if (token.text === stack.at(-1)) {
      stack.pop();
      if (
        stack.length === 0 &&
        token.text === "}" &&
        !endsAtSemicolon
      ) {
        return { bodyStart, end: token.end };
      }
    } else if (token.text === ";" && stack.length === 0) {
      return { bodyStart, end: token.end };
    }
  }
  throw new SnippetNotFoundError(`unterminated ${keyword} declaration`);
}

function leadingCommentStart(tokens: Token[], first: Token): number {
  let start = first.start;
  let index = tokens.indexOf(first) - 1;
  while (index >= 0) {
    const token = tokens[index] as Token;
    if (token.kind === "comment") start = token.start;
    else if (
      token.kind !== "whitespace" ||
      token.text.includes("\n\n")
    ) {
      break;
    }
    index--;
  }
  return start;
}

export function dedent(text: string): string {
  const lines = text.replace(/^\n+|\s+$/g, "").split("\n");
  const indents = lines
    .filter((line) => line.trim())
    .map((line) => line.length - line.trimStart().length);
  const shared = Math.min(...indents);
  return lines.map((line) => line.slice(shared)).join("\n");
}
