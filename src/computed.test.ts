import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { type Computed, computed } from "./computed.ts";
import { type Signal, signal } from "./signal.ts";

suite("computed", () => {
  let parity: Computed<boolean>;
  let sum: Computed<number>;
  let num1: Signal<number>;
  let num2: Signal<number>;
  const listener1 = test.mock.fn();
  const listener2 = test.mock.fn();

  test.beforeEach(() => {
    num1 = signal(0);
    num2 = signal(0);
    parity = computed(() => num1.get() % 2 === 0, [num1]);
    sum = computed(() => num1.get() + num2.get(), [num1, num2]);
    listener1.mock.resetCalls();
    listener2.mock.resetCalls();
  });

  test("can create computed property", () => {
    assert.equal(parity.get(), true);
  });

  test("after mutating signal, computed value changes", () => {
    num1.set(1);
    assert.equal(parity.get(), false);
  });

  test("can depend on multiple signals", () => {
    assert.equal(sum.get(), 0);
  });

  test("after mutating signals, computed value changes", () => {
    num1.set(1);
    num2.set(2);

    assert.equal(sum.get(), 3);
  });

  test("can depend on other computed property", () => {
    const doubleSum = computed(() => sum.get() * 2, [sum]);

    num1.set(1);

    assert.equal(doubleSum.get(), 2);
  });

  test("can subscribe to computed property", () => {
    const listener1 = test.mock.fn();
    parity.subscribe(listener1);

    assert.equal(listener1.mock.callCount(), 0);
  });

  test("after mutating signal, listener is called", () => {
    const listener1 = test.mock.fn();
    parity.subscribe(listener1);

    num1.set(1);

    assert.equal(listener1.mock.callCount(), 1);
  });

  test("after mutating signals 3 times, listener is called 3 times", () => {
    const listener1 = test.mock.fn();
    sum.subscribe(listener1);

    num1.set(1);
    num1.set(2);
    num2.set(7);

    assert.equal(listener1.mock.callCount(), 3);
  });

  test("can have multiple listeners", () => {
    parity.subscribe(listener1);
    parity.subscribe(listener2);

    num1.set(1);

    assert.equal(listener1.mock.callCount(), 1);
    assert.equal(listener2.mock.callCount(), 1);
  });

  test("can unsubscribe from computed property", () => {
    const unsubscribe = parity.subscribe(listener1);

    unsubscribe();
    num1.set(1);

    assert.equal(listener1.mock.callCount(), 0);
  });
});
