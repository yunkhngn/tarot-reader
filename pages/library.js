import { useState, useEffect } from 'react';
import { Card, CardBody, Input, Spinner, Button } from '@heroui/react';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';

export default function Library() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const CARDS_PER_PAGE = 12;

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
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
        <AppNavbar />
      
      <div className="container mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl flex-1">
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-2xl p-6 sm:p-8 mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-4 text-center">
            Library Bài Tarot
          </h1>
          <p className="text-white/80 mb-6 text-center text-base sm:text-lg">
            Khám phá tất cả 78 lá bài Tarot và ý nghĩa của chúng
          </p>
          
          <Input
            placeholder="Tìm kiếm bài..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl mx-auto"
            classNames={{
              input: "text-white placeholder:text-gray-400 text-base sm:text-lg",

              // Lớp trong, nơi HeroUI hay tự đổi màu -> khoá luôn lại
              innerWrapper: `
                bg-[#1a1a1a]
                data-[hover=true]:bg-[#1a1a1a]
                data-[focus=true]:bg-[#1a1a1a]
                group-data-[focus=true]:bg-[#1a1a1a]
                px-4 py-3
              `,

              // Lớp ngoài – border và nền tổng
              inputWrapper: `
                bg-[#1a1a1a]
                border border-gray-700
                hover:border-[#D4AF37]/50
                focus-within:border-[#D4AF37]
                data-[hover=true]:bg-[#1a1a1a]
                data-[focus=true]:bg-[#1a1a1a]
                group-data-[focus=true]:bg-[#1a1a1a]
                focus-within:ring-0
                outline-none
                rounded-xl
              `,
            }}
          />

        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" className="text-[#D4AF37]" />
          </div>
        ) : (
          <>
            <p className="text-white/70 mb-6 text-center text-sm sm:text-base">
              Tìm thấy {filteredCards.length} lá bài
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {paginatedCards.map((card, index) => (
                <div
                  key={`${card.name}-${index}`}
                  className="bg-[#2a2a2a] border border-gray-700 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:border-[#D4AF37]/50 hover:shadow-2xl"
                  onClick={() => setSelectedCard(card)}
                >
                  <div className="relative">
                    <img
                      src={card.image}
                      alt={card.name}
                      className="w-full h-80 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-[#D4AF37] mb-2">{card.name}</h3>
                    <p className="text-white/70 text-sm line-clamp-3">
                      {card.description.substring(0, 100)}...
                    </p>
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
              className="relative bg-[#1b1918] border border-[#453628] rounded-[32px] shadow-[0_35px_120px_rgba(0,0,0,0.7)] max-w-3xl w-full max-h-[95vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 left-6">
                <span className="text-xs uppercase tracking-[0.35em] text-[#c08b45] bg-white/10 px-3 py-1 rounded-full">
                  {selectedCard.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedCard(null)}
                className="absolute top-4 right-6 text-white/70 hover:text-white text-3xl leading-none"
              >
                ×
              </button>
              
              <div className="p-8">
                <h2 className="text-4xl font-serif text-[#c8a05e] mb-6 mt-8">
                  {selectedCard.name}
                </h2>
                <div className="relative w-full rounded-2xl overflow-hidden border border-[#2f2620] shadow-[0_25px_70px_rgba(0,0,0,0.45)] mb-6 bg-[#0f0e0d] flex justify-center">
                  <img
                    src={selectedCard.image}
                    alt={selectedCard.name}
                    className="w-full max-w-md h-auto object-contain"
                  />
                </div>
                <div className="text-white/90 leading-relaxed whitespace-pre-line break-words text-lg font-light space-y-6">
                  {selectedCard.description}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}

