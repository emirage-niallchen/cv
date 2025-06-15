import { FileUpload } from '@/components/FileUpload';
import { FileViewer } from '@/components/FileViewer';

export default function FilesPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Files</h1>
      <FileUpload />
      <div className="mt-8">
        <FileViewer />
      </div>
    </div>
  );
} 