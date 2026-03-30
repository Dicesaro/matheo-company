"use client";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export function useCustomSearchParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Create a mutable copy of search params to ensure compatibility with code mutating it
  const searchParamsCopy = useMemo(() => {
    return new URLSearchParams(searchParams?.toString() || '');
  }, [searchParams]);

  const setSearchParams = useCallback(
    (params: URLSearchParams | Record<string, string>, options?: { replace?: boolean }) => {
      const newParams = new URLSearchParams(params);
      const url = `${pathname}?${newParams.toString()}`;
      if (options?.replace) {
        router.replace(url, { scroll: false });
      } else {
        router.push(url, { scroll: false });
      }
    },
    [router, pathname]
  );

  return [searchParamsCopy, setSearchParams] as const;
}
