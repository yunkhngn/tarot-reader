import { useState, useEffect } from 'react';
import { Card, CardBody, Input, Spinner, Button } from '@heroui/react';
import Image from 'next/image';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';

export default function Library() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 24;

  useEffect(() => {
    fetch('/api/cards')
      .then(res => res.json())
      .then(data => {
        setCards(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching cards:', err);
        setLoading(false);
      });
  }, []);

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / CARDS_PER_PAGE));
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const paginatedCards = filteredCards.slice(startIndex, startIndex + CARDS_PER_PAGE);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <Metadata 
        title="Library Bài Tarot - Xem Tất Cả 78 Lá Bài"
        description="Khám phá tất cả 78 lá bài Tarot và ý nghĩa chi tiết của chúng. Tìm hiểu về Major Arcana và Minor Arcana."
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col">
        <AppNavbar />
      
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl flex-1">
        <Card className="bg-[#111010] border border-[#2a1f17] rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.45)] mb-10">
          <CardBody className="p-6 sm:p-10">
            <p className="text-center text-xs md:text-sm tracking-[0.5em] text-[#c08b45] uppercase mb-4">
              Library
            </p>
            <h1 className="text-2xl sm:text-4xl font-serif text-[#f5f0e5] text-center mb-4">
              Library Bài Tarot
            </h1>
            <p className="text-white/70 text-center max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-6">
              Khám phá tất cả 78 lá bài Tarot và ý nghĩa của chúng. Hover vào lá bài để xem tên, click để xem chi tiết.
            </p>
            
            <div className="max-w-2xl mx-auto">
            <Input
              placeholder="Tìm kiếm bài..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-70"
              classNames={{
                input: `
                  text-white
                  placeholder:text-[#5f5f60]
                  text-base sm:text-lg
                  !pr-5
                `,

                innerWrapper: `
                  bg-[#262626]
                  data-[hover=true]:bg-[#262626]
                  data-[focus=true]:bg-[#262626]
                  group-data-[focus=true]:bg-[#262626]
                `,

                inputWrapper: `
                  bg-[#262626]
                  border border-[#3a3a3c]
                  hover:border-[#D4AF37]/60
                  focus-within:border-[#D4AF37]
                  data-[hover=true]:bg-[#262626]
                  data-[focus=true]:bg-[#262626]
                  group-data-[focus=true]:bg-[#262626]
                  focus-within:ring-0
                  shadow-[0_15px_45px_rgba(0,0,0,0.45)]
                  transition-all
                  min-h-[64px]
                `,
              }}
            />
            </div>
          </CardBody>
        </Card>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" className="text-[#D4AF37]" />
          </div>
        ) : (
          <>
            <p className="text-white/70 mb-6 text-center text-sm sm:text-base">
             Tổng cộng {filteredCards.length} lá bài
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {paginatedCards.map((card, index) => (
                <div
                  key={`${card.name}-${index}`}
                  className="group relative cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="relative overflow-hidden rounded-lg border border-gray-700/50 group-hover:border-[#D4AF37]/70 transition-all shadow-lg group-hover:shadow-2xl" style={{ aspectRatio: '3 / 5' }}>
                    <Image
                      src={card.image}
                      alt={card.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 20vw, 16vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all duration-300 flex items-center justify-center">
                      <h3 className="text-white text-sm sm:text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center px-2">
                        {card.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCards.length > CARDS_PER_PAGE && (
              <div className="mt-10 flex flex-col items-center gap-4">
                <div className="text-white/70">
                  Trang {currentPage} / {totalPages}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="bg-[#1b1b1d] text-white border border-[#2f2f32] hover:border-[#c08b45]/60"
                    size="sm"
                    radius="full"
                  >
                    Trước
                  </Button>
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNumber = idx + 1;
                    const isActive = pageNumber === currentPage;
                    // Only show first, last, current +/-1
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      Math.abs(pageNumber - currentPage) <= 1
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`w-10 h-10 rounded-full border ${
                            isActive
                              ? 'bg-[#c08b45] border-[#c08b45] text-black font-semibold'
                              : 'bg-[#1b1b1d] border-[#2f2f32] text-white hover:border-[#c08b45]/60'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                    if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span key={`ellipsis-${pageNumber}`} className="text-white/50 px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <Button
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="bg-[#1b1b1d] text-white border border-[#2f2f32] hover:border-[#c08b45]/60"
                    size="sm"
                    radius="full"
                  >
                    Sau
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal for selected card */}
        {selectedCard && (
          <div 
            className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-50 p-4 md:p-6"
            onClick={() => setSelectedCard(null)}
          >
            <div 
              className="relative bg-[#1b1918] border border-[#453628] rounded-[32px] shadow-[0_35px_120px_rgba(0,0,0,0.7)] max-w-3xl w-full h-[95vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 left-6 z-10">
                <span className="text-xs uppercase tracking-[0.35em] text-[#c08b45] bg-white/10 px-3 py-1 rounded-full">
                  {selectedCard.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-6 z-10 text-white/70 hover:text-white text-3xl leading-none"
              >
                ×
              </button>
              
              <div className="flex-1 overflow-y-auto p-8 pt-16">
                <h2 className="text-4xl font-serif text-[#c8a05e] mb-6">
                  {selectedCard.name}
                </h2>
                <div className="relative w-full rounded-2xl overflow-hidden border border-[#2f2620] shadow-[0_25px_70px_rgba(0,0,0,0.45)] mb-6 bg-[#0f0e0d] flex justify-center" style={{ aspectRatio: '3 / 5', maxWidth: '400px', margin: '0 auto' }}>
                  <Image
                    src={selectedCard.image}
                    alt={selectedCard.name}
                    fill
                    className="object-contain"
                    sizes="400px"
                  />
                </div>
                <div className="text-white/90 leading-relaxed whitespace-pre-line break-words text-lg font-light pb-4">
                  {selectedCard.description}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
      <Footer />
    </>
  );
}

