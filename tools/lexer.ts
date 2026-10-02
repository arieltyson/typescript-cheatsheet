// A small lexer for the TypeScript used in snippets/. It powers
// highlighting, definition extraction and the assert-to-result rewrite.
// Template literals, including their ${...} parts, are one token.

export type TokenKind =
  | "comment"
  | "string"
  | "template"
  | "regex"
  | "number"
  | "identifier"
  | "punctuation"
  | "whitespace";

export interface Token {
  kind: TokenKind;
  text: string;
  start: number;
  end: number;
}

const NUMBER =
  /^(?:0[xXbBoO][\da-fA-F_]+|\d[\d_]*(?:\.\d[\d_]*)?(?:[eE][+-]?\d+)?|\.\d+)n?/;
const IDENTIFIER = /^#?[A-Za-z_$][\w$]*/;
const REGEX_AFTER_WORDS = new Set([
  "return",
  "typeof",
  "case",
  "do",
  "else",
  "in",
  "of",
  "new",
  "delete",
  "void",
  "throw",
]);

export function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  let previous: Token | undefined;
  let position = 0;
  while (position < source.length) {
    const start = position;
    const kind = scanToken(source, position, previous);
    position = kind.end;
    const token = {
      kind: kind.kind,
      text: source.slice(start, position),
      start,
      end: position,
    };
    tokens.push(token);
    if (token.kind !== "whitespace" && token.kind !== "comment") {
      previous = token;
    }
  }
  return tokens;
}

function scanToken(
  source: string,
  position: number,
  previous: Token | undefined,
): { kind: TokenKind; end: number } {
  const char = source[position] ?? "";
  const rest = source.slice(position, position + 64);
  if (/\s/.test(char)) {
    let end = position;
    while (end < source.length && /\s/.test(source[end] ?? "")) end++;
    return { kind: "whitespace", end };
  }
  if (rest.startsWith("//")) {
    const newline = source.indexOf("\n", position);
    return {
      kind: "comment",
      end: newline === -1 ? source.length : newline,
    };
  }
  if (rest.startsWith("/*")) {
    const close = source.indexOf("*/", position + 2);
    return {
      kind: "comment",
      end: close === -1 ? source.length : close + 2,
    };
  }
  if (char === '"' || char === "'") {
    return { kind: "string", end: scanQuoted(source, position) };
  }
  if (char === "`") {
    return { kind: "template", end: scanTemplate(source, position) };
  }
  const number = NUMBER.exec(source.slice(position));
  if (number && /[\d.]/.test(char)) {
    return { kind: "number", end: position + number[0].length };
  }
  const identifier = IDENTIFIER.exec(source.slice(position));
  if (identifier) {
    return { kind: "identifier", end: position + identifier[0].length };
  }
  if (char === "/" && regexAllowed(previous)) {
    const end = scanRegex(source, position);
    if (end !== -1) return { kind: "regex", end };
  }
  return { kind: "punctuation", end: position + 1 };
}

function regexAllowed(previous: Token | undefined): boolean {
  if (!previous) return true;
  if (previous.kind === "identifier") {
    return REGEX_AFTER_WORDS.has(previous.text);
  }
  return (
    previous.kind === "punctuation" && !")]".includes(previous.text)
  );
}

function scanQuoted(source: string, start: number): number {
  const quote = source[start];
  let index = start + 1;
  while (index < source.length) {
    const char = source[index];
    if (char === "\\") index += 2;
    else if (char === quote) return index + 1;
    else if (char === "\n") return index;
    else index++;
  }
  return source.length;
}

function scanTemplate(source: string, start: number): number {
  let index = start + 1;
  while (index < source.length) {
    const char = source[index];
    if (char === "\\") index += 2;
    else if (char === "`") return index + 1;
    else if (char === "$" && source[index + 1] === "{") {
      index = scanTemplateExpression(source, index + 2);
    } else index++;
  }
  return source.length;
}

function scanTemplateExpression(source: string, start: number): number {
  let depth = 1;
  let index = start;
  while (index < source.length) {
    const char = source[index];
    if (char === '"' || char === "'") index = scanQuoted(source, index);
    else if (char === "`") index = scanTemplate(source, index);
    else if (char === "{") {
      depth++;
      index++;
    } else if (char === "}") {
      depth--;
      index++;
      if (depth === 0) return index;
    } else index++;
  }
  return source.length;
}

function scanRegex(source: string, start: number): number {
  let index = start + 1;
  let inClass = false;
  while (index < source.length) {
    const char = source[index];
    if (char === "\\") index += 2;
    else if (char === "\n") return -1;
    else if (char === "[") {
      inClass = true;
      index++;
    } else if (char === "]") {
      inClass = false;
      index++;
    } else if (char === "/" && !inClass) {
      index++;
      while (/[a-z]/.test(source[index] ?? "")) index++;
      return index;
    } else index++;
  }
  return -1;
}
