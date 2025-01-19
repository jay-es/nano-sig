import type { Computed } from "./computed";
import type { Signal } from "./signal";

export function effect(
  fn: () => void,
  signals: (Signal<unknown> | Computed<unknown>)[]
): void {
  for (const signal of signals) {
    signal.subscribe(fn);
  }
}
