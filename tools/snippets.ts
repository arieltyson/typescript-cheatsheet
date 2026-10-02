// Facts about snippet files shared by the build and the guardrails.
import { readdirSync, readFileSync } from "node:fs";
import { tokenize } from "./lexer.ts";
import { SNIPPETS } from "./paths.ts";

const DECLARATIONS = new Set([
  "function",
  "class",
  "interface",
  "type",
  "const",
]);

export function snippetFiles(): string[] {
  return readdirSync(SNIPPETS, { recursive: true })
    .map(String)
    .filter((path) => path.endsWith(".ts"))
    .sort();
}

export function readSnippet(path: string): string {
  return readFileSync(`${SNIPPETS}${path}`, "utf8");
}

/** Return the names of every top-level exported declaration. */
export function exportedNames(source: string): string[] {
  const tokens = tokenize(source).filter(
    (token) => token.kind !== "whitespace" && token.kind !== "comment",
  );
  const names: string[] = [];
  for (const [index, token] of tokens.entries()) {
    const keyword = tokens[index + 1];
    if (token.text !== "export" || !keyword) continue;
    if (!DECLARATIONS.has(keyword.text)) continue;
    const afterKeyword = tokens[index + 2];
    const name =
      afterKeyword?.text === "*" ? tokens[index + 3] : afterKeyword;
    if (name) names.push(name.text);
  }
  return names;
}

/** Return every module specifier imported by the source. */
export function importedModules(source: string): string[] {
  return [...source.matchAll(/^import[^"']*["']([^"']+)["']/gm)].map(
    (match) => match[1] as string,
  );
}
