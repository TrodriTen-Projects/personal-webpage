/**
 * NavDock — macOS-style magnification dock, rendered INSIDE the top navbar
 * (desktop only). Items grow on cursor proximity; tooltips drop below.
 * react-router NavLink for active state; labels via react-i18next.
 * Mobile keeps the hamburger dropdown (this dock is `hidden md:flex`).
 */
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaTerminal,
  FaUser,
  FaBriefcase,
  FaGraduationCap,
  FaFileLines,
  FaUsers,
  FaEnvelope,
} from 'react-icons/fa6';
import { cn } from '@/lib/utils';

const ITEMS = [
  { key: 'home', path: '/', Icon: FaTerminal },
  { key: 'about', path: '/about', Icon: FaUser },
  { key: 'experience', path: '/experience', Icon: FaBriefcase },
  { key: 'education', path: '/education', Icon: FaGraduationCap },
  { key: 'publications', path: '/publications', Icon: FaFileLines },
  { key: 'clients', path: '/clients', Icon: FaUsers },
  { key: 'contact', path: '/contact', Icon: FaEnvelope },
];

function DockItem({ mouseX, item, label }) {
  const ref = useRef(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });
  const sizeTarget = useTransform(distance, [-110, 0, 110], [38, 52, 38]);
  const size = useSpring(sizeTarget, { mass: 0.1, stiffness: 170, damping: 14 });

  const { Icon } = item;

  return (
    <NavLink to={item.path} aria-label={label} className="group relative grid place-items-center">
      {({ isActive }) => (
        <motion.div
          ref={ref}
          style={{ width: size, height: size }}
          className={cn(
            'relative grid aspect-square place-items-center rounded-lg border transition-colors duration-200',
            isActive
              ? 'border-primary/60 bg-primary/15 text-primary'
              : 'border-border/60 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground'
          )}
        >
          <Icon className="h-[42%] w-[42%]" />

          {/* Tooltip (drops below, since the dock sits at the top) */}
          <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 font-mono text-[11px] uppercase tracking-widest text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            {label}
          </span>
        </motion.div>
      )}
    </NavLink>
  );
}

export default function NavDock() {
  const { t } = useTranslation();
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="hidden items-center gap-2 md:flex"
    >
      {ITEMS.map((item) => (
        <DockItem key={item.key} mouseX={mouseX} item={item} label={t(`nav.${item.key}`)} />
      ))}
    </div>
  );
}
