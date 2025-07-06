import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TechVO } from "@/app/api/techs/route";

//todo 整个界面以卡片的形式展示技术栈卡片，卡片上先展示图片，若没有，则在图片的位置上，展示名称。之后使用文字展示"描述"整个卡片的底色为   背景颜色的透明度为0.5

export function TechStackGrid({ techs }: { techs: TechVO[] }) {
  console.log('TechStackGrid received techs:', techs);
  
  if (!techs) {
    console.log('techs is undefined or null');
    return null;
  }
  
  if (!Array.isArray(techs)) {
    console.log('techs is not an array:', typeof techs);
    return null;
  }

  return (
    <section className="py-16" id="tech-stack">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">技术栈</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techs.map((tech) => (
            <Card
              key={tech.id}
              style={{ backgroundColor: tech.bgColor ? hexToRgba(tech.bgColor, 0.3) : 'rgba(255,255,255,0.3)' }}
              className="transition-transform hover:scale-105 shadow-lg border-none"
            >
              <CardHeader className="flex flex-col items-center gap-2 min-h-[120px] justify-center">
                {tech.icon ? (
                  tech.icon.startsWith('data:image') ? (
                    <img src={tech.icon} alt={tech.name} className="w-16 h-16 object-contain mb-2 rounded" />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center mb-2" dangerouslySetInnerHTML={{ __html: tech.icon }} />
                  )
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center mb-2 bg-muted rounded-full text-lg font-bold text-primary">
                    {tech.name}
                  </div>
                )}
                <CardTitle className="text-xl text-center w-full">{tech.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-foreground/80 mb-4 text-center min-h-[48px]">{tech.description}</CardDescription>
                <div className="flex flex-wrap gap-2 justify-center">
                  {(tech.tags || []).map((tagRel) => (
                    <Badge key={tagRel.id} style={{ backgroundColor: tagRel.color }}>
                      {tagRel.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * 将16进制颜色转为rgba字符串
 * @param hex 16进制颜色
 * @param alpha 透明度 0-1
 */
function hexToRgba(hex: string, alpha: number): string {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const num = parseInt(c, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r},${g},${b},${alpha})`;
} 