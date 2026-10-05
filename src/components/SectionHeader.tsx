interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeader({ eyebrow, title, description }: SectionHeaderProps) {
  return (
    <div className="section-header">
      {eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {description && <p className="section-header__description">{description}</p>}
    </div>
  );
}
