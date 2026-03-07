import { describe, expect, it } from 'vitest';
import { portfolioData } from '../src/data';
import {
  aggregateMetricDisplay,
  filterExperience,
  filterProjects,
  getAllTags,
  sortExperienceByRecency
} from '../src/utils/portfolio';
import type { FilterState } from '../src/types/portfolio';

const baseFilter: FilterState = {
  activeTag: 'All',
  query: ''
};

describe('portfolio utility logic', () => {
  it('sorts experience by recency with Present on top', () => {
    const sorted = sortExperienceByRecency(portfolioData.experience);
    expect(sorted[0].role).toContain('Team Lead');
    expect(sorted[sorted.length - 1].role).toContain('Junior');
  });

  it('filters experience by active tag and query', () => {
    const filteredByTag = filterExperience(portfolioData.experience, {
      ...baseFilter,
      activeTag: 'Leadership'
    });
    expect(filteredByTag.length).toBe(1);
    expect(filteredByTag[0].role).toContain('Team Lead');

    const filteredByQuery = filterExperience(portfolioData.experience, {
      ...baseFilter,
      query: 'asof'
    });
    expect(filteredByQuery.length).toBe(1);
    expect(filteredByQuery[0].role).toContain('Senior');
  });

  it('filters projects by tag and search query', () => {
    const filtered = filterProjects(portfolioData.projects, {
      activeTag: 'Kafka',
      query: ''
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toContain('Kafka');

    const byQuery = filterProjects(portfolioData.projects, {
      activeTag: 'All',
      query: 'migration'
    });
    expect(byQuery).toHaveLength(1);
    expect(byQuery[0].id).toBe('migration-testing');
  });

  it('aggregates metric display strings and exposes all tags', () => {
    const metrics = aggregateMetricDisplay(portfolioData.metrics);
    expect(metrics[0].display).toContain(String(metrics[0].value));

    const allTags = getAllTags(portfolioData.experience, portfolioData.projects);
    expect(allTags[0]).toBe('All');
    expect(allTags).toContain('SQL Testing');
    expect(allTags).toContain('API Testing');
  });
});
