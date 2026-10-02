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
      {
        id: "strings",
        title: "Strings",
        entries: [
          {
            id: "slicing",
            title: "Slicing & reversing",
            aliases: [
              "substring",
              "reverse string",
              "last character",
              "at",
            ],
            code: ["syntax/strings.ts:demoSlicing"],
            gotcha:
              "`length` and indexes count UTF-16 units: an emoji is 2. `[...text]` splits by character.",
          },
          {
            id: "split-join",
            title: "split, trim & join",
            aliases: [
              "tokenize",
              "words",
              "parse line",
              "split whitespace",
              "string to array",
              "map number",
            ],
            code: ["syntax/strings.ts:demoSplitJoin"],
          },
          {
            id: "string-checks",
            title: "Case & character checks",
            aliases: [
              "isalnum",
              "isdigit",
              "is letter",
              "lowercase",
              "uppercase",
              "regex test",
            ],
            code: ["syntax/strings.ts:demoCaseAndChecks"],
          },
          {
            id: "string-search",
            title: "includes, indexOf, replace & count",
            aliases: [
              "substring search",
              "contains",
              "startsWith",
              "endsWith",
              "replaceAll",
            ],
            code: ["syntax/strings.ts:demoSearch"],
            gotcha:
              "`replace` with a string replaces only the first match. Use `replaceAll` or a `/g` regex.",
          },
          {
            id: "build-strings",
            title: "Building strings",
            aliases: [
              "concatenate",
              "string builder",
              "immutable",
              "repeat",
              "clean string",
              "palindrome cleanup",
            ],
            code: ["syntax/strings.ts:demoBuildStrings"],
            gotcha:
              '`text[0] = "b"` does nothing (and is a type error). Convert to an array, edit, join.',
          },
          {
            id: "char-codes",
            title: "Character codes & letter counts",
            aliases: [
              "ascii",
              "charCodeAt",
              "fromCharCode",
              "anagram",
              "frequency array",
              "26 letters",
            ],
            code: ["syntax/strings.ts:demoCharacterCodes"],
          },
        ],
      },
      {
        id: "formatting",
        title: "Template literals & number formatting",
        entries: [
          {
            id: "format-money",
            title: "Format money: dollars and cents",
            aliases: [
              "money",
              "currency",
              "price",
              "Intl.NumberFormat",
              "two decimals",
              "negative money",
              "thousands separator",
            ],
            code: ["syntax/formatting.ts:demoMoney"],
            gotcha:
              "Create the formatter once and reuse it; constructing `Intl.NumberFormat` is slow.",
          },
          {
            id: "money-in-cents",
            title: "Store money as integer cents",
            aliases: [
              "float precision",
              "0.1 + 0.2",
              "EPSILON",
              "parse price",
              "cents to dollars",
            ],
            code: ["syntax/formatting.ts:demoCents"],
            useWhen:
              "Any calculation with money. Convert to cents on input, format only for display.",
          },
          {
            id: "number-formats",
            title: "toFixed, separators & percent",
            aliases: [
              "decimal places",
              "toLocaleString",
              "percentage",
              "compact",
              "1.5M",
            ],
            code: ["syntax/formatting.ts:demoNumberFormats"],
            gotcha:
              "`toFixed` returns a string. Wrap it in `Number(...)` to keep calculating.",
          },
          {
            id: "padding",
            title: "Padding, alignment & template literals",
            aliases: [
              "padStart",
              "padEnd",
              "zero pad",
              "align columns",
              "interpolation",
              "string format",
            ],
            code: ["syntax/formatting.ts:demoPadding"],
          },
          {
            id: "number-bases",
            title: "Binary, hex & parsing numbers",
            aliases: [
              "toString(2)",
              "parseInt",
              "base 2",
              "base 16",
              "Number()",
              "NaN",
            ],
            code: ["syntax/formatting.ts:demoNumberBases"],
            gotcha:
              "`parseInt` stops at the first invalid character; `Number` rejects the whole string. Always pass the radix to `parseInt`.",
          },
          {
            id: "rounding",
            title: "Rounding, trunc, floor & ceil",
            aliases: [
              "round half",
              "round to 2 decimals",
              "truncate",
              "floor",
              "ceil",
            ],
            code: ["syntax/formatting.ts:demoRounding"],
            gotcha:
              "`Math.round(-2.5)` is -2, not -3. For money, round integer cents.",
          },
        ],
      },
    ],
  },
];
