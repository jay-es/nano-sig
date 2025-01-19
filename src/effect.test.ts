import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { type Computed, computed } from "./computed.ts";
import { effect } from "./effect.ts";
import { type Signal, signal } from "./signal.ts";

suite("effect", () => {
  let num1: Signal<number>;
  let num2: Signal<number>;
  const listener = test.mock.fn();

  test.beforeEach(() => {
    num1 = signal(0);
    num2 = signal(0);
    listener.mock.resetCalls();
  });

  test("can create effect", () => {
    effect(listener, []);
  });

  test("after mutating dependency, listener is called", () => {
    effect(listener, [num1]);

    num1.set(1);

    assert.equal(listener.mock.callCount(), 1);
  });

  test("after mutating dependency 3 times, listener is called 3 times", () => {
    effect(listener, [num1, num2]);

    num1.set(1);
    num1.set(2);
    num2.set(7);

    assert.equal(listener.mock.callCount(), 3);
  });

  test("can depend on computed property", () => {
    const sum = computed(() => num1.get() + num2.get(), [num1, num2]);
    effect(listener, [sum]);

    num1.set(1);
    num1.set(2);
    num2.set(7);

    assert.equal(listener.mock.callCount(), 3);
  });
});
