import { getContent } from './bundledContent.js';

function loadContent(path: string): string {
  return getContent(path) || '';
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  tags?: string[];
  link?: string;
  type: 'project' | 'blog' | 'academic' | 'work' | 'faq';
  date?: string;
  fullContent?: string;
}

export const projects: ContentItem[] = [
  {
    id: 'this_website',
    title: 'This website',
    description: 'A chatbot that functions as my personal website, where you can ask about my projects, academic work, and professional experience.',
    tags: ['React', 'WebSockets', 'TypeScript', 'Figma Make', 'Cloudflare', 'Agents', 'Chatbot', 'LangSmith'],
    type: 'project',
    date: 'January 2026',
    link: 'https://personal-website.seppe-vanswegenoven.workers.dev/',
    fullContent: loadContent('projects/this_website.md')
  }
];

export const blogs: ContentItem[] = [];

export const academic: ContentItem[] = [
  {
    id: "what_did_i_study",
    title: "What did I study?",
    description: "An overview of my academic background, including the influential courses I undertook during my studies.",
    tags: ["Education"],
    type: "academic",
    date: "June 2025",
    fullContent: loadContent("academic/what_did_i_study.md")
  }
];

export const work: ContentItem[] = [
  {
    id: "my_student_work",
    title: "My Student Work",
    description: "A summary of student jobs.",
    tags: ["Student Jobs"],
    type: "work",
    date: "June 2025",
    fullContent: loadContent("work/my_student_work.md")
  }
];

export const faq: ContentItem[] = [
  {
    id: "faq1",
    title: "Job Opportunities",
    description: "Information about potential job opportunities and how to reach out for collaborations.",
    type: "faq",
    fullContent: loadContent("faq/job_opportunities.md")
  },
  {
    id: "faq2",
    title: "Role and Experience",
    description: "Details about my current role, experience, and the kind of projects I am interested in.",
    type: "faq",
    fullContent: loadContent("faq/role_and_experience.md")
  }
];

export const allContent: {
  projects: ContentItem[];
  blogs: ContentItem[];
  academic: ContentItem[];
  work: ContentItem[];
  faq: ContentItem[]; 
} = {
  projects,
  blogs,
  academic,
  work,
  faq
};