import assert from "node:assert/strict";

export function demoSlicing(): void {
  const text = "interview";
  assert.equal(text[0], "i");
  assert.equal(text.at(-1), "w");
  assert.equal(text.slice(2, 5), "ter");
  assert.equal(text.slice(0, 3), "int");
  assert.equal(text.slice(-4), "view");
  assert.equal([...text].reverse().join(""), "weivretni");
  assert.equal(text.length, 9);
}

export function demoSplitJoin(): void {
  const line = "red, green ,blue";
  assert.deepEqual(line.split(","), ["red", " green ", "blue"]);
  const parts = line.split(",").map((part) => part.trim());
  assert.deepEqual(parts, ["red", "green", "blue"]);
  const sentence = "  many   spaces here ";
  const words = sentence.trim().split(/\s+/);
  assert.deepEqual(words, ["many", "spaces", "here"]);
  assert.equal(parts.join("-"), "red-green-blue");
  assert.deepEqual([..."abc"], ["a", "b", "c"]);
  assert.deepEqual("3 1 2".split(" ").map(Number), [3, 1, 2]);
}

export function demoCaseAndChecks(): void {
  assert.equal("Hello".toLowerCase(), "hello");
  assert.equal("Hello".toUpperCase(), "HELLO");
  assert.equal("  padded  ".trim(), "padded");
  assert.ok(/^[a-z0-9]+$/i.test("abc123"));
  assert.ok(/^[a-z]$/i.test("Q"));
  const char = "7";
  assert.ok(char >= "0" && char <= "9");
  assert.ok(/\s/.test(" "));
}

export function demoSearch(): void {
  const text = "banana";
  assert.ok(text.includes("nan"));
  assert.equal(text.indexOf("na"), 2);
  assert.equal(text.indexOf("xyz"), -1);
  assert.equal(text.lastIndexOf("na"), 4);
  assert.ok(text.startsWith("ban"));
  assert.ok(text.endsWith("na"));
  // replace() with a string changes only the first match
  assert.equal(text.replace("a", "o"), "bonana");
  assert.equal(text.replaceAll("a", "o"), "bonono");
  assert.equal(text.split("a").length - 1, 3);
}

export function demoBuildStrings(): void {
  // Strings are immutable: collect pieces in an array, join once
  const pieces: string[] = [];
  for (const word of ["fast", "join"]) {
    pieces.push(word.toUpperCase());
  }
  assert.equal(pieces.join(" "), "FAST JOIN");
  const letters = [..."cat"];
  letters[0] = "b";
  assert.equal(letters.join(""), "bat");
  assert.equal("ab".repeat(3), "ababab");
  const phrase = "A man, a plan!";
  const cleaned = phrase.toLowerCase().replace(/[^a-z0-9]/g, "");
  assert.equal(cleaned, "amanaplan");
}

export function demoCharacterCodes(): void {
  assert.equal("a".charCodeAt(0), 97);
  assert.equal(String.fromCharCode(98), "b");
  assert.equal("c".charCodeAt(0) - "a".charCodeAt(0), 2);
  const counts = new Array<number>(26).fill(0);
  for (const char of "abca") {
    counts[char.charCodeAt(0) - 97]++;
  }
  assert.deepEqual(counts.slice(0, 3), [2, 1, 1]);
  // Sorted letters are a key shared by all anagrams
  assert.equal([..."listen"].sort().join(""), "eilnst");
}
