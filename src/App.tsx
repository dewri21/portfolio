import { useEffect, useMemo, useState } from 'react';
import { AnimatedCounter } from './components/AnimatedCounter';
import { KineticBackground } from './components/KineticBackground';
import { SectionHeading } from './components/SectionHeading';
import { StackFadeSection } from './components/StackFadeSection';
import { TagFilter } from './components/TagFilter';
import { ThemeToggle } from './components/ThemeToggle';
import { portfolioData } from './data';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import type { FilterState } from './types/portfolio';
import { aggregateMetricDisplay, filterExperience, filterProjects, getAllTags } from './utils/portfolio';
import { applyTheme, resolveInitialTheme, toggleTheme, type ThemeMode } from './utils/theme';

const INITIAL_FILTER: FilterState = {
  activeTag: 'All',
  query: ''
};

const SECTION_LINKS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' }
];

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

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<ThemeMode>(() => resolveInitialTheme());
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const desktopQuery = window.matchMedia('(min-width: 841px)');
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setMobileMenuOpen(false);
      }
    };

    desktopQuery.addEventListener('change', onDesktop);
    return () => desktopQuery.removeEventListener('change', onDesktop);
  }, []);

  const allTags = useMemo(
    () => getAllTags(portfolioData.experience, portfolioData.projects),
    []
  );

  const metrics = useMemo(() => aggregateMetricDisplay(portfolioData.metrics), []);

  const filteredExperience = useMemo(
    () => filterExperience(portfolioData.experience, filterState),
    [filterState]
  );

  const filteredProjects = useMemo(
    () => filterProjects(portfolioData.projects, filterState),
    [filterState]
  );
  const activeFocusLabel =
    filterState.activeTag === 'All'
      ? 'All focus areas'
      : `Focused on: ${filterState.activeTag}`;

  return (
    <div className="app-shell" data-motion={reducedMotion ? 'reduced' : 'full'}>
      <KineticBackground reducedMotion={reducedMotion} />

      <header className={mobileMenuOpen ? 'top-bar menu-open' : 'top-bar'}>
        <p className="brand">{portfolioData.identity.name}</p>
        <button
          type="button"
          className="menu-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="header-actions"
          aria-label="Toggle navigation menu"
          onClick={() => setMobileMenuOpen((current) => !current)}
        >
          <span className="menu-icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
        <div className="header-actions" id="header-actions">
          <nav aria-label="Primary sections">
            <ul>
              {SECTION_LINKS.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} onClick={() => setMobileMenuOpen(false)}>
                    {section.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle
            mode={theme}
            onToggle={() => {
              setTheme((current) => toggleTheme(current));
              setMobileMenuOpen(false);
            }}
          />
        </div>
      </header>

      <main>
        <StackFadeSection id="hero" className="hero" testId="section-hero" reducedMotion={reducedMotion}>
          <div>
            <p className="eyebrow">Automation Portfolio</p>
            <h1>{portfolioData.identity.role}</h1>
            <h2>{portfolioData.identity.headline}</h2>
            <p className="hero-summary">{portfolioData.identity.summary}</p>
            <p className="hero-meta">
              {portfolioData.contact.location} · {portfolioData.contact.availability}
            </p>
            <div className="hero-cta-row">
              <a href="#projects" className="primary-cta">
                View highlighted work
              </a>
              <a href="#contact" className="secondary-cta">
                Let's connect
              </a>
            </div>
          </div>

          <div className="metric-grid" data-testid="metric-grid">
            {metrics.map((metric) => (
              <AnimatedCounter
                key={metric.id}
                value={metric.value}
                suffix={metric.suffix}
                label={metric.label}
                description={metric.description}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </StackFadeSection>

        <StackFadeSection id="about" className="content-section" testId="section-about" reducedMotion={reducedMotion}>
          <SectionHeading
            eyebrow="About"
            title="Engineering reliability in fast-moving data products"
            description={portfolioData.about.narrative}
          />
          <ul className="focus-list">
            {portfolioData.about.focusAreas.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </StackFadeSection>

        <StackFadeSection
          id="experience"
          className="content-section"
          testId="section-experience"
          reducedMotion={reducedMotion}
        >
          <SectionHeading
            eyebrow="Experience"
            title="Role progression and automation outcomes"
            description="Use filters to inspect role depth, stack specialization, and impact themes across experience and projects."
          />
          <TagFilter
            tags={allTags}
            state={filterState}
            onTagChange={(tag) => setFilterState((current) => ({ ...current, activeTag: tag }))}
            onQueryChange={(query) => setFilterState((current) => ({ ...current, query }))}
          />
          <div className="filter-insights" data-testid="filter-insights">
            <p>{activeFocusLabel}</p>
            <p>
              {filteredExperience.length} roles · {filteredProjects.length} projects
            </p>
          </div>
          <div className="timeline" data-testid="timeline">
            {filteredExperience.length === 0 ? (
              <p className="empty-state">No matching roles found. Try a broader tag or keyword.</p>
            ) : (
              filteredExperience.map((item) => (
                <article key={item.id} className="timeline-item">
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
              ))
            )}
          </div>
        </StackFadeSection>

        <StackFadeSection id="skills" className="content-section" testId="section-skills" reducedMotion={reducedMotion}>
          <SectionHeading
            eyebrow="Skills"
            title="Technical range"
            description="Hands-on across test frameworks, SQL engines, stream validation, and team-level quality systems."
          />
          <div className="skills-grid">
            {portfolioData.skills.map((skillGroup) => (
              <article key={skillGroup.group} className="skill-card">
                <h3>{skillGroup.group}</h3>
                <ul>
                  {skillGroup.items.map((item) => (
                    <li key={`${skillGroup.group}-${item}`}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </StackFadeSection>

        <StackFadeSection
          id="projects"
          className="content-section"
          testId="section-projects"
          reducedMotion={reducedMotion}
        >
          <SectionHeading
            eyebrow="Projects"
            title="Applied systems and validation programs"
            description="Project cards react to the same filters as experience so you can inspect both career timeline and implementation depth together."
          />
          <div className="project-grid">
            {filteredProjects.length === 0 ? (
              <p className="empty-state">No matching projects found. Try another filter.</p>
            ) : (
              filteredProjects.map((project) => (
                <article className="project-card" key={project.id} data-testid="project-card">
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
              ))
            )}
          </div>
        </StackFadeSection>

        <StackFadeSection
          id="education"
          className="content-section"
          testId="section-education"
          reducedMotion={reducedMotion}
        >
          <SectionHeading eyebrow="Education" title="Academic foundation" />
          {portfolioData.education.map((entry) => (
            <article className="education-card" key={entry.institution}>
              <h3>{entry.institution}</h3>
              <p>{entry.degree}</p>
              <p>
                {entry.period} · {entry.location}
              </p>
            </article>
          ))}
        </StackFadeSection>

        <StackFadeSection
          id="contact"
          className="content-section"
          testId="section-contact"
          reducedMotion={reducedMotion}
        >
          <SectionHeading
            eyebrow="Contact"
            title="Open to complex automation mandates"
            description={portfolioData.contact.availability}
          />
          <div className="contact-grid">
            <article className="contact-card">
              <h3>Email</h3>
              <a href={`mailto:${portfolioData.contact.email}`} data-testid="contact-email-link">
                {portfolioData.contact.email}
              </a>
            </article>
            <article className="contact-card">
              <h3>LinkedIn</h3>
              <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" data-testid="contact-linkedin-link">
                {portfolioData.contact.linkedin.replace('https://', '')}
              </a>
            </article>
            <article className="contact-card">
              <h3>Location</h3>
              <p>{portfolioData.contact.location}</p>
            </article>
          </div>
        </StackFadeSection>
      </main>
      <footer className="site-footer">
        <p>
          Built with React, TypeScript, and Framer Motion. Focused on measurable quality outcomes.
        </p>
        <a href="#hero">Back to top</a>
      </footer>
    </div>
  );
}
