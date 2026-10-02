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
            id: "sort",
            title: "sort with a comparator",
            code: ["syntax/arrays.ts:demoSorting"],
          },
        ],
      },
    ],
  },
];
