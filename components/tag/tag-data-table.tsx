"use client"

import { DataTable } from "@/components/ui/data-table"
import { TagDetailDialog } from "./tag-detail-dialog"
import { useState } from "react"
import { Tag } from "@/lib/types"
import { useTagColumns } from "./tag-columns"

interface TagDataTableProps {
  data: Tag[]
  mutate: () => void
  onEdit: (tag: Tag) => void
}

export function TagDataTable({ data, mutate, onEdit }: TagDataTableProps) {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null)
  const columns = useTagColumns({ mutate, onEdit })
  
  return (
    <>
      <DataTable 
        columns={columns} 
        data={data}
      />
      
      {selectedTag && (
        <TagDetailDialog
          tag={selectedTag}
          open={!!selectedTag}
          onClose={() => setSelectedTag(null)}
        />
      )}
    </>
  )
} 