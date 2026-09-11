"use client";

import {
  CheckSquare,
  FileText,
  Grid2X2,
  Heart,
  Lightbulb,
  MessageCircle,
  MousePointer2,
  Smile,
  Sparkles,
  StickyNote,
  X,
} from "lucide-react";
import { useState } from "react";
import { convertToExcalidrawElements } from "@excalidraw/excalidraw";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

type Panel = "notes" | "emoji" | "ai" | null;

type Props = {
  excalidrawApi: ExcalidrawImperativeAPI | null;
  onSmartWitty: () => void;
};

type NoteStyle = {
  name: string;
  description: string;
  backgroundColor: string;
  strokeColor: string;
  accentColor: string;
  icon: typeof StickyNote;
  width: number;
  height: number;
};

const noteStyles: NoteStyle[] = [
  {
    name: "Sticky Note",
    description: "Warm idea card",
    backgroundColor: "#fff1b8",
    strokeColor: "#e5b93f",
    accentColor: "#f59e0b",
    icon: StickyNote,
    width: 300,
    height: 180,
  },
  {
    name: "Glass Note",
    description: "Polished meeting note",
    backgroundColor: "#dbeafe",
    strokeColor: "#93c5fd",
    accentColor: "#2563eb",
    icon: FileText,
    width: 300,
    height: 180,
  },
  {
    name: "Task Card",
    description: "Structured checklist tile",
    backgroundColor: "#d1fae5",
    strokeColor: "#6ee7b7",
    accentColor: "#10b981",
    icon: CheckSquare,
    width: 340,
    height: 210,
  },
];

const emojiGroups = [
  {
    name: "Frequently Used",
    items: ["😀", "😂", "😍", "😎", "🤔", "🔥", "✨", "🎯", "🚀", "💡"],
  },
  {
    name: "Smileys & People",
    items: ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😋", "😎", "🤓"],
  },
  {
    name: "Objects & Symbols",
    items: ["⭐", "🌈", "☀️", "✅", "❌", "⚡", "❤️", "👍", "👏", "💬", "📌", "🎨", "📎", "🔔", "🎉", "💻", "📱", "🧠", "📝", "🗂️"],
  },
];

const iconItems = [
  { name: "Activity", glyph: "⌁", icon: Heart },
  { name: "Arrow Up", glyph: "↑", icon: Lightbulb },
  { name: "Message", glyph: "☏", icon: MessageCircle },
  { name: "Grid", glyph: "⊞", icon: Grid2X2 },
  { name: "Target", glyph: "◎", icon: MousePointer2 },
  { name: "Spark", glyph: "✦", icon: Sparkles },
  { name: "Check", glyph: "✓", icon: CheckSquare },
  { name: "Heart", glyph: "♡", icon: Heart },
];

