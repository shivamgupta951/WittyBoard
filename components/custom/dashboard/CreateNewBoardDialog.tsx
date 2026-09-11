"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

function CreateNewBoardDialog() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loadingState, setLoadingState] = useState(false);
  const [dialog, setDialog] = useState(false);
  const router = useRouter();
  const handleCreateBoard = async () => {
    if (workspaceName.trim() === "" || workspaceName.length > 30) {
      toast.add({
        type: "error",
        title: "Invalid WorkSpace Name",
        description: "Please enter a valid workspace name (1-30 characters).",
      });
      return;
    }
    setLoadingState(true);
    const projectId = crypto.randomUUID();
    try {
      await axios.post("/api/projects", {
        projectName: workspaceName.trim(),
        projectId,
      });

      toast.add({
        type: "success",
        title: "New WorkSpace Created!",
      });
      setDialog(false);
      router.push("/workspace/" + projectId);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error
        : "Please try again.";
      toast.add({
        type: "error",
        title: "Workspace could not be created",
        description: message ?? "Please try again.",
      });
    } finally {
      setLoadingState(false);
    }
  };
  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger render={<Button className="w-full" />}>
        <Plus />
        Create New Board
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>WhittyBoard WorkSpace</DialogTitle>
        </DialogHeader>
        <div>
          <label className="text-gray-500">
            Enter Whiteboard WorkSpace Name
          </label>
          <Input
            placeholder="Workspace Name"
            className="mt-1"
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <Button
            onClick={handleCreateBoard}
            disabled={
              workspaceName.trim() === "" ||
              workspaceName.length > 30 ||
              loadingState
            }
          >
            {loadingState && <Loader2 className="animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewBoardDialog;
