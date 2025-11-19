import { useState, useEffect } from 'react';
import { Card, CardBody, Input, Spinner } from '@heroui/react';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';

export default function Library() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

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

  return (
    <>
      <Metadata 
        title="Library Bài Tarot - Xem Tất Cả 78 Lá Bài"
        description="Khám phá tất cả 78 lá bài Tarot và ý nghĩa chi tiết của chúng. Tìm hiểu về Major Arcana và Minor Arcana."
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#1a1a1a]">
        <AppNavbar />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6 mb-8">
          <h1 className="text-4xl font-serif text-[#D4AF37] mb-4 text-center">
            Library Bài Tarot
          </h1>
          <p className="text-white/80 mb-6 text-center text-lg">
            Khám phá tất cả 78 lá bài Tarot và ý nghĩa của chúng
          </p>
          
          <Input
            placeholder="Tìm kiếm bài..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md mx-auto"
            classNames={{
              input: "text-white placeholder:text-gray-500",
              inputWrapper: "bg-[#1a1a1a] border-gray-700 hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37]"
            }}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" className="text-[#D4AF37]" />
          </div>
        ) : (
          <>
            <p className="text-white/70 mb-6 text-center">
              Tìm thấy {filteredCards.length} lá bài
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCards.map((card, index) => (
                <div
                  key={index}
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
          </>
        )}

        {/* Modal for selected card */}
        {selectedCard && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCard(null)}
          >
            <div 
              className="bg-[#2a2a2a] border border-gray-700 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-3xl font-serif text-[#D4AF37]">{selectedCard.name}</h2>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-white/80 hover:text-white text-3xl leading-none"
                  >
                    ×
                  </button>
                </div>
                <img
                  src={selectedCard.image}
                  alt={selectedCard.name}
                  className="w-full h-96 object-cover rounded-lg mb-4 border border-gray-700"
                />
                <div className="text-white/90 leading-relaxed whitespace-pre-line text-lg">
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

