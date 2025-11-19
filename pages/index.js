import { useRouter } from 'next/router';
import { Card, CardBody, Button } from '@heroui/react';
import AppNavbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <AppNavbar />
      
      <div className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-6">
              TAROTREADER.ME - BÓI BÀI TAROT MIỄN PHÍ
            </h1>
            <p className="text-white/80 text-lg leading-relaxed mb-8">
              Chào mừng bạn đến với TarotReader.me - nơi bạn có thể bói bài Tarot miễn phí trực tuyến. 
              Khám phá những thông điệp bí ẩn từ vũ trụ, giải quyết những vấn đề trong tình yêu, công việc và cuộc sống. 
              Tìm kiếm sự cân bằng và hướng dẫn cho hành trình của bạn.
            </p>
            
            <Button
              className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-6 text-lg"
              onClick={() => router.push('/reading')}
            >
              <span className="mr-2">⭐</span> BÓI TAROT NGAY
            </Button>
          </div>
          
          <div className="hidden md:block">
            {/* Placeholder for decorative graphic */}
            <div className="w-full h-96 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-lg border border-gray-700 flex items-center justify-center">
              <span className="text-6xl">🔮</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gray-800">
          <h2 className="text-2xl font-serif text-[#D4AF37] mb-4">API Endpoints</h2>
          <div className="space-y-2 text-white/70">
            <p><code className="bg-[#2a2a2a] px-3 py-1 rounded border border-gray-700">GET /api/cards</code> - Get all cards</p>
            <p><code className="bg-[#2a2a2a] px-3 py-1 rounded border border-gray-700">GET /api/cards/onecard</code> - Get one random card</p>
            <p><code className="bg-[#2a2a2a] px-3 py-1 rounded border border-gray-700">GET /api/cards/threecards</code> - Get three random cards</p>
          </div>
        </div>
      </div>
    </div>
  );
}

