"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Sparkles, Workflow } from "lucide-react";
import React from "react";

function WelcomeBanner() {
  const { user } = useUser();
  return (
    <div>
      <div className="p-10 border rounded-xl bg-linear-to-r from-purple-300 to-blue-100">
        <h2 className="font-bold text-2xl ">Welcome Back! {user?.fullName}</h2>
        <p>Bring Your Ideas to life on WittyBoard!</p>
        <div className="flex items-center gap-2 mt-5">
          <Button size="lg">
            + Create New Board <Workflow />
          </Button>
          <Button variant="outline" size="lg">
            AI Helper <Sparkles />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WelcomeBanner;
