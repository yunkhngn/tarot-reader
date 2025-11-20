import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';

export default function ApiDocs() {
  return (
    <>
      <Metadata 
        title="API Documentation - Tarot Reader"
        description="API documentation for Tarot Reader. Get all cards, random cards, and more."
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col">
        <AppNavbar />
        
        <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 max-w-4xl flex-1">
          <div className="mb-8">
            <p className="tracking-[0.5em] text-xs text-[#d5a052] uppercase mb-4 text-center">API Documentation</p>
            <h1 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-4 text-center">
              API Endpoints
            </h1>
            <p className="text-white/70 text-center text-base sm:text-lg leading-relaxed mb-8">
              Khám phá các API endpoints có sẵn để tích hợp Tarot Reader vào ứng dụng của bạn.
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-[#111010] border border-[#2a1f17] rounded-2xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <code className="bg-[#2a2a2a] px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-sm sm:text-base whitespace-nowrap w-fit">
                    GET /api/cards
                  </code>
                  <span className="text-white/90 text-base sm:text-lg font-medium">Get all cards</span>
                </div>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  Trả về danh sách tất cả 78 lá bài Tarot với thông tin chi tiết.
                </p>
              </div>
            </div>

            <div className="bg-[#111010] border border-[#2a1f17] rounded-2xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <code className="bg-[#2a2a2a] px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-sm sm:text-base whitespace-nowrap w-fit">
                    GET /api/cards/onecard
                  </code>
                  <span className="text-white/90 text-base sm:text-lg font-medium">Get one random card</span>
                </div>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  Trả về một lá bài Tarot ngẫu nhiên từ bộ bài 78 lá.
                </p>
              </div>
            </div>

            <div className="bg-[#111010] border border-[#2a1f17] rounded-2xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <code className="bg-[#2a2a2a] px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-sm sm:text-base whitespace-nowrap w-fit">
                    GET /api/cards/threecards
                  </code>
                  <span className="text-white/90 text-base sm:text-lg font-medium">Get three random cards</span>
                </div>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  Trả về ba lá bài Tarot ngẫu nhiên, không trùng lặp, phù hợp cho trải bài 3 lá.
                </p>
              </div>
            </div>

            <div className="bg-[#111010] border border-[#2a1f17] rounded-2xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <code className="bg-[#2a2a2a] px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-sm sm:text-base whitespace-nowrap w-fit">
                    GET /api/quotes
                  </code>
                  <span className="text-white/90 text-base sm:text-lg font-medium">Get all quotes</span>
                </div>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  Trả về danh sách tất cả các câu nói truyền cảm hứng với thông tin chi tiết.
                </p>
              </div>
            </div>

            <div className="bg-[#111010] border border-[#2a1f17] rounded-2xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <code className="bg-[#2a2a2a] px-4 py-2.5 rounded-lg border border-[#D4AF37]/30 text-[#D4AF37] font-mono text-sm sm:text-base whitespace-nowrap w-fit">
                    GET /api/quotes/daily
                  </code>
                  <span className="text-white/90 text-base sm:text-lg font-medium">Get quote of the day</span>
                </div>
                <p className="text-white/70 text-sm sm:text-base leading-relaxed">
                  Trả về câu nói của ngày hôm nay. Mỗi ngày sẽ có cùng một câu nói dựa trên ngày trong năm.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 bg-[#111010] border border-[#2a1f17] rounded-2xl p-6 sm:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
            <h2 className="text-xl sm:text-2xl font-serif text-[#D4AF37] mb-4">Response Format</h2>
            
            <div className="mb-6">
              <p className="text-white/70 text-sm sm:text-base mb-3">
                <strong className="text-[#D4AF37]">Card Endpoints</strong> trả về dữ liệu dưới dạng JSON:
              </p>
              <pre className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm text-white/80">
{`{
  "name": "The Fool",
  "image": "/tarotdeck/thefool.jpeg",
  "description": "..."
}`}
              </pre>
            </div>

            <div className="mb-6">
              <p className="text-white/70 text-sm sm:text-base mb-3">
                <strong className="text-[#D4AF37]">GET /api/quotes</strong> trả về:
              </p>
              <pre className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm text-white/80">
{`{
  "quotes": [
    {
      "id": 1,
      "text": "Không ai sống hộ cuộc đời mình...",
      "category": "life"
    },
    ...
  ],
  "total": 503
}`}
              </pre>
            </div>

            <div>
              <p className="text-white/70 text-sm sm:text-base mb-3">
                <strong className="text-[#D4AF37]">GET /api/quotes/daily</strong> trả về:
              </p>
              <pre className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 overflow-x-auto text-sm text-white/80">
{`{
  "quote": "Không ai sống hộ cuộc đời mình...",
  "category": "life",
  "id": 1,
  "date": "2025-01-21"
}`}
              </pre>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

