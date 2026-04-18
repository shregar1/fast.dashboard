import { useQuery } from "@tanstack/react-query";
import { getJSON } from "@/lib/api";

export const POLL_INTERVAL_MS = 10_000;

export function usePollingQuery<T>(key: string, path: string) {
  return useQuery<T>({
    queryKey: [key, path],
    queryFn: () => getJSON<T>(path),
    refetchInterval: POLL_INTERVAL_MS,
  });
}
