export class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;

  constructor(
    val = 0,
    left: TreeNode | null = null,
    right: TreeNode | null = null,
  ) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/** Return the root of a tree given in level order, null = gap. */
export function buildTree(values: (number | null)[]): TreeNode | null {
  if (values.length === 0 || values[0] === null) return null;
  const root = new TreeNode(values[0]);
  const queue = [root];
  let head = 0;
  let index = 1;
  while (head < queue.length && index < values.length) {
    const node = queue[head++];
    const [left = null, right = null] = values.slice(index, index + 2);
    index += 2;
    if (left !== null) {
      node.left = new TreeNode(left);
      queue.push(node.left);
    }
    if (right !== null) {
      node.right = new TreeNode(right);
      queue.push(node.right);
    }
  }
  return root;
}

/** Return the [preorder, inorder, postorder] values. */
export function traversals(
  root: TreeNode | null,
): [number[], number[], number[]] {
  const preorder: number[] = [];
  const inorder: number[] = [];
  const postorder: number[] = [];
  const visit = (node: TreeNode | null): void => {
    if (!node) return;
    preorder.push(node.val);
    visit(node.left);
    inorder.push(node.val);
    visit(node.right);
    postorder.push(node.val);
  };
  visit(root);
  return [preorder, inorder, postorder];
}

/** Return inorder values without recursion. */
export function inorderIterative(root: TreeNode | null): number[] {
  const values: number[] = [];
  const stack: TreeNode[] = [];
  let node = root;
  while (node || stack.length > 0) {
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop()!;
    values.push(node.val);
    node = node.right;
  }
  return values;
}

/** Return the values of each level, top to bottom. */
export function levelOrder(root: TreeNode | null): number[][] {
  const levels: number[][] = [];
  let level = root ? [root] : [];
  while (level.length > 0) {
    levels.push(level.map((node) => node.val));
    level = level.flatMap((node) =>
      [node.left, node.right].filter((child) => child !== null),
    );
  }
  return levels;
}

/** Return the number of nodes on the longest root-to-leaf path. */
export function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

/** Return the node holding target, or null. */
export function bstSearch(
  root: TreeNode | null,
  target: number,
): TreeNode | null {
  let node = root;
  while (node && node.val !== target) {
    node = target < node.val ? node.left : node.right;
  }
  return node;
}

/** Insert val and return the (possibly new) root. */
export function bstInsert(
  root: TreeNode | null,
  val: number,
): TreeNode {
  if (!root) return new TreeNode(val);
  if (val < root.val) root.left = bstInsert(root.left, val);
  else root.right = bstInsert(root.right, val);
  return root;
}

/** Return true if every node is strictly between its bounds. */
export function isValidBst(
  root: TreeNode | null,
  low = -Infinity,
  high = Infinity,
): boolean {
  if (!root) return true;
  if (root.val <= low || root.val >= high) return false;
  return (
    isValidBst(root.left, low, root.val) &&
    isValidBst(root.right, root.val, high)
  );
}
