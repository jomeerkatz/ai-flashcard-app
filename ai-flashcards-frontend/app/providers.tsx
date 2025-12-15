"use client";

import { SessionProvider } from "next-auth/react";
import { useUserSync } from "@/lib/useUserSync";
import { UserProvider } from "@/lib/UserContext";

function UserSyncWrapper({ children }: { children: React.ReactNode }) {
  useUserSync();
  return <>{children}</>;
}

export default function NextAuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <UserProvider>
        <UserSyncWrapper>{children}</UserSyncWrapper>
      </UserProvider>
    </SessionProvider>
  );
}
