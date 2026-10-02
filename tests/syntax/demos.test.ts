// Run every exported demo* function: their asserts are the results
// the page shows as comments.
import { test } from "node:test";
import { snippetFiles } from "../../tools/snippets.ts";
import { SNIPPETS } from "../../tools/paths.ts";

for (const path of snippetFiles()) {
  const module: Record<string, unknown> = await import(
    `${SNIPPETS}${path}`
  );
  for (const [name, value] of Object.entries(module)) {
    if (!name.startsWith("demo") || typeof value !== "function")
      continue;
    test(`${path}:${name}`, () => {
      value();
    });
  }
}
