"use client";

import React, { useRef, useState } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
function WhiteSmartBoard() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const saveTimeRef = useRef<any>(null);
  const handleCanvasChange = (elements: readonly any[], appState: any , files: any) => {
    if(saveTimeRef.current)
    {
        clearTimeout(saveTimeRef.current);
    }

    saveTimeRef.current = setTimeout(() => {
        // save method
    }, 10000);
  };

  const SaveCanvasChanges = (elements: readonly any[], appState: any , files: any) =>{

  }


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
