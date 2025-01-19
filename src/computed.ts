import { effect } from "./effect.ts";
import { type Listener, type Signal, signal } from "./signal.ts";

export type Computed<T> = {
  get: () => T;
  subscribe(listener: Listener): () => void;
};

export function computed<T>(
  fn: () => T,
  signals: (Signal<unknown> | Computed<unknown>)[]
): Computed<T> {
  const value = signal(fn());

  effect(() => value.set(fn()), signals);

  return {
    get: value.get,
    subscribe: value.subscribe,
  };
}
