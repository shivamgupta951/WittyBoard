"use client";

import SmartDoc from "@/components/custom/workspace/SmartDoc";
import WorkspaceHeader from "@/components/custom/workspace/WorkspaceHeader";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import axios from "axios";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { toast } from "@/components/ui/toast";

const WhiteSmartBoard = dynamic(
  () => import("@/components/custom/workspace/WhiteSmartBoard"),
  { ssr: false },
);

function page() {
  const { projectid } = useParams();
  const projectId = Array.isArray(projectid) ? projectid[0] : projectid;
  const [isSaving, setIsSaving] = useState(false);
  // The page owns the imperative Excalidraw API so header actions can export or
  // save the same live scene that the whiteboard component is rendering.
  const handleExportImage = async () => {
    if (!api) return;

    const { exportToBlob } = await import("@excalidraw/excalidraw");
    const blob = await exportToBlob({
      elements: api.getSceneElements(),
      appState: {
        ...api.getAppState(),
        exportBackground: true,
      },
      files: api.getFiles(),
      mimeType: "image/png",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "whiteboard.png";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };

  const handleSaveChanges = async () => {
    if (!api || !projectId) {
      toast.add({
        title: "Nothing to save",
        description: "The whiteboard is still loading.",
        type: "info",
      });
      return;
    }

    setIsSaving(true);

    try {
      await axios.post("/api/whiteboard", {
        projectId,
        elements: api.getSceneElements(),
        appState: api.getAppState(),
        files: api.getFiles(),
      });
      toast.add({
        title: "Changes saved",
        description: "Your whiteboard has been saved successfully.",
        type: "success",
      });
    } catch (error) {
      console.error("Failed to save whiteboard:", error);
      toast.add({
        title: "Changes could not be saved",
        description: "Please check your connection and try again.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const [activeTab, setActiveTab] = useState("whiteboard");
  const [api, setApi] = useState<ExcalidrawImperativeAPI | null>(null);
  return (
    <div>
      <WorkspaceHeader
        selectedTab={(value: string) => setActiveTab(value)}
        onExport={handleExportImage}
        onSave={handleSaveChanges}
        isSaving={isSaving}
      />
      {activeTab === "whiteboard" ? (
        <WhiteSmartBoard onApiReady={(api) => setApi(api)} />
      ) : (
        <SmartDoc />
      )}
    </div>
  );
}

export default page;
