import { useState, useEffect } from 'react';
import { Spinner, Card, CardBody } from '@heroui/react';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';

export default function Quotes() {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/quotes/daily');
        if (!response.ok) {
          throw new Error('Failed to fetch quote');
        }
        const data = await response.json();
        setQuote(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching quote:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, []);

  const getCategoryColor = (category) => {
    const colors = {
      life: 'text-[#D4AF37]',
      gratitude: 'text-[#d5a052]',
      love: 'text-[#c08b45]',
      work: 'text-[#D4AF37]',
      friendship: 'text-[#d5a052]',
      growth: 'text-[#c08b45]',
      mindset: 'text-[#D4AF37]',
    };
    return colors[category] || 'text-[#D4AF37]';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      life: 'Cuộc Sống',
      gratitude: 'Lòng Biết Ơn',
      love: 'Tình Yêu',
      work: 'Công Việc',
      friendship: 'Tình Bạn',
      growth: 'Phát Triển',
      mindset: 'Tư Duy',
    };
    return labels[category] || category;
  };

  return (
    <>
      <Metadata 
        title="Quote of the Day - Tarot Reader"
        description="Khám phá câu nói truyền cảm hứng mỗi ngày từ Tarot Reader"
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col">
        <AppNavbar />
        
        <div className="w-full border-b border-white/10 py-12 sm:py-16 lg:py-20 flex-1 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl w-full">
            <div className="text-center mb-8 sm:mb-12">
              <p className="tracking-[0.5em] text-xs sm:text-sm text-[#d5a052] uppercase mb-4">Quote of the Day</p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">
                CÂU NÓI HÔM NAY
              </h1>
              {quote && (
                <p className="text-white/60 text-sm sm:text-base">
                  {new Date(quote.date).toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" className="text-[#D4AF37]" />
              </div>
            ) : error ? (
              <Card className="bg-[#111010] border-2 border-red-500/30 rounded-lg p-8">
                <CardBody>
                  <p className="text-red-400 text-center">Có lỗi xảy ra: {error}</p>
                </CardBody>
              </Card>
            ) : quote ? (
              <Card className="bg-[#111010] border-2 border-white/20 rounded-lg overflow-hidden">
                <CardBody className="p-8 sm:p-12 lg:p-16">
                  <div className="text-center">
                    <div className="mb-6">
                      <span className={`inline-block px-4 py-2 rounded-full border-2 border-white/20 text-sm uppercase tracking-[0.2em] ${getCategoryColor(quote.category)}`}>
                        {getCategoryLabel(quote.category)}
                      </span>
                    </div>
                    
                    <blockquote className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed mb-8 italic">
                      "{quote.quote}"
                    </blockquote>
                    
                    <div className="flex justify-center items-center gap-2 text-white/60 text-sm">
                      <svg 
                        className="w-5 h-5" 
                        fill="currentColor" 
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                      <span>Quote thứ {quote.id} của Khoa Nguyễn</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ) : null}
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}

