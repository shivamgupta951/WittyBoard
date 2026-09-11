'use client'

import Image from "next/image";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DownloadIcon, Loader2, Save, Share } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  selectedTab: (value: string) => void;
  onExport: () => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

function WorkspaceHeader({ selectedTab, onExport, onSave, isSaving }: Props) {
  const { projectid } = useParams();
  const projectId = Array.isArray(projectid) ? projectid[0] : projectid;
  const [projectName, setProjectName] = useState("WorkSpace Name");

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
        <Tabs defaultValue="whiteboard" onValueChange={selectedTab}>
          <TabsList>
            <TabsTrigger value="whiteboard">WhiteBoard</TabsTrigger>
            <TabsTrigger value="doc">Doc</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-2">
        <Button disabled={isSaving} onClick={onSave}>
          {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button variant={"outline"}><Share/> Share</Button>
        <Button onClick={onExport}><DownloadIcon/> Export</Button>
      </div>
    </div>
  );
}

export default WorkspaceHeader;
