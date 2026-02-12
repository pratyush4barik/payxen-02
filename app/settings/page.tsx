import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { account, session as sessionTable, user } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

export default async function SettingsPage() {
  const session = await requireSession();

  const [dbUser] = await db
    .select()
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);

  const linkedAccounts = await db
    .select()
    .from(account)
    .where(eq(account.userId, session.user.id));

  const activeSessions = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.userId, session.user.id));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <Link className="text-sm underline" href="/dashboard">
          Back to dashboard
        </Link>
      </div>

      <section className="rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Name: {dbUser?.name || session.user.name}
        </p>
        <p className="text-sm text-muted-foreground">
          Email: {dbUser?.email || session.user.email}
        </p>
      </section>

      <section className="rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">Linked Accounts</h2>
        {linkedAccounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No linked accounts.</p>
        ) : (
          <ul className="space-y-2">
            {linkedAccounts.map((linkedAccount) => (
              <li className="rounded-lg border p-3" key={linkedAccount.id}>
                <p className="font-medium">{linkedAccount.providerId}</p>
                <p className="text-sm text-muted-foreground">
                  Account ID: {linkedAccount.accountId}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border p-6">
        <h2 className="mb-4 text-lg font-semibold">Active Sessions</h2>
        <p className="text-sm text-muted-foreground">
          Total sessions: {activeSessions.length}
        </p>
      </section>
    </main>
  );
}
