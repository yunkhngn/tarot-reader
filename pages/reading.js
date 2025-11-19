import { useState } from 'react';
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Spinner
} from '@heroui/react';
import AppNavbar from '../components/Navbar';

const suggestedQuestions = [
  "Mối quan hệ tiếp theo của tôi có khả năng kéo dài không?",
  "Người yêu cũ của tôi có còn tình cảm với tôi không?",
  "Liệu tôi có vượt qua được những thử thách sắp tới không?",
  "Tôi có thể mong đợi sự cải thiện nào trong tình hình tài chính của mình không?",
  "Khi nào tôi sẽ gặp được tình yêu mới?",
  "Sự nghiệp của tôi trong năm tới sẽ phát triển như thế nào?",
  "Tôi nên làm gì để cải thiện cuộc sống của mình?",
  "Điều gì đang chờ đợi tôi trong tương lai gần?"
];

export default function Reading() {
  const [question, setQuestion] = useState('');
  const [cards, setCards] = useState([]);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleReading = async () => {
    if (!question.trim()) {
      alert('Vui lòng nhập câu hỏi của bạn');
      return;
    }

    setLoading(true);
    setAnalysis('');
    setCards([]);

    try {
      // Get 3 random cards
      const cardsResponse = await fetch('/api/cards/threecards');
      const threeCards = await cardsResponse.json();
      setCards(threeCards);

      // Get analysis from Gemini
      const analysisResponse = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question,
          cards: threeCards,
        }),
      });

      const data = await analysisResponse.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestedQuestion = (suggestedQ) => {
    setQuestion(suggestedQ);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      <AppNavbar />
      
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-8 text-center">
          ĐẶT CÂU HỎI CHO TRẢI BÀI TAROT
        </h1>

        {/* Question Input Section */}
        <div className="mb-8">
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Khi nào tôi sẽ gặp được tình yêu mới?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1"
              classNames={{
                input: "text-white placeholder:text-gray-500",
                inputWrapper: "bg-[#2a2a2a] border-gray-700 hover:border-[#D4AF37]/50 focus-within:border-[#D4AF37]"
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && question.trim() && !loading) {
                  handleReading();
                }
              }}
            />
            <Button
              className="bg-white text-black hover:bg-gray-200 min-w-[50px]"
              onClick={handleReading}
              isLoading={loading}
              disabled={loading || !question.trim()}
            >
              {loading ? <Spinner size="sm" /> : '↑'}
            </Button>
          </div>

          {/* Suggested Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {suggestedQuestions.slice(0, 4).map((suggestedQ, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedQuestion(suggestedQ)}
                className="bg-[#2a2a2a] hover:bg-[#3a3a3a] border border-gray-700 hover:border-[#D4AF37]/50 text-white text-left p-4 rounded transition-all duration-200"
              >
                {suggestedQ}
              </button>
            ))}
          </div>

          <p className="text-white/70 text-center text-sm mb-8">
            Nhấn gửi câu hỏi để bắt đầu xào bài
          </p>
        </div>

        {/* Cards Display */}
        {cards.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-serif text-[#D4AF37] mb-8 text-center">
              Ba Lá Bài Của Bạn
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {cards.map((card, index) => {
                const positions = ['Quá Khứ', 'Hiện Tại', 'Tương Lai'];
                return (
                  <div key={index} className="relative">
                    <div 
                      className="relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 shadow-2xl"
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <img
                        src={card.image}
                        alt={card.name}
                        className="w-full h-[500px] object-cover"
                      />
                      {hoveredCard === index && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
                          <div className="text-center p-6">
                            <h3 className="text-3xl font-bold text-[#D4AF37] mb-2">{card.name}</h3>
                            <p className="text-white/90 text-lg font-semibold">{positions[index]}</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="text-white text-center font-semibold text-lg">
                          {positions[index]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Analysis Section */}
        {loading && cards.length === 0 && (
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-12">
            <div className="flex flex-col items-center justify-center">
              <Spinner size="lg" className="text-[#D4AF37]" />
              <p className="text-white/80 mt-6 text-lg">Đang rút bài và phân tích...</p>
            </div>
          </div>
        )}

        {analysis && (
          <div className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-8 mb-8">
            <h2 className="text-3xl font-serif text-[#D4AF37] mb-6">
              ✨ Phân Tích Tarot
            </h2>
            <div 
              className="text-white/90 leading-relaxed whitespace-pre-line"
              style={{ 
                fontSize: '1.1rem',
                lineHeight: '2'
              }}
            >
              {analysis}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

