import {
  Monitor,
  Network,
  PencilRuler,
  Smartphone,
  Sparkles,
  Workflow,
  X,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  convertToExcalidrawElements,
} from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

type Props = {
  excalidrawApi: ExcalidrawImperativeAPI | null;
  onClose: () => void;
};

function AIFloatingSidebar({ excalidrawApi, onClose }: Props) {
  const [selectedTool, setSelectedTool] = useState("Generate Diagrams");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");

  const AiTools = [
    {
      name: "Generate Diagrams",
      desc: "Create visual diagrams",
      icon: <PencilRuler />,
      color: "text-blue-600",
      background: "#eff6ff",
      stroke: "#2563eb",
      labels: ["Goal", "Key steps", "Decision", "Outcome", "Next step"],
      prompt:
        "Create a rich, presentation-ready visual diagram from the user's idea. First identify the real entities, roles, concepts, stages, dependencies, and relationships in the request. Use a clear title, grouped sections, concise labels, rectangles for actions or components, diamonds for decisions, ellipses for start/end states, and arrows for direction. Include 6-12 meaningful elements, secondary relationships, and short connection labels where useful. Use the user's domain vocabulary instead of generic labels, keep spacing balanced, and make the result understandable without extra explanation.",
    },
    {
      name: "Web Mockup",
      desc: "Create website wireframes",
      icon: <Monitor />,
      color: "text-cyan-600",
      background: "#ecfeff",
      stroke: "#0891b2",
      labels: ["Navigation", "Hero section", "Feature cards", "Social proof", "Footer"],
      prompt:
        "Create a rich website UI wireframe for the user's exact idea, not a simple three-box diagram. Build one complete page from top to bottom: navigation with a brand/logo placeholder and links, hero headline and supporting copy, primary and secondary CTA buttons, a visual/product preview area, 3-4 feature cards, a benefit or pricing section, testimonial/social-proof content, and a footer. Use realistic domain-specific copy, distinguish headings from controls, align sections to a consistent grid, and connect navigation or CTA actions only when they represent real page flow.",
    },
    {
      name: "Mobile Mockup",
      desc: "Create mobile app wireframes",
      icon: <Smartphone />,
      color: "text-pink-600",
      background: "#fdf2f8",
      stroke: "#db2777",
      labels: ["Status bar", "Brand header", "Main content", "User action", "Confirmation"],
      prompt:
        "Create a rich mobile app UI wireframe based on the user's exact request, not a simple flowchart. Draw one or two consistent phone-shaped screens with status bar, brand/logo placeholder, page title, realistic input fields or content cards, icons represented by short labels, a prominent primary button, secondary action, validation or empty states, and helpful footer text. Name every screen and control using the user's domain. Add arrows only for real navigation between screens, keep phone proportions consistent, and align every control inside its screen.",
    },
    {
      name: "Flowchart",
      desc: "Visualize workflows",
      icon: <Workflow />,
      color: "text-purple-600",
      background: "#f5f3ff",
      stroke: "#7c3aed",
      labels: ["Start", "Collect details", "Check condition", "Take action", "Finish"],
      prompt:
        "Create a detailed, domain-specific flowchart from the user's description. Extract the actual workflow steps and use them as labels. Use rounded rectangles for start and finish, rectangles for actions, diamonds for decisions, and arrows that connect node edges cleanly. Include 6-12 nodes, a clear primary path, realistic success and failure branches, and short labels such as Yes, No, Approved, Failed, or Retry. Avoid generic Process or Result labels when the user gives a specific domain. Keep the main flow top-to-bottom and avoid crossing arrows.",
    },
    {
      name: "Architecture",
      desc: "Design system architecture",
      icon: <Network />,
      color: "text-orange-600",
      background: "#fff7ed",
      stroke: "#ea580c",
      labels: ["Client app", "Web frontend", "API layer", "Services", "Database", "External systems"],
      prompt:
        "Design a rich, production-minded system architecture diagram for the user's system. Identify and group client apps, web or mobile frontends, authentication, API gateways, backend services, workers or queues, databases, caches, file storage, analytics, and external integrations only when relevant. Use containers or grouped sections for system boundaries, concise domain-specific labels, and directional arrows for request and data flow. Label important protocols or events, show read/write relationships, and keep the architecture readable from left to right with no unnecessary crossings.",
    },
  ];

  const selectedToolConfig =
    AiTools.find((tool) => tool.name === selectedTool) ?? AiTools[0];

  const getEmptyCanvasPosition = () => {
    if (!excalidrawApi) {
      return { x: 100, y: 100 };
    }

    const elements = excalidrawApi
      .getSceneElements()
      .filter((element: any) => !element.isDeleted);

    if (elements.length === 0) {
      return { x: 100, y: 100 };
    }

    const maxRight = Math.max(
      ...elements.map((element: any) => element.x + element.width),
    );
    const minTop = Math.min(...elements.map((element: any) => element.y));

    return {
      x: maxRight + 150,
      y: minTop,
    };
  };

  const getLoadingElements = (x: number, y: number) =>
    convertToExcalidrawElements([
      {
        type: "rectangle",
        x,
        y,
        width: 550,
        height: 360,
        strokeColor: "#7c3aed",
        backgroundColor: "#f5f3ff",
        fillStyle: "solid",
        roundness: { type: 3 },
      },
      {
        type: "text",
        x: x + 42,
        y: y + 42,
        text: "Generating with AI",
        fontSize: 30,
        fontFamily: 1,
        strokeColor: "#5b21b6",
      },
      {
        type: "text",
        x: x + 42,
        y: y + 98,
        text: `Preparing your ${selectedTool.toLowerCase()}...`,
        fontSize: 20,
        fontFamily: 1,
        strokeColor: "#6b7280",
      },
      {
        type: "rectangle",
        x: x + 42,
        y: y + 168,
        width: 360,
        height: 28,
        strokeColor: "#c4b5fd",
        backgroundColor: "#ddd6fe",
        fillStyle: "solid",
        roundness: { type: 3 },
      },
      {
        type: "rectangle",
        x: x + 42,
        y: y + 224,
        width: 500,
        height: 28,
        strokeColor: "#ddd6fe",
        backgroundColor: "#ede9fe",
        fillStyle: "solid",
        roundness: { type: 3 },
      },
      {
        type: "rectangle",
        x: x + 42,
        y: y + 280,
        width: 280,
        height: 28,
        strokeColor: "#c4b5fd",
        backgroundColor: "#ddd6fe",
        fillStyle: "solid",
        roundness: { type: 3 },
      },
    ] as any);

  const getConnectionPoints = (
    fromNode: any,
    toNode: any,
    origin: { x: number; y: number },
  ) => {
    const fromX = origin.x + Number(fromNode.x || 0);
    const fromY = origin.y + Number(fromNode.y || 0);
    const fromWidth = Number(fromNode.width || 200);
    const fromHeight = Number(fromNode.height || 80);
    const toX = origin.x + Number(toNode.x || 0);
    const toY = origin.y + Number(toNode.y || 0);
    const toWidth = Number(toNode.width || 200);
    const toHeight = Number(toNode.height || 80);
    const fromCenter = {
      x: fromX + fromWidth / 2,
      y: fromY + fromHeight / 2,
    };
    const toCenter = {
      x: toX + toWidth / 2,
      y: toY + toHeight / 2,
    };
    const horizontal = Math.abs(toCenter.x - fromCenter.x) >= Math.abs(toCenter.y - fromCenter.y);

    if (horizontal) {
      const startsOnRight = toCenter.x >= fromCenter.x;
      return {
        start: {
          x: (startsOnRight ? fromX + fromWidth : fromX) - origin.x,
          y: fromCenter.y - origin.y,
        },
        end: {
          x: (startsOnRight ? toX : toX + toWidth) - origin.x,
          y: toCenter.y - origin.y,
        },
      };
    }

    const startsBelow = toCenter.y >= fromCenter.y;
    return {
      start: {
        x: fromCenter.x - origin.x,
        y: (startsBelow ? fromY + fromHeight : fromY) - origin.y,
      },
      end: {
        x: toCenter.x - origin.x,
        y: (startsBelow ? toY : toY + toHeight) - origin.y,
      },
    };
  };

  const getConnectionElements = (
    elements: any[],
    connections: any[],
    origin: { x: number; y: number },
  ) => {
    const elementById = new Map(
      elements.map((element) => [element.id, element]),
    );

    return connections.flatMap((connection) => {
      const fromNode = elementById.get(connection.from);
      const toNode = elementById.get(connection.to);

      if (!fromNode || !toNode) return [];

      const points = getConnectionPoints(fromNode, toNode, origin);
      const arrow = {
        type: "arrow",
        x: points.start.x,
        y: points.start.y,
        points: [
          [0, 0],
          [points.end.x - points.start.x, points.end.y - points.start.y],
        ],
        strokeColor: "#475569",
        strokeWidth: 2,
        endArrowhead: "arrow",
      };

      return connection.label
        ? [
            arrow,
            {
              type: "text",
              x: (points.start.x + points.end.x) / 2,
              y: (points.start.y + points.end.y) / 2 - 18,
              text: connection.label,
              fontSize: 16,
              fontFamily: 1,
            },
          ]
        : [arrow];
    });
  };

  const handleGenerate = async () => {
    if (!excalidrawApi) return;

    setIsGenerating(true);
    setGenerationError("");
    const position = getEmptyCanvasPosition();
    const loadingElements = getLoadingElements(position.x, position.y);
    const loadingIds = new Set(loadingElements.map((element) => element.id));

    try {
      excalidrawApi.updateScene({
        elements: [...excalidrawApi.getSceneElements(), ...loadingElements],
        appState: {
          selectedElementIds: Object.fromEntries(
            loadingElements.map((element) => [element.id, true]),
          ),
        },
      });

      const [result] = await Promise.all([
        axios.post("/api/ai", {
          userInput: prompt.trim(),
          type: selectedToolConfig.name,
          systemPrompt: selectedToolConfig.prompt,
          canvasPosition: position,
        }),
        new Promise((resolve) => setTimeout(resolve, 2400)),
      ]);

      if (!result.data?.success) {
        throw new Error(result.data?.error || "AI generation failed");
      }

      if (result.data.fallback) {
        setGenerationError(
          result.data.warning ||
            "Gemini was unavailable, so a local template was used.",
        );
      }

      const elementsWithoutLoading = excalidrawApi
        .getSceneElements()
        .filter((element) => !loadingIds.has(element.id));
      const responseElements = result.data?.elements ?? result.data;

      if (!Array.isArray(responseElements)) {
        throw new Error("The AI API must return an array of Excalidraw elements.");
      }

      const connectionElements = getConnectionElements(
        responseElements,
        result.data?.connections ?? [],
        { x: 0, y: 0 },
      );
      const newElements = convertToExcalidrawElements([
        ...responseElements,
        ...connectionElements,
      ] as any);

      excalidrawApi.updateScene({
        elements: [...elementsWithoutLoading, ...newElements],
        appState: {
          selectedElementIds: Object.fromEntries(
            newElements.map((element) => [element.id, true]),
          ),
        },
      });
      setPrompt("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "AI generation failed";
      console.error("AI generation failed:", error);
      setGenerationError(message);
      excalidrawApi.updateScene({
        elements: excalidrawApi
          .getSceneElements()
          .filter((element) => !loadingIds.has(element.id)),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="absolute right-15 bottom-20 z-50 w-80 max-h-125 overflow-hidden rounded-xl border border-gray-200 bg-white p-3 shadow-2xl">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-gray-900">
            <span className="flex size-7 items-center justify-center rounded-lg bg-gray-900 text-white">
              <Sparkles className="size-3.5" />
            </span>
            SmartWitty
          </h2>
          <Button
            aria-label="Close SmartWitty"
            className="text-gray-400 hover:text-gray-900"
            size="icon-sm"
            variant="ghost"
            onClick={onClose}
          >
            <X />
          </Button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          Turn ideas into visuals in seconds!
        </p>
      </div>

      <div className="mt-3 space-y-0.5">
        {AiTools.map((tool) => (
          <div
            key={tool.name}
            className={`flex cursor-pointer items-center gap-2 rounded-lg p-1.5 transition-colors ${selectedTool === tool.name ? "bg-gray-700 text-white shadow-sm" : "hover:bg-gray-50"}`}
            onClick={() => {
              setSelectedTool(tool.name);
              setPrompt(`Create a ${tool.name.toLowerCase()} for `);
              setGenerationError("");
            }}
          >
            <div
              className={`${tool.color} rounded-lg bg-gray-100 p-1.5 [&>svg]:size-4`}
            >
              {tool.icon}
            </div>
            <div className="min-w-0">
              <h3
                className={`text-sm font-medium ${selectedTool === tool.name ? "text-white" : "text-gray-900"}`}
              >
                {tool.name}
              </h3>
              <p
                className={`line-clamp-1 text-xs ${selectedTool === tool.name ? "text-gray-300" : "text-gray-400"}`}
              >
                {tool.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 border-t border-gray-100 pt-3">
        <h3 className="text-xs font-semibold text-gray-900">
          Describe what you want to create
        </h3>
        <Textarea
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={isGenerating}
          className="mt-2 min-h-16 resize-none border-gray-200 bg-gray-50 text-xs placeholder:text-gray-400 focus-visible:bg-white"
          placeholder="Eg. Customer onboarding flow with decision points"
        />
        {generationError && (
          <p className="mt-2 text-xs text-amber-700" role="status">
            {generationError}
          </p>
        )}
        <Button
          className="mt-2 w-full gap-2"
          disabled={!excalidrawApi || isGenerating}
          onClick={handleGenerate}
          size="sm"
        >
          {isGenerating ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              <Sparkles />
              Generate
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default AIFloatingSidebar;
