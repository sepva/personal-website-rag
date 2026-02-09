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
  shareable_link?: string;
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
    shareable_link: 'this-website',
    fullContent: loadContent('projects/this_website.md')
  },
  {
    id: 'amber_advent',
    title: 'AmberAdvent: A Digital Advent Calendar Gift',
    description: 'An interactive online advent calendar with 24 virtual doors built as a personal gift. Each day unlocks to reveal a new surprise, from photos to sweet messages.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Cloudflare Pages', 'Web Development'],
    type: 'project',
    date: 'December 2025',
    link: 'https://amberadvent.pages.dev/',
    shareable_link: 'amber-advent',
    fullContent: loadContent('projects/amber_advent.md')
  },
  {
    id: 'villa_panis',
    title: 'Villa Panis: A Vacation Rental Website',
    description: 'A professional vacation rental website for a family villa in Spain. A React-based information portal showcasing amenities, photos, and local attractions.',
    tags: ['React', 'Vite', 'Cloudflare Pages', 'Web Development'],
    type: 'project',
    link: 'https://melios.be/home',
    shareable_link: 'villa-panis',
    fullContent: loadContent('projects/villa_panis.md')
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
    shareable_link: 'what-did-i-study',
    fullContent: loadContent("academic/what_did_i_study.md")
  },
  {
    id: "master_thesis",
    title: "My Master Thesis: Personalized Humor Generation with Language Models",
    description: "Built JokeTailor, a system combining multiple ML techniques to generate personalized jokes achieving a 76% preference rate over non-personalized baselines.",
    tags: ["ML", "NLP", "Personalization", "RAG", "LLMs", "Research"],
    type: "academic",
    date: "June 2025",
    shareable_link: 'master-thesis',
    fullContent: loadContent("academic/master_thesis.md")
  },
  {
    id: "some_nice_academic_projects",
    title: "Engineering and Computer Science projects",
    description: "A collection of fun and educational projects from my 5 years of studying engineering and computer science, including robotics, electronics, and software development.",
    tags: ["Education", "Arduino", "Electronics", "Projects", "ML"],
    type: "academic",
    shareable_link: 'academic-projects',
    fullContent: loadContent("academic/some_nice_academic_projects.md")
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
    shareable_link: 'student-work',
    fullContent: loadContent("work/my_student_work.md")
  },
  {
    id: "first_months_at_ae",
    title: "My first months at AE",
    description: "Started my career at AE with intensive training, competed in a 3-day Vlaanderen Hackathon, and worked on an AI-first strategy project at Mediagenix.",
    tags: ["AE", "Career", "AI", "Hackathon", "Consulting"],
    type: "work",
    date: "October 2025",
    shareable_link: 'first-months-at-ae',
    fullContent: loadContent("work/first_months_at_ae.md")
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