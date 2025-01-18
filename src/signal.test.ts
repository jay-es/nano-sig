import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { type Signal, signal } from "./signal.ts";

suite("signal", () => {
  let counter: Signal<number>;
  const listener1 = test.mock.fn();
  const listener2 = test.mock.fn();

  test.beforeEach(() => {
    counter = signal(0);
    listener1.mock.resetCalls();
    listener2.mock.resetCalls();
  });

  test("can create signal", () => {
    assert.equal(counter.get(), 0);
  });

  test("can mutate value", () => {
    counter.set(1);

    assert.equal(counter.get(), 1);
  });

  test("can mutate value multiple times", () => {
    counter.set(1);
    counter.set(7);

    assert.equal(counter.get(), 7);
  });

  test("can subscribe to signal", () => {
    counter.subscribe(listener1);

    assert.equal(listener1.mock.callCount(), 0);
  });

  test("after value mutation, listener is called", () => {
    counter.subscribe(listener1);

    counter.set(1);

    assert.equal(listener1.mock.callCount(), 1);
  });

  test("mutating value twice, listener is called twice", () => {
    counter.subscribe(listener1);

    counter.set(1);
    counter.set(7);

    assert.equal(listener1.mock.callCount(), 2);
  });

  test("can have multiple listeners", () => {
    counter.subscribe(listener1);
    counter.subscribe(listener2);

    counter.set(1);

    assert.equal(listener1.mock.callCount(), 1);
    assert.equal(listener2.mock.callCount(), 1);
  });

  test("can unsubscribe from signal", () => {
    const unsubscribe = counter.subscribe(listener1);

    unsubscribe();
    counter.set(1);

    assert.equal(listener1.mock.callCount(), 0);
  });

  test("subscriptions don't affect value", () => {
    counter.set(1);

    counter.subscribe(listener1);

    assert.equal(counter.get(), 1);
  });

  test("unsubscriptions don't affect value too", () => {
    const unsubscribe = counter.subscribe(listener1);
    counter.set(1);

    unsubscribe();

    assert.equal(counter.get(), 1);
  });
});
