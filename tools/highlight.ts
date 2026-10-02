// Turn TypeScript source into highlighted HTML lines at build time.
import { type Token, tokenize } from "./lexer.ts";

const KEYWORDS = new Set(
  (
    "abstract as async await break case catch class const continue " +
    "default delete do else export extends false finally for from " +
    "function get if implements import in instanceof interface keyof " +
    "let new null of private protected public readonly return " +
    "satisfies set static super switch this throw true try type " +
    "typeof undefined while yield"
  ).split(" "),
);
const BUILTINS = new Set(
  (
    "Array BigInt Boolean Date Error Infinity Intl Iterable Iterator " +
    "JSON Map Math NaN Number Object Omit Partial Pick Promise " +
    "Readonly ReadonlyArray ReadonlyMap ReadonlySet Record RegExp Set " +
    "String Symbol WeakMap bigint boolean console never number object " +
    "parseFloat parseInt string structuredClone symbol unknown void"
  ).split(" "),
);
const DEFINERS = new Set(["function", "class", "interface", "type"]);
const MAX_INDENT_LEVEL = 8;

export function classify(
  token: Token,
  previous: string,
): string | null {
  switch (token.kind) {
    case "comment":
      return "com";
    case "string":
    case "template":
    case "regex":
      return "str";
    case "number":
      return "num";
    case "identifier":
      if (DEFINERS.has(previous)) return "fn";
      if (KEYWORDS.has(token.text)) return "kw";
      if (BUILTINS.has(token.text)) return "bi";
      return /^[A-Z]/.test(token.text) ? "fn" : null;
    default:
      return null;
  }
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

/** Return one line span per source line, with tokens wrapped. */
export function highlight(source: string): string {
  const lines: string[][] = [[]];
  let previous = "";
  for (const token of tokenize(source)) {
    const cssClass = classify(token, previous);
    if (token.kind !== "whitespace" && token.kind !== "comment") {
      previous = token.text;
    }
    for (const [index, part] of token.text.split("\n").entries()) {
      if (index > 0) lines.push([]);
      if (!part) continue;
      const escaped = escapeHtml(part);
      (lines.at(-1) as string[]).push(
        cssClass
          ? `<span class="${cssClass}">${escaped}</span>`
          : escaped,
      );
    }
  }
  const rawLines = source.split("\n");
  return lines
    .map((parts, index) => {
      const raw = rawLines[index] ?? "";
      const spaces = raw.length - raw.trimStart().length;
      const level = Math.min(Math.floor(spaces / 2), MAX_INDENT_LEVEL);
      return `<span class="line i${level}">${parts.join("")}</span>`;
    })
    .join("");
}
