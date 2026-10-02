import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildGraph,
  buildWeightedGraph,
  gridNeighbors,
} from "../../snippets/structures/graphs.ts";
import { Trie } from "../../snippets/structures/trie.ts";
import { UnionFind } from "../../snippets/structures/union_find.ts";

test("trie words and prefixes", () => {
  const words = new Trie();
  assert.equal(words.search("a"), false);
  assert.equal(words.startsWith(""), true);
  for (const word of ["car", "card", "care", "dog"]) words.insert(word);
  assert.equal(words.search("card"), true);
  assert.equal(words.search("ca"), false);
  assert.equal(words.startsWith("ca"), true);
  assert.equal(words.startsWith("cat"), false);
  assert.equal(words.search("cards"), false);
});

test("union-find components and redundant edges", () => {
  const groups = new UnionFind(5);
  for (const [a, b] of [
    [0, 1],
    [1, 2],
    [3, 4],
  ]) {
    assert.equal(groups.union(a, b), true);
  }
  assert.equal(groups.components, 2);
  assert.equal(groups.find(0), groups.find(2));
  assert.notEqual(groups.find(0), groups.find(3));
  const cycle = new UnionFind(3);
  const edges: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 0],
  ];
  const redundant = edges.filter(([a, b]) => !cycle.union(a, b));
  assert.deepEqual(redundant, [[2, 0]]);
});

test("union-find long chain", () => {
  const count = 100_000;
  const groups = new UnionFind(count);
  for (let node = 1; node < count; node++) groups.union(node - 1, node);
  assert.equal(groups.components, 1);
});

test("graphs", () => {
  assert.deepEqual(buildGraph(3, [[0, 1]]), [[1], [0], []]);
  assert.deepEqual(buildGraph(2, [[0, 1]], true), [[1], []]);
  assert.deepEqual(buildWeightedGraph(2, [[1, 0, 4]]), [[], [[0, 4]]]);
  const grid = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  assert.equal([...gridNeighbors(grid, 1, 1)].length, 4);
  assert.deepEqual([...gridNeighbors(grid, 2, 2)].sort(), [
    [1, 2],
    [2, 1],
  ]);
  assert.deepEqual([...gridNeighbors([[0]], 0, 0)], []);
});
