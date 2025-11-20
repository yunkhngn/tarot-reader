import { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button, Card, CardBody } from '@heroui/react';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';

export default function Home() {
  const router = useRouter();

  return (
    <>
      <Metadata 
        title="Tarot Reader - Bói Bài Tarot Miễn Phí"
        description="Bói bài Tarot miễn phí trực tuyến. Khám phá những thông điệp bí ẩn từ vũ trụ, giải quyết những vấn đề trong tình yêu, công việc và cuộc sống."
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col">
        <AppNavbar />
        
        {/* Hero Section - Full Height */}
        <div className="w-full border-b border-white/10 flex-1 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl w-full py-12 sm:py-16">
            <div className="grid gap-8 lg:gap-12 items-center lg:grid-cols-2">
              <div className="text-center lg:text-left">
                <p className="tracking-[0.5em] text-xs text-[#d5a052] uppercase mb-4">Tarot Reader</p>
                <h1 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-4">
                  TAROT.YUNKHNGN.DEV
                </h1>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-8">
                  Chào mừng bạn đến với Tarot Reader - nơi bạn có thể bói bài Tarot miễn phí trực tuyến. 
                  Khám phá những thông điệp bí ẩn từ vũ trụ, giải quyết những vấn đề trong tình yêu, công việc và cuộc sống. 
                  Tìm kiếm sự cân bằng và hướng dẫn cho hành trình của bạn.
                </p>
                
                <Button
                  className="bg-white text-black hover:bg-gray-200 font-semibold text-base rounded-none border-2 border-black"
                  onClick={() => router.push('/reading')}
                >
                  <span className="nav-star mr-2">✦</span>
                  BÓI TAROT NGAY
                </Button>
              </div>
              
              <div className="w-full">
                <div className="relative w-full h-60 sm:h-72 lg:h-96 border-2 border-white/20 overflow-hidden">
                  <Image
                    src="/image/homepage.jpg"
                    alt="Tarot Reader"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TAROT LÀ GÌ Section - Full Width */}
        <div className="w-full border-b border-white/10 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid gap-8 lg:gap-12 items-center lg:grid-cols-2">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-6">
                  TAROT LÀ GÌ?
                </h2>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed">
                  Tarot là bộ bài gồm 78 lá, chia thành Major Arcana và Minor Arcana, mang ý nghĩa biểu tượng sâu sắc về các khía cạnh của cuộc sống. Bói bài Tarot sử dụng bộ bài này để đưa ra lời khuyên, giải quyết vấn đề hoặc dự đoán tương lai thông qua việc trải bài và giải mã ý nghĩa các lá bài. Phương pháp này không chỉ giúp khám phá bản thân mà còn hỗ trợ định hướng trong tình yêu, sự nghiệp, tài chính và nhiều lĩnh vực khác. Ngày nay, bói bài Tarot online trở nên phổ biến nhờ tính tiện lợi và khả năng kết nối với các chuyên gia trên toàn cầu.
                </p>
                <Button
                  className="bg-white text-black hover:bg-gray-200 font-semibold text-base mt-6 rounded-none border-2 border-black"
                  onClick={() => router.push('/reading')}
                >
                  <span className="nav-star mr-2">✦</span>
                  BÓI TAROT NGAY
                </Button>
              </div>
              <div className="order-1 lg:order-2 w-full">
              <div className="relative w-full h-60 sm:h-72 lg:h-96 border-2 border-white/20 overflow-hidden">
                  <Image
                    src="/image/tarot-zalo.jpg"
                    alt="Tarot Reader"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CÁC CHỦ ĐỀ BÓI BÀI TAROT Section - Full Width */}
        <div className="w-full border-b border-white/10 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-4 text-center">
              CÁC CHỦ ĐỀ BÓI BÀI TAROT
            </h2>
            <p className="text-white/70 text-center text-base sm:text-lg leading-relaxed mb-12 max-w-3xl mx-auto">
              tarot.yunkhngn.dev mang đến trải nghiệm bói bài Tarot toàn diện với sự đa dạng về chủ đề, đáp ứng mọi khía cạnh trong cuộc sống. Từ tình yêu, sự nghiệp, tài chính, sức khỏe, đến các vấn đề về gia đình hay tinh thần cá nhân, mỗi trải bài đều được cá nhân hóa để giải đáp thắc mắc và định hướng chính xác nhất. Với đội ngũ chuyên gia giàu kinh nghiệm, tarot.yunkhngn.dev là nơi bạn có thể tìm thấy câu trả lời và sự cân bằng cho mọi giai đoạn của hành trình cuộc sống.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  cardName: 'The Lovers',
                  title: 'TÌNH YÊU',
                  description: 'Bói bài Tarot giúp bạn khám phá các khía cạnh sâu sắc trong tình yêu và mối quan hệ.',
                  image: '/image/lover.png'
                },
                {
                  cardName: 'The Empress',
                  title: 'TINH THẦN',
                  description: 'Khám phá nội tâm, hiểu rõ cảm xúc, và tìm kiếm sự cân bằng trong cuộc sống từ thông điệp của trải bài Tarot.',
                  image: '/image/empress.png'
                },
                {
                  cardName: 'Strength',
                  title: 'SỨC KHỎE',
                  description: 'Cung cấp và đưa ra lời khuyên giúp cải thiện sức khỏe toàn diện.',
                  image: '/image/strength.png'
                },
                {
                  cardName: 'The Wheel of Fortune',
                  title: 'TÀI CHÍNH',
                  description: 'Trải bài về chủ đề tài chính giúp bạn hiểu rõ tình hình kinh tế hiện tại, đưa ra dự đoán và lời khuyên hữu ích giải quyết khó khăn về tiền bạc.',
                  image: '/image/fortune.png'
                }
              ].map((theme, index) => (
                <div key={index} className="bg-[#111010] border-2 border-white/20 overflow-hidden flex flex-col h-full">
                  <div className="relative w-full flex-1 border-b-2 border-white/20 bg-white flex items-center justify-center p-4 min-h-[300px]">
                    <Image
                      src={theme.image}
                      alt={theme.cardName}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="text-xl font-serif text-[#D4AF37] mb-3">{theme.title}</h3>
                    <p className="text-white/80 text-sm leading-relaxed mb-6">{theme.description}</p>
                    <Button
                      className="bg-white text-black hover:bg-gray-200 font-semibold text-sm rounded-none border-2 border-black w-full"
                      onClick={() => router.push('/reading')}
                    >
                      <span className="nav-star mr-2">✦</span>
                      NHẬN THÔNG ĐIỆP
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LỢI ÍCH Section - Full Width */}
        <div className="w-full border-b border-white/10 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid gap-8 lg:gap-12 items-center lg:grid-cols-2">
              <div className="w-full">
              <div className="relative w-full h-60 sm:h-72 lg:h-96 border-2 border-white/20 overflow-hidden">
                  <Image
                    src="/image/kenh-tarot.jpg"
                    alt="Tarot Reader"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-6">
                  LỢI ÍCH KHI SỬ DỤNG DỊCH VỤ BÓI BÀI TAROT ONLINE TẠI TAROT.YUNKHNGN.DEV
                </h2>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed mb-6">
                  Sử dụng dịch vụ bói bài Tarot tại tarot.yunkhngn.dev mang đến trải nghiệm nhanh chóng, tiện lợi và chuyên nghiệp. Nền tảng của chúng tôi cung cấp dịch vụ bói bài cá nhân hóa, cho phép đặt câu hỏi cho tất cả khía cạnh trong cuộc sống của bạn. Đặc biệt, tarot.yunkhngn.dev hỗ trợ trải bài hoàn toàn miễn phí, giúp bạn dễ dàng giải đáp mọi thắc mắc chỉ trong vài phút mà không cần rời khỏi nhà. Nếu bạn đang tìm kiếm một nơi uy tín để nhận được những lời khuyên chất lượng, đây chính là lựa chọn lý tưởng dành cho bạn!
                </p>
                <Button
                  className="bg-white text-black hover:bg-gray-200 font-semibold text-base rounded-none border-2 border-black"
                  onClick={() => router.push('/reading')}
                >
                  <span className="nav-star mr-2">✦</span>
                  BÓI BÀI NGAY
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Full Width */}
        <div className="w-full border-b border-white/10 py-12 sm:py-16 mb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <h2 className="text-3xl sm:text-4xl font-serif text-[#D4AF37] mb-12 text-center">
              CÂU HỎI THƯỜNG GẶP
            </h2>
            
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  question: 'CÁCH XEM TAROT ONLINE TẠI TAROT READER?',
                  answer: 'Bạn chỉ cần truy cập trang "Bói bài tarot", nhập câu hỏi của mình, chọn 3 lá bài từ trải bài, và nhận phân tích chi tiết từ hệ thống AI của chúng tôi.'
                },
                {
                  question: 'BÓI BÀI TAROT CÓ MẤT PHÍ KHÔNG?',
                  answer: 'Không, dịch vụ bói bài Tarot tại tarot.yunkhngn.dev hoàn toàn miễn phí. Bạn có thể sử dụng không giới hạn số lần trải bài.'
                },
                {
                  question: 'TÔI CÓ THỂ HỎI NHIỀU CÂU HỎI CHO TRẢI BÀI KHÔNG?',
                  answer: 'Mỗi trải bài được thiết kế để trả lời một câu hỏi cụ thể. Tuy nhiên, bạn có thể thực hiện nhiều trải bài khác nhau để giải đáp các câu hỏi khác nhau của mình.'
                },
                {
                  question: 'LỜI GIẢI BÀI TAROT TẠI TAROT.YUNKHNGN.DEV CHÍNH XÁC ĐẾN MỨC NÀO?',
                  answer: 'Chúng tôi sử dụng AI tiên tiến (Google Gemini) để phân tích các lá bài dựa trên ý nghĩa truyền thống của Tarot. Độ chính xác phụ thuộc vào cách bạn đặt câu hỏi và cách bạn áp dụng lời khuyên vào cuộc sống của mình.'
                },
                {
                  question: 'TÔI CÓ THỂ LIÊN HỆ TAROT.YUNKHNGN.DEV Ở ĐÂU?',
                  answer: 'Bạn có thể liên hệ với chúng tôi qua các kênh thông tin được cung cấp trong phần Footer của website.'
                }
              ].map((faq, index) => (
                <FAQItem key={index} question={faq.question} answer={faq.answer} />
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-[#111010] border-2 border-white/20 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#0b0a0a] transition-colors"
      >
        <span className="text-white text-base sm:text-lg font-medium pr-4">{question}</span>
        <span className="text-white text-2xl flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t-2 border-white/20">
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}

