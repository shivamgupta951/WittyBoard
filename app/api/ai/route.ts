import { GoogleGenAI } from "@google/genai";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_USER_INPUT_LENGTH = 2000;
const MAX_SYSTEM_PROMPT_LENGTH = 6000;
const MAX_GENERATED_ELEMENTS = 100;

const elementSchema = {
  type: "object",
  properties: {
    id: { type: "string" },
    type: {
      type: "string",
      enum: [
        "rectangle",
        "ellipse",
        "diamond",
        "text",
        "arrow",
        "line",
        "freedraw",
      ],
    },
    x: { type: "number" },
    y: { type: "number" },
    width: { type: "number" },
    height: { type: "number" },
    text: { type: "string" },
    points: {
      type: "array",
      items: {
        type: "array",
        items: { type: "number" },
      },
    },
    backgroundColor: { type: "string" },
    strokeColor: { type: "string" },
    strokeWidth: { type: "number" },
    strokeStyle: { type: "string" },
    fillStyle: { type: "string" },
    roughness: { type: "number" },
    opacity: { type: "number" },
    startArrowhead: { type: "string" },
    endArrowhead: { type: "string" },
    fontSize: { type: "number" },
    fontFamily: { type: "number" },
  },
  required: ["id", "type", "x", "y"],
  additionalProperties: false,
};

const connectionSchema = {
  type: "object",
  properties: {
    from: { type: "string" },
    to: { type: "string" },
    label: { type: "string" },
  },
  required: ["from", "to"],
  additionalProperties: false,
};

const responseSchema = {
  type: "object",
  properties: {
    elements: {
      type: "array",
      items: elementSchema,
    },
    connections: {
      type: "array",
      items: connectionSchema,
    },
  },
  required: ["elements", "connections"],
  additionalProperties: false,
};

// Gemini receives a strict JSON schema so the client can safely convert the
// response into Excalidraw elements without trusting arbitrary model prose.

const visualEnhancementPrompt = `
GLOBAL VISUAL ENHANCEMENT RULES:
- Make the diagram colorful, readable, and visually organized.
- Every shape or component must include a valid HEX backgroundColor and strokeColor.
- Use soft modern pastel backgrounds with darker contrasting borders.
- Use different colors to distinguish steps, sections, groups, and states.
- Do not use the same color for every element.
- Use these preferred palettes when appropriate:
  - Blue: backgroundColor #DBEAFE, strokeColor #2563EB
  - Purple: backgroundColor #EDE9FE, strokeColor #7C3AED
  - Green: backgroundColor #DCFCE7, strokeColor #16A34A
  - Orange: backgroundColor #FFEDD5, strokeColor #EA580C
  - Pink: backgroundColor #FCE7F3, strokeColor #DB2777
  - Cyan: backgroundColor #CFFAFE, strokeColor #0891B2
  - Yellow: backgroundColor #FEF3C7, strokeColor #D97706
  - Red: backgroundColor #FEE2E2, strokeColor #DC2626
- Use darker neutral or matching colors for arrows and connections.
- Use dark readable colors for standalone text.
- Keep sufficient spacing between elements and avoid overlapping labels.
- Do not generate Excalidraw internal properties such as version, seed, versionNonce, or updated.
`;

const parseModelJson = (text: string) => {
  const cleanedText = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  return JSON.parse(cleanedText);
};

const isValidElement = (element: unknown) => {
  if (!element || typeof element !== "object") return false;

  const candidate = element as Record<string, unknown>;
  return (
    typeof candidate.type === "string" &&
    typeof candidate.x === "number" &&
    typeof candidate.y === "number"
  );
};

const alignElementsToCanvas = (
  elements: Record<string, unknown>[],
  position: { x?: number; y?: number },
) => {
  const minX = Math.min(...elements.map((element) => Number(element.x)));
  const minY = Math.min(...elements.map((element) => Number(element.y)));
  const targetX = Number(position.x) || 100;
  const targetY = Number(position.y) || 100;
  const offsetX = targetX - minX;
  const offsetY = targetY - minY;

  return elements.map((element) => ({
    ...element,
    x: Number(element.x) + offsetX,
    y: Number(element.y) + offsetY,
  }));
};

