import assert from "node:assert/strict";
import { test } from "node:test";
import {
  TreeNode,
  bstInsert,
  bstSearch,
  buildTree,
  inorderIterative,
  isValidBst,
  levelOrder,
  maxDepth,
  traversals,
} from "../../snippets/structures/binary_tree.ts";
import {
  ListNode,
  buildList,
  hasCycle,
  listValues,
  mergeSorted,
  middleNode,
  reverseList,
} from "../../snippets/structures/linked_list.ts";

test("linked list round trip", () => {
  assert.deepEqual(listValues(buildList([1, 2, 3])), [1, 2, 3]);
  assert.equal(buildList([]), null);
});

test("reverse", () => {
  for (const values of [[], [1], [1, 2, 3]]) {
    assert.deepEqual(
      listValues(reverseList(buildList(values))),
      values.toReversed(),
    );
  }
});

test("middle", () => {
  assert.equal(middleNode(null), null);
  assert.equal(middleNode(buildList([1]))?.val, 1);
  assert.equal(middleNode(buildList([1, 2, 3]))?.val, 2);
  assert.equal(middleNode(buildList([1, 2, 3, 4]))?.val, 3);
});

test("cycle", () => {
  assert.equal(hasCycle(null), false);
  assert.equal(hasCycle(buildList([1, 2, 3])), false);
  const head = buildList([1, 2, 3])!;
  head.next!.next!.next = head.next;
  assert.equal(hasCycle(head), true);
  const single = new ListNode(1);
  single.next = single;
  assert.equal(hasCycle(single), true);
});

test("merge sorted", () => {
  const cases: [number[], number[]][] = [
    [[], []],
    [[1, 3], []],
    [
      [1, 4, 5],
      [1, 2, 6],
    ],
  ];
  for (const [first, second] of cases) {
    const merged = mergeSorted(buildList(first), buildList(second));
    assert.deepEqual(
      listValues(merged),
      [...first, ...second].sort((a, b) => a - b),
    );
  }
});

//       4
//     2   6
//    1 3 5 7
const BALANCED = [4, 2, 6, 1, 3, 5, 7];

test("build tree with gaps", () => {
  assert.equal(buildTree([]), null);
  assert.equal(buildTree([null]), null);
  const root = buildTree([1, null, 2, 3])!;
  assert.equal(root.left, null);
  assert.equal(root.right?.val, 2);
  assert.equal(root.right?.left?.val, 3);
});

test("traversals", () => {
  const [preorder, inorder, postorder] = traversals(
    buildTree(BALANCED),
  );
  assert.deepEqual(preorder, [4, 2, 1, 3, 6, 5, 7]);
  assert.deepEqual(inorder, [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(postorder, [1, 3, 2, 5, 7, 6, 4]);
  assert.deepEqual(traversals(null), [[], [], []]);
});

test("iterative inorder matches recursive", () => {
  for (const values of [BALANCED, [1, null, 2, 3], [5, 3, null, 2]]) {
    const root = buildTree(values);
    assert.deepEqual(inorderIterative(root), traversals(root)[1]);
  }
  assert.deepEqual(inorderIterative(null), []);
});

test("level order and depth", () => {
  assert.deepEqual(levelOrder(buildTree(BALANCED)), [
    [4],
    [2, 6],
    [1, 3, 5, 7],
  ]);
  assert.deepEqual(levelOrder(null), []);
  assert.equal(maxDepth(buildTree(BALANCED)), 3);
  assert.equal(maxDepth(buildTree([1, null, 2, null, 3])), 3);
  assert.equal(maxDepth(null), 0);
});

test("BST search, insert and validate", () => {
  const root = buildTree(BALANCED);
  assert.equal(bstSearch(root, 5)?.val, 5);
  assert.equal(bstSearch(root, 8), null);
  let built: TreeNode | null = null;
  for (const value of [5, 3, 8, 1, 4, 9])
    built = bstInsert(built, value);
  assert.deepEqual(traversals(built)[1], [1, 3, 4, 5, 8, 9]);
  assert.ok(isValidBst(built));
  assert.ok(isValidBst(null));
  assert.ok(!isValidBst(buildTree([5, 1, 6, null, null, 4, 7])));
  assert.ok(!isValidBst(new TreeNode(2, new TreeNode(2))));
});
