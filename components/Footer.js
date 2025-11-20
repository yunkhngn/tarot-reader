import { useRouter } from 'next/router';

export default function Footer() {
  const links = [
    { label: 'Bói bài tarot', href: '/reading' },
    { label: 'Library bài', href: '/library' },
  ];
  const router = useRouter();

  return (
    <footer className="bg-[#0b0a0a] border-t border-[#2a1f17]">
      <div className="container mx-auto px-4 py-10 md:py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-playfair text-white text-2xl tracking-[0.2em] flex items-center gap-2">
              <span>TAROT READER</span>
              <span className="text-[#d5a052]">✦</span>
            </p>
            <p className="text-white/70 mt-4 max-w-lg text-sm md:text-base">
              Tarot Reader mang đến trải nghiệm bói bài trực tuyến miễn phí, giúp bạn tìm
              kiếm thông điệp sâu sắc và định hướng trong tình yêu, sự nghiệp và cuộc sống.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm md:text-base font-mulish">
            {links.map((link) => (
              <p
                key={link.label}
                href={link.href}
                className="text-white/70 hover:text-white uppercase tracking-[0.2em]"
                onClick={() => router.push(link.href)}
              >
                {link.label}
              </p>
            ))}
          </div>
        </div>
        <div className="border-t border-[#2a1f17] mt-8 pt-6 text-center text-white/40 text-xs tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} Tarot Reader. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

