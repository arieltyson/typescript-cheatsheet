export class ListNode {
  val: number;
  next: ListNode | null;

  constructor(val = 0, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}

/** Return the head of a linked list holding values in order. */
export function buildList(values: number[]): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  for (const value of values) {
    tail.next = new ListNode(value);
    tail = tail.next;
  }
  return dummy.next;
}

/** Return the values of a linked list as an array. */
export function listValues(head: ListNode | null): number[] {
  const values: number[] = [];
  for (let node = head; node; node = node.next) values.push(node.val);
  return values;
}

/** Return the new head after reversing the list in place. */
export function reverseList(head: ListNode | null): ListNode | null {
  let previous: ListNode | null = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = previous;
    previous = current;
    current = next;
  }
  return previous;
}

/** Return the middle node (the second middle for even length). */
export function middleNode(head: ListNode | null): ListNode | null {
  let slow = head;
  let fast = head;
  while (fast?.next) {
    slow = slow!.next;
    fast = fast.next.next;
  }
  return slow;
}

/** Return true if following next pointers ever loops. */
export function hasCycle(head: ListNode | null): boolean {
  let slow = head;
  let fast = head;
  while (fast?.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}

/** Return one sorted list made from two sorted lists. */
export function mergeSorted(
  first: ListNode | null,
  second: ListNode | null,
): ListNode | null {
  const dummy = new ListNode();
  let tail = dummy;
  while (first && second) {
    if (first.val <= second.val) {
      tail.next = first;
      first = first.next;
    } else {
      tail.next = second;
      second = second.next;
    }
    tail = tail.next;
  }
  tail.next = first ?? second;
  return dummy.next;
}
