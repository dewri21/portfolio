import type { ExperienceItem, FilterState, MetricItem, ProjectItem } from '../types/portfolio';

const OPEN_ENDED_END_VALUE = 999999;

function toComparableMonth(value: string): number {
  if (value === 'Present') {
    return OPEN_ENDED_END_VALUE;
  }

  const [yearText, monthText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);

  if (Number.isNaN(year) || Number.isNaN(month)) {
    return 0;
  }

  return year * 100 + month;
}

export function getAllTags(experience: ExperienceItem[], projects: ProjectItem[]): string[] {
  const tagSet = new Set<string>();

  experience.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));
  projects.forEach((item) => item.tags.forEach((tag) => tagSet.add(tag)));

  return ['All', ...Array.from(tagSet).sort((a, b) => a.localeCompare(b))];
}

export function sortExperienceByRecency(experience: ExperienceItem[]): ExperienceItem[] {
  return [...experience].sort((a, b) => {
    const endDelta = toComparableMonth(b.end) - toComparableMonth(a.end);
    if (endDelta !== 0) {
      return endDelta;
    }

    return toComparableMonth(b.start) - toComparableMonth(a.start);
  });
}

export function filterExperience(experience: ExperienceItem[], state: FilterState): ExperienceItem[] {
  const normalizedQuery = state.query.trim().toLowerCase();

  return sortExperienceByRecency(experience).filter((item) => {
    const tagMatch = state.activeTag === 'All' || item.tags.includes(state.activeTag);
    const searchCorpus = [
      item.role,
      item.company,
      item.summary,
      ...item.tags,
      ...item.achievements
    ]
      .join(' ')
      .toLowerCase();

    const queryMatch = normalizedQuery.length === 0 || searchCorpus.includes(normalizedQuery);

    return tagMatch && queryMatch;
  });
}

export function filterProjects(projects: ProjectItem[], state: FilterState): ProjectItem[] {
  const normalizedQuery = state.query.trim().toLowerCase();

  return [...projects].filter((item) => {
    const tagMatch = state.activeTag === 'All' || item.tags.includes(state.activeTag);
    const searchCorpus = [item.name, item.description, item.impact, ...item.stack, ...item.tags]
      .join(' ')
      .toLowerCase();

    const queryMatch = normalizedQuery.length === 0 || searchCorpus.includes(normalizedQuery);

    return tagMatch && queryMatch;
  });
}

export function aggregateMetricDisplay(metrics: MetricItem[]): Array<MetricItem & { display: string }> {
  return metrics.map((metric) => ({
    ...metric,
    display: `${metric.value}${metric.suffix ?? ''}`
  }));
}
