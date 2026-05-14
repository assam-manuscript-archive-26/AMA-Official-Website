import React, { useState } from 'react';
import MobileDrawer from './MobileDrawer';
import { Menu } from 'lucide-react';

export default function NavbarController() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="md:hidden p-2 text-ink"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}