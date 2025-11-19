import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link as HeroUILink } from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AppNavbar() {
  const router = useRouter();

  return (
    <Navbar 
      className="bg-[#1a1a1a] border-b border-gray-800"
      maxWidth="full"
      isBordered
    >
      <NavbarBrand>
        <Link href="/" className="font-bold text-white text-xl hover:opacity-80 transition-opacity">
          TAROT READER
        </Link>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem isActive={router.pathname === '/reading'}>
          <HeroUILink 
            as={Link}
            href="/reading"
            className={router.pathname === '/reading' ? 'text-white font-semibold' : 'text-white/70 hover:text-white'}
          >
            BÓI BÀI TAROT
          </HeroUILink>
        </NavbarItem>
        <NavbarItem isActive={router.pathname === '/library'}>
          <HeroUILink 
            as={Link}
            href="/library"
            className={router.pathname === '/library' ? 'text-white font-semibold' : 'text-white/70 hover:text-white'}
          >
            BÀI TAROT
          </HeroUILink>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

