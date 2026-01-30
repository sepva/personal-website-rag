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
  type: 'project' | 'blog' | 'academic' | 'work';
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
    description: "An overview of my academic background, including the influential courses and projects I undertook during my studies.",
    type: "academic",
    date: "June 2025",
    fullContent: loadContent("academic/what_did_i_study.md")
  }
];

export const work: ContentItem[] = [];

export const allContent: {
  projects: ContentItem[];
  blogs: ContentItem[];
  academic: ContentItem[];
  work: ContentItem[];
} = {
  projects,
  blogs,
  academic,
  work
};