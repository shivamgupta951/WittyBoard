"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import axios from "axios";
import { Archive, ArchiveRestore, ArrowUpRight, CalendarClock, Clock3, FolderOpen, Loader2, MoreHorizontal, SmileIcon, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import CreateNewBoardDialog from "./CreateNewBoardDialog";
import { useRouter, useSearchParams } from "next/navigation";

type Project = {
  projectId: string;
  projectName: string;
  createdAt: string;
  archivedAt?: string | null;
  deleteAt?: string | null;
};

const formatCreatedAt = (date: string) => {
  const value = new Date(date);
  if (Number.isNaN(value.getTime())) return "Recently created";

  return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(
    Math.round((value.getTime() - Date.now()) / 86400000),
    "day",
  );
};

const formatDeletionCountdown = (date?: string | null) => {
  if (!date) return "Deletion date unavailable";

  const remainingMs = new Date(date).getTime() - Date.now();
  if (remainingMs <= 0) return "Deleting soon";

  const remainingDays = Math.ceil(remainingMs / 86400000);
  if (remainingDays === 1) {
    const remainingHours = Math.max(1, Math.ceil(remainingMs / 3600000));
    return `Deletes in ${remainingHours} hour${remainingHours === 1 ? "" : "s"}`;
  }

  return `Deletes in ${remainingDays} days`;
};

function ProjectList() {
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const requestedView = searchParams.get("view") === "archived" ? "archived" : "active";
  const [activeView, setActiveView] = useState<"active" | "archived">(requestedView);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // The URL is the source of truth for the selected library view, allowing
    // refreshes and sidebar navigation to load the same dataset.
    setActiveView(requestedView);
  }, [requestedView]);

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get<Project[]>("/api/projects", {
          params: { archived: activeView === "archived" },
        });
        setProjectList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load projects:", error);
        toast.add({
          title: "Projects could not be loaded",
          description: "Please refresh and try again.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    void loadProjects();
  }, [activeView]);

  const archiveProject = async (project: Project) => {
    if (!window.confirm(`Move "${project.projectName}" to Archive?`)) return;

    setProcessingId(project.projectId);
    try {
      // Soft delete removes the card from Active but preserves its data for
      // restore until the server-side retention deadline.
      await axios.delete("/api/projects", { data: { projectId: project.projectId } });
      setProjectList((current) => current.filter((item) => item.projectId !== project.projectId));
      toast.add({ title: "Workspace archived", description: "You can restore it from Archive.", type: "success" });
    } catch (error) {
      console.error("Failed to archive project:", error);
      toast.add({ title: "Workspace could not be archived", description: "Please try again.", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  const changeView = (view: "active" | "archived") => {
    setActiveView(view);
    router.replace(
      view === "archived" ? "/dashboard?view=archived" : "/dashboard",
      { scroll: false },
    );
  };

  const restoreProject = async (project: Project) => {
    setProcessingId(project.projectId);
    try {
      await axios.patch("/api/projects", { projectId: project.projectId });
      setProjectList((current) => current.filter((item) => item.projectId !== project.projectId));
      toast.add({ title: "Workspace restored", type: "success" });
    } catch (error) {
      console.error("Failed to restore project:", error);
      toast.add({ title: "Workspace could not be restored", description: "Please try again.", type: "error" });
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-64 animate-pulse rounded-2xl bg-white/70 ring-1 ring-black/5" />
        ))}
      </div>
    );
  }

  return (
    <section className="mt-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace library</p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{activeView === "active" ? "Pick up where you left off" : "Archived workspaces"}</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-full bg-white/80 p-1 text-sm ring-1 ring-black/5">
            <button className={`rounded-full px-3 py-1.5 ${activeView === "active" ? "bg-slate-900 text-white" : "text-slate-500"}`} onClick={() => changeView("active")}>Active</button>
            <button className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${activeView === "archived" ? "bg-slate-900 text-white" : "text-slate-500"}`} onClick={() => changeView("archived")}><Archive className="size-3.5" /> Archive</button>
          </div>
          <span className="hidden rounded-full bg-white/80 px-3 py-1 text-sm text-slate-500 ring-1 ring-black/5 lg:inline-flex">{projectList.length}</span>
        </div>
      </div>

      {projectList.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/70 p-12 text-center shadow-sm">
          <Image src="/folder.png" alt="folder" width={120} height={90} style={{ width: 120, height: 90 }}/>
          <h2 className="text-2xl font-bold text-slate-900">{activeView === "active" ? "No boards yet" : "Archive is empty"}</h2>
          <div className="max-w-sm text-sm text-slate-500">{activeView === "active" ? "Create your first workspace to start brainstorming, planning, and turning ideas into something real." : "Archived workspaces will appear here. Restore one whenever you are ready to continue."}</div>
          {activeView === "active" && <CreateNewBoardDialog/>}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projectList.map((project) => (
            <article key={project.projectId} className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <Image src="/image.png" alt="Whiteboard preview" fill loading="eager" sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/55 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-slate-700"><FolderOpen className="size-3.5" /> Whiteboard</span>
                {activeView === "active" ? (
                  <button aria-label={`Archive ${project.projectName}`} title="Archive workspace" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 opacity-0 shadow-sm transition hover:bg-amber-50 hover:text-amber-700 group-hover:opacity-100" onClick={() => void archiveProject(project)} disabled={processingId === project.projectId}>
                    {processingId === project.projectId ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                  </button>
                ) : (
                  <button aria-label={`Restore ${project.projectName}`} title="Restore workspace" className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-slate-600 opacity-0 shadow-sm transition hover:bg-emerald-50 hover:text-emerald-700 group-hover:opacity-100" onClick={() => void restoreProject(project)} disabled={processingId === project.projectId}>
                    {processingId === project.projectId ? <Loader2 className="size-4 animate-spin" /> : <ArchiveRestore className="size-4" />}
                  </button>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold text-slate-900">{project.projectName}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="size-3.5" /> {formatCreatedAt(project.createdAt)}</p>
                    {activeView === "archived" && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-amber-700">
                        <CalendarClock className="size-3.5" /> {formatDeletionCountdown(project.deleteAt)}
                      </p>
                    )}
                  </div>
                  <SmileIcon className="mt-1 size-5 text-red-500 shrink-0" />
                </div>
                {activeView === "active" ? (
                  <Button className="mt-4 w-full justify-between" onClick={() => router.push(`/workspace/${project.projectId}`)}>Open workspace <ArrowUpRight /></Button>
                ) : (
                  <p className="mt-4 flex items-center gap-2 text-xs text-amber-700"><Archive className="size-3.5" /> Archived and read-only</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ProjectList;
