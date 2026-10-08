interface SectionHeaderProps { eyebrow?: string; title: string; description?: string; actionHref?: string; actionLabel?: string; as?: 'h1' | 'h2'; }
export function SectionHeader({ eyebrow, title, description, actionHref, actionLabel = 'Все', as: Heading = 'h2' }: SectionHeaderProps) {
  return <header className="section-header">
    <div>{eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}<Heading>{title}</Heading>{description && <p className="section-header__description">{description}</p>}</div>
    {actionHref && <a className="section-header__action" href={actionHref}>{actionLabel}<span className="chevron" aria-hidden="true"/></a>}
  </header>;
}