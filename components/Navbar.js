import { useState } from 'react';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as HeroUILink } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
  { label: 'Bói bài tarot', href: '/reading', key: 'reading' },
  { label: 'Bài tarot', href: '/library', key: 'library' },
];

export default function AppNavbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const DesktopLinks = () => (
    <>
      {navLinks.map((link) => (
        <NavbarItem 
          key={link.key}
          isActive={router.pathname === link.href}
          className="font-mulish"
        >
          <HeroUILink 
            as={Link}
            href={link.href}
            className={
              router.pathname === link.href 
                ? 'navbar-link'
                : 'navbar-link inactive hover:text-white'
            }
          >
            <span className="nav-star">✦</span>
            {link.label.toUpperCase()}
          </HeroUILink>
        </NavbarItem>
      ))}
    </>
  );

  return (
    <>
      <Navbar 
        className="bg-[#0b0a0a] border-b border-[#2a1f17] p-5"
        maxWidth="full"
      >
        <NavbarBrand>
          <Link 
            href="/" 
            className="font-playfair text-white text-xl sm:text-2xl tracking-[0.2em] flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span>TAROT READER</span>
            <span className="text-[#d5a052] text-lg">✦</span>
          </Link>
        </NavbarBrand>

        <div className="flex lg:hidden">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="text-white/80 hover:text-white transition-colors"
          >
            ☰
          </button>
        </div>

        <NavbarContent className="hidden lg:flex gap-6" justify="center">
          <DesktopLinks />
        </NavbarContent>
      </Navbar>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
          <div className="flex justify-end p-4">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-white text-2xl font-light"
            >
              ×
            </button>
          </div>
          <div className="px-6 py-8 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link key={link.key} href={link.href}>
                <span
                  onClick={() => setMenuOpen(false)}
                  className="block text-white/90 border border-[#2f2f32] rounded-2xl px-5 py-4 text-center tracking-[0.3em] uppercase hover:border-[#d5a052] transition-colors"
                >
                  <span className="nav-star mr-2">✦</span>
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

