import { memo } from 'react';
import type { ExperienceItem, ProjectItem } from '../types/portfolio';

function formatPeriod(start: string, end: string): string {
  const [startYear, startMonth] = start.split('-').map(Number);
  const startDate = new Date(startYear, startMonth - 1, 1);
  const startText = startDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });

  if (end === 'Present') {
    return `${startText} - Present`;
  }

  const [endYear, endMonth] = end.split('-').map(Number);
  const endDate = new Date(endYear, endMonth - 1, 1);
  const endText = endDate.toLocaleString('en-US', { month: 'short', year: 'numeric' });

  return `${startText} - ${endText}`;
}

export const ExperienceCard = memo(function ExperienceCard({ item }: { item: ExperienceItem }): JSX.Element {
  return (
    <article className="timeline-item">
      <div className="timeline-marker" aria-hidden="true" />
      <div className="timeline-content">
        <p className="timeline-period">{formatPeriod(item.start, item.end)}</p>
        <h3>{item.role}</h3>
        <p className="timeline-company">
          {item.company} · {item.location}
        </p>
        <p>{item.summary}</p>
        <ul className="achievement-list">
          {item.achievements.map((achievement) => (
            <li key={achievement}>{achievement}</li>
          ))}
        </ul>
        <div className="chip-row">
          {item.tags.map((tag) => (
            <span key={`${item.id}-${tag}`} className="chip">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
});

export const ProjectCard = memo(function ProjectCard({ project }: { project: ProjectItem }): JSX.Element {
  return (
    <article className="project-card" data-testid="project-card">
      <p className="project-period">{project.period}</p>
      <h3>{project.name}</h3>
      <p>{project.description}</p>
      <p className="project-impact">{project.impact}</p>
      <p className="project-stack">Stack: {project.stack.join(' • ')}</p>
      <div className="chip-row">
        {project.tags.map((tag) => (
          <span key={`${project.id}-${tag}`} className="chip">
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
});
