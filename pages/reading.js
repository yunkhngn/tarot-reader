import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Button, Spinner, Textarea } from '@heroui/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Image from 'next/image';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';

const DISPLAY_CARD_COUNT = 12;

const suggestedQuestions = [
  "Mối quan hệ mới này có phải là True Love của tôi không?",
  "Người ấy có hối tiếc về việc chia tay không?",
  "Tôi sẽ gặp những cơ hội quan trọng nào trong tương lai gần?",
  "Tôi nên tiếp tục công việc hiện tại hay tìm kiếm một hướng đi mới?"
];

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
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [hCaptchaToken, setHCaptchaToken] = useState(null);
  const [hCaptchaSiteKey, setHCaptchaSiteKey] = useState(null);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const analysisRef = useRef(null);
  const rowRef = useRef(null);
  const hCaptchaRef = useRef(null);
  const cooldownIntervalRef = useRef(null);
  const isProduction = process.env.NODE_ENV === 'production';
  const COOLDOWN_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

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

  useEffect(() => {
    if (isProduction) {
      const fetchHCaptchaSiteKey = async () => {
        try {
          const res = await fetch('/api/hcaptcha-sitekey');
          const data = await res.json();
          if (data.siteKey) {
            setHCaptchaSiteKey(data.siteKey);
          }
        } catch (error) {
          console.error('Failed to fetch hCaptcha site key:', error);
        }
      };
      fetchHCaptchaSiteKey();
    }
  }, [isProduction]);

  // Check cooldown on mount and set up interval
  useEffect(() => {
    if (!isProduction) return;

    const checkCooldown = () => {
      const lastSubmitTime = localStorage.getItem('lastTarotSubmit');
      if (!lastSubmitTime) {
        setCooldownRemaining(0);
        return;
      }

      const elapsed = Date.now() - parseInt(lastSubmitTime, 10);
      const remaining = COOLDOWN_DURATION - elapsed;

      if (remaining > 0) {
        setCooldownRemaining(remaining);
      } else {
        setCooldownRemaining(0);
        localStorage.removeItem('lastTarotSubmit');
      }
    };

    checkCooldown();
    cooldownIntervalRef.current = setInterval(checkCooldown, 1000);

    return () => {
      if (cooldownIntervalRef.current) {
        clearInterval(cooldownIntervalRef.current);
      }
    };
  }, [isProduction, COOLDOWN_DURATION]);

  const resetSpread = () => {
    if (!allCards.length) return;
    setDeck(shuffle(allCards).slice(0, DISPLAY_CARD_COUNT));
    setSelectedCards([]);
    setRevealedIndices([]);
    setQuestion('');
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
  };

  // Drag to scroll functionality
  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let hasMoved = false;

    const handleMouseDown = (e) => {
      // Only start drag if clicking on the row itself, not on a card button
      if (e.target === row || (e.target.closest('.tarot-row') === row && !e.target.closest('button'))) {
        isDown = true;
        hasMoved = false;
        setIsDragging(false);
        startX = e.pageX - row.offsetLeft;
        scrollLeft = row.scrollLeft;
        row.style.cursor = 'grabbing';
      }
    };

    const handleMouseLeave = () => {
      isDown = false;
      hasMoved = false;
      row.style.cursor = 'grab';
    };

    const handleMouseUp = () => {
      isDown = false;
      row.style.cursor = 'grab';
      setTimeout(() => {
        setIsDragging(false);
        hasMoved = false;
      }, 100);
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - row.offsetLeft;
      const diff = Math.abs(x - startX);
      
      if (diff > 5) {
        hasMoved = true;
        setIsDragging(true);
        e.preventDefault();
        const walk = (x - startX) * 2;
        row.scrollLeft = scrollLeft - walk;
      }
    };

    row.addEventListener('mousedown', handleMouseDown);
    row.addEventListener('mouseleave', handleMouseLeave);
    row.addEventListener('mouseup', handleMouseUp);
    row.addEventListener('mousemove', handleMouseMove);

    // Touch events for mobile
    let touchStart = 0;
    let scrollLeftStart = 0;

    const handleTouchStart = (e) => {
      touchStart = e.touches[0].pageX;
      scrollLeftStart = row.scrollLeft;
      setIsDragging(false);
    };

    const handleTouchMove = (e) => {
      if (!touchStart) return;
      const touchNow = e.touches[0].pageX;
      const walk = (touchStart - touchNow) * 2;
      row.scrollLeft = scrollLeftStart + walk;
      setIsDragging(true);
    };

    const handleTouchEnd = () => {
      touchStart = 0;
      setTimeout(() => setIsDragging(false), 100);
    };

    row.addEventListener('touchstart', handleTouchStart);
    row.addEventListener('touchmove', handleTouchMove);
    row.addEventListener('touchend', handleTouchEnd);

    return () => {
      row.removeEventListener('mousedown', handleMouseDown);
      row.removeEventListener('mouseleave', handleMouseLeave);
      row.removeEventListener('mouseup', handleMouseUp);
      row.removeEventListener('mousemove', handleMouseMove);
      row.removeEventListener('touchstart', handleTouchStart);
      row.removeEventListener('touchmove', handleTouchMove);
      row.removeEventListener('touchend', handleTouchEnd);
    };
  }, [deck]);

  const handleAnalyze = () => {
    if (!question.trim()) {
      alert('Vui lòng nhập câu hỏi của bạn');
      return;
    }
    if (selectedCards.length !== 3) {
      alert('Vui lòng chọn đủ 3 lá bài');
      return;
    }
    if (isProduction && !hCaptchaToken) {
      alert('Vui lòng hoàn thành xác thực hCaptcha');
      return;
    }
    if (isProduction && cooldownRemaining > 0) {
      const minutes = Math.floor(cooldownRemaining / 60000);
      const seconds = Math.floor((cooldownRemaining % 60000) / 1000);
      alert(`Vui lòng đợi ${minutes} phút ${seconds} giây trước khi bói lại.`);
      return;
    }
    analyzeCards(selectedCards);
  };

  const handleHCaptchaVerify = (token) => {
    setHCaptchaToken(token);
  };

  const handleHCaptchaExpire = () => {
    setHCaptchaToken(null);
  };

  const handleSuggestedQuestion = (suggestedQ) => {
    setQuestion(suggestedQ);
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
          question: question.trim() || 'Hãy phân tích 3 lá bài Tarot này cho tôi.',
          cards: cardsToAnalyze,
          hCaptchaToken: hCaptchaToken,
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

      // Save submit time for cooldown (only in production)
      if (isProduction) {
        localStorage.setItem('lastTarotSubmit', Date.now().toString());
        setCooldownRemaining(COOLDOWN_DURATION);
      }

      // Reset hCaptcha after successful submission (only in production)
      if (isProduction && hCaptchaRef.current) {
        hCaptchaRef.current.resetCaptcha();
      }
      if (isProduction) {
        setHCaptchaToken(null);
      }

      setTimeout(() => {
        if (analysisRef.current) {
          analysisRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra: ' + error.message);
      // Reset hCaptcha on error (only in production)
      if (isProduction && hCaptchaRef.current) {
        hCaptchaRef.current.resetCaptcha();
      }
      if (isProduction) {
        setHCaptchaToken(null);
      }
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
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col">
        <AppNavbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 max-w-5xl flex-1">
        {/* Question Input Section */}
        <div className="mb-12">
          <div className="bg-[#111010] border border-[#2a1f17] rounded-[32px] px-5 sm:px-8 py-8 sm:py-10 shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
            <p className="text-center text-xs md:text-sm tracking-[0.5em] text-[#c08b45] uppercase mb-4">
              ĐẶT CÂU HỎI
            </p>
            <h1 className="text-2xl sm:text-4xl font-serif text-[#f5f0e5] text-center mb-6 sm:mb-8">
              ĐẶT CÂU HỎI CHO <br/>
              TRẢI BÀI TAROT
            </h1>

            <div className="mb-8">
              <div className="relative w-full">
              <Textarea
  placeholder="Khi nào tôi sẽ gặp được tình yêu mới?"
  value={question}
  onChange={(e) => setQuestion(e.target.value)}
  minRows={1}
  maxRows={4}
  spellCheck={false}
  autoCorrect="off"
  autoComplete="off"
  classNames={{
    input: `
      text-white
      !text-white
      placeholder:text-[#5f5f60]
      text-base sm:text-lg
      [-webkit-text-fill-color:rgba(255,255,255,0.96)]
    `,
    innerWrapper: `
      !px-5 sm:!px-6 
      !py-4 sm:!py-5
      bg-[#262626]
      data-[hover=true]:bg-[#262626]
      data-[focus=true]:bg-[#262626]
      group-data-[focus=true]:bg-[#262626]
    `,
    inputWrapper: `
      bg-[#262626]
      data-[hover=true]:bg-[#262626]
      data-[focus=true]:bg-[#262626]
      group-data-[focus=true]:bg-[#262626]
      rounded-[28px]
      border border-[#3a3a3c]
      hover:border-[#4a4a4c]
      focus-within:border-[#4a4a4c]
      shadow-[0_15px_45px_rgba(0,0,0,0.45)]
      transition-all
      !min-h-[64px]
    `,
  }}
  onKeyDown={(e) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      question.trim() &&
      selectedCards.length === 3 &&
      !isSubmitting
    ) {
      e.preventDefault();
      handleAnalyze();
    }
  }}
/>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6">
              {suggestedQuestions.map((suggestedQ, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestion(suggestedQ)}
                  disabled={isSubmitting}
                  className={`bg-[#1b1b1d] border border-[#2f2f32] text-white text-left px-5 sm:px-6 py-4 sm:py-5 rounded-[18px] sm:rounded-[20px] transition-all duration-200 text-sm sm:text-base md:text-lg shadow-[0_12px_30px_rgba(0,0,0,0.35)] ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#262628] hover:border-[#c08b45]/50'
                  }`}
                >
                  {suggestedQ}
                </button>
              ))}
            </div>

            <p className="text-center text-[#c08b45] text-sm uppercase tracking-[0.3em]">
              Nhập câu hỏi và chọn 3 lá bài để bắt đầu
            </p>
          </div>
        </div>

        {/* Card Selection Section */}
        <Card className="bg-[#111010] border border-[#2a1f17] rounded-[32px] shadow-[0_25px_80px_rgba(0,0,0,0.45)] mb-10">
          <CardBody className="p-6 sm:p-10">
            <p className="text-center text-xs md:text-sm tracking-[0.5em] text-[#c08b45] uppercase mb-4">
              Bước 2
            </p>
            <h1 className="text-2xl sm:text-4xl font-serif text-[#f5f0e5] text-center mb-4">
              Chọn 3 lá bài bạn cảm thấy kết nối nhất
            </h1>
            <p className="text-white/70 text-center max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
              Kéo thả để xem các lá bài, sau đó click vào 3 lá bạn muốn chọn. Hãy hít thở sâu và lắng nghe trực giác của bạn.
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
            <div 
              ref={rowRef}
              className="tarot-row flex gap-4 overflow-x-auto pb-4 cursor-grab select-none"
              style={{ userSelect: 'none' }}
            >
              {deck.map((card, index) => {
                const flipped = revealedIndices.includes(index);
                const disabled = flipped || selectedCards.length >= 3 || isSubmitting;
                return (
                  <button
                    key={`${card.name}-${index}`}
                    className={`tarot-card relative flex-shrink-0 ${flipped ? 'is-flipped' : ''} ${disabled ? 'disabled-card' : ''}`}
                    style={{ aspectRatio: '3 / 5', width: '110px', animationDelay: `${index * 60}ms`, pointerEvents: disabled ? 'none' : 'auto' }}
                    draggable="false"
                    onDragStart={(e) => {
                      e.preventDefault();
                      return false;
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardSelect(index);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    disabled={disabled}
                  >
                    <div className="card-inner">
                      <div className="card-face card-back">
                        <div className="relative w-full h-full">
                          <Image 
                            src="/image/backside.png" 
                            alt="Mặt sau lá bài" 
                            fill
                            className="object-cover"
                            sizes="110px"
                          />
                        </div>
                      </div>
                      <div className="card-face card-front">
                        <div className="relative w-full h-full">
                          <Image 
                            src={card.image} 
                            alt={card.name} 
                            fill
                            className="object-cover"
                            sizes="110px"
                          />
                        </div>
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
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-6">
              {selectedCards.map((card, index) => (
                <div key={`${card.name}-selected-${index}`} className="w-48 sm:w-56 md:w-64">
                  <div className="relative overflow-hidden rounded-xl border border-[#2f2f32] shadow-[0_15px_45px_rgba(0,0,0,0.45)] mb-3" style={{ aspectRatio: '3 / 5' }}>
                    <Image 
                      src={card.image} 
                      alt={card.name} 
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 192px, (max-width: 768px) 224px, 256px"
                    />
                  </div>
                    <p className="text-center text-white text-base sm:text-lg font-semibold">{card.name}</p>
                </div>
              ))}
            </div>
            
            {selectedCards.length === 3 && (
              <div className="flex flex-col items-center gap-4">
                {isProduction && hCaptchaSiteKey && (
                  <div className="flex justify-center">
                    <HCaptcha
                      sitekey={hCaptchaSiteKey}
                      onVerify={handleHCaptchaVerify}
                      onExpire={handleHCaptchaExpire}
                      ref={hCaptchaRef}
                    />
                  </div>
                )}
                <div className="flex flex-col items-center gap-3">
                  {isProduction && cooldownRemaining > 0 && (
                    <p className="text-white/70 text-sm">
                      Cooldown: {Math.floor(cooldownRemaining / 60000)}:{(Math.floor((cooldownRemaining % 60000) / 1000)).toString().padStart(2, '0')}
                    </p>
                  )}
                  <Button
                    onClick={handleAnalyze}
                    disabled={
                      isSubmitting || 
                      !question.trim() || 
                      (isProduction && !hCaptchaToken) ||
                      (isProduction && cooldownRemaining > 0)
                    }
                    size="lg"
                    className={`
                      bg-[#c08b45]
                      hover:bg-[#d4a052]
                      text-white
                      font-semibold
                      px-8 py-6
                      rounded-[20px]
                      text-base sm:text-lg
                      shadow-[0_8px_25px_rgba(192,139,69,0.3)]
                      transition-all
                      ${isSubmitting || !question.trim() || (isProduction && !hCaptchaToken) || (isProduction && cooldownRemaining > 0)
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-[1.02] hover:shadow-[0_12px_35px_rgba(192,139,69,0.4)]"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner size="sm" className="mr-2" />
                        Đang phân tích...
                      </>
                    ) : (
                      'Phân tích bài Tarot'
                    )}
                  </Button>
                </div>
              </div>
            )}
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
      <Footer/>
    </>
  );
}
