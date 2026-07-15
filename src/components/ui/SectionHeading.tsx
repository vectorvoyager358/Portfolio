export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 max-w-2xl">
      <p className="mb-3 font-mono text-xs tracking-[0.22em] text-accent uppercase">
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl leading-tight tracking-tight text-fg sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-fg-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
