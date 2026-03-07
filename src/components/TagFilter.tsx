import type { FilterState } from '../types/portfolio';

interface TagFilterProps {
  tags: string[];
  state: FilterState;
  onTagChange: (tag: string) => void;
  onQueryChange: (query: string) => void;
}

export function TagFilter({ tags, state, onTagChange, onQueryChange }: TagFilterProps): JSX.Element {
  return (
    <div className="filter-shell" data-testid="tag-filter">
      <div className="tag-list" role="tablist" aria-label="Filter by focus area">
        {tags.map((tag) => {
          const active = state.activeTag === tag;
          return (
            <button
              key={tag}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onTagChange(tag)}
              className={active ? 'tag-button active' : 'tag-button'}
              data-testid={`tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
            >
              {tag}
            </button>
          );
        })}
      </div>
      <label className="query-input-shell">
        <span className="visually-hidden">Search by keyword</span>
        <input
          type="search"
          placeholder="Search skills, tools, impact"
          value={state.query}
          onChange={(event) => onQueryChange(event.target.value)}
          data-testid="portfolio-search"
        />
      </label>
    </div>
  );
}
