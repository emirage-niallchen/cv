import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Resume } from "@prisma/client";
import { ResumeVO } from "@/app/api/resume/route";

export function ResumeTimeline({ resumes }:{resumes:ResumeVO[]}) {
  // 按时间排序，最近的在前面
  const sortedResumes = [...resumes].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <section className="py-16" id="experience">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">工作与教育经历</h2>
        
        <div className="relative border-l-2 border-primary/50 pl-8 ml-4 space-y-10">
          {sortedResumes.map((resume) => (
            <div key={resume.id} className="relative">
              {/* 时间线上的圆点 */}
              <div className="absolute -left-[41px] w-6 h-6 bg-primary rounded-full"></div>
              
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {resume.tags.map((tagRel) => (
                      <Badge key={tagRel.tag.id} style={{ backgroundColor: tagRel.tag.color }}>
                        {tagRel.tag.name}
                      </Badge>
                    ))}
                  </div>
                  
                  <CardTitle className="text-xl">
                    {resume.organization && (
                      <span className="font-semibold">{resume.organization}</span>
                    )}
                    {resume.title && (
                      <span className="ml-2 text-muted-foreground">{resume.title}</span>
                    )}
                  </CardTitle>
                  
                  <div className="flex flex-wrap gap-x-4 text-sm text-muted-foreground">
                    {resume.location && (
                      <span>{resume.location}</span>
                    )}
                    <span>
                      {format(new Date(resume.startTime), 'yyyy-MM')} 至 
                      {resume.endTime ? format(new Date(resume.endTime), ' yyyy-MM') : ' 至今'}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="whitespace-pre-line">{resume.description}</p>
                  
                  {resume.highlights && (
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">主要成就:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {(JSON.parse(resume.highlights) as string[]).map((highlight, index) => (
                          <li key={index}>{highlight}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 