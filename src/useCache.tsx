import { useCallback, useEffect, useState } from "react";
import { LRUMap } from "lru_map";
import { useLocalStorage } from "./useLocalStorage";

interface Params {
  policy: "lru";
  lruMax?: number;
  storageKey: string;
}

const useCache = ({ storageKey, policy, lruMax }: Params) => {
  const [store] = useState(() => {
    switch (policy) {
      case "lru":
        return new LRUMap(lruMax);
      default:
        throw Error("Invalid Policy");
    }
  });

  const [storage, setStorage] = useLocalStorage<Iterable<[string, string]> | any | undefined>(storageKey, []);

  const setValue = useCallback(
    (key: string, value: string) => {
      store.set(key, value);
      setStorage(store.entries());
    },
    [setStorage, store],
  );

  const getValue = useCallback((key: string) => store.get(key), [store]);

  useEffect(() => {
    store.clear();
    storage.forEach(({ key, value }) => store.set(key, value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { getValue, setValue, storageKey, store };
};

export { useCache };
