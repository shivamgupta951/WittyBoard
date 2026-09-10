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
  Users,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function AppSidebar() {
  const path = usePathname();
  const { user } = useUser();
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Image src="/logo.svg" alt="logo" width={40} height={40} />
          <h2 className="text-xl font-bold tracking-tight">WittyBoard</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button>+ Create New Board</Button>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Boards</SidebarGroupLabel>
          <SidebarMenuButton className="p-5" isActive={path === "/dashboard"}>
            <LayoutGrid />
            All Files
          </SidebarMenuButton>
          <SidebarMenuButton
            className="p-5 mt-2"
            isActive={path === "/shared-files"}
          >
            <Users />
            Shared
          </SidebarMenuButton>
          <SidebarMenuButton
            className="p-5 mt-2"
            isActive={path === "/archived"}
          >
            <Archive />
            Archived
          </SidebarMenuButton>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarMenuButton className="p-5 mt-2" isActive={path === "/ai"}>
            <Sparkles />
            <span>AI Helper</span>
          </SidebarMenuButton>
          <SidebarMenuButton
            className="p-5 mt-2"
            isActive={path === "/settings"}
          >
            <Settings />
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button>+ Create New Board</Button>
        <div className="flex flex-col gap-2 text-sm p-4 my-3 border rounded-md">
          <h2>
            2 files created <span>total 3</span>
          </h2>
          <Progress value={66} className="h-2 w-full" />
        </div>
        <div className="flex items-center gap-2">
          <Image
            src={user?.imageUrl ?? ""}
            alt="User Image"
            height={40}
            width={40}
            className="rounded-full"
          />
          <h2>{user?.firstName} {user?.lastName}</h2>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
