// Every colour on the page, defined once as [light, dark]. The build
// turns these into CSS custom properties with light-dark(), and
// tests/contrast.test.ts asserts every pairing (decision 002).
//
// Link blue and the highlight come from the TypeScript blue (#3178C6),
// shifted until they pass WCAG AA on every background.

export type ColorPair = readonly [light: string, dark: string];

export const colors = {
  bg: ["#FAFAF7", "#111214"],
  surface: ["#F1F0EB", "#18191C"],
  "code-bg": ["#FFFFFF", "#0B0C0E"],
  border: ["#DCDAD2", "#2A2C30"],
  "border-strong": ["#B9B6AB", "#4A4D53"],
  text: ["#1B1B18", "#E8E6E1"],
  "text-muted": ["#55554F", "#A3A19B"],
  link: ["#2D6CB5", "#8CBDF5"],
  // Dark uses the icon blue at 30% opacity over the dark background.
  highlight: ["#D6E4F5", "#3178C64D"],
  // Behind the jump-list dialog. Not text, so not contrast tested.
  backdrop: ["#1B1B1833", "#00000099"],
} satisfies Record<string, ColorPair>;

export const syntax = {
  kw: ["#A0306E", "#F29AC4"],
  str: ["#2F7A3A", "#A3D9A0"],
  num: ["#94560A", "#F0B46A"],
  com: ["#66665E", "#9A988F"],
  fn: ["#1F5FA8", "#8CBDF5"],
  bi: ["#00717A", "#72D3D8"],
} satisfies Record<string, ColorPair>;

/** The icon tile colour; the highlight tint is derived from it. */
export const MARK_BLUE = "#3178C6";

export function cssVariables(): string {
  const lines = Object.entries({ ...colors, ...syntax }).map(
    ([name, [light, dark]]) =>
      `  --${name}: light-dark(${light}, ${dark});`,
  );
  return `:root {\n${lines.join("\n")}\n}\n`;
}
