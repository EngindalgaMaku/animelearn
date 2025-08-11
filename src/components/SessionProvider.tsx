"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export function SessionProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider
      basePath="/api/auth"
      refetchInterval={5 * 60} // 5 dakikada bir session kontrolü
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
