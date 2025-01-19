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

  for (const signal of signals) {
    signal.subscribe(() => {
      value.set(fn());
    });
  }

  return {
    get: value.get,
    subscribe: value.subscribe,
  };
}
