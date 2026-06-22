import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * cn — merge class names with Tailwind-aware conflict resolution.
 * Used by every shadcn / 21st.dev component.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
