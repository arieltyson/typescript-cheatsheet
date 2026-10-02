// Compile content/site.ts and snippets/ into dist/index.html.
import {
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { site } from "../content/site.ts";
import { cssVariables } from "../web/tokens.ts";
import { highlight } from "./highlight.ts";
import {
  type Entry,
  type Part,
  type Section,
  parseCodeRef,
  validateSite,
} from "./manifest.ts";
import { DIST, SNIPPETS, WEB } from "./paths.ts";
import { extract } from "./source.ts";

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

function renderEntry(entry: Entry): string {
  const blocks = (entry.code ?? []).map((ref) => {
    const source = extract(SNIPPETS, parseCodeRef(ref));
    return `<pre><code>${highlight(source)}</code></pre>`;
  });
  return (
    `<article class="entry" id="${entry.id}">` +
    `<h4>${escapeHtml(entry.title)}</h4>${blocks.join("")}</article>`
  );
}

function renderSection(section: Section): string {
  const entries = section.entries.map(renderEntry).join("\n");
  return (
    `<section class="section" id="${section.id}">` +
    `<h3>${escapeHtml(section.title)}</h3>\n${entries}</section>`
  );
}

function renderPart(part: Part): string {
  const sections = part.sections.map(renderSection).join("\n");
  return (
    `<section class="part" id="${part.id}">` +
    `<h2>${escapeHtml(part.title)}</h2>\n${sections}</section>`
  );
}

export function renderPage(): string {
  validateSite(site, SNIPPETS);
  const template = readFileSync(`${WEB}template.html`, "utf8");
  const styles = readFileSync(`${WEB}styles.css`, "utf8");
  return fill(template, {
    styles: cssVariables() + styles,
    content: site.map(renderPart).join("\n"),
  });
}

export function build(outputDir: string = DIST): string {
  const page = renderPage();
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(outputDir, { recursive: true });
  const index = `${outputDir}index.html`;
  writeFileSync(index, page);
  return index;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  console.log(`Built ${build()}`);
}
