import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimatedCounter } from './components/AnimatedCounter';
import { ExperienceCard, ProjectCard } from './components/CardComponents';
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

export default function App(): JSX.Element {
  const [theme, setTheme] = useState<ThemeMode>(() => resolveInitialTheme());
  const [filterState, setFilterState] = useState<FilterState>(INITIAL_FILTER);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showBackToTop, setShowBackToTop] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
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

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', onClickOutside, true);
    return () => document.removeEventListener('click', onClickOutside, true);
  }, [mobileMenuOpen]);

  // Use IntersectionObserver to detect strictly the "back to top" threshold
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowBackToTop(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    const pivot = document.getElementById('scroll-pivot');
    if (pivot) {
      observer.observe(pivot);
    }

    return () => observer.disconnect();
  }, []);

  // Removed scroll performance timeout mechanism as kinetic background animations were deprecated for static performance.

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
      <div id="scroll-pivot" aria-hidden="true" style={{ position: 'absolute', top: '300px', left: 0, width: 1, height: 1, pointerEvents: 'none', visibility: 'hidden' }} />

      <header ref={headerRef} className={mobileMenuOpen ? 'top-bar menu-open' : 'top-bar'}>
        <p className="brand">{portfolioData.identity.name}</p>
        <div className="header-actions" id="header-actions">
          <div className="header-actions-inner">
            <nav aria-label="Primary sections">
              <ul>
                {SECTION_LINKS.map((section) => (
                  <li key={section.id}>
                    <a 
                      href={`#${section.id}`} 
                      onClick={(e) => {
                        if (mobileMenuOpen) {
                          e.preventDefault();
                          setMobileMenuOpen(false);
                          setTimeout(() => {
                            const target = document.getElementById(section.id);
                            if (target) {
                              target.scrollIntoView({ behavior: 'smooth' });
                              window.history.pushState(null, '', `#${section.id}`);
                            }
                          }, 350); // Meticulously matched to CSS transition duration
                        }
                      }}
                    >
                      {section.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="header-controls">
          <ThemeToggle
            mode={theme}
            onToggle={(e) => {
              const isToDark = theme === 'light';
              const nextTheme = isToDark ? 'dark' : 'light';
              
              const toggleMode = () => setTheme(nextTheme);

              // Cinematic View Transition API fallback
              if (!document.startViewTransition) {
                toggleMode();
                return;
              }

              // Capture click coordinates for the circular ripple center
              const x = e.clientX;
              const y = e.clientY;
              const endRadius = Math.hypot(
                Math.max(x, window.innerWidth - x),
                Math.max(y, window.innerHeight - y)
              );

              // Pass coordinates via inline CSS variables for the native CSS View Transition
              document.documentElement.style.setProperty('--transition-x', `${x}px`);
              document.documentElement.style.setProperty('--transition-y', `${y}px`);
              document.documentElement.style.setProperty('--transition-r', `${endRadius}px`);

              // Add transition active class to hide backdrop filters during the snapshot
              document.documentElement.classList.add('transition-active');

              const transition = document.startViewTransition(() => {
                flushSync(() => {
                  setTheme(nextTheme);
                });
              });

              // Remove the class once the transition animation is complete
              transition.finished.finally(() => {
                document.documentElement.classList.remove('transition-active');
              });
            }}
            iconOnly={true} 
          />
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
                <ExperienceCard key={item.id} item={item} />
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
                <ProjectCard key={project.id} project={project} />
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

      <button
        type="button"
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
}
