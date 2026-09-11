"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Sparkles, Workflow } from "lucide-react";
import React from "react";
import CreateNewBoardDialog from "./CreateNewBoardDialog";

function WelcomeBanner() {
  const { user } = useUser();
  return (
    <div>
      <div className="p-10 border rounded-xl bg-linear-to-r from-red-200 to-blue-100">
        <h2 className="font-bold text-2xl ">Welcome Back! {user?.fullName}</h2>
        <p>Bring Your Ideas to life on WittyBoard!</p>
        <div className="flex items-center gap-2 mt-5">
          <CreateNewBoardDialog />
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
