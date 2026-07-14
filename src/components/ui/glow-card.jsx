import { useRef } from 'react';
import { cn } from '@/lib/utils';

/**
 * GlowCard - surface with a gold radial glow that follows the cursor and a
 * border that brightens on hover. Pure CSS variables (no animation libs), so
 * it's cheap on the main thread. Renders a <div> by default; pass `as="a"`
 * (with href/target/rel) to make the whole card a link.
 */
export function GlowCard({ as: Tag = 'div', children, className, ...props }) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <Tag
      ref={ref}
      onMouseMove={handleMove}
      className={cn(
        'group relative overflow-hidden rounded-md border border-border bg-card/70 backdrop-blur-sm transition-colors duration-300 hover:border-primary/40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        className
      )}
      {...props}
    >
      {/* Cursor-tracking radial glow */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(440px circle at var(--mx, 50%) var(--my, 0%), rgba(255,215,0,0.10), transparent 45%)',
        }}
      />
      {/* Top hairline accent */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative h-full">{children}</div>
    </Tag>
  );
}
