import assert from "node:assert/strict";
import { test } from "node:test";
import {
  RollingMax,
  RollingWindow,
  type TimedValue,
} from "../../snippets/structures/rolling_window.ts";
import { seeded } from "../random.ts";

test("rolling window keeps a value exactly at the cutoff", () => {
  const window = new RollingWindow(5_000);
  window.add({ timestamp: 1_000, value: 5 });
  window.add({ timestamp: 6_000, value: 0 });
  assert.equal(window.size, 2);
  assert.equal(window.hasValue(5), true);
  window.add({ timestamp: 6_500, value: 0 });
  assert.equal(window.size, 2);
  assert.equal(window.hasValue(5), false);
});

test("empty rolling windows hold nothing", () => {
  const window = new RollingWindow(5_000);
  assert.equal(window.size, 0);
  assert.equal(window.hasValue(0), false);
  assert.equal(new RollingMax(5_000).peak, undefined);
});

test("rolling windows match brute force", () => {
  const random = seeded(13);
  for (let round = 0; round < 50; round++) {
    const durationMs = Math.floor(random() * 3_000);
    const window = new RollingWindow(durationMs);
    const rollingMax = new RollingMax(durationMs);
    const items: TimedValue[] = [];
    let timestamp = 0;
    for (let step = 0; step < 200; step++) {
      timestamp += Math.floor(random() * 1_000);
      const item = { timestamp, value: Math.floor(random() * 11) };
      items.push(item);
      window.add(item);
      rollingMax.add(item);

      const cutoff = timestamp - durationMs;
      const live = items.filter((i) => i.timestamp >= cutoff);
      const peak = Math.max(...live.map((i) => i.value));
      assert.equal(window.size, live.length);
      assert.equal(window.hasValue(peak), true);
      assert.equal(window.hasValue(peak + 0.5), false);
      assert.equal(rollingMax.peak, peak);
    }
  }
});
