"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.replace("/login");
  };

  return (
    <Button type="button" variant="outline" onClick={handleSignOut}>
      Sign out
    </Button>
  );
}
