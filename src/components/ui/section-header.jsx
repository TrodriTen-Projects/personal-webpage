import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * SectionHeader - brutalist / terminal-style section title:
 *   [ 01 ] ──── // LABEL
 *   Big Title
 * Animated reveal on scroll. Text is passed in (already translated via i18n).
 */
export function SectionHeader({ index, label, title, align = 'left', className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn('mb-12', align === 'center' && 'flex flex-col items-center text-center', className)}
    >
      <div className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        <span className="text-primary">[ {index} ]</span>
        <span className="h-px w-8 bg-primary/50" />
        {label && <span>// {label}</span>}
      </div>
      <h2 className="font-mono text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
    </motion.div>
  );
}
