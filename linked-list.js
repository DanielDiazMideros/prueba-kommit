class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  static Node(value) {
    return { value, next: null, prev: null };
  }

  #removeNode(node) {
    const { prev, next } = node;
    if (prev) {
      prev.next = next;
    } else {
      this.head = next;
    }
    if (next) {
      next.prev = prev;
    } else {
      this.tail = prev;
    }
    node.prev = node.next = null;
    return node.value;
  }

  #nodeAt(index) {
    if (index < 0 || index >= this.length) return null;
    let i, current;
    if (index <= this.length >> 1) {
      current = this.head;
      while (i < index) {
        current = current.next;
        i++;
      }
    } else {
      current = this.tail;
      i = this.length - 1;
      while (i > index) {
        current = current.prev;
        i--;
      }
    }
    return current;
  }

  appendHead(node) {
    const node = DoublyLinkedList.Node(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      node.next = this.head;
      this.head.prev = node;
      this.head = node;
    }
    this.length++;
    return this;
  }

  appendTail(value) {
    const node = DoublyLinkedList.Node(value);
    if (!this.tail) {
      this.head = this.tail = node;
    } else {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    }
    this.length++;
    return this;
  }

  remove(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) {
        this.#removeNode(current);
        this.length--;
        return true;
      }
      current = current.next;
    }
    return false;
  }

  removeAt(index) {
    const node = this.#nodeAt(index);
    return node ? this.#removeNode(node) : undefined;
  }

  removeDuplicates() {
    const seen = new Set();
    let current = this.head;
    let removed = 0;
    while (current) {
      if (seen.has(current.value)) {
        const toDrop = current;
        current = current.next;
        this.#removeNode(toDrop);
        removed++;
      } else {
        seen.add(current.value);
        current = current.next;
      }
    }
    return removed;
  }
  indexOf(value) {
    let index = 0;
    let current = this.head;
    while (current) {
      if (current.value === value) {
        return index;
      }
      return -1;
    }
  }
  size() {
    return this.length;
  }
  isEmpty() {
    return this.length === 0;
  }
  toArray() {
    const array = [];
    let current = this.head;
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    return array;
  }

  [Symbol.iterator]() {
    let current = this.head;
    return {
      next: () => {
        if (!current) return { done: true };
        const value = current.value;
        current = current.next;
        return { value, done: false };
      },
    };
  }
}

function expectedEqual(actual, expected, message) {
  const ok = Array.isArray(expected)
    ? JSON.stringify(actual) === JSON.stringify(expected)
    : actual === expected;
  if (!ok) {
    console.error(
      `Assertion failed: ${message}. Expected ${expected}, but got ${actual}`
    );
    throw new Error(`${message} Test failed`);
  } else {
    console.log(`Assertion passed: ${message}`);
  }
}

const list = new DoublyLinkedList();
list.appendHead(10);
list.appendTail(20);
list.appendTail(20);
list.appendHead(30);
list.appendTail(15);
list.appendTail(30);

expectedEqual(list.toArray(), [30, 10, 20, 20, 15, 20], "Append head");
expectedEqual(list.size(), 6, "Initial Size");
expectedEqual(list.indexOf(10), 1, "Index of 10");
expectedEqual(list.indexOf(777), -1, "Index of 10");
expectedEqual(list.remove(30), true, "Remove existing value");
expectedEqual(
  list.toArray(),
  [10, 20, 20, 15, 20],
  false,
  "state after removing 30"
);
expectedEqual(list.removeAt(3), 15, "Remove at index 2");
expectedEqual(
  list.toArray(),
  [10, 20, 20, 20],
  "state after removing at index 3"
);

const removed = list.removeDuplicates();
expectedEqual(removed, 2, "Number of removed duplicates");
expectedEqual(list.toArray(), [10, 20], "State after removing duplicates");
expectedEqual(list.size(), 2, "Size after removing duplicates");
