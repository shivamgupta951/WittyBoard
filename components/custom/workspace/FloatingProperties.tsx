"use client";

import React from "react";
import { BringToFront, SendToBack, Copy, Trash2, X } from "lucide-react";

type Props = {
  selectedElement: any;
  position: {
    left: number;
    top: number;
  };
  excalidrawAPI: any;
};

function FloatingProperties({
  selectedElement,
  position,
  excalidrawAPI,
}: Props) {
  if (!selectedElement) return null;

  const type = selectedElement.type;

  const isText = type === "text";

  const isShape = ["rectangle", "ellipse", "diamond"].includes(type);

  const isLine = type === "line" || type === "arrow";

  const isArrow = type === "arrow";

  const isFreeDraw = type === "freedraw";

  const updateElement = (changes: any) => {
    if (!excalidrawAPI) return;

    const elements = excalidrawAPI.getSceneElements();

    const updatedElements = elements.map((element: any) => {
      if (element.id !== selectedElement.id) {
        return element;
      }

      return {
        ...element,
        ...changes,
        version: element.version + 1,
        versionNonce: Math.floor(Math.random() * 2147483647),
      };
    });

    excalidrawAPI.updateScene({
      elements: updatedElements,
    });
  };

  const bringToFront = () => {
    const elements = excalidrawAPI.getSceneElements();

    const selected = elements.find((el: any) => el.id === selectedElement.id);

    if (!selected) return;

    const rest = elements.filter((el: any) => el.id !== selectedElement.id);

    excalidrawAPI.updateScene({
      elements: [...rest, selected],
    });
  };

  const sendToBack = () => {
    const elements = excalidrawAPI.getSceneElements();

    const selected = elements.find((el: any) => el.id === selectedElement.id);

    if (!selected) return;

    const rest = elements.filter((el: any) => el.id !== selectedElement.id);

    excalidrawAPI.updateScene({
      elements: [selected, ...rest],
    });
  };

  const duplicateElement = () => {
    const elements = excalidrawAPI.getSceneElements();

    const newElement = {
      ...selectedElement,

      id: crypto.randomUUID(),

      x: selectedElement.x + 20,
      y: selectedElement.y + 20,

      version: 1,

      versionNonce: Math.floor(Math.random() * 2147483647),

      seed: Math.floor(Math.random() * 2147483647),
    };

    excalidrawAPI.updateScene({
      elements: [...elements, newElement],

      appState: {
        selectedElementIds: {
          [newElement.id]: true,
        },
      },
    });
  };

  const deleteElement = () => {
    const elements = excalidrawAPI.getSceneElements();

    excalidrawAPI.updateScene({
      elements: elements.filter((el: any) => el.id !== selectedElement.id),

      appState: {
        selectedElementIds: {},
      },
    });
  };

  return (
    <div
      className="
        absolute
        z-100
        translate-x-[-90%]
        translate-y-[-90%]
        flex
        w-56
        max-h-[calc(90vh-2rem)]
        overflow-y-auto
        flex-col
        gap-1.5
        rounded-lg
        border
        bg-white
        p-2
        shadow-xl
      "
      style={{
        left: position.left,
        top: position.top,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold">
          {isText
            ? "Text options"
            : isShape
              ? "Shape options"
              : isArrow
                ? "Arrow options"
                : isLine
                  ? "Line options"
                  : isFreeDraw
                    ? "Draw options"
                    : "Element options"}
        </span>

        <button
          onClick={() =>
            excalidrawAPI.updateScene({
              appState: {
                selectedElementIds: {},
              },
            })
          }
          className="rounded-md p-0.5 hover:bg-gray-100"
        >
          <X size={16} />
        </button>
      </div>

      {/* Layer controls */}
      <div className="flex gap-1">
        <button
          onClick={bringToFront}
          className="
            flex items-center gap-1
            rounded-md border
            px-2 py-1
            text-[11px]
            hover:bg-gray-50
          "
        >
          <BringToFront size={13} />
          Bring front
        </button>

        <button
          onClick={sendToBack}
          className="
            flex items-center gap-1
            rounded-md border
            px-2 py-1
            text-[11px]
            hover:bg-gray-50
          "
        >
          <SendToBack size={13} />
          Send back
        </button>
      </div>

      {/* SHAPE OPTIONS */}
      {isShape && (
        <>
          <div>
            <p className="mb-1 text-[11px] font-semibold text-gray-500">Stroke</p>

            <div className="flex gap-1">
              <button
                onClick={() =>
                  updateElement({
                    strokeStyle: "solid",
                  })
                }
                className="h-6 w-9 rounded-md border text-xs"
              >
                ─────
              </button>

              <button
                onClick={() =>
                  updateElement({
                    strokeStyle: "dashed",
                  })
                }
                className="h-6 w-9 rounded-md border text-xs"
              >
                - - -
              </button>

              <button
                onClick={() =>
                  updateElement({
                    strokeStyle: "dotted",
                  })
                }
                className="h-6 w-9 rounded-md border text-xs"
              >
                · · ·
              </button>
            </div>
          </div>

          {/* Stroke width */}
          <select
            value={selectedElement.strokeWidth || 2}
            onChange={(e) =>
              updateElement({
                strokeWidth: Number(e.target.value),
              })
            }
            className="
              w-full
              rounded-md
              border
              px-2 py-1
              text-xs
            "
          >
            <option value="1">1 px — Thin</option>

            <option value="2">2 px — Medium</option>

            <option value="4">4 px — Thick</option>
          </select>

          {/* Fill */}
          <div>
            <p className="mb-1 text-[11px] font-semibold text-gray-500">Fill</p>

            <div className="flex gap-1">
              {[
                "#1e1e1e",
                "#e03131",
                "#f08c00",
                "#2f9e44",
                "#1971c2",
                "#6741d9",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    updateElement({
                      backgroundColor: color,
                    })
                  }
                  style={{
                    backgroundColor: color,
                  }}
                  className="h-5 w-5 rounded-md"
                />
              ))}

              <button
                onClick={() =>
                  updateElement({
                    backgroundColor: "transparent",
                  })
                }
                className="
                  flex h-5 w-5
                  items-center justify-center
                  rounded-md
                  border
                "
              >
                <X size={13} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* LINE / ARROW OPTIONS */}
      {isLine && (
        <div>
          <p className="mb-1 text-[11px] font-semibold text-gray-500">Stroke</p>

          <select
            value={selectedElement.strokeWidth || 2}
            onChange={(e) =>
              updateElement({
                strokeWidth: Number(e.target.value),
              })
            }
            className="
              w-full
              rounded-md
              border
              px-2 py-1
            "
          >
            <option value="1">1 px — Thin</option>

            <option value="2">2 px — Medium</option>

            <option value="4">4 px — Thick</option>
          </select>
        </div>
      )}

      {/* TEXT OPTIONS */}
      {isText && (
        <div>
          <p className="mb-1 text-[11px] font-semibold text-gray-500">Font size</p>

          <select
            value={selectedElement.fontSize || 20}
            onChange={(e) =>
              updateElement({
                fontSize: Number(e.target.value),
              })
            }
            className="
              w-full
              rounded-md
              border
              px-2 py-1
            "
          >
            <option value="16">16 px</option>

            <option value="20">20 px</option>

            <option value="24">24 px</option>

            <option value="32">32 px</option>

            <option value="40">40 px</option>
          </select>
        </div>
      )}

      {/* Opacity */}
      <div>
        <div className="mb-1 flex justify-between">
          <span className="text-xs font-semibold text-gray-500">Opacity</span>

          <span className="text-xs text-gray-500">
            {selectedElement.opacity ?? 100}%
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={selectedElement.opacity ?? 100}
          onChange={(e) =>
            updateElement({
              opacity: Number(e.target.value),
            })
          }
          className="w-full"
        />
      </div>

      {/* Bottom buttons */}
      <div className="flex gap-1 border-t pt-1">
        <button
          onClick={duplicateElement}
          className="
            flex flex-1
            items-center
            justify-center
            gap-1
            rounded-md
            border
            px-2 py-1
            text-xs
            hover:bg-gray-50
          "
        >
          <Copy size={13} />
          Duplicate
        </button>

        <button
          onClick={deleteElement}
          className="
            flex flex-1
            items-center
            justify-center
            gap-1
            rounded-md
            border
            px-2 py-1
            text-xs
            text-red-500
            hover:bg-red-50
          "
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}

export default FloatingProperties;
