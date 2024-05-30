import { cache as reactCache } from "react";
import { unstable_cache as nextCache } from "next/cache";

type Callback = (...args: any[]) => Promise<any>;
type Options = { revalidate?: number | false; tags?: string[] };

export function cache<T extends Callback>(
  cb: T,
  keyParts: string[],
  options: Options = {}
) {
  return nextCache(reactCache(cb), keyParts, options);
}
