"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import {
  Archive,
  LayoutGrid,
  Settings,
  Sparkles,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import CreateNewBoardDialog from "./CreateNewBoardDialog";
import { MAX_WORKSPACES } from "@/lib/constants";

export function AppSidebar() {
  const path = usePathname();
  const router = useRouter();
  const [isArchiveView, setIsArchiveView] = useState(false);
  const [credits, setCredits] = useState(MAX_WORKSPACES);
  const { user } = useUser();

  useEffect(() => {
    const loadCredits = async () => {
      try {
        const { data } = await axios.post("/api/users");
        if (typeof data?.credits === "number") setCredits(data.credits);
      } catch (error) {
        console.error("Failed to load workspace credits:", error);
      }
    };

    void loadCredits();
  }, []);

  const usedWorkspaces = Math.max(0, MAX_WORKSPACES - credits);
  const usagePercent = Math.min(100, (usedWorkspaces / MAX_WORKSPACES) * 100);
  // Credits are derived from all retained project rows, including archives.
  // This keeps the progress indicator aligned with the server-side quota.
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image
            className="h-10 w-10"
            src="/logo.svg"
            alt="logo"
            width={40}
            height={40}
          />
          <h2 className="text-xl font-bold tracking-tight">WittyBoard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <CreateNewBoardDialog />
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Boards</SidebarGroupLabel>
          <SidebarMenuButton
            className="p-5"
            isActive={path === "/dashboard" && !isArchiveView}
            onClick={() => {
              setIsArchiveView(false);
              router.push("/dashboard");
            }}
          >
            <LayoutGrid />
            All Files
          </SidebarMenuButton>
          <SidebarMenuButton
            className="p-5 mt-2"
            isActive={isArchiveView}
            onClick={() => {
              setIsArchiveView(true);
              router.push("/dashboard?view=archived");
            }}
          >
            <Archive />
            Archived
          </SidebarMenuButton>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others Features in WorkSpace.</SidebarGroupLabel>
          <div className="flex text-sm items-center p-5 mt-2">
            <Sparkles className="mx-1" />
            <span>AI Helper</span>
          </div>
          <div className="flex text-sm items-center p-5">
            <Settings className="mx-1" />
            <span>Settings</span>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex flex-col gap-2 text-sm p-4 my-3 border rounded-md">
          <h2>
            {usedWorkspaces} {usedWorkspaces === 1 ? "workspace" : "workspaces"} created
            <span className="ml-1 text-muted-foreground">of {MAX_WORKSPACES}</span>
          </h2>
          <Progress value={usagePercent} className="h-2 w-full" />
          <p className="text-xs text-muted-foreground">
            {credits} {credits === 1 ? "workspace" : "workspaces"} remaining
          </p>
        </div>
        <div className="flex items-center gap-2">
          {user?.imageUrl ? (
            <Image
              src={user.imageUrl}
              alt="User Image"
              height={40}
              width={40}
              className="rounded-full"
            />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-full bg-slate-200 text-slate-500">
              <UserRound className="size-5" />
            </span>
          )}
          <h2>
            {user?.firstName} {user?.lastName}
          </h2>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
