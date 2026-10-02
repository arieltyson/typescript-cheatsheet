// Compile content/site.ts and snippets/ into dist/index.html.
import { createHash } from "node:crypto";
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";
import { site } from "../content/site.ts";
import { cssVariables } from "../web/tokens.ts";
import { highlight } from "./highlight.ts";
import {
  type Entry,
  type Part,
  type Section,
  type Table,
  parseCodeRef,
  validateSite,
} from "./manifest.ts";
import { DIST, SNIPPETS, WEB } from "./paths.ts";
import { assertsAsResults } from "./results.ts";
import { extract } from "./source.ts";

const ASSETS = [
  "favicon.svg",
  "fonts/jetbrains-mono-subset.woff2",
  "fonts/OFL.txt",
];
export const PAGE_BUDGET_GZIP = 150_000;
export const SCRIPT_BUDGET_GZIP = 4_096;

export class BudgetError extends Error {}

export function gzipSize(text: string): number {
  return gzipSync(text).length;
}

export function sha256Source(text: string): string {
  const digest = createHash("sha256").update(text).digest("base64");
  return `'sha256-${digest}'`;
}

/** Allow only this page's own inline code and same-origin files. */
export function contentSecurityPolicy(
  styles: string,
  scripts: string[],
): string {
  return [
    "default-src 'none'",
    `script-src ${scripts.map(sha256Source).join(" ")}`,
    `style-src ${sha256Source(styles)}`,
    "font-src 'self'",
    "img-src 'self'",
    "base-uri 'none'",
    "form-action 'none'",
  ].join("; ");
}

export function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Replace every <!-- slot:name --> marker, failing on any miss. */
export function fill(
  template: string,
  slots: Record<string, string>,
): string {
  let page = template;
  for (const [name, value] of Object.entries(slots)) {
    const marker = `<!-- slot:${name} -->`;
    if (!page.includes(marker)) {
      throw new Error(`template has no slot "${name}"`);
    }
    page = page.replace(marker, () => value);
  }
  if (page.includes("<!-- slot:")) {
    throw new Error("template has an unfilled slot");
  }
  return page;
}

/** Escape text and turn `backticks` into <code> elements. */
export function inline(text: string): string {
  return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderCode(ref: string): string {
  const codeRef = parseCodeRef(ref);
  let source = extract(SNIPPETS, codeRef);
  if (codeRef.isDemo) source = assertsAsResults(source);
  return `<pre><code>${highlight(source)}</code></pre>`;
}

function renderTable(table: Table): string {
  const cells = (row: string[], tag: string) =>
    row.map((cell) => `<${tag}>${inline(cell)}</${tag}>`).join("");
  const rows = table.rows
    .map((row) => `<tr>${cells(row, "td")}</tr>`)
    .join("");
  return (
    `<table><thead><tr>${cells(table.header, "th")}</tr></thead>` +
    `<tbody>${rows}</tbody></table>`
  );
}

function renderMeta(entry: Entry): string {
  if (entry.table) return "";
  const refs = (entry.code ?? []).map(parseCodeRef);
  let text = "Syntax";
  if (entry.time) text = `Time ${entry.time} · Space ${entry.space}`;
  else if (refs.every((ref) => ref.isType)) text = "Definition";
  return `<p class="meta">${escapeHtml(text)}</p>`;
}

function labelled(className: string, label: string, text: string) {
  return (
    `<p class="${className}"><span class="label">${label}</span> ` +
    `${inline(text)}</p>`
  );
}

function renderEntry(entry: Entry): string {
  return [
    `<article class="entry" id="${entry.id}">`,
    `<h4><a href="#${entry.id}">${inline(entry.title)}</a></h4>`,
    renderMeta(entry),
    entry.useWhen
      ? labelled("use-when", "Use when:", entry.useWhen)
      : "",
    ...(entry.code ?? []).map(renderCode),
    entry.table ? renderTable(entry.table) : "",
    entry.gotcha ? labelled("gotcha", "Gotcha:", entry.gotcha) : "",
    "</article>",
  ].join("");
}

function renderSection(section: Section): string {
  const intro = section.intro
    ? `<p class="section-intro">${inline(section.intro)}</p>`
    : "";
  const entries = section.entries.map(renderEntry).join("\n");
  return (
    `<section class="section" id="${section.id}">` +
    `<h3>${inline(section.title)}</h3>${intro}\n${entries}</section>`
  );
}

function renderPart(part: Part): string {
  const sections = part.sections.map(renderSection).join("\n");
  return (
    `<section class="part" id="${part.id}">` +
    `<h2>${escapeHtml(part.title)}</h2>\n${sections}</section>`
  );
}

function tocLink(anchor: string, title: string): string {
  return `<a href="#${anchor}">${inline(title)}</a>`;
}

function renderToc(): string {
  const parts = site
    .map((part) => {
      const sections = part.sections
        .map(
          (section) => `<li>${tocLink(section.id, section.title)}</li>`,
        )
        .join("");
      return `<li>${tocLink(part.id, part.title)}<ol>${sections}</ol></li>`;
    })
    .join("");
  return (
    '<nav class="toc" aria-label="Contents">' +
    `<p class="toc-title">Contents</p><ol>${parts}</ol></nav>`
  );
}

/** Return [id, title, context, keywords, kind] jump-list rows. */
export function jumpIndex(): string {
  const rows = site.flatMap((part) => [
    [part.id, part.title, "Part", "", "part"],
    ...part.sections.flatMap((section) => [
      [section.id, section.title, part.title, "", "section"],
      ...section.entries.map((entry) => [
        entry.id,
        entry.title,
        section.title,
        (entry.aliases ?? []).join(" "),
        "entry",
      ]),
    ]),
  ]);
  // "</" would end the <script> element early
  return JSON.stringify(rows).replaceAll("</", "<\\/");
}

export function renderPage(): string {
  validateSite(site, SNIPPETS);
  const template = readFileSync(`${WEB}template.html`, "utf8");
  const styles =
    cssVariables() + readFileSync(`${WEB}styles.css`, "utf8");
  const script = readFileSync(`${WEB}app.js`, "utf8");
  const themeScript = readFileSync(`${WEB}theme.js`, "utf8");
  if (gzipSize(script) > SCRIPT_BUDGET_GZIP) {
    throw new BudgetError("app.js is over its gzipped size budget");
  }
  return fill(template, {
    csp: contentSecurityPolicy(styles, [themeScript, script]),
    styles,
    toc: renderToc(),
    "jump-index": jumpIndex(),
    content: site.map(renderPart).join("\n"),
    script,
    "theme-script": themeScript,
  });
}

export function build(outputDir: string = DIST): string {
  const page = renderPage();
  if (gzipSize(page) > PAGE_BUDGET_GZIP) {
    throw new BudgetError("index.html is over its gzipped size budget");
  }
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(`${outputDir}fonts`, { recursive: true });
  const index = `${outputDir}index.html`;
  writeFileSync(index, page);
  for (const asset of ASSETS) {
    copyFileSync(`${WEB}${asset}`, `${outputDir}${asset}`);
  }
  return index;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Built ${build()}`);
}
