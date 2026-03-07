export interface MetricItem {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  description: string;
  tags: string[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  achievements: string[];
  tags: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  period: string;
  description: string;
  impact: string;
  stack: string[];
  tags: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  location: string;
  availability: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  period: string;
  location: string;
}

export interface FilterState {
  activeTag: string;
  query: string;
}

export interface PortfolioData {
  identity: {
    name: string;
    role: string;
    headline: string;
    summary: string;
  };
  about: {
    narrative: string;
    focusAreas: string[];
  };
  metrics: MetricItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillGroup[];
  education: EducationItem[];
  contact: ContactInfo;
}
