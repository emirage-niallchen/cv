import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Admin, CustomField } from "@prisma/client";
import Image from "next/image";
import { FileVO } from "@/app/api/files/route";
import { FileDownloads } from "./file-downloads";
//todo 修改为，增加卡片选项，选择之后，前端以卡片的形式展示
export function HeroSection({ adminData, customFields, files }: { adminData: Admin, customFields: CustomField[], files: FileVO[] }) {
  return (
    <section className="relative bg-gradient-to-r from-primary/20 to-primary/5 py-24 overflow-hidden">
      {/* 背景图层 */}
      {adminData.background && adminData.background.trim() !== "" && (
        <Image
          src={
            adminData.background.startsWith("http")
              ? adminData.background
              : `data:image/jpeg;base64,${adminData.background}`
          }
          alt=""
          fill
          className="object-cover object-center w-full h-full"
          priority
          aria-hidden="true"
        />
      )}

      {/* 内容层 */}
      <div className="relative container mx-auto px-4 flex flex-col md:flex-row items-center gap-8 z-10">
        <Avatar className="w-32 h-32 md:w-48 md:h-48 border-4 border-primary/20">
          <AvatarImage
            src={
              adminData.avatar && adminData.avatar.trim() !== ""
                ? adminData.avatar.startsWith("http")
                  ? adminData.avatar
                  : `data:image/png;base64,${adminData.avatar}`
                : undefined
            }
          />
          <AvatarFallback>{adminData.name?.substring(0, 2) || "CV"}</AvatarFallback>
        </Avatar>

        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-bold">{adminData.name || "简历"}</h2>
          <p
            className="text-xl text-muted-foreground whitespace-pre-line indent-8"
            dangerouslySetInnerHTML={{
              __html: `&emsp;${adminData.description?.replace(/\n/g, '<br>') || ''}`
            }}
          />

          <div className="flex gap-4">
            {adminData.email && adminData.email.trim() !== "" && (
              <Card className="inline-flex items-center px-4 py-2">
                <CardContent className="p-0">
                  {`个人邮箱：` + adminData.email}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {customFields && customFields.length > 0 && customFields.map(field => (
              <div key={field.id} className="flex items-center space-x-1 px-4 py-2">
                <span className="font-semibold">{field.label}：</span>
                {field.type === 'link' ? (
                  <a
                    href={field.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline break-all"
                  >
                    {field.value}
                  </a>
                ) : (
                  <span>{field.value}</span>
                )}
              </div>
            ))}
          </div>

          <div className="w-full flex justify-center flex-wrap mt-8 z-10">
            <FileDownloads files={files} />
          </div>
        </div>

      </div>

    </section>
  );
} 