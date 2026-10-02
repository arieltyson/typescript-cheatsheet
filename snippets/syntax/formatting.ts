import assert from "node:assert/strict";

export function demoMoney(): void {
  const usd = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  assert.equal(usd.format(1234.5), "$1,234.50");
  assert.equal(usd.format(0.5), "$0.50");
  assert.equal(usd.format(1_000_000), "$1,000,000.00");
  // The sign goes before the dollar sign
  assert.equal(usd.format(-42.5), "-$42.50");
  // Without Intl: fixed decimals, no thousands separator
  assert.equal(`$${(1234.5).toFixed(2)}`, "$1234.50");
}

export function demoCents(): void {
  // Floats cannot store 0.1 exactly, so keep money in integer cents
  assert.equal(0.1 + 0.2, 0.30000000000000004);
  assert.ok(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);
  const priceCents = 1999;
  const totalCents = priceCents * 3;
  const dollars = Math.trunc(totalCents / 100);
  const cents = totalCents % 100;
  assert.equal(
    `$${dollars}.${String(cents).padStart(2, "0")}`,
    "$59.97",
  );
  assert.equal((totalCents / 100).toFixed(2), "59.97");
  // Parse a price string into cents
  const price = "$1,234.56";
  const parsed = Math.round(Number(price.replace(/[$,]/g, "")) * 100);
  assert.equal(parsed, 123456);
}

export function demoNumberFormats(): void {
  const value = 3.14159;
  assert.equal(value.toFixed(2), "3.14");
  assert.equal(Number(value.toFixed(2)), 3.14);
  assert.equal((1234567).toLocaleString("en-US"), "1,234,567");
  const percent = new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 1,
  });
  assert.equal(percent.format(0.256), "25.6%");
  const compact = new Intl.NumberFormat("en-US", {
    notation: "compact",
  });
  assert.equal(compact.format(1_500_000), "1.5M");
}

export function demoPadding(): void {
  const name = "ada";
  assert.equal(`${name.padEnd(6)}|`, "ada   |");
  assert.equal(`${name.padStart(6)}|`, "   ada|");
  assert.equal("7".padStart(3, "0"), "007");
  const row = `${"item".padEnd(6)}${"cost".padStart(6)}`;
  assert.equal(row, "item    cost");
  const count = 3;
  assert.equal(`${name} has ${count} items`, "ada has 3 items");
}

export function demoNumberBases(): void {
  assert.equal((10).toString(2), "1010");
  assert.equal((10).toString(2).padStart(8, "0"), "00001010");
  assert.equal((255).toString(16), "ff");
  assert.equal(parseInt("1011", 2), 11);
  assert.equal(parseInt("ff", 16), 255);
  assert.equal(Number("42"), 42);
  assert.ok(Number.isNaN(Number("4x2")));
  assert.equal(parseInt("42px", 10), 42);
}

export function demoRounding(): void {
  // Math.round rounds half up, toward +Infinity
  assert.equal(Math.round(2.5), 3);
  assert.equal(Math.round(-2.5), -2);
  assert.equal(Math.round(1234.5678 * 100) / 100, 1234.57);
  // 1.005 is stored as 1.00499999..., so it rounds down
  assert.equal((1.005).toFixed(2), "1.00");
  assert.equal(Math.trunc(-2.9), -2);
  assert.equal(Math.floor(-2.9), -3);
  assert.equal(Math.ceil(2.1), 3);
}
