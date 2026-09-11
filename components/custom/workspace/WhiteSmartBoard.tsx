"use client";

import React, { useEffect, useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
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
  Loader2,
} from "lucide-react";
import FloatingProperties from "./FloatingProperties";
import AIFloatingSidebar from "./AIFloatingSidebar";
import SmartToolsDock from "./SmartToolsDock";

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

type Props = {
  onApiReady: (api: ExcalidrawImperativeAPI) => void;
};
 

function WhiteSmartBoard({ onApiReady }: Props) {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [activeTool, setActiveTool] = useState("selection");
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [showAiSideBar, setShowAiSideBar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasState, setCanvasState] = useState<any>(null);
  const pendingSaveRef = useRef<{
    elements: readonly any[];
    appState: any;
    files: any;
  } | null>(null);
  const isHydratedRef = useRef(false);
  const { projectid } = useParams();
  const router = useRouter();
  const projectId = Array.isArray(projectid) ? projectid[0] : projectid;

  const SaveCanvasChanges = async (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
    await axios.post("/api/whiteboard", {
      elements,
      appState,
      files,
      projectId,
    });
  };

  useEffect(() => {
    if (!excalidrawAPI) return;

    if (!projectId) {
      isHydratedRef.current = true;
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    // Excalidraw must be ready before restoring the scene. The hydration flag
    // prevents its initial empty onChange event from overwriting saved data.
    const loadCanvas = async () => {
      try {
        const { data } = await axios.get("/api/whiteboard", {
          params: { projectId },
        });

        if (cancelled) return;

        if (data) {
          const elements = Array.isArray(data.elements) ? data.elements : [];
          const appState = {
            ...(data.appState ?? {}),
            // JSON turns Excalidraw's collaborators Map into a plain object.
            collaborators: new Map(),
          };
          const files = data.files ?? {};

          if (Object.keys(files).length > 0) {
            excalidrawAPI.addFiles(files as any);
          }

          excalidrawAPI.updateScene({
            elements,
            appState,
          });
        }

        isHydratedRef.current = true;
        setIsLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          isHydratedRef.current = false;
          setIsLoading(false);
          toast.add({
            title: "Workspace archived",
            description: "This workspace is read-only. Returning to Archive.",
            type: "info",
          });
          router.replace("/dashboard?view=archived");
          return;
        }

        console.error("Failed to load whiteboard:", error);
        toast.add({
          title: "Whiteboard could not be loaded",
          description: "Please refresh and try again.",
          type: "error",
        });
        isHydratedRef.current = true;
        setIsLoading(false);
      }
    };

    void loadCanvas();

    return () => {
      cancelled = true;
    };
  }, [excalidrawAPI, projectId, router]);

  const handleCanvasChange = (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
    if (!isHydratedRef.current) return;

    setCanvasState(appState);
    const selectedIds = Object.keys(appState.selectedElementIds || {});

    if (selectedIds?.length == 1) {
      const element = elements.find((element) => element.id == selectedIds[0]);
      setSelectedElement(element);
    } else {
      setSelectedElement(null);
    }

    // Keep the latest event for an unmount fallback. The interval below reads
    // directly from Excalidraw so imperative UI tools are also captured.
    pendingSaveRef.current = { elements, appState, files };
  };

  const changeTool = (tool: any) => {
    if (!excalidrawAPI) return;
    setActiveTool(tool);
    excalidrawAPI.setActiveTool({
      type: tool,
    });
  };

  useEffect(() => {
    if (!excalidrawAPI || !projectId) return;

    // A fixed interval is deliberate: Notes, Emoji, AI, and property panels can
    // update Excalidraw without always emitting React onChange.
    const saveCurrentCanvas = async () => {
      if (!isHydratedRef.current) return;

      const snapshot = {
        elements: excalidrawAPI.getSceneElements(),
        appState: excalidrawAPI.getAppState(),
        files: excalidrawAPI.getFiles(),
      };

      pendingSaveRef.current = snapshot;

      try {
        await SaveCanvasChanges(
          snapshot.elements,
          snapshot.appState,
          snapshot.files,
        );
        pendingSaveRef.current = null;
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
    };

    const saveInterval = window.setInterval(() => {
      void saveCurrentCanvas();
    }, 20000);

    return () => {
      window.clearInterval(saveInterval);

      const pendingSave = pendingSaveRef.current;
      if (pendingSave) {
        void SaveCanvasChanges(
          pendingSave.elements,
          pendingSave.appState,
          pendingSave.files,
        );
      }
    };
  }, [excalidrawAPI, projectId]);

  const getFloatingPosition = () => {
    if (!selectedElement || !canvasState) {
      return { left: 0, top: 0 };
    }
    const zoom = canvasState.zoom?.value ?? 1;

    const scrollX = canvasState.scrollX ?? 0;

    const scrollY = canvasState.scrollY ?? 0;

    // Convert Excalidraw coordinates
    // into browser coordinates
    const screenX = (selectedElement.x + scrollX) * zoom;

    const screenY = (selectedElement.y + scrollY) * zoom;

    const panelWidth = 300;
    const viewportWidth = typeof window === "undefined" ? 0 : window.innerWidth;

    return {
      left:
        viewportWidth > 0
          ? Math.max(panelWidth * 0.9, Math.min(screenX, viewportWidth))
          : screenX,
      top: Math.max(16, screenY),
    };
  };

  const floatingPosition = getFloatingPosition();
  return (
    <div className="relative" style={{ height: "90vh" }}>
      <Excalidraw
        //@ts-ignore
        excalidrawAPI={(api) => {
          setExcalidrawAPI(api);
          onApiReady(api);
        }}
        onChange={handleCanvasChange}
      />
      <div className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex flex-col gap-1 rounded-2xl bg-white border p-1.5 shadow-xl">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              key={tool.name}
              className={`flex h-7 w-7 my-0.5 items-center justify-center rounded-2xl transition hover:bg-primary/10 hover:cursor-pointer ${activeTool === tool.name ? "bg-primary/20" : ""}`}
              onClick={() => changeTool(tool.name)}
            >
              <Icon size={19} className={tool.color} />
            </button>
          );
        })}
      </div>
      <FloatingProperties
        selectedElement={selectedElement}
        position={floatingPosition}
        excalidrawAPI={excalidrawAPI}
      />

      <SmartToolsDock
        excalidrawApi={excalidrawAPI}
        onSmartWitty={() => setShowAiSideBar((current) => !current)}
      />

      {showAiSideBar && (
        <AIFloatingSidebar
          excalidrawApi={excalidrawAPI}
          onClose={() => setShowAiSideBar(false)}
        />
      )}

      {isLoading && (
        <div
          aria-live="polite"
          aria-label="Loading whiteboard"
          className="absolute inset-0 z-60 flex items-center justify-center bg-white/85 backdrop-blur-[2px]"
        >
          <div className="flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 shadow-lg">
            <Loader2 className="size-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Loading whiteboard...
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default WhiteSmartBoard;
