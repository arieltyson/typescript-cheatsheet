// The shape of content/site.ts and the rules every entry must follow.
import { existsSync } from "node:fs";

export interface Table {
  header: string[];
  rows: string[][];
}

export interface Entry {
  id: string;
  title: string;
  aliases?: string[];
  /** "path/to/file.ts:name" references into snippets/. */
  code?: string[];
  table?: Table;
  time?: string;
  space?: string;
  useWhen?: string;
  gotcha?: string;
}

export interface Section {
  id: string;
  title: string;
  intro?: string;
  entries: Entry[];
}

export interface Part {
  id: string;
  title: string;
  sections: Section[];
}

export interface CodeRef {
  path: string;
  name: string;
  isDemo: boolean;
  isType: boolean;
}

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ManifestError extends Error {}

export function parseCodeRef(ref: string): CodeRef {
  const [path, name, ...extra] = ref.split(":");
  if (!path || !name || extra.length > 0) {
    throw new ManifestError(`code ref "${ref}" is not path:name`);
  }
  return {
    path,
    name,
    isDemo: name.startsWith("demo"),
    isType: /^[A-Z]/.test(name),
  };
}

export function allEntries(site: Part[]): Entry[] {
  return site.flatMap((part) =>
    part.sections.flatMap((section) => section.entries),
  );
}

export function validateSite(site: Part[], snippetsRoot: string): void {
  const seen = new Set<string>();
  const claim = (id: string, where: string): void => {
    if (!ID_PATTERN.test(id)) {
      throw new ManifestError(`${where}: id "${id}" is not kebab-case`);
    }
    if (seen.has(id)) {
      throw new ManifestError(`${where}: duplicate id "${id}"`);
    }
    seen.add(id);
  };
  if (site.length === 0) throw new ManifestError("site has no parts");
  for (const part of site) {
    claim(part.id, `part ${part.id}`);
    if (part.sections.length === 0) {
      throw new ManifestError(`part ${part.id}: has no sections`);
    }
    for (const section of part.sections) {
      claim(section.id, `section ${section.id}`);
      if (section.entries.length === 0) {
        throw new ManifestError(
          `section ${section.id}: has no entries`,
        );
      }
      for (const entry of section.entries) {
        claim(entry.id, `entry ${entry.id}`);
        validateEntry(entry, snippetsRoot);
      }
    }
  }
}

function validateEntry(entry: Entry, snippetsRoot: string): void {
  const where = `entry ${entry.id}`;
  const refs = (entry.code ?? []).map(parseCodeRef);
  if (refs.length > 0 === (entry.table !== undefined)) {
    throw new ManifestError(
      `${where}: needs exactly one of code or table`,
    );
  }
  for (const ref of refs) {
    if (!existsSync(`${snippetsRoot}${ref.path}`)) {
      throw new ManifestError(`${where}: missing file ${ref.path}`);
    }
  }
  if ((entry.time === undefined) !== (entry.space === undefined)) {
    throw new ManifestError(`${where}: give both time and space`);
  }
  const isReference = refs.every((ref) => ref.isDemo || ref.isType);
  if (refs.length > 0 && !isReference && entry.time === undefined) {
    throw new ManifestError(
      `${where}: algorithm entries need time/space`,
    );
  }
  const table = entry.table;
  if (
    table &&
    table.rows.some((row) => row.length !== table.header.length)
  ) {
    throw new ManifestError(
      `${where}: every row must match the header`,
    );
  }
}
