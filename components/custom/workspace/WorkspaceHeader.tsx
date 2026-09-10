'use client'

import Image from "next/image";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Save, Share } from "lucide-react";

type Props = {
    selectedTab : any
}

function WorkspaceHeader({selectedTab}:Props) {
  return (
    <div className="p-3 border-b flex justify-between">
      <div className="flex gap-2 items-center">
        <Image className="h-10 w-10" src="/logo.svg" alt="logo" width={40} height={40} />
        <h2>WorkSpace Name</h2>
      </div>

      <div>
        <Tabs defaultValue="whiteboard" className="" onValueChange={(value)=>selectedTab(value)}>
          <TabsList>
            <TabsTrigger value="whiteboard">WhiteBoard</TabsTrigger>
            <TabsTrigger value="doc">Doc</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-2">
        <Button><Save/> Save</Button>
        <Button variant={"outline"}><Share/> Share</Button>
      </div>
    </div>
  );
}

export default WorkspaceHeader;
