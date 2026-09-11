'use client'

import Image from "next/image";
import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Loader2, Save, Share } from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  selectedTab: (value: string) => void;
  onExport: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

function WorkspaceHeader({ selectedTab, onExport, onSave, isSaving }: Props) {
  const { projectid } = useParams();
  const router = useRouter();
  const projectId = Array.isArray(projectid) ? projectid[0] : projectid;
  const [projectName, setProjectName] = useState("WorkSpace Name");

  const handleTabChange = (value: string) => {
    if (value === "dashboard") {
      router.push("/dashboard");
      return;
    }

    selectedTab(value);
  };

  useEffect(() => {
    if (!projectId) return;

    const loadProject = async () => {
      try {
        const { data } = await axios.get("/api/projects", {
          params: { projectId },
        });
        if (data?.projectName) setProjectName(data.projectName);
      } catch (error) {
        console.error("Failed to load project name:", error);
      }
    };

    void loadProject();
  }, [projectId]);

  return (
    <div className="p-3 border-b flex justify-between">
      <div className="flex gap-2 items-center">
        <Image className="h-10 w-10" src="/logo.svg" alt="logo" width={40} height={40} />
        <h2>{projectName}</h2>
      </div>

      <div>
        <Tabs defaultValue="whiteboard" onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="whiteboard">WhiteBoard</TabsTrigger>
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-2">
        <Button disabled={isSaving} onClick={onSave}>
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button variant={"outline"} onClick={onExport}><DownloadIcon/> Export</Button>
      </div>
    </div>
  );
}

export default WorkspaceHeader;