const ensureElementIds = (elements: Record<string, unknown>[]) =>
  elements.map((element, index) => ({
    ...element,
    id:
      typeof element.id === "string" && element.id.trim()
        ? element.id
        : `ai-element-${index + 1}`,
  }));

const addMissingLabels = (elements: Record<string, unknown>[], type: string) => {
  const labelsByType: Record<string, string[]> = {
    Flowchart: ["Start", "Process", "Decision", "Result", "Finish"],
    Architecture: ["Client", "Service", "API", "Database", "Storage"],
    "Web Mockup": ["Navigation", "Hero", "Features", "Content", "Footer"],
    "Mobile Mockup": ["Header", "Main screen", "Details", "Action", "Footer"],
  };
  const labels = labelsByType[type] ?? ["Input", "Process", "Decision", "Output"];
  const textElements = elements.filter(
    (element) => element.type === "text" && String(element.text ?? "").trim(),
  );
  let labelIndex = 0;
  const missingLabels: Record<string, unknown>[] = [];

  for (const element of elements) {
    if (!["rectangle", "diamond", "ellipse"].includes(String(element.type))) {
      continue;
    }

    const x = Number(element.x);
    const y = Number(element.y);
    const width = Number(element.width) || 160;
    const height = Number(element.height) || 64;
    const hasLabel = textElements.some((textElement) => {
      const textX = Number(textElement.x);
      const textY = Number(textElement.y);
      return (
        textX >= x - 8 &&
        textX <= x + width &&
        textY >= y - 8 &&
        textY <= y + height
      );
    });

    if (!hasLabel) {
      missingLabels.push({
        type: "text",
        x: x + 16,
        y: y + Math.max(12, height / 2 - 10),
        text: labels[labelIndex % labels.length],
        fontSize: 18,
        fontFamily: 1,
        strokeColor: "#1f2937",
      });
      labelIndex += 1;
    }
  }

  return [...elements, ...missingLabels];
};

const applyVisualDefaults = (elements: Record<string, unknown>[]) => {
  const palettes = [
    { backgroundColor: "#dbeafe", strokeColor: "#2563eb" },
    { backgroundColor: "#dcfce7", strokeColor: "#16a34a" },
    { backgroundColor: "#fef3c7", strokeColor: "#d97706" },
    { backgroundColor: "#fce7f3", strokeColor: "#db2777" },
    { backgroundColor: "#ede9fe", strokeColor: "#7c3aed" },
  ];
  const isBlankColor = (value: unknown) => {
    const color = String(value ?? "").toLowerCase().replaceAll(" ", "");
    return !color || ["#fff", "#ffffff", "white", "transparent"].includes(color);
  };

  return elements.map((element, index) => {
    const palette = palettes[index % palettes.length];
    const elementType = String(element.type);

    if (["rectangle", "diamond", "ellipse"].includes(elementType)) {
      return {
        ...element,
        strokeColor: isBlankColor(element.strokeColor)
          ? palette.strokeColor
          : element.strokeColor,
        backgroundColor: isBlankColor(element.backgroundColor)
          ? palette.backgroundColor
          : element.backgroundColor,
        strokeWidth: Math.max(2, Number(element.strokeWidth) || 2),
        strokeStyle: "solid",
        fillStyle: element.fillStyle || "solid",
      };
    }

    if (["arrow", "line"].includes(elementType)) {
      return {
        ...element,
        strokeColor: isBlankColor(element.strokeColor)
          ? "#475569"
          : element.strokeColor,
        strokeWidth: Math.max(2, Number(element.strokeWidth) || 2),
      };
    }

    if (elementType === "text" && isBlankColor(element.strokeColor)) {
      return { ...element, strokeColor: "#1f2937" };
    }

    return element;
  });
};

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const getErrorStatus = (error: unknown) => {
  if (!error || typeof error !== "object") return undefined;

  const candidate = error as { status?: number; error?: { code?: number } };
  return candidate.status ?? candidate.error?.code;
};

