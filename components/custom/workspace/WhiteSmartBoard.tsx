"use client";

import React, { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/toast";
import "./whiteboard.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import {
  MousePointer2,
  Hand,
  Square,
  Diamond,
  Circle,
  ArrowRight,
  Minus,
  Pencil,
  Type,
  Image,
  Eraser,
  Shapes,
} from "lucide-react";

const tools = [
  {
    name: "selection",
    icon: MousePointer2,
    color: "text-blue-600",
  },
  {
    name: "hand",
    icon: Hand,
    color: "text-cyan-600",
  },
  {
    name: "rectangle",
    icon: Square,
    color: "text-blue-600",
  },
  {
    name: "diamond",
    icon: Diamond,
    color: "text-purple-600",
  },
  {
    name: "ellipse",
    icon: Circle,
    color: "text-green-600",
  },
  {
    name: "arrow",
    icon: ArrowRight,
    color: "text-orange-600",
  },
  {
    name: "line",
    icon: Minus,
    color: "text-gray-600",
  },
  {
    name: "freedraw",
    icon: Pencil,
    color: "text-pink-600",
  },
  {
    name: "text",
    icon: Type,
    color: "text-yellow-600",
  },
  {
    name: "image",
    icon: Image,
    color: "text-indigo-600",
  },
  {
    name: "eraser",
    icon: Eraser,
    color: "text-red-600",
  },
];

function WhiteSmartBoard() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [activeTool, setActiveTool] = useState("selection");
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

  const changeTool = (tool: any) => {
    if (!excalidrawAPI) return;
    setActiveTool(tool);
    excalidrawAPI.setActiveTool({
      type: tool,
    });
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
      <div className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex flex-col gap-1 rounded-2xl bg-white border p-1.5 shadow-xl">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              className={`flex h-7 w-7 my-0.5 items-center justify-center rounded-2xl transition hover:bg-primary/10 hover:cursor-pointer ${activeTool === tool.name ? "bg-primary/20" : ""}`}
              onClick={() => changeTool(tool.name)}
            >
              <Icon size={19} className={tool.color} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WhiteSmartBoard;
