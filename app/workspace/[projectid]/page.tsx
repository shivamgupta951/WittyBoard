"use client";

import SmartDoc from "@/components/custom/workspace/SmartDoc";
import WhiteSmartBoard from "@/components/custom/workspace/WhiteSmartBoard";
import WorkspaceHeader from "@/components/custom/workspace/WorkspaceHeader";
import React, { useState } from "react";

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