function SmartToolsDock({ excalidrawApi, onSmartWitty }: Props) {
  const [activePanel, setActivePanel] = useState<Panel>(null);
  const [emojiTab, setEmojiTab] = useState<"emoji" | "icons">("emoji");
  const [search, setSearch] = useState("");

  const getInsertPosition = () => {
    const appState = excalidrawApi?.getAppState();
    const zoom = appState?.zoom?.value ?? 1;
    const viewportWidth = appState?.width ?? 1000;
    const viewportHeight = appState?.height ?? 700;
    const scrollX = appState?.scrollX ?? 0;
    const scrollY = appState?.scrollY ?? 0;

    return {
      x: scrollX + viewportWidth / zoom / 2 - 150,
      y: scrollY + viewportHeight / zoom / 2 - 100,
    };
  };

  const addElements = (elements: any[]) => {
    if (!excalidrawApi) return;
    // All dock tools create normal Excalidraw elements, so the result remains
    // selectable, editable, autosaved, and exportable like hand-drawn content.
    const newElements = convertToExcalidrawElements(elements as any);
    excalidrawApi.updateScene({
      elements: [...excalidrawApi.getSceneElements(), ...newElements],
      appState: {
        selectedElementIds: Object.fromEntries(
          newElements.map((element) => [element.id, true]),
        ),
      },
    });
    setActivePanel(null);
  };

  const addNote = (style: NoteStyle) => {
    const position = getInsertPosition();
    const isTask = style.name === "Task Card";
    const elements = [
      {
        type: "rectangle",
        x: position.x,
        y: position.y,
        width: style.width,
        height: style.height,
        backgroundColor: style.backgroundColor,
        strokeColor: style.strokeColor,
        fillStyle: "solid",
        roundness: { type: 3 },
        strokeWidth: 2,
      },
      {
        type: "text",
        x: position.x + 24,
        y: position.y + 24,
        text: style.name,
        fontSize: 24,
        fontFamily: 1,
        strokeColor: "#1f2937",
      },
      {
        type: "rectangle",
        x: position.x + 24,
        y: position.y + 68,
        width: isTask ? 30 : style.width - 48,
        height: 8,
        backgroundColor: style.accentColor,
        strokeColor: style.accentColor,
        fillStyle: "solid",
        strokeWidth: 1,
      },
      {
        type: "text",
        x: position.x + 24,
        y: position.y + 98,
        text: isTask ? "Add your next action" : "Write your idea here",
        fontSize: 18,
        fontFamily: 1,
        strokeColor: "#4b5563",
      },
    ];

    if (isTask) {
      elements.push(
        {
          type: "text",
          x: position.x + 24,
          y: position.y + 140,
          text: "[ ] First step",
          fontSize: 17,
          fontFamily: 1,
          strokeColor: "#374151",
        },
        {
          type: "text",
          x: position.x + 24,
          y: position.y + 170,
          text: "[ ] Final step",
          fontSize: 17,
          fontFamily: 1,
          strokeColor: "#374151",
        },
      );
    }

    addElements(elements);
  };

  const addTextElement = (text: string, fontSize: number) => {
    const position = getInsertPosition();
    addElements([
      {
        type: "text",
        x: position.x,
        y: position.y,
        text,
        fontSize,
        fontFamily: 1,
        strokeColor: "#111827",
      },
    ]);
  };

  const filteredGroups = emojiGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => !search || item.includes(search)),
    }))
    .filter((group) => group.items.length > 0);
  const filteredIcons = iconItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const togglePanel = (panel: Exclude<Panel, null>) => {
    // Only one utility panel is open at a time, keeping the dock usable on
    // smaller screens and avoiding overlapping popovers.
    setActivePanel((current) => (current === panel ? null : panel));
    if (panel !== "emoji") setSearch("");
  };

  return (
    <>
      {activePanel === "notes" && (
        <div className="absolute bottom-16 left-1/2 z-50 w-80 -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Add notes</h2>
              <p className="text-xs text-gray-500">Pick a blank note style for the whiteboard.</p>
            </div>
            <button aria-label="Close notes" className="rounded-full p-1 text-gray-400 hover:bg-gray-100" onClick={() => setActivePanel(null)}>
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-2">
            {noteStyles.map((style) => {
              const Icon = style.icon;
              return (
                <button
                  key={style.name}
                  className="flex w-full items-center gap-3 rounded-xl border border-gray-200 p-2 text-left transition hover:border-gray-400 hover:bg-gray-50"
                  onClick={() => addNote(style)}
                >
                  <span className="flex size-14 shrink-0 items-center justify-center rounded-lg border" style={{ backgroundColor: style.backgroundColor, borderColor: style.strokeColor }}>
                    <Icon className="size-6" style={{ color: style.accentColor }} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-gray-900">{style.name}</span>
                    <span className="block text-xs text-gray-500">{style.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {activePanel === "emoji" && (
        <div className="absolute bottom-16 left-1/2 z-50 w-96 max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Emoji and icons</h2>
              <p className="text-xs text-gray-500">Choose from the picker or search the icon library.</p>
            </div>
            <button aria-label="Close emoji picker" className="rounded-full p-1 text-gray-400 hover:bg-gray-100" onClick={() => setActivePanel(null)}>
              <X className="size-4" />
            </button>
          </div>
          <div className="mb-3 flex rounded-full bg-gray-100 p-1">
            <button className={`flex-1 rounded-full py-1 text-xs font-medium ${emojiTab === "emoji" ? "bg-white shadow-sm" : "text-gray-500"}`} onClick={() => setEmojiTab("emoji")}>Emoji</button>
            <button className={`flex-1 rounded-full py-1 text-xs font-medium ${emojiTab === "icons" ? "bg-white shadow-sm" : "text-gray-500"}`} onClick={() => setEmojiTab("icons")}>Icons</button>
          </div>
          <input
            aria-label="Search emoji or icons"
            className="mb-3 h-9 w-full rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-blue-500"
            placeholder={emojiTab === "emoji" ? "Search emoji" : "Search icons"}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="max-h-64 overflow-y-auto">
            {emojiTab === "emoji" ? (
              filteredGroups.length > 0 ? filteredGroups.map((group) => (
                <section key={group.name} className="mb-3">
                  <h3 className="mb-1 text-xs font-semibold text-gray-500">{group.name}</h3>
                  <div className="grid grid-cols-10 gap-1">
                    {group.items.map((item, index) => (
                      <button key={`${item}-${index}`} className="flex aspect-square items-center justify-center rounded-lg text-xl hover:bg-blue-50" onClick={() => addTextElement(item, 56)}>{item}</button>
                    ))}
                  </div>
                </section>
              )) : <p className="py-8 text-center text-sm text-gray-500">No emoji found.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {filteredIcons.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button key={item.name} className="flex flex-col items-center gap-1 rounded-xl border border-gray-100 p-2 hover:border-blue-300 hover:bg-blue-50" onClick={() => addTextElement(item.glyph, 56)}>
                      <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-xl text-blue-600"><Icon className="size-5" /></span>
                      <span className="w-full truncate text-[10px] text-gray-600">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-gray-200 bg-white/95 p-1.5 shadow-xl backdrop-blur">
        <button className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${activePanel === "notes" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`} onClick={() => togglePanel("notes")}>
          <FileText className="size-4" /> Notes
        </button>
        <button className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium transition ${activePanel === "emoji" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-50"}`} onClick={() => togglePanel("emoji")}>
          <Smile className="size-4" /> Emoji
        </button>
        <button className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700" onClick={onSmartWitty}>
          <Sparkles className="size-4" /> SmartWitty
        </button>
      </div>
    </>
  );
}

export default SmartToolsDock;
