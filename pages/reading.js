import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Button, Spinner } from '@heroui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';

const DEFAULT_PROMPT =
  'Bạn là một reader Tarot chuyên nghiệp. Dựa trên 3 lá bài bên dưới, hãy đưa ra thông điệp chung, phân tích ngắn gọn (quá khứ - hiện tại - tương lai) và lời khuyên dành cho người xem. Trình bày bằng markdown.';
const DISPLAY_CARD_COUNT = 12;

const shuffle = (array) => {
  const cloned = [...array];
  for (let i = cloned.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
  }
  return cloned;
};

export default function Reading() {
  const [allCards, setAllCards] = useState([]);
  const [deck, setDeck] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const analysisRef = useRef(null);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('/api/cards');
        const data = await res.json();
        setAllCards(data);
        setDeck(shuffle(data).slice(0, DISPLAY_CARD_COUNT));
      } catch (error) {
        console.error(error);
        alert('Không thể tải dữ liệu lá bài.');
      } finally {
        setIsLoadingCards(false);
      }
    };
    fetchCards();
  }, []);

  const resetSpread = () => {
    if (!allCards.length) return;
    setDeck(shuffle(allCards).slice(0, DISPLAY_CARD_COUNT));
    setSelectedCards([]);
    setRevealedIndices([]);
    setAnalysis('');
  };

  const handleCardSelect = (index) => {
    if (isSubmitting) return;
    if (revealedIndices.includes(index)) return;
    if (selectedCards.length >= 3) return;

    const updatedRevealed = [...revealedIndices, index];
    const updatedSelected = [...selectedCards, deck[index]];
    setRevealedIndices(updatedRevealed);
    setSelectedCards(updatedSelected);

    if (updatedSelected.length === 3) {
      analyzeCards(updatedSelected);
    }
  };

  const analyzeCards = async (cardsToAnalyze) => {
    setIsSubmitting(true);
    setAnalysis('');
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: DEFAULT_PROMPT,
          cards: cardsToAnalyze,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = 'Không thể phân tích bài';
        try {
          const errorData = JSON.parse(errorText);
          if (response.status === 429) {
            errorMessage =
              errorData.message ||
              `Vui lòng đợi ${errorData.remainingMinutes || 0} phút ${errorData.remainingSeconds || 0} giây trước khi bói lại.`;
          } else if (
            response.status === 503 ||
            (errorData.details && errorData.details.toLowerCase().includes('overloaded'))
          ) {
            errorMessage = 'Máy chủ Gemini đang quá tải, vui lòng thử lại sau một chút.';
          } else {
            errorMessage = errorData.details || errorData.error || errorMessage;
          }
        } catch (error) {
          errorMessage = `Lỗi ${response.status}: ${errorText.substring(0, 100)}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAnalysis(data.analysis);

      setTimeout(() => {
        if (analysisRef.current) {
          analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Metadata 
        title="Bói Tarot - Trải bài tương tác"
        description="Chọn 3 lá bài Tarot bạn cảm thấy kết nối nhất và nhận thông điệp phân tích từ Tarot Reader."
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col">
        <AppNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 max-w-5xl flex-1">
        <Card className="bg-[#111010] border border-[#2a1f17] rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.45)] mb-10">
          <CardBody className="p-6 sm:p-10">
            <p className="text-center text-xs md:text-sm tracking-[0.5em] text-[#c08b45] uppercase mb-4">
              Bước 1
            </p>
            <h1 className="text-2xl sm:text-4xl font-serif text-[#f5f0e5] text-center mb-4">
              Chọn 3 lá bài bạn cảm thấy kết nối nhất
            </h1>
            <p className="text-white/70 text-center max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Hãy hít thở sâu, tập trung vào trực giác và chọn lần lượt từng lá. Khi đủ 3 lá, chúng tôi sẽ
              giải nghĩa và gửi bạn thông điệp dành riêng cho hành trình hiện tại.
            </p>
          </CardBody>
        </Card>

        <div className="mb-12">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <p className="text-white/80 text-sm sm:text-base">
              Đã chọn <span className="text-[#c08b45] font-semibold">{selectedCards.length}/3</span> lá
            </p>
            <Button
              size="sm"
              className="bg-transparent border border-[#2a2a2a] text-white hover:border-[#c08b45]"
              onClick={resetSpread}
              disabled={isSubmitting || isLoadingCards}
            >
              Trải bài mới
            </Button>
          </div>

          {isLoadingCards ? (
            <div className="py-20 flex justify-center">
              <Spinner size="lg" className="text-[#D4AF37]" />
            </div>
          ) : (
            <div className="tarot-row flex gap-4 overflow-x-auto pb-4">
              {deck.map((card, index) => {
                const flipped = revealedIndices.includes(index);
                const disabled = flipped || selectedCards.length >= 3 || isSubmitting;
                return (
                  <button
                    key={`${card.name}-${index}`}
                    className={`tarot-card relative flex-shrink-0 ${flipped ? 'is-flipped' : ''} ${disabled ? 'disabled-card' : ''}`}
                    style={{ aspectRatio: '3 / 5', width: '110px', animationDelay: `${index * 60}ms` }}
                    onClick={() => handleCardSelect(index)}
                    disabled={disabled}
                  >
                    <div className="card-inner">
                      <div className="card-face card-back">
                        <img src="/image/backside.png" alt="Mặt sau lá bài" className="w-full h-full object-cover" />
                      </div>
                      <div className="card-face card-front">
                        <img src={card.image} alt={card.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {selectedCards.length > 0 && (
          <div className="mb-10 bg-[#1b1b1d] border border-[#2f2f32] rounded-2xl p-6">
            <h2 className="text-center text-[#c08b45] uppercase tracking-[0.3em] text-sm mb-4">
              Lá bài đã chọn
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              {selectedCards.map((card, index) => (
                <div key={`${card.name}-selected-${index}`} className="w-28 sm:w-32">
                  <div className="overflow-hidden rounded-xl border border-[#2f2f32] shadow-[0_15px_45px_rgba(0,0,0,0.45)] mb-2">
                    <img src={card.image} alt={card.name} className="w-full h-40 object-cover" />
                  </div>
                    <p className="text-center text-white text-sm font-semibold">{card.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isSubmitting && (
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-12 mb-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <Spinner size="lg" className="text-[#D4AF37]" />
              <p className="text-white/80 text-center text-lg">Đang lắng nghe thông điệp từ vũ trụ...</p>
            </div>
          </div>
        )}

        {analysis && (
          <div 
            ref={analysisRef}
            className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-6 sm:p-8 mb-8"
          >
            <h2 className="text-3xl font-serif text-[#D4AF37] mb-6 text-center">
              Thông điệp Tarot
            </h2>
            <div 
              className="text-white/90 leading-relaxed markdown-content"
              style={{ 
                fontSize: '1.05rem',
                lineHeight: '1.9'
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-[#D4AF37] mt-6 mb-4 text-center" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-bold text-[#D4AF37] mt-5 mb-3" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-bold text-[#D4AF37] mt-4 mb-2" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-white/80" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside my-4 space-y-2 ml-4" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside my-4 space-y-2 ml-4" {...props} />,
                  li: ({node, ...props}) => <li className="ml-2" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-[#D4AF37] pl-4 my-4 italic text-white/80" {...props} />,
                }}
              >
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
      </div>
    </>
  );
}
