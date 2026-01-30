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
  },
  {
    id: 'proj2',
    title: 'Neural Style Transfer App',
    description: 'Mobile-first web app that applies artistic styles to photos using machine learning.',
    tags: ['TensorFlow.js', 'React', 'ML', 'PWA'],
    type: 'project',
    date: 'January 2024',
    fullContent: loadContent('projects/proj2.md')
  },
  {
    id: 'proj3',
    title: 'Distributed Task Queue',
    description: 'High-throughput job processing system with Redis and Python, handling 10k+ tasks/minute.',
    tags: ['Python', 'Redis', 'Docker', 'Celery'],
    type: 'project',
    date: 'November 2023',
    fullContent: loadContent('projects/proj3.md')
  }
];

export const blogs: ContentItem[] = [
  {
    id: 'blog1',
    title: 'Understanding React Server Components',
    description: 'A deep dive into the architecture and benefits of React Server Components, with practical examples.',
    tags: ['React', 'Next.js', 'Web Development'],
    type: 'blog',
    date: 'April 2024',
    fullContent: loadContent('blogs/blog1.md')
  },
  {
    id: 'blog2',
    title: 'Building Accessible UIs: Beyond ARIA',
    description: 'Practical tips for creating truly accessible interfaces, focusing on keyboard navigation and screen readers.',
    tags: ['Accessibility', 'UX', 'Web Standards'],
    type: 'blog',
    date: 'February 2024',
    fullContent: loadContent('blogs/blog2.md')
  }
];

export const academic: ContentItem[] = [
  {
    id: 'acad1',
    title: 'Optimizing Compiler Backend for RISC-V',
    description: 'Research project on improving code generation efficiency for RISC-V architecture.',
    tags: ['Compilers', 'RISC-V', 'Optimization'],
    type: 'academic',
    link: 'https://example.com/risc-v-compiler-optimization',
    date: 'December 2023',
    fullContent: loadContent('academic/acad1.md')
  },
  {
    id: 'acad2',
    title: 'Machine Learning for Code Review',
    description: 'Master\'s thesis on using ML to predict code review outcomes and suggest improvements.',
    tags: ['Machine Learning', 'Software Engineering', 'NLP'],
    type: 'academic',
    date: 'May 2023',
    fullContent: loadContent('academic/acad2.md')
  }
];

export const work: ContentItem[] = [
  {
    id: 'work1',
    title: 'Senior Frontend Engineer - TechCorp',
    description: 'Led development of design system and component library used by 50+ engineers.',
    tags: ['React', 'TypeScript', 'Design Systems'],
    type: 'work',
    date: '2022 - Present',
    fullContent: loadContent('work/work1.md')
  },
  {
    id: 'work2',
    title: 'Full Stack Developer - StartupXYZ',
    description: 'Early engineer helping build real-time collaboration platform from scratch.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    type: 'work',
    date: '2020 - 2022',
    fullContent: loadContent('work/work2.md')
  }
];

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