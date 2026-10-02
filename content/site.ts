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
      {
        id: "maps-sets",
        title: "Map, Set & objects",
        entries: [
          {
            id: "map",
            title: "Map",
            aliases: [
              "hash map",
              "dictionary",
              "get default",
              "has key",
              "map iteration",
              "insertion order",
            ],
            code: ["syntax/maps.ts:demoMap"],
            gotcha:
              "`map.get(key)` is `undefined` when missing. Use `?? 0` for a default, not `|| 0`, so a stored 0 survives.",
          },
          {
            id: "counting",
            title: "Count occurrences",
            aliases: [
              "frequency",
              "counter",
              "histogram",
              "most common",
              "top k frequent",
              "sort map by value",
            ],
            code: ["syntax/maps.ts:demoCounting"],
          },
          {
            id: "grouping",
            title: "Group values by key",
            aliases: [
              "group by",
              "group anagrams",
              "multimap",
              "bucket",
              "Map.groupBy",
            ],
            code: ["syntax/maps.ts:demoGrouping"],
            gotcha:
              "`Map.groupBy(items, keyFn)` does this in one call, but needs ES2024 (Node 21+).",
          },
          {
            id: "set",
            title: "Set & set operations",
            aliases: [
              "unique",
              "dedupe",
              "union",
              "intersection",
              "difference",
              "visited",
              "contains",
            ],
            code: ["syntax/maps.ts:demoSet"],
            gotcha:
              "`first.union(second)` and `intersection` exist only in ES2025 (Node 22+). The spread and filter versions work everywhere.",
          },
          {
            id: "objects",
            title: "Objects as records",
            aliases: [
              "Record",
              "Object.keys",
              "Object.entries",
              "fromEntries",
              "in operator",
              "plain object",
            ],
            code: ["syntax/maps.ts:demoObjects"],
            useWhen:
              "Fixed string keys known in advance. For keys added at run time, counts or non-string keys, use a `Map`.",
          },
          {
            id: "coordinate-keys",
            title: "Coordinates as keys",
            aliases: [
              "visited grid",
              "tuple key",
              "pair key",
              "string key",
              "2d visited",
            ],
            code: ["syntax/maps.ts:demoCoordinateKeys"],
            gotcha:
              "`new Set([[0, 1]]).has([0, 1])` is false. Encode the pair as a string or a number.",
          },
        ],
      },
      {
        id: "types",
        title: "Types for interviews",
        entries: [
          {
            id: "type-aliases",
            title: "type vs interface, optional fields",
            aliases: [
              "type alias",
              "interface",
              "object type",
              "optional property",
              "nullable",
            ],
            code: ["syntax/types.ts:demoTypeAliases"],
            gotcha:
              "Either works for object shapes. Only `type` can name a union or a tuple.",
          },
          {
            id: "unions",
            title: "Unions & narrowing",
            aliases: [
              "discriminated union",
              "typeof",
              "type guard",
              "union type",
              "tagged union",
            ],
            code: ["syntax/types.ts:demoUnions"],
          },
          {
            id: "generics",
            title: "Generics, tuples, Record & as const",
            aliases: [
              "generic function",
              "tuple",
              "Record",
              "readonly",
              "as const",
              "directions",
            ],
            code: ["syntax/types.ts:demoGenerics"],
          },
          {
            id: "nullish",
            title: "Optional chaining, ?? and !",
            aliases: [
              "optional chaining",
              "nullish coalescing",
              "non-null assertion",
              "undefined",
              "default value",
            ],
            code: ["syntax/types.ts:demoNullish"],
            gotcha:
              "`!` removes the compiler's check without adding a runtime one. A wrong `!` crashes later, far from the cause.",
          },
        ],
      },
      {
        id: "numbers",
        title: "Numbers & math",
        entries: [
          {
            id: "integer-division",
            title: "Integer division & modulo",
            aliases: [
              "floor division",
              "truncate",
              "negative modulo",
              "ceil division",
              "remainder",
            ],
            code: ["syntax/numbers.ts:demoIntegerDivision"],
            gotcha:
              "There is no integer division operator. `Math.floor` and `Math.trunc` disagree for negatives; pick deliberately.",
          },
          {
            id: "big-numbers",
            title: "Safe integers, BigInt & mod 1e9+7",
            aliases: [
              "overflow",
              "precision",
              "MAX_SAFE_INTEGER",
              "bigint",
              "modular multiplication",
              "1e9+7",
            ],
            code: ["syntax/numbers.ts:demoBigNumbers"],
            gotcha:
              "BigInt and number never mix: `1n + 1` is a TypeError. Convert with `BigInt(x)` and `Number(x)`.",
          },
          {
            id: "math",
            title: "Math helpers & Infinity",
            aliases: [
              "sqrt",
              "log2",
              "abs",
              "hypot",
              "infinity",
              "isInteger",
            ],
            code: ["syntax/numbers.ts:demoMath"],
          },
          {
            id: "gcd",
            title: "gcd & lcm",
            aliases: [
              "greatest common divisor",
              "least common multiple",
              "euclid",
            ],
            code: [
              "syntax/numbers.ts:gcd",
              "syntax/numbers.ts:demoGcd",
            ],
            time: "O(log min(a, b))",
            space: "O(1)",
          },
        ],
      },
      {
        id: "control-classes",
        title: "Loops, destructuring & classes",
        entries: [
          {
            id: "loops",
            title: "for...of vs for...in",
            aliases: [
              "loop",
              "iterate",
              "reverse loop",
              "forEach",
              "for in string keys",
            ],
            code: ["syntax/control.ts:demoLoops"],
            gotcha:
              "`forEach` cannot `break` or `return` early. Use `for...of`.",
          },
          {
            id: "destructuring",
            title: "Destructuring, spread & copies",
            aliases: [
              "swap",
              "rest",
              "spread",
              "default value",
              "structuredClone",
              "deep copy",
              "shallow copy",
            ],
            code: ["syntax/control.ts:demoDestructuring"],
            gotcha:
              "Backtracking: push `[...path]` into the results, not `path`, or every result changes later.",
          },
          {
            id: "classes",
            title: "A class with a comparator & private state",
            aliases: [
              "class",
              "constructor",
              "static",
              "#private",
              "readonly",
              "compare objects",
              "sort objects",
            ],
            code: [
              "syntax/control.ts:Task",
              "syntax/control.ts:Counter",
              "syntax/control.ts:demoClasses",
            ],
            gotcha:
              "Type stripping forbids constructor parameter properties (`constructor(private x)`); declare fields explicitly.",
          },
        ],
      },
    ],
  },
  {
    id: "structures",
    title: "Data structures",
    sections: [
      {
        id: "complexity",
        title: "Operation costs",
        intro:
          "Average case in V8 (Node and Chrome). Worst case is shown where it differs and matters.",
        entries: [
          {
            id: "constraints",
            title: "Input size to target complexity",
            aliases: [
              "constraints",
              "time limit",
              "how fast",
              "big o target",
            ],
            table: {
              header: ["Input size n", "Target", "Typical approach"],
              rows: [
                ["n <= 10", "O(n!)", "Permutations, backtracking"],
                ["n <= 20", "O(2^n)", "Subsets, bitmask DP"],
                ["n <= 500", "O(n^3)", "Triple loop, interval DP"],
                ["n <= 5,000", "O(n^2)", "All pairs, 2D DP"],
                [
                  "n <= 10^6",
                  "O(n log n)",
                  "Sort, heap, binary search",
                ],
                ["n <= 10^8", "O(n)", "One pass, two pointers, Map"],
                ["Larger", "O(log n) or O(1)", "Binary search, math"],
              ],
            },
          },
          {
            id: "array-costs",
            title: "Array costs",
            aliases: ["array complexity", "array big o", "shift cost"],
            table: {
              header: ["Operation", "Code", "Time"],
              rows: [
                ["Index, assign", "`items[i]`, `items.at(-1)`", "O(1)"],
                [
                  "Add or remove at the end",
                  "`push`, `pop`",
                  "O(1) amortized",
                ],
                [
                  "Add or remove at the front",
                  "`shift`, `unshift`",
                  "O(n)",
                ],
                [
                  "Insert or delete in the middle",
                  "`splice(i, 1)`",
                  "O(n)",
                ],
                ["Search", "`includes`, `indexOf`, `find`", "O(n)"],
                [
                  "Copy or slice",
                  "`slice(a, b)`, `[...items]`",
                  "O(b - a)",
                ],
                ["Sort", "`sort`, `toSorted`", "O(n log n)"],
                ["Length", "`items.length`", "O(1)"],
              ],
            },
          },
          {
            id: "map-costs",
            title: "Map & object costs",
            aliases: [
              "hash map complexity",
              "map big o",
              "object complexity",
            ],
            table: {
              header: ["Operation", "Code", "Time"],
              rows: [
                [
                  "Get, set, has, delete",
                  "`map.get(k)`, `map.set(k, v)`",
                  "O(1), worst O(n)",
                ],
                [
                  "Object property",
                  "`record[key]`, `key in record`",
                  "O(1), worst O(n)",
                ],
                ["Size", "`map.size`", "O(1)"],
                [
                  "Size of an object",
                  "`Object.keys(record).length`",
                  "O(n)",
                ],
                ["Iterate", "`for (const [k, v] of map)`", "O(n)"],
              ],
            },
          },
          {
            id: "set-costs",
            title: "Set costs",
            aliases: ["set complexity", "set big o"],
            table: {
              header: ["Operation", "Code", "Time"],
              rows: [
                [
                  "Add, has, delete",
                  "`set.add(x)`, `set.has(x)`",
                  "O(1), worst O(n)",
                ],
                [
                  "Union",
                  "`new Set([...a, ...b])`",
                  "O(len(a) + len(b))",
                ],
                [
                  "Intersection",
                  "`[...a].filter((x) => b.has(x))`",
                  "O(len(a))",
                ],
                ["Build from an array", "`new Set(items)`", "O(n)"],
              ],
            },
          },
          {
            id: "heap-costs",
            title: "Heap costs (PriorityQueue below)",
            aliases: ["priority queue complexity", "heap big o"],
            table: {
              header: ["Operation", "Code", "Time"],
              rows: [
                [
                  "Push, pop",
                  "`queue.push(x)`, `queue.pop()`",
                  "O(log n)",
                ],
                ["Peek at the first item", "`queue.peek()`", "O(1)"],
                [
                  "Build from an array",
                  "`new PriorityQueue(compare, items)`",
                  "O(n)",
                ],
                [
                  "Find or remove any item",
                  "Not supported",
                  "Scan is O(n)",
                ],
              ],
            },
          },
          {
            id: "string-costs",
            title: "string costs",
            aliases: [
              "string complexity",
              "string big o",
              "concatenation cost",
            ],
            table: {
              header: ["Operation", "Code", "Time"],
              rows: [
                ["Index", "`text[i]`, `text.charCodeAt(i)`", "O(1)"],
                ["Slice", "`text.slice(a, b)`", "O(b - a)"],
                ["Join", '`parts.join("")`', "O(total length)"],
                ["Split", '`text.split(",")`', "O(n)"],
                [
                  "Substring search",
                  "`text.includes(part)`, `indexOf`",
                  "O(n * m) worst case",
                ],
                [
                  "Compare",
                  "`first === second`, `localeCompare`",
                  "O(n)",
                ],
                ["Reverse", '`[...text].reverse().join("")`', "O(n)"],
              ],
            },
          },
        ],
      },
      {
        id: "stack-queue",
        title: "Stack & queue",
        entries: [
          {
            id: "stack",
            title: "Stack with an array",
            aliases: ["lifo", "push pop", "peek", "undo"],
            code: ["structures/stack_queue.ts:demoStack"],
          },
          {
            id: "head-index-queue",
            title: "Queue with a head index (inline)",
            aliases: [
              "fifo",
              "bfs queue",
              "avoid shift",
              "queue without class",
            ],
            code: ["structures/stack_queue.ts:demoHeadIndexQueue"],
            useWhen:
              "BFS and other one-off queues. The array keeps every item, which is fine when the total is bounded.",
            gotcha: "`queue.shift()` in a loop makes BFS O(n^2).",
          },
          {
            id: "queue-class",
            title: "Queue class",
            aliases: [
              "fifo",
              "enqueue",
              "dequeue",
              "deque",
              "o(1) queue",
            ],
            code: [
              "structures/stack_queue.ts:Queue",
              "structures/stack_queue.ts:demoQueue",
            ],
            time: "O(1) amortized per operation",
            space: "O(n)",
            useWhen:
              "A long-running queue where memory must be released as items leave.",
          },
          {
            id: "valid-brackets",
            title: "Balanced brackets",
            aliases: [
              "valid parentheses",
              "matching brackets",
              "stack template",
            ],
            code: ["structures/stack_queue.ts:isBalanced"],
            time: "O(n)",
            space: "O(n)",
            useWhen:
              "Matching pairs, nesting, or undoing the most recent thing first.",
          },
        ],
      },
      {
        id: "heap",
        title: "Heap (priority queue)",
        intro:
          "TypeScript has no built-in heap. This one takes a comparator, like `sort`, so the same class is a min-heap, a max-heap or a heap of tuples.",
        entries: [
          {
            id: "priority-queue",
            title: "PriorityQueue class",
            aliases: [
              "heap",
              "min heap",
              "binary heap",
              "heapify",
              "sift up",
              "sift down",
            ],
            code: ["structures/heap.ts:PriorityQueue"],
            time: "O(log n) push and pop, O(1) peek, O(n) build",
            space: "O(n)",
            gotcha:
              "LeetCode preloads `MinPriorityQueue` from @datastructures-js; most interview platforms do not. This class works everywhere.",
          },
          {
            id: "min-max-heap",
            title: "Min-heap & max-heap",
            aliases: [
              "max heap",
              "largest first",
              "smallest first",
              "kth largest",
              "peek",
            ],
            code: ["structures/heap.ts:demoPriorityQueue"],
          },
          {
            id: "heap-tuples",
            title: "Priorities & tie-breakers",
            aliases: [
              "tuple heap",
              "task scheduler",
              "custom priority",
              "compare tuples",
            ],
            code: ["structures/heap.ts:demoHeapOfTuples"],
          },
        ],
      },
      {
        id: "linked-list",
        title: "Linked list",
        entries: [
          {
            id: "list-node",
            title: "ListNode",
            aliases: ["node class", "singly linked list"],
            code: ["structures/linked_list.ts:ListNode"],
            gotcha:
              "Matches LeetCode's definition: `val`, `next`, and `null` (not `undefined`) at the end.",
          },
          {
            id: "build-linked-list",
            title: "Build & read a linked list",
            aliases: [
              "array to linked list",
              "print linked list",
              "test helper",
              "dummy head",
            ],
            code: [
              "structures/linked_list.ts:buildList",
              "structures/linked_list.ts:listValues",
            ],
            time: "O(n)",
            space: "O(n)",
            useWhen:
              "Testing your own solution. A dummy head removes the empty-list special case.",
          },
          {
            id: "reverse-linked-list",
            title: "Reverse a linked list",
            aliases: [
              "reverse list",
              "in place reversal",
              "previous current next",
            ],
            code: ["structures/linked_list.ts:reverseList"],
            time: "O(n)",
            space: "O(1)",
          },
          {
            id: "middle-node",
            title: "Middle node (fast & slow pointers)",
            aliases: ["tortoise and hare", "find middle", "half"],
            code: ["structures/linked_list.ts:middleNode"],
            time: "O(n)",
            space: "O(1)",
          },
          {
            id: "linked-list-cycle",
            title: "Detect a cycle",
            aliases: ["floyd", "loop detection", "cycle"],
            code: ["structures/linked_list.ts:hasCycle"],
            time: "O(n)",
            space: "O(1)",
            gotcha:
              "Compare nodes with `===`, never their values: two nodes can hold the same value.",
          },
          {
            id: "merge-sorted-lists",
            title: "Merge two sorted lists",
            aliases: ["merge linked lists", "dummy node", "merge step"],
            code: ["structures/linked_list.ts:mergeSorted"],
            time: "O(n + m)",
            space: "O(1)",
          },
        ],
      },
      {
        id: "binary-tree",
        title: "Binary tree & BST",
        entries: [
          {
            id: "tree-node",
            title: "TreeNode",
            aliases: ["binary tree node", "tree class"],
            code: ["structures/binary_tree.ts:TreeNode"],
          },
          {
            id: "build-tree",
            title: "Build a tree from a level-order list",
            aliases: [
              "array to tree",
              "leetcode tree input",
              "test helper",
              "deserialize",
            ],
            code: ["structures/binary_tree.ts:buildTree"],
            time: "O(n)",
            space: "O(n)",
            useWhen:
              "Testing your own tree solution with LeetCode-style input like `[1, null, 2, 3]`.",
          },
          {
            id: "tree-traversals",
            title: "Preorder, inorder & postorder",
            aliases: [
              "dfs traversal",
              "tree walk",
              "recursive traversal",
              "sorted order of bst",
            ],
            code: ["structures/binary_tree.ts:traversals"],
            time: "O(n)",
            space: "O(h) stack, h = height",
            gotcha:
              "Inorder traversal of a BST visits values in sorted order.",
          },
          {
            id: "inorder-iterative",
            title: "Inorder without recursion",
            aliases: [
              "iterative traversal",
              "explicit stack",
              "kth smallest in bst",
            ],
            code: ["structures/binary_tree.ts:inorderIterative"],
            time: "O(n)",
            space: "O(h)",
            useWhen:
              "The tree may be deep enough to overflow the call stack, or you need to stop early.",
          },
          {
            id: "level-order",
            title: "Level order (BFS)",
            aliases: [
              "breadth first",
              "levels",
              "right side view",
              "zigzag",
              "tree bfs",
            ],
            code: ["structures/binary_tree.ts:levelOrder"],
            time: "O(n)",
            space: "O(w), w = widest level",
          },
          {
            id: "max-depth",
            title: "Maximum depth",
            aliases: ["height", "tree height", "depth of tree"],
            code: ["structures/binary_tree.ts:maxDepth"],
            time: "O(n)",
            space: "O(h)",
          },
          {
            id: "bst-search-insert",
            title: "BST search & insert",
            aliases: ["binary search tree", "lookup", "add to bst"],
            code: [
              "structures/binary_tree.ts:bstSearch",
              "structures/binary_tree.ts:bstInsert",
            ],
            time: "O(h): O(log n) balanced, O(n) skewed",
            space: "O(1) search, O(h) insert",
          },
          {
            id: "validate-bst",
            title: "Validate a BST",
            aliases: ["is valid bst", "bounds", "min max range"],
            code: ["structures/binary_tree.ts:isValidBst"],
            time: "O(n)",
            space: "O(h)",
            gotcha:
              "Checking a node only against its children is wrong. Every node must fit the bounds set by all its ancestors.",
          },
        ],
      },
      {
        id: "trie",
        title: "Trie",
        entries: [
          {
            id: "trie-template",
            title: "Trie (prefix tree)",
            aliases: [
              "prefix tree",
              "autocomplete",
              "word search",
              "startsWith",
              "dictionary of words",
            ],
            code: [
              "structures/trie.ts:TrieNode",
              "structures/trie.ts:Trie",
              "structures/trie.ts:demoTrie",
            ],
            time: "O(m) per operation, m = word length",
            space: "O(total characters inserted)",
            useWhen: "Many prefix lookups over a set of words.",
          },
        ],
      },
      {
        id: "union-find",
        title: "Union-find",
        entries: [
          {
            id: "union-find-template",
            title: "Union-find (disjoint set)",
            aliases: [
              "disjoint set",
              "dsu",
              "connected components",
              "redundant connection",
              "cycle in undirected graph",
              "kruskal",
            ],
            code: [
              "structures/union_find.ts:UnionFind",
              "structures/union_find.ts:demoUnionFind",
            ],
            time: "O(α(n)) amortized per operation, effectively O(1)",
            space: "O(n)",
            useWhen:
              "Merging groups and asking whether two items are connected, especially as edges arrive one at a time.",
          },
        ],
      },
      {
        id: "graphs",
        title: "Graphs",
        entries: [
          {
            id: "adjacency-list",
            title: "Adjacency lists from edges",
            aliases: [
              "graph representation",
              "edge list",
              "neighbors",
              "build graph",
              "undirected",
              "directed",
              "weighted graph",
            ],
            code: [
              "structures/graphs.ts:buildGraph",
              "structures/graphs.ts:buildWeightedGraph",
            ],
            time: "O(V + E)",
            space: "O(V + E)",
            gotcha:
              "Use `Array.from({ length: n }, () => [])`, not `new Array(n).fill([])`, or every node shares one list.",
          },
          {
            id: "grid-neighbors",
            title: "Grid neighbours",
            aliases: [
              "4 directions",
              "matrix neighbors",
              "in bounds",
              "up down left right",
              "directions",
              "generator",
            ],
            code: ["structures/graphs.ts:gridNeighbors"],
            time: "O(1) per cell",
            space: "O(1)",
            useWhen:
              "Any grid problem: islands, flood fill, shortest path in a maze. Works for `number[][]` and `string[]` grids.",
          },
          {
            id: "graph-usage",
            title: "Using the helpers",
            aliases: ["graph example"],
            code: ["structures/graphs.ts:demoGraphs"],
          },
        ],
      },
    ],
  },
  {
    id: "algorithms",
    title: "Algorithms",
    sections: [
      {
        id: "binary-search",
        title: "Binary search",
        intro:
          "The loop condition and the update must agree: `low <= high` with `middle ± 1`, or `low < high` with `high = middle`.",
        entries: [
          {
            id: "binary-search-exact",
            title: "Find an exact value",
            aliases: [
              "binary search",
              "search sorted array",
              "log n search",
            ],
            code: ["algorithms/binary_search.ts:binarySearch"],
            time: "O(log n)",
            space: "O(1)",
            gotcha:
              "`(low + high) >> 1` floors for indexes below 2^31. For huge numeric ranges use `Math.floor((low + high) / 2)`.",
          },
          {
            id: "lower-upper-bound",
            title: "Lower & upper bound",
            aliases: [
              "bisect left",
              "bisect right",
              "first occurrence",
              "last occurrence",
              "insert position",
              "count in range",
            ],
            code: [
              "algorithms/binary_search.ts:lowerBound",
              "algorithms/binary_search.ts:upperBound",
            ],
            time: "O(log n)",
            space: "O(1)",
            useWhen:
              "First or last position of a value, where to insert it, or how many values fall in a range: `upperBound(v, b) - lowerBound(v, a)`.",
          },
          {
            id: "binary-search-answer",
            title: "Search on the answer",
            aliases: [
              "minimize maximum",
              "smallest feasible",
              "koko eating bananas",
              "capacity to ship",
              "predicate binary search",
            ],
            code: [
              "algorithms/binary_search.ts:firstTrue",
              "algorithms/binary_search.ts:minEatingSpeed",
            ],
            time: "O(n log m), m = size of the answer range",
            space: "O(1)",
            useWhen:
              '"Find the smallest x such that ..." and if x works, every larger x works too.',
          },
        ],
      },
    ],
  },
];