const isRetryableError = (error: unknown) =>
  [429, 500, 502, 503, 504].includes(getErrorStatus(error) ?? 0);

const createFallbackElements = (
  type: string,
  userInput: string,
  position: { x?: number; y?: number },
) => {
  const labelsByType: Record<string, string[]> = {
    Flowchart: ["Start", "Collect details", "Check condition", "Take action", "Finish"],
    Architecture: ["Client", "Web app", "API Server", "Database", "Notifications"],
    "Web Mockup": ["Navigation", "Hero section", "Main features", "Call to action", "Footer"],
    "Mobile Mockup": ["Header", "Main screen", "Content", "User action", "Confirmation"],
  };
  const labels = labelsByType[type] ?? ["Input", "Process", "Output"];
  const x = Number(position.x) || 100;
  const y = Number(position.y) || 100;
  const width = 180;
  const height = 64;
  const gap = 70;

  return [
    {
      type: "text",
      x,
      y: y - 42,
      text: `${type}: ${userInput}`,
      fontSize: 20,
      fontFamily: 1,
    },
    ...labels.flatMap((label, index) => {
      const nodeX = x + index * (width + gap);
      return [
        {
          type: "rectangle",
          x: nodeX,
          y,
          width,
          height,
          backgroundColor: "#eff6ff",
          strokeColor: "#2563eb",
          fillStyle: "solid",
          roundness: { type: 3 },
        },
        {
          type: "text",
          x: nodeX + 16,
          y: y + 22,
          text: label,
          fontSize: 20,
          fontFamily: 1,
        },
      ];
    }),
    ...labels.slice(0, -1).map((_, index) => ({
      type: "arrow",
      x: x + index * (width + gap) + width,
      y: y + height / 2,
      points: [[0, 0], [gap, 0]],
      strokeColor: "#64748b",
      endArrowhead: "arrow",
    })),
  ];
};

