import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * SectionWrapper - Reusable container for each portfolio section.
 * Provides consistent padding, min-height, animation triggers, and ID targeting.
 */
export default function SectionWrapper({
  id,
  children,
  className = '',
  fullHeight = true,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`section ${className}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
      style={{
        minHeight: fullHeight ? '100vh' : 'auto',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {children}
    </motion.section>
  );
}
