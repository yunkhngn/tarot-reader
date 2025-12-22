import { useState } from 'react';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Link as HeroUILink,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button
} from '@heroui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navStructure = [
  {
    label: 'FEATURES',
    items: [
      { label: 'Bói bài Tarot', href: '/reading', key: 'reading', icon: '✦' },
      { label: 'Book of Answers', href: '/book-of-answers', key: 'book-of-answers', icon: '✦' },
      { label: 'Star Chart', href: '/star-chart', key: 'star-chart', icon: '✦' },
      { label: 'Couple Questions', href: '/couple-questions', key: 'couple-questions', icon: '✦' },
    ]
  },
  {
    label: 'RESOURCES',
    items: [
      { label: 'Thư viện bài Tarot', href: '/library', key: 'library', icon: '✦' },
      { label: 'Quote of the Day', href: '/quotes', key: 'quotes', icon: '✦' },
    ]
  },
  {
    label: 'SYSTEM',
    items: [
      { label: 'API Docs', href: '/api-docs', key: 'api-docs', icon: '✦' },
      { label: 'About', href: '/about', key: 'about', icon: '✦' },
    ]
  }
];

// Flatten for mobile menu
const mobileLinks = navStructure.flatMap(group => group.items);

export default function AppNavbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const DesktopLinks = () => (
    <>
      <style jsx global>{`
        .navbar-item-trigger {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Mulish', sans-serif;
          font-size: 0.875rem; /* text-sm */
          letter-spacing: 0.05em;
          color: rgba(255, 255, 255, 0.7); /* inactive */
          transition: all 0.3s ease;
          cursor: pointer;
          border: 1px solid transparent;
          padding: 6px 16px;
          border-radius: 9999px; /* rounded-full */
        }
        .navbar-item-trigger:hover, .navbar-item-trigger[data-active="true"] {
          color: #d4a052;
          background: rgba(212, 160, 82, 0.05); /* very subtle gold bg */
          border-color: rgba(212, 160, 82, 0.2);
          text-shadow: 0 0 15px rgba(212, 160, 82, 0.3);
        }
        .nav-star {
          color: #d5a052;
          font-size: 0.9rem;
          transition: transform 0.3s ease;
        }
        .navbar-item-trigger:hover .nav-star {
          transform: rotate(45deg);
        }
      `}</style>
      {navStructure.map((group) => {
        // Check if any item in this group is active
        const isActive = group.items.some(item => router.pathname === item.href);
        
        return (
          <Dropdown key={group.label} className="bg-[#111010]/95 border border-[#d4a052]/20 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)]" radius="sm">
            <NavbarItem isActive={isActive}>
              <DropdownTrigger>
                <button 
                  className={`navbar-item-trigger group ${isActive ? 'data-[active=true]' : ''}`}
                  type="button"
                  data-active={isActive}
                >
                  <span className="nav-star">✦</span>
                  <span className="font-bold tracking-widest">{group.label}</span>
                  <span className="text-[10px] opacity-50 group-hover:translate-y-0.5 transition-transform duration-300">▼</span>
                </button>
              </DropdownTrigger>
            </NavbarItem>
            <DropdownMenu 
              aria-label={`${group.label} features`}
              className="w-[340px] p-2"
              itemClasses={{
                base: "gap-4 data-[hover=true]:bg-[#d4a052]/10 data-[hover=true]:text-[#d4a052] transition-colors duration-300 rounded-lg p-3",
                description: "text-white/40 group-hover:text-[#d4a052]/70",
                wrapper: "group",
              }}
            >
              {group.items.map((item) => (
                <DropdownItem
                  key={item.key}
                  description={getShortDescription(item.key)}
                  startContent={<span className="text-xl text-[#d4a052]/80 group-hover:text-[#d4a052] transition-colors">{item.icon}</span>}
                  textValue={item.label}
                >
                  <Link href={item.href} className="flex-1 block w-full h-full font-serif font-medium tracking-wide">
                    {item.label}
                  </Link>
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        );
      })}
    </>
  );

  const getShortDescription = (key) => {
    switch(key) {
      case 'reading': return 'Trải bài và nhận thông điệp từ vũ trụ';
      case 'book-of-answers': return 'Tìm câu trả lời cho những băn khoăn';
      case 'star-chart': return 'Khám phá bản đồ sao cá nhân';
      case 'couple-questions': return 'Deep talk giúp các cặp đôi hiểu nhau';
      case 'library': return 'Tìm hiểu ý nghĩa 78 lá bài Tarot';
      case 'quotes': return 'Thông điệp truyền cảm hứng mỗi ngày';
      case 'api-docs': return 'Tài liệu tích hợp API Tarot Reader';
      case 'about': return 'Về dự án và tác giả';
      default: return '';
    }
  };

  return (
    <>
      <Navbar 
        className="bg-[#0b0a0a] border-b border-[#2a1f17] p-5 z-50 sticky top-0"
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

        <NavbarContent className="hidden lg:flex gap-8" justify="center">
          <DesktopLinks />
        </NavbarContent>
      </Navbar>

      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#0b0a0a] overflow-y-auto">
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
            {mobileLinks.map((link) => (
              <Link key={link.key} href={link.href}>
                <span
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center justify-between text-white border-2 border-white/30 rounded-lg px-5 py-4 text-left tracking-[0.1em] uppercase hover:bg-white/10 hover:border-white/50 transition-all"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-xl">{link.icon}</span>
                    {link.label}
                  </span>
                  <span className="nav-star text-[#d5a052]">✦</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

