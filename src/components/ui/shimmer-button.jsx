import { cn } from '@/lib/utils';

/**
 * ShimmerButton - high-conversion CTA with a gold spark travelling around the
 * border (ported from the Magic UI / 21st.dev pattern, recoloured to the
 * cyber-gold palette). Pass `as="a"` for link CTAs.
 *
 * Relies on the `shimmer-slide` / `spin-around` keyframes declared in
 * globals.css.
 */
export function ShimmerButton({
  as: Tag = 'button',
  children,
  className,
  shimmerColor = '#FFD700',
  shimmerSize = '0.06em',
  shimmerDuration = '3s',
  borderRadius = '9999px',
  background = '#0a0a0a',
  ...props
}) {
  return (
    <Tag
      style={{
        '--spread': '90deg',
        '--shimmer-color': shimmerColor,
        '--radius': borderRadius,
        '--speed': shimmerDuration,
        '--cut': shimmerSize,
        '--bg': background,
      }}
      className={cn(
        'group relative z-0 inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden whitespace-nowrap border border-primary/25 px-8 py-3 font-mono text-sm font-bold uppercase tracking-widest text-foreground [background:var(--bg)] [border-radius:var(--radius)]',
        'transform-gpu transition-transform duration-200 hover:scale-[1.02] active:translate-y-px',
        className
      )}
      {...props}
    >
      {/* spark */}
      <div className="absolute inset-0 -z-30 overflow-visible blur-[2px] [container-type:size]">
        <div className="animate-shimmer-slide absolute inset-0 h-[100cqh] [aspect-ratio:1] [border-radius:0] [mask:none]">
          <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
        </div>
      </div>

      <span className="relative z-10 flex items-center gap-2">{children}</span>

      {/* inner highlight */}
      <div className="absolute inset-0 size-full rounded-[inherit] shadow-[inset_0_-8px_10px_#FFD70018] transition-shadow duration-300 group-hover:shadow-[inset_0_-6px_10px_#FFD70033]" />
      {/* backdrop that masks the spark to a thin border */}
      <div className="absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]" />
    </Tag>
  );
}