export async function POST(request: NextRequest) {
  let requestContext = {
    type: "Diagram",
    userInput: "Generated diagram",
    canvasPosition: { x: 100, y: 100 },
  };

  try {
    // API routes need their own authentication check because they can be called
    // directly, independently of the page routes protected by middleware.
    if (!(await currentUser())) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 },
      );
    }

    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Request body must be a JSON object" },
        { status: 400 },
      );
    }

    const userInput =
      typeof body.userInput === "string" ? body.userInput.trim() : "";
    const type = typeof body.type === "string" ? body.type.trim() : "Diagram";
    const systemPrompt =
      typeof body.systemPrompt === "string" ? body.systemPrompt.trim() : "";
    const canvasPosition =
      body.canvasPosition && typeof body.canvasPosition === "object"
        ? body.canvasPosition
        : { x: 100, y: 100 };
    requestContext = { type, userInput, canvasPosition };

    if (!userInput) {
      return NextResponse.json(
        { success: false, error: "userInput is required" },
        { status: 400 },
      );
    }

    if (userInput.length > MAX_USER_INPUT_LENGTH) {
      return NextResponse.json(
        { success: false, error: `userInput must be ${MAX_USER_INPUT_LENGTH} characters or fewer` },
        { status: 400 },
      );
    }

    if (systemPrompt.length > MAX_SYSTEM_PROMPT_LENGTH) {
      return NextResponse.json(
        { success: false, error: `systemPrompt must be ${MAX_SYSTEM_PROMPT_LENGTH} characters or fewer` },
        { status: 400 },
      );
    }

    if (!Number.isFinite(Number(canvasPosition.x)) || !Number.isFinite(Number(canvasPosition.y))) {
      return NextResponse.json(
        { success: false, error: "canvasPosition must contain finite x and y values" },
        { status: 400 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const finalPrompt = `
You are an expert Excalidraw ${type} generation agent.

  ${visualEnhancementPrompt}

System instructions:
${systemPrompt}

User request:
${userInput}

Canvas insertion position: x=${Number(canvasPosition.x) || 100}, y=${Number(canvasPosition.y) || 100}

Create a detailed, useful visual layout rather than a shallow three-box summary.
Break the request into 6-12 meaningful elements when the idea supports it. Include the important steps, roles, screens, services, decisions, or data stores implied by the request.
Use a clear primary flow plus helpful secondary branches. Keep the composition balanced and leave enough spacing for labels.
Use concise, practical labels that feel friendly and slightly conversational, not overly formal or vague.
If the request is simple, add a few relevant supporting details without inventing unrelated features.
Treat the user request as the source of truth. Extract concrete nouns and actions from it and use them in the node labels.
Do not use generic labels such as "Process", "Result", "Content", or "Action" when the user has provided a specific domain.
For example, an ecommerce flow should use labels like "Browse products", "Add to cart", "Checkout", "Payment", and "Order confirmed" rather than generic placeholders.
For a flowchart, include realistic success and failure paths, and label decision branches with short values such as "Yes", "No", "Paid", or "Failed".
Return only valid JSON matching the response schema.
Use relative points for lines and arrows. Use hex colors. Do not include markdown or explanatory text.
Every element must have a unique id, type, x, and y. Add width and height where applicable.
Return connections using the source and target element ids. Add a short label for decision branches when useful.
`;

    const models = [
      process.env.GEMINI_MODEL || "gemini-3.7-flash",
      ...(process.env.GEMINI_FALLBACK_MODELS || "")
        .split(",")
        .map((fallbackModel) => fallbackModel.trim())
        .filter(Boolean),
    ].filter((candidate, index, all) => all.indexOf(candidate) === index);
    let response;
    let lastError: unknown;

    for (const model of models) {
      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: finalPrompt,
            config: {
              responseMimeType: "application/json",
              responseJsonSchema: responseSchema,
            },
          });
          break;
        } catch (error) {
          lastError = error;

          if (!isRetryableError(error) || attempt === 2) {
            break;
          }

          await wait(800 * 2 ** attempt);
        }
      }

      if (response) break;
    }

    if (!response) {
      throw lastError ?? new Error("No Gemini model was available");
    }

    const parsed = parseModelJson(response.text ?? "{}");
    const elements = Array.isArray(parsed.elements)
      ? ensureElementIds(parsed.elements.filter(isValidElement)).slice(0, MAX_GENERATED_ELEMENTS)
      : null;
    const connections = Array.isArray(parsed.connections)
      ? parsed.connections.filter(
          (connection: unknown) =>
            connection &&
            typeof connection === "object" &&
            typeof (connection as Record<string, unknown>).from === "string" &&
            typeof (connection as Record<string, unknown>).to === "string",
        )
      : [];

    if (!elements || elements.length === 0) {
      throw new Error("Gemini returned no valid Excalidraw elements");
    }

    const alignedElements = alignElementsToCanvas(elements, canvasPosition);
    const readableElements = addMissingLabels(alignedElements, type);

    return NextResponse.json({
      success: true,
      elements: applyVisualDefaults(readableElements),
      connections,
    });
  } catch (error) {
    console.error("AI generation failed:", error);

    const status = getErrorStatus(error);
    const isUnavailable = [429, 500, 502, 503, 504].includes(status ?? 0);

    if (isUnavailable) {
      return NextResponse.json({
        success: true,
        fallback: true,
        warning: "Gemini is temporarily busy. A local diagram was created instead.",
        elements: createFallbackElements(
          requestContext.type,
          requestContext.userInput,
          requestContext.canvasPosition,
        ),
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: isUnavailable
          ? "Gemini is temporarily busy. Please try again in a moment."
          : error instanceof Error
            ? error.message
            : "AI generation failed",
      },
      { status: isUnavailable ? 503 : 500 },
    );
  }
}
