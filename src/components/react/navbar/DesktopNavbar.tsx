import React from 'react';
import { navRoutes } from '@/lib/data/navRoutes';

export default function DesktopNavbar() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      {navRoutes.map((route) => (
        <a
          key={route.href}
          href={route.href}
          className="text-sm font-medium text-body hover:text-ink transition-colors"
        >
          {route.label}
        </a>
      ))}
    </nav>
  );
}