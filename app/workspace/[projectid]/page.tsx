"use client";

import SmartDoc from "@/components/custom/workspace/SmartDoc";
import WorkspaceHeader from "@/components/custom/workspace/WorkspaceHeader";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const WhiteSmartBoard = dynamic(
  () => import("@/components/custom/workspace/WhiteSmartBoard"),
  { ssr: false },
);

function page() {
  const [activeTab, setActiveTab] = useState("whiteboard");
  return (
    <div>
      <WorkspaceHeader selectedTab={(value: string) => setActiveTab(value)} />
      {activeTab === "whiteboard" ? <WhiteSmartBoard/> : <SmartDoc />}
    </div>
  );
}

export default page;
