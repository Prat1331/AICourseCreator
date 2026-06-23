import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Utility to throw an error if response is not OK
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let errorMessage = res.statusText;
    let errorData: any = null;
    
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        errorData = await res.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } else {
        const text = await res.text();
        errorMessage = text || errorMessage;
      }
    } catch {
      // If parsing fails, use status text
      errorMessage = res.statusText;
    }
    
    const error = new Error(errorMessage);
    (error as any).status = res.status;
    (error as any).data = errorData;
    throw error;
  }
}

// API request wrapper using dynamic BASE_URL from .env
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL;
  const res = await fetch(`${BASE_URL}${url}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// React Query - Query function with optional 401 behavior
type UnauthorizedBehavior = "returnNull" | "throw";

export function getQueryFn<T>({ on401: unauthorizedBehavior }: {
  on401: UnauthorizedBehavior;
}): QueryFunction<T> {
  return async ({ queryKey }) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;
    const res = await fetch(`${BASE_URL}${queryKey[0]}`, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as unknown as T;
    }

    await throwIfResNotOk(res);
    return (await res.json()) as T;
  };
}

// Create a new React Query client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
