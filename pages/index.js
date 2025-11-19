import { useRouter } from 'next/router';
import { Card, CardBody, Button } from '@heroui/react';
import AppNavbar from '../components/Navbar';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <AppNavbar />
      
      <div className="container mx-auto px-4 py-20 max-w-4xl">
        <Card className="backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl">
          <CardBody className="p-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              🔮 Tarot Reader
            </h1>
            <p className="text-xl text-white/80 mb-8">
              Khám phá vận mệnh của bạn qua những lá bài Tarot
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                color="secondary"
                size="lg"
                className="font-semibold"
                onClick={() => router.push('/reading')}
              >
                Bói Tarot Ngay
              </Button>
              <Button
                variant="bordered"
                size="lg"
                className="font-semibold border-white/30 text-white"
                onClick={() => router.push('/library')}
              >
                Xem Library Bài
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-white/20">
              <h2 className="text-2xl font-bold text-white mb-4">API Endpoints</h2>
              <div className="text-left space-y-2 text-white/80">
                <p><code className="bg-white/10 px-2 py-1 rounded">GET /api/cards</code> - Get all cards</p>
                <p><code className="bg-white/10 px-2 py-1 rounded">GET /api/cards/onecard</code> - Get one random card</p>
                <p><code className="bg-white/10 px-2 py-1 rounded">GET /api/cards/threecards</code> - Get three random cards</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

