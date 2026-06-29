/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { MessageSquareText } from "lucide-react";
import { verifyBrand } from "@/lib/auth/verifyBrand";
import { createClient } from "@/lib/supabase/server";
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { getDashboardDateTimeValue } from "@/lib/dashboard/formatDashboardDate";
import { MessagesClient } from "../messages/MessagesClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CollaborationHubPage() {
  const brandSession = await verifyBrand();

  if (!brandSession.ok) {
    redirect("/login");
  }

  const supabase = await createClient();
  const brandId = brandSession.brand.id;
  let threads: any[] = [];
  let tableMissing = false;

  try {
    const { data, error } = await supabase
      .from("chat_threads")
      .select(`
        *,
        campaigns ( title ),
        chat_messages (
          id,
          content,
          created_at,
          sender_id
        )
      `)
      .eq("brand_id", brandId)
      .order("updated_at", { ascending: false });

    if (error) {
      if (error.code === "42P01" || error.message?.includes("does not exist")) {
        tableMissing = true;
      } else {
        console.error("[Collaboration Hub] Error fetching threads:", error);
      }
    } else if (data) {
      threads = data.map((thread) => ({
        id: thread.id,
        title: thread.campaigns?.title || "Campaign Thread",
        lastMessage:
          thread.chat_messages?.sort((a: any, b: any) => getDashboardDateTimeValue(b.created_at) - getDashboardDateTimeValue(a.created_at))[0]?.content ||
          "No messages yet",
        updatedAt: thread.updated_at,
        messages: thread.chat_messages || [],
      }));
    }
  } catch (err) {
    console.warn("[Collaboration Hub] handled error:", err);
  }

  if (tableMissing) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <DashboardPageHeader
          title="Collaboration Hub"
          description="Chat with creators, coordinate campaign details, and keep collaboration history in one workspace."
        />
        <DashboardEmptyState
          title="Collaboration unavailable"
          description="The chat messaging service is currently being configured."
          icon={MessageSquareText}
        />
      </div>
    );
  }

  return <MessagesClient initialThreads={threads} />;
}
