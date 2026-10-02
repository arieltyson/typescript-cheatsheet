// Checks against the built dist/index.html, not the source.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { test } from "node:test";
import { site } from "../content/site.ts";
import {
  PAGE_BUDGET_GZIP,
  build,
  gzipSize,
  sha256Source,
} from "../tools/build.ts";
import { WEB } from "../tools/paths.ts";
import { MARK_BLUE } from "../web/tokens.ts";
import { allEntries } from "../tools/manifest.ts";

const output = `${mkdtempSync(`${tmpdir()}/page-`)}/dist/`;
const page = readFileSync(build(output), "utf8");
// Script and style bodies may contain "<"; the rest is generated markup
const markup = page.replace(
  /<(script|style)\b[^>]*>[\s\S]*?<\/\1>/g,
  "<$1></$1>",
);
const tags = [...markup.matchAll(/<(\/?)([a-z0-9]+)([^>]*)>/g)].map(
  ([, closing, name, attributes]) => ({
    closing: closing === "/",
    name: name as string,
    attributes: attributes as string,
  }),
);
const ids = tags.flatMap(({ attributes }) =>
  [...attributes.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
);

test("every entry is on the page", () => {
  for (const entry of allEntries(site)) {
    assert.ok(ids.includes(entry.id), entry.id);
  }
});

test("ids are unique", () => {
  assert.equal(new Set(ids).size, ids.length);
});

test("nothing in main is hidden", () => {
  const main = markup.slice(
    markup.indexOf("<main"),
    markup.indexOf("</main>"),
  );
  assert.ok(!/\shidden[\s>=]/.test(main));
  assert.ok(!main.includes("display: none"));
});

test("no inline style attributes", () => {
  // Inline styles would break the Content-Security-Policy
  assert.ok(
    tags.every(({ attributes }) => !/\bstyle=/.test(attributes)),
  );
});

test("headings never skip a level", () => {
  const levels = tags
    .filter(({ closing, name }) => !closing && /^h[1-6]$/.test(name))
    .map(({ name }) => Number(name[1]));
  assert.equal(levels[0], 1);
  assert.equal(levels.filter((level) => level === 1).length, 1);
  for (let i = 1; i < levels.length; i++) {
    assert.ok((levels[i] as number) <= (levels[i - 1] as number) + 1);
  }
});

test("buttons have names", () => {
  for (const match of markup.matchAll(
    /<button([^>]*)>([\s\S]*?)<\/button>/g,
  )) {
    const [, attributes = "", content = ""] = match;
    const text = content.replace(/<[^>]+>/g, "").trim();
    assert.ok(text || attributes.includes("aria-label="), match[0]);
  }
});

test("language is set", () => {
  assert.match(page, /<html lang="en">/);
});

test("page is within budget", () => {
  assert.ok(gzipSize(page) <= PAGE_BUDGET_GZIP);
});

test("CSP allows exactly the inline code", () => {
  const policy =
    /Content-Security-Policy" content="([^"]+)"/.exec(page)?.[1] ?? "";
  assert.ok(policy.includes("default-src 'none'"));
  const inline = [
    ...page.matchAll(/<script>([\s\S]*?)<\/script>/g),
    ...page.matchAll(/<style>([\s\S]*?)<\/style>/g),
  ].map((match) => match[1] as string);
  assert.equal(inline.length, 3);
  for (const code of inline)
    assert.ok(policy.includes(sha256Source(code)));
});

test("icon tile is the mark blue", () => {
  const icon = readFileSync(`${WEB}favicon.svg`, "utf8");
  assert.ok(icon.includes(`fill="${MARK_BLUE}"`));
});
