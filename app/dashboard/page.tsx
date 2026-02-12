import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  groupMembers,
  groupSubscriptions,
  groups,
  subscriptions,
  transactions,
  wallet,
} from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { SignOutButton } from "@/components/ui/app_components/sign_out_button";

export default async function DashboardPage() {
  const session = await requireSession();
  const [userWallet] = await db
    .select()
    .from(wallet)
    .where(eq(wallet.userId, session.user.id))
    .limit(1);

  const recentTransactions = await db
    .select()
    .from(transactions)
    .where(eq(transactions.userId, session.user.id))
    .orderBy(desc(transactions.createdAt))
    .limit(5);

  const activeSubscriptions = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .orderBy(desc(subscriptions.createdAt))
    .limit(5);

  const [groupsSummary] = await db
    .select({
      groupsCount: sql<number>`count(*)`,
    })
    .from(groupMembers)
    .where(eq(groupMembers.userId, session.user.id));

  const [groupSubsSummary] = await db
    .select({
      subscriptionsCount: sql<number>`count(${groupSubscriptions.id})`,
    })
    .from(groupSubscriptions)
    .innerJoin(groups, eq(groups.id, groupSubscriptions.groupId))
    .innerJoin(groupMembers, eq(groupMembers.groupId, groups.id))
    .where(eq(groupMembers.userId, session.user.id));

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-6 py-10 md:grid-cols-[220px_1fr]">
      <aside className="rounded-xl border p-4">
        <h1 className="mb-4 text-xl font-semibold">SubWallet</h1>
        <nav className="flex flex-col gap-2 text-sm">
          <Link className="rounded-md border px-3 py-2" href="/dashboard">
            Dashboard
          </Link>
          <Link className="rounded-md border px-3 py-2" href="/wallet">
            Wallet
          </Link>
          <Link className="rounded-md border px-3 py-2" href="/groups">
            Groups
          </Link>
          <Link className="rounded-md border px-3 py-2" href="/subscriptions">
            Subscription
          </Link>
          <Link className="rounded-md border px-3 py-2" href="/settings">
            Settings
          </Link>
        </nav>
        <div className="mt-4">
          <SignOutButton />
        </div>
      </aside>

      <section className="flex flex-col gap-6">
        <h2 className="text-3xl font-semibold">Dashboard</h2>

        <section className="grid gap-4 md:grid-cols-4">
          <article className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Wallet Balance</p>
            <p className="mt-2 text-2xl font-semibold">
              {userWallet?.balance ?? "0.00"}
            </p>
          </article>
          <article className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Your Groups</p>
            <p className="mt-2 text-2xl font-semibold">
              {groupsSummary?.groupsCount ?? 0}
            </p>
          </article>
          <article className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Group Subs</p>
            <p className="mt-2 text-2xl font-semibold">
              {groupSubsSummary?.subscriptionsCount ?? 0}
            </p>
          </article>
          <article className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">Personal Subs</p>
            <p className="mt-2 text-2xl font-semibold">
              {activeSubscriptions.length}
            </p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Transactions</h3>
              <Link className="text-sm underline" href="/wallet">
                Wallet
              </Link>
            </div>
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No transactions yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentTransactions.map((txn) => (
                  <li className="rounded-lg border p-3" key={txn.id}>
                    <p className="font-medium">{txn.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {txn.amount} | {txn.referenceType}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </article>

          <article className="rounded-xl border p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Subscriptions</h3>
              <Link className="text-sm underline" href="/subscriptions">
                View all
              </Link>
            </div>
            {activeSubscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No personal subscriptions yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {activeSubscriptions.map((sub) => (
                  <li className="rounded-lg border p-3" key={sub.id}>
                    <p className="font-medium">{sub.serviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      {sub.monthlyCost} / month
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </section>

        <section className="rounded-xl border p-6">
          <p className="text-sm text-muted-foreground">Signed in as</p>
          <p className="mt-2 text-lg font-medium">{session.user.name}</p>
          <p className="text-sm text-muted-foreground">{session.user.email}</p>
        </section>
      </section>
    </main>
  );
}
