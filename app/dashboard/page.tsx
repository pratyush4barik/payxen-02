import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOutButton } from "@/components/ui/app_components/sign_out_button";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-12">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <section className="rounded-xl border p-6">
        <p className="text-sm text-muted-foreground">Signed in as</p>
        <p className="mt-2 text-lg font-medium">{session.user.name}</p>
        <p className="text-sm text-muted-foreground">{session.user.email}</p>
      </section>
      <SignOutButton />
    </main>
  );
}
