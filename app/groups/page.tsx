import type React from "react";
import { and, eq } from "drizzle-orm";
import { AppSidebar } from "@/app/dashboard-01/app-sidebar";
import { SiteHeader } from "@/app/dashboard-01/site-header";
import { db } from "@/db";
import {
  groupMembers,
  groupSubscriptionSplits,
  groupSubscriptions,
  groups,
} from "@/db/schema";
import { requireSession } from "@/lib/require-session";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function GroupsPage() {
  const session = await requireSession();

  const memberships = await db
    .select({
      groupId: groups.id,
      name: groups.name,
      role: groupMembers.role,
      joinedAt: groupMembers.joinedAt,
    })
    .from(groupMembers)
    .innerJoin(groups, eq(groups.id, groupMembers.groupId))
    .where(eq(groupMembers.userId, session.user.id));

  const memberSubscriptions = await db
    .select({
      subscriptionId: groupSubscriptions.id,
      groupId: groupSubscriptions.groupId,
      serviceName: groupSubscriptions.serviceName,
      totalCost: groupSubscriptions.totalCost,
      splitType: groupSubscriptions.splitType,
      status: groupSubscriptions.status,
      shareAmount: groupSubscriptionSplits.shareAmount,
    })
    .from(groupSubscriptionSplits)
    .innerJoin(
      groupSubscriptions,
      and(
        eq(groupSubscriptions.id, groupSubscriptionSplits.groupSubscriptionId),
        eq(groupSubscriptionSplits.userId, session.user.id),
      ),
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
        <SiteHeader title="Groups" />
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-6 py-8">
          <section className="rounded-xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">My Group Memberships</h2>
            {memberships.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You are not part of any groups yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {memberships.map((membership) => (
                  <li className="rounded-lg border p-3" key={membership.groupId}>
                    <p className="font-medium">{membership.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Role: {membership.role}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="mb-4 text-lg font-semibold">My Group Subscription Splits</h2>
            {memberSubscriptions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No group subscription splits assigned.
              </p>
            ) : (
              <ul className="space-y-3">
                {memberSubscriptions.map((sub) => (
                  <li className="rounded-lg border p-3" key={sub.subscriptionId}>
                    <p className="font-medium">{sub.serviceName}</p>
                    <p className="text-sm text-muted-foreground">
                      Share: {sub.shareAmount} | Total: {sub.totalCost} | {sub.status}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
