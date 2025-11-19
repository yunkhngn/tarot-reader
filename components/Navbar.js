import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as HeroUILink } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AppNavbar() {
  const router = useRouter();

  return (
    <Navbar 
      className="backdrop-blur-md bg-white/10 border-b border-white/20"
      maxWidth="full"
      isBordered
    >
      <NavbarBrand>
        <Link href="/" className="font-bold text-white text-xl hover:opacity-80 transition-opacity">
          🔮 Tarot Reader
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem isActive={router.pathname === '/reading'}>
          <HeroUILink 
            as={Link}
            href="/reading"
            className={router.pathname === '/reading' ? 'text-white font-semibold' : 'text-white/80'}
          >
            Bói Tarot
          </HeroUILink>
        </NavbarItem>
        <NavbarItem isActive={router.pathname === '/library'}>
          <HeroUILink 
            as={Link}
            href="/library"
            className={router.pathname === '/library' ? 'text-white font-semibold' : 'text-white/80'}
          >
            Library Bài
          </HeroUILink>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

