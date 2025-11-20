import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from '@heroui/react';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Metadata 
        title="Tarot Reader - Bói Bài Tarot Miễn Phí"
        description="Bói bài Tarot miễn phí trực tuyến. Khám phá những thông điệp bí ẩn từ vũ trụ, giải quyết những vấn đề trong tình yêu, công việc và cuộc sống."
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
        <AppNavbar />
        
        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-6xl flex-1">
          <div className="grid gap-10 lg:gap-14 items-center lg:grid-cols-2">
            <div className="text-center lg:text-left">
              <p className="tracking-[0.5em] text-xs text-[#d5a052] uppercase mb-4">Tarot Reader</p>
              <h1 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-4">
                TAROT.YUNKHNGN.DEV
              </h1>
              <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
                Chào mừng bạn đến với Tarot Reader - nơi bạn có thể bói bài Tarot miễn phí trực tuyến. 
                Khám phá những thông điệp bí ẩn từ vũ trụ, giải quyết những vấn đề trong tình yêu, công việc và cuộc sống. 
                Tìm kiếm sự cân bằng và hướng dẫn cho hành trình của bạn.
              </p>
              
              <Button
                className="bg-white text-black hover:bg-gray-200 font-semibold text-base sm:text-lg rounded-none"
                onClick={() => router.push('/reading')}
              >
                <span className="nav-star mr-2">✦</span>
                BÓI TAROT NGAY
              </Button>
            </div>
            
            <div className="w-full">
              <div className="relative w-full h-60 sm:h-72 lg:h-96 rounded-3xl border border-gray-700 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
                <Image
                  src="/image/homepage.jpg"
                  alt="Tarot Reader"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-800">
            <h2 className="text-xl sm:text-2xl font-serif text-[#D4AF37] mb-4 text-center sm:text-left">API Endpoints</h2>
            <div className="space-y-3 text-white/70 text-sm sm:text-base">
              <p><code className="bg-[#2a2a2a] px-3 py-1 rounded border border-gray-700 block sm:inline-block">GET /api/cards</code> <span className="sm:ml-2">- Get all cards</span></p>
              <p><code className="bg-[#2a2a2a] px-3 py-1 rounded border border-gray-700 block sm:inline-block">GET /api/cards/onecard</code> <span className="sm:ml-2">- Get one random card</span></p>
              <p><code className="bg-[#2a2a2a] px-3 py-1 rounded border border-gray-700 block sm:inline-block">GET /api/cards/threecards</code> <span className="sm:ml-2">- Get three random cards</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

