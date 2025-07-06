"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TagDataTable } from "@/components/tag/tag-data-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useTagsData } from "@/lib/hooks/use-tags"
import { Tag } from "@/lib/types"
import { TagForm } from "@/components/tag/tag-form"

export default function TagsPage() {
  const [open, setOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const { data: tags, isLoading, mutate } = useTagsData() as { 
    data: Tag[] | undefined, 
    isLoading: boolean,
    mutate: () => void 
  }

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setOpen(true)
  }

  const handleSuccess = () => {
    setOpen(false)
    setEditingTag(null)
    mutate()
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">标签管理</h2>
          <p className="text-muted-foreground">
            标签用于对您所有展示的内容进行分类
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          新建标签
        </Button>
      </div>
      <div className="mt-6">
        <TagDataTable 
          data={tags || []} 
          mutate={mutate}
          onEdit={handleEdit}
        />
      </div>

      <Dialog 
        open={open} 
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingTag ? "编辑标签" : "新建标签"}
            </DialogTitle>
          </DialogHeader>
          <TagForm 
            onSubmit={handleSuccess}
            defaultValues={editingTag || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
