import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { requireSession } from "@/lib/require-session";

export default async function SubscriptionsPage() {
  const session = await requireSession();

  const rows = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, session.user.id))
    .orderBy(desc(subscriptions.createdAt));

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">Subscriptions</h1>
        <Link className="text-sm underline" href="/dashboard">
          Back to dashboard
        </Link>
      </div>

      <section className="rounded-xl border p-6">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No subscriptions found.</p>
        ) : (
          <ul className="space-y-3">
            {rows.map((sub) => (
              <li className="rounded-lg border p-3" key={sub.id}>
                <p className="font-medium">{sub.serviceName}</p>
                <p className="text-sm text-muted-foreground">
                  {sub.monthlyCost} / month | {sub.status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
