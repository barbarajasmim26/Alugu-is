import { trpc } from "@/lib/trpc";

export function useAuthCheck() {
  const { data: user, isLoading, isError } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return null;
  if (isError || !user) return false;
  return true;
}
