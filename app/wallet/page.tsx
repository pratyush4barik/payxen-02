import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { internalTransfers, transactions, wallet } from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { addMoneyAction, withdrawMoneyAction } from "@/app/wallet/actions";

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Wallet</h1>
        <Link className="text-sm underline" href="/dashboard">
          Back to dashboard
        </Link>
      </div>

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
        <p className="text-sm text-muted-foreground">Current Balance</p>
        <p className="mt-2 text-3xl font-semibold">{userWallet.balance}</p>
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
              placeholder="Amount"
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
              placeholder="Amount"
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
                  <p className="font-medium">{txn.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {txn.amount} | {txn.referenceType}
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
                  <p className="text-sm text-muted-foreground">{transfer.amount}</p>
                </div>
              ))}
          </div>
        </article>
      </section>
    </main>
  );
}
