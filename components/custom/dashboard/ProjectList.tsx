"use client";

import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function ProjectList() {
  const [projectList, setProjectList] = useState([]);
  return (
    <div>
      {projectList.length === 0 ? (
        <div className="flex flex-col items-center p-10 border rounded-xl mt-10 gap-3">
          <Image src="/folder.png" alt="folder" width={120} height={90}/>
          <h2 className="text-2xl font-bold">No Boards Found!</h2>
          <div className="text-sm text-muted-foreground">Create Your first board to start brainstorming & Planning.</div>
          <Button> Create One!</Button>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}

export default ProjectList;
