// Parts -> sections -> entries. Each entry shows tested code from
// snippets/ ("path.ts:name") or a table. Functions named demo* are shown
// as their body only, with assert lines rewritten as result comments.
import type { Part } from "../tools/manifest.ts";

export const site: Part[] = [
  {
    id: "syntax",
    title: "Syntax",
    sections: [
      {
        id: "arrays",
        title: "Arrays & sorting",
        entries: [
          {
            id: "create-arrays",
            title: "Create & fill arrays",
            aliases: [
              "array of zeros",
              "2d array",
              "grid",
              "matrix",
              "range",
              "Array.from",
            ],
            code: ["syntax/arrays.ts:demoCreateArrays"],
            gotcha:
              "`new Array(n).fill([])` shares one inner array. Use `Array.from({ length: n }, () => [])`.",
          },
          {
            id: "array-operations",
            title: "push, pop, shift, slice & splice",
            aliases: [
              "append",
              "remove",
              "insert",
              "at",
              "last element",
              "includes",
              "indexOf",
            ],
            code: ["syntax/arrays.ts:demoArrayOperations"],
            gotcha:
              "`shift()` and `unshift()` are O(n). Use a head index for queues.",
          },
          {
            id: "sort",
            title: "sort with a comparator",
            aliases: [
              "sort numbers",
              "ascending",
              "descending",
              "toSorted",
              "localeCompare",
              "sort strings",
            ],
            code: ["syntax/arrays.ts:demoSorting"],
            gotcha:
              "Always pass `(a, b) => a - b` for numbers. `toSorted` (ES2023, Node 20+) returns a copy; `sort` mutates.",
          },
          {
            id: "sort-keys",
            title: "Sort by several keys",
            aliases: [
              "multi key sort",
              "tie break",
              "custom comparator",
              "sort tuples",
            ],
            code: ["syntax/arrays.ts:demoSortKeys"],
            useWhen:
              "Sort descending on one field, then ascending on another: chain comparisons with `||`.",
            gotcha:
              "A comparator returns a number: negative, zero or positive. Returning a boolean silently breaks the sort.",
          },
          {
            id: "array-transforms",
            title: "map, filter, reduce & flat",
            aliases: [
              "iterate",
              "entries",
              "sum array",
              "flatten",
              "index and value",
            ],
            code: ["syntax/arrays.ts:demoTransforms"],
            gotcha:
              "`reduce` without an initial value throws on an empty array.",
          },
          {
            id: "array-search",
            title: "find, findIndex, some & every",
            aliases: [
              "search array",
              "contains",
              "findLast",
              "any",
              "all",
            ],
            code: ["syntax/arrays.ts:demoSearchArrays"],
            gotcha:
              "`find` returns `undefined` and `findIndex` returns -1 when nothing matches.",
          },
          {
            id: "min-max",
            title: "min, max & argmax",
            aliases: [
              "largest",
              "smallest",
              "Math.max",
              "key with max value",
            ],
            code: ["syntax/arrays.ts:demoMinMax"],
            gotcha:
              "`Math.max(...hugeArray)` can throw RangeError past roughly 100,000 items. Use `reduce`.",
          },
        ],
      },
    ],
  },
];
