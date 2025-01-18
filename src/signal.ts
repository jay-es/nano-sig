type Listener = () => unknown;

export type Signal<T> = {
  get(): T;
  set(newValue: T): void;
  subscribe(listener: Listener): () => void;
};

export function signal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const listeners = new Set<Listener>();

  return {
    get: (): T => value,
    set: (newValue: T): void => {
      value = newValue;
      for (const listener of listeners) {
        listener();
      }
    },
    subscribe: (listener: Listener): (() => void) => {
      listeners.add(listener);
      return (): void => {
        listeners.delete(listener);
      };
    },
  };
}
