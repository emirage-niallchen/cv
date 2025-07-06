"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AddProjectDialog } from "./components/AddProjectDialog";
import { ProjectList } from "./components/ProjectList";
import useSWR from "swr";
import { Project } from "@prisma/client";
import { ProjectVO } from "@/app/api/projects/route";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const deleteProjectById = async (id: string) => {
  const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("删除失败");
  return res.json();
};

export default function ProjectsPage() {
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [editProject, setEditProject] = useState<ProjectVO | null>(null);
  const { data: projects, mutate } = useSWR("/api/admin/projects", fetcher);

  console.log("projects 数据:", projects);

  const handleEdit = (project: ProjectVO) => {
    setEditProject(project);
    setOpenAddDialog(true);
  };

  const handleDelete = async (projectId: string) => {
    if (window.confirm("确定要删除该项目吗？")) {
      try {
        await deleteProjectById(projectId);
        mutate(); // 删除成功后刷新项目列表
      } catch (e) {
        alert("删除失败");
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">项目管理</h1>
        <Button onClick={() => { setOpenAddDialog(true); setEditProject(null); }}>
          <Plus className="w-4 h-4 mr-2" />
          添加项目
        </Button>
      </div>

      <ProjectList projects={projects || []} 
      onEdit={handleEdit}
      onDelete={handleDelete}
      />

      <AddProjectDialog 
        open={openAddDialog} 
        onOpenChange={(open) => {
          setOpenAddDialog(open);
          if (!open) setEditProject(null);
        }}
        onSuccess={() => {
          setOpenAddDialog(false);
          setEditProject(null);
          mutate(); // 刷新项目列表
        }}
        project={editProject || undefined}
      />
    </div>
  );
} 

// FIXME:  履历管理中，固定卡片大小，过多内容不要超过8行，否则显示省略号。同时编辑界面中，增加描述信息的行数。