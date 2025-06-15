import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File } from "@prisma/client";
import { FileVO } from "@/app/api/files/route";
import { getFileIcon } from "@/lib/utils";

export function FileDownloads({ files }: { files: FileVO[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {files.map(file => {
        const Icon = getFileIcon(file.type);
        return (
          <a
            key={file.id}
            href={file.path}
            download={file.name}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center p-4 rounded hover:bg-primary/10 transition"
          >
            <Icon className="w-10 h-10 mb-2 text-primary" />
            <span className="truncate w-full text-center">{file.name}</span>
            <span className="text-s text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</span>
          </a>
        );
      })}
    </div>
  );
} 