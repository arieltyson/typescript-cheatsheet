import assert from "node:assert/strict";

export class TrieNode {
  readonly children = new Map<string, TrieNode>();
  isWord = false;
}

export class Trie {
  readonly #root = new TrieNode();

  insert(word: string): void {
    let node = this.#root;
    for (const char of word) {
      let child = node.children.get(char);
      if (!child) {
        child = new TrieNode();
        node.children.set(char, child);
      }
      node = child;
    }
    node.isWord = true;
  }

  search(word: string): boolean {
    return this.#walk(word)?.isWord ?? false;
  }

  startsWith(prefix: string): boolean {
    return this.#walk(prefix) !== null;
  }

  #walk(prefix: string): TrieNode | null {
    let node: TrieNode | undefined = this.#root;
    for (const char of prefix) {
      node = node.children.get(char);
      if (!node) return null;
    }
    return node;
  }
}

export function demoTrie(): void {
  const words = new Trie();
  words.insert("apple");
  assert.equal(words.search("apple"), true);
  assert.equal(words.search("app"), false);
  assert.equal(words.startsWith("app"), true);
  words.insert("app");
  assert.equal(words.search("app"), true);
}
