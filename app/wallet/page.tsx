import type React from "react";
import { and, desc, eq, lte, sql } from "drizzle-orm";
import { AppSidebar } from "@/app/dashboard-01/app-sidebar";
import { SiteHeader } from "@/app/dashboard-01/site-header";
import { db } from "@/db";
import { internalTransfers, transactions, wallet } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import {
  addMoneyAction,
  transferByPxIdAction,
  withdrawMoneyAction,
} from "@/app/wallet/actions";
import { PendingStatusRefresher } from "@/app/wallet/pending-status-refresher";
import { PxIdCopyButton } from "@/app/wallet/pxid-copy-button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const formatInr = (value: string | number) => {
  const num = typeof value === "number" ? value : Number.parseFloat(value);
  if (!Number.isFinite(num)) return "₹0.00";
  return `₹${num.toFixed(2)}`;
};

type WalletPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function WalletPage({ searchParams }: WalletPageProps) {
  const session = await requireSession();
  const query = (await searchParams) ?? {};

  let [userWallet] = await db
    .select()
    .from(wallet)
    .where(eq(wallet.userId, session.user.id))
    .limit(1);

  if (!userWallet) {
    const [createdWallet] = await db
      .insert(wallet)
      .values({
        userId: session.user.id,
        balance: "0.00",
      })
      .returning();
    userWallet = createdWallet;
  }

  await db
    .update(transactions)
    .set({ status: "SUCCESSFUL" })
    .where(
      and(
        eq(transactions.userId, session.user.id),
        eq(transactions.referenceType, "BANK_WITHDRAWAL"),
        eq(transactions.status, "PENDING"),
        lte(transactions.createdAt, sql`now() - interval '5 seconds'`),
      ),
    );

  const txns = await db
    .select()
    .from(transactions)
    .where(eq(transactions.walletId, userWallet.id))
    .orderBy(desc(transactions.createdAt))
    .limit(20);

  const sentTransfers = await db
    .select()
    .from(internalTransfers)
    .where(eq(internalTransfers.senderId, session.user.id))
    .orderBy(desc(internalTransfers.createdAt))
    .limit(10);

  const receivedTransfers = await db
    .select()
    .from(internalTransfers)
    .where(eq(internalTransfers.receiverId, session.user.id))
    .orderBy(desc(internalTransfers.createdAt))
    .limit(10);

  const hasPendingWithdrawal = txns.some(
    (txn) => txn.referenceType === "BANK_WITHDRAWAL" && txn.status === "PENDING",
  );

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        user={{
          name: session.user.name ?? "User",
          email: session.user.email,
        }}
        variant="inset"
      />
      <SidebarInset>
        <SiteHeader title="Wallet" />
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
          <PendingStatusRefresher shouldRefresh={hasPendingWithdrawal} />

          {query.success ? (
            <p className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {query.success}
            </p>
          ) : null}
          {query.error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {query.error}
            </p>
          ) : null}

          <section className="rounded-xl border p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="mt-2 text-3xl font-semibold">{formatInr(userWallet.balance)}</p>
              </div>
              <div className="md:text-right">
                <p className="text-sm text-muted-foreground">Your PayXen ID</p>
                <div className="mt-1 flex items-center gap-2 md:justify-end">
                  <p className="text-base font-medium">{userWallet.pxId}</p>
                  <PxIdCopyButton pxId={userWallet.pxId} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Share this `px-id` to receive internal wallet transfers.
                </p>
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">Add Money</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Adds money from escrow settlement into your wallet balance.
              </p>
              <form action={addMoneyAction} className="flex gap-3">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  min="0.01"
                  name="amount"
                  placeholder="Amount (₹)"
                  required
                  step="0.01"
                  type="number"
                />
                <button
                  className="rounded-md bg-black px-4 py-2 text-sm text-white"
                  type="submit"
                >
                  Add
                </button>
              </form>
            </article>

            <article className="rounded-xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">Withdraw Money</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Sends wallet money to your bank and records the transfer history.
              </p>
              <form action={withdrawMoneyAction} className="flex gap-3">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  min="0.01"
                  name="amount"
                  placeholder="Amount (₹)"
                  required
                  step="0.01"
                  type="number"
                />
                <button
                  className="rounded-md bg-black px-4 py-2 text-sm text-white"
                  type="submit"
                >
                  Withdraw
                </button>
              </form>
            </article>

            <article className="rounded-xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">Transfer to PayXen User</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Use receiver `px-id` to transfer instantly.
              </p>
              <form action={transferByPxIdAction} className="space-y-3">
                <input
                  className="w-full rounded-md border px-3 py-2 text-sm"
                  name="target"
                  placeholder="px-id (e.g. px-abc123...)"
                  required
                  type="text"
                />
                <div className="flex gap-3">
                  <input
                    className="w-full rounded-md border px-3 py-2 text-sm"
                    min="0.01"
                    name="amount"
                    placeholder="Amount (₹)"
                    required
                    step="0.01"
                    type="number"
                  />
                  <button
                    className="rounded-md bg-black px-4 py-2 text-sm text-white"
                    type="submit"
                  >
                    Transfer
                  </button>
                </div>
              </form>
            </article>

            <article className="rounded-xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">Requests</h2>
              <p className="text-sm text-muted-foreground">
                Request feature box is ready. Request send/accept/reject flows will be added here.
              </p>
            </article>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <article className="rounded-xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">Ledger</h2>
              {txns.length === 0 ? (
                <p className="text-sm text-muted-foreground">No wallet activity yet.</p>
              ) : (
                <ul className="space-y-3">
                  {txns.map((txn) => (
                    <li className="rounded-lg border p-3" key={txn.id}>
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{txn.type}</p>
                        <span
                          className={
                            txn.status === "PENDING"
                              ? "rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700"
                              : "rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700"
                          }
                        >
                          {txn.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatInr(txn.amount)} | {txn.referenceType}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {txn.description || "No description"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="rounded-xl border p-6">
              <h2 className="mb-4 text-lg font-semibold">Internal Transfers</h2>
              <p className="text-sm text-muted-foreground">
                Sent: {sentTransfers.length} | Received: {receivedTransfers.length}
              </p>
              <div className="mt-4 space-y-3">
                {[...sentTransfers, ...receivedTransfers]
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
                  )
                  .slice(0, 10)
                  .map((transfer) => (
                    <div className="rounded-lg border p-3" key={transfer.id}>
                      <p className="font-medium">{transfer.status}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatInr(transfer.amount)}
                      </p>
                    </div>
                  ))}
              </div>
            </article>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
