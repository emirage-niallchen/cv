'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { prisma } from '@/lib/prisma';
import type { ResumeData } from '@/lib/types';
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { ResumeTimeline } from "@/components/sections/resume-timeline";
import { ProjectsShowcase } from "@/components/sections/projects-showcase";
import { TechStackGrid } from "@/components/sections/tech-stack-grid";
import { ContactSection } from "@/components/sections/contact-section";
import { LocationMap } from "@/components/sections/location-map";
import { CustomFieldsDisplay } from "@/components/sections/custom-fields-display";
import { SectionSkeleton } from "@/components/ui/section-skeleton";
import { FooterSection } from "@/components/sections/footer-section";
//todo 在之后，可以配置展示哪些section，并对其进行排序

// 定义查询参数类型
interface QueryParams {
  projectName?: string;
  techName?: string;
  customFieldLabel?: string;
  [key: string]: string | string[] | undefined;
}

// 获取简历分段数据
const fetcher = (url: string) => fetch(url).then(res => res.json());

// 构建查询字符串的简化函数
const buildQuery = (param: string, value: string | string[] | undefined | null) => {
  if (!value) return '';
  if (Array.isArray(value)) return `?${value.map(v => `${param}=${v}`).join('&')}`;
  return `?${param}=${value}`;
};

export default function HomePage() {
  const searchParams = useSearchParams();
  const tags = searchParams.get('tags') || undefined;
  
  // 使用SWR分别获取各个部分的数据
  const { data: profileData, error: profileError } = useSWR(
    `/api/profile`, 
    fetcher
  );

  
  const { data: projectsData, error: projectsError } = useSWR(
    `/api/projects${buildQuery('tags', tags)}`, 
    fetcher
  );

  
  const { data: techsData, error: techsError } = useSWR(
    `/api/techs${buildQuery('tags', tags)}`,
    fetcher
  );
  
  const { data: customFieldsData, error: customFieldsError } = useSWR(
    `/api/custom-fields${buildQuery('tags', tags)}`,
    fetcher
  );
  
  const { data: resumesData, error: resumesError } = useSWR(
    `/api/resumes${buildQuery('tags', tags)}`, 
    fetcher
  );
  
  const { data: filesData, error: filesError } = useSWR(
    `/api/files${buildQuery('tags', tags)}`, 
    fetcher
  );
  

  
  

  return (
    <main className="min-h-screen flex flex-col">
      {/* 个人信息展示区域 */}
      {profileData ? (
        <HeroSection adminData={profileData.admin} customFields={profileData.customFields} files={filesData}/>
      ) : profileError ? (
        <div className="text-center py-8">获取个人信息失败</div>
      ) : (
        <SectionSkeleton height="300px" />
      )}
      
      {/* 依次渲染所有区块 */}
      <div className="container mx-auto px-4 py-8 flex-grow">
       
        {/* 简历时间线 */}
        {resumesData ? (
          <ResumeTimeline resumes={resumesData} />
        ) : (
          <SectionSkeleton height="200px" />
        )}

        {/* 项目展示 */}
        {projectsData ? (
          <ProjectsShowcase projects={projectsData} />
        ) : (
          <SectionSkeleton height="200px" />
        )}

        {/* 技术栈 */}
        {techsData ? (
          <TechStackGrid techs={techsData} />
        ) : (
          <SectionSkeleton height="200px" />
        )}

        {/* 联系方式 */}
        <ContactSection />


      </div>

      {/* 添加页脚 */}
      <FooterSection />
    </main>
  );
} 