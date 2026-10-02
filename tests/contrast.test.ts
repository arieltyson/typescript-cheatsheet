// Every text colour must pass WCAG 2.2 AA (4.5:1) where it is used.
import assert from "node:assert/strict";
import { test } from "node:test";
import { type ColorPair, colors, syntax } from "../web/tokens.ts";

const MINIMUM_RATIO = 4.5;
const palette: Record<string, ColorPair> = { ...colors, ...syntax };
const TEXT_ON: Record<string, string[]> = {
  text: ["bg", "surface", "code-bg", "highlight"],
  "text-muted": ["bg", "surface", "code-bg"],
  link: ["bg", "surface", "code-bg"],
};
const SYNTAX = Object.keys(syntax);

type Rgb = [number, number, number];

function channels(color: string): [...Rgb, number] {
  const hex = color.slice(1);
  const alpha = hex.length === 8 ? parseInt(hex.slice(6), 16) / 255 : 1;
  const [red, green, blue] = [0, 2, 4].map((at) =>
    parseInt(hex.slice(at, at + 2), 16),
  );
  return [red, green, blue, alpha];
}

/** Composite a possibly translucent colour over an opaque one. */
export function flatten(color: string, backdrop: string): Rgb {
  const [red, green, blue, alpha] = channels(color);
  const [backRed, backGreen, backBlue] = channels(backdrop);
  const mix = (front: number, back: number) =>
    alpha * front + (1 - alpha) * back;
  return [
    mix(red, backRed),
    mix(green, backGreen),
    mix(blue, backBlue),
  ];
}

function luminance([red, green, blue]: Rgb): number {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * linear(red) +
    0.7152 * linear(green) +
    0.0722 * linear(blue)
  );
}

export function contrast(first: Rgb, second: Rgb): number {
  const [lighter, darker] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a,
  );
  return (lighter + 0.05) / (darker + 0.05);
}

function color(name: string, theme: 0 | 1): Rgb {
  const page = (palette.bg as ColorPair)[theme];
  return flatten((palette[name] as ColorPair)[theme], page);
}

function assertReadable(foreground: string, background: string): void {
  for (const theme of [0, 1] as const) {
    const ratio = contrast(
      color(foreground, theme),
      color(background, theme),
    );
    assert.ok(
      ratio >= MINIMUM_RATIO,
      `${foreground} on ${background} (${theme ? "dark" : "light"}) is ${ratio.toFixed(2)}`,
    );
  }
}

test("text colours", () => {
  for (const [foreground, backgrounds] of Object.entries(TEXT_ON)) {
    for (const background of backgrounds) {
      assertReadable(foreground, background);
    }
  }
});

test("syntax colours on code", () => {
  for (const token of SYNTAX) assertReadable(token, "code-bg");
});

test("contrast math", () => {
  assert.equal(contrast([0, 0, 0], [255, 255, 255]), 21);
  assert.equal(contrast([255, 255, 255], [255, 255, 255]), 1);
  assert.equal(flatten("#FFFFFF80", "#000000")[0], 128);
});
