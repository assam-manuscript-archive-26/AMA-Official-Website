import React from 'react';
import { navRoutes } from '@/lib/data/navRoutes';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-canvas">
      <div className="flex justify-end p-4">
        <button onClick={onClose} className="p-2 text-ink">
          <X size={24} />
        </button>
      </div>
      <nav className="flex flex-col items-center gap-8 pt-16">
        {navRoutes.map((route) => (
          <a
            key={route.href}
            href={route.href}
            className="font-display text-2xl text-ink"
            onClick={onClose}
          >
            {route.label}
          </a>
        ))}
      </nav>
    </div>
  );
}