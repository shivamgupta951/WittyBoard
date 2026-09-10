"use client";

import React, { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
function WhiteSmartBoard() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const saveTimeRef = useRef<any>(null);
  const { projectid } = useParams();
  const handleCanvasChange = (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
    if (saveTimeRef.current) {
      clearTimeout(saveTimeRef.current);
    }

    saveTimeRef.current = setTimeout(async () => {
      try {
        await SaveCanvasChanges(elements, appState, files);
        toast.add({
          title: "Changes Saved!",
          type: "success",
        });
      } catch {
        toast.add({
          title: "Changes could not be saved",
          description: "Please check your connection and try again.",
          type: "error",
        });
      }
    }, 10000);
  };

  useEffect(() => {
    return () => {
      if (saveTimeRef.current) {
        clearTimeout(saveTimeRef.current);
      }
    };
  }, []);

  const SaveCanvasChanges = async (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
    await axios.post("/api/whiteboard", {
      elements: elements,
      appState: appState,
      files: files,
      projectId: projectid,
    });
  };

  return (
    <div style={{ height: "90vh" }}>
      <Excalidraw
        //@ts-ignore
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={handleCanvasChange}
      />
    </div>
  );
}

export default WhiteSmartBoard;
