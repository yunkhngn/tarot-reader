/**
 * ChartExplanation Component
 * Educational section explaining astronomical concepts
 */

import { useState } from 'react';

const explanations = [
  {
    title: 'Julian Day (JD)',
    content: `Julian Day là hệ thống đếm ngày liên tục được các nhà thiên văn sử dụng. Thay vì dùng lịch phức tạp với các tháng khác nhau, JD đếm số ngày từ một điểm gốc cố định (ngày 1 tháng 1 năm 4713 TCN theo lịch Julian).

Công thức:
JD = 367Y - floor(7*(Y + floor((M+9)/12))/4) + floor(275*M/9) + D + 1721013.5 + UT/24

Việc sử dụng JD giúp tính toán khoảng cách thời gian giữa các sự kiện thiên văn trở nên đơn giản - chỉ cần trừ hai số JD.`,
  },
  {
    title: 'Sidereal Time (Giờ thiên văn)',
    content: `Sidereal Time (ST) đo thời gian dựa trên vị trí các ngôi sao, khác với thời gian mặt trời thông thường. Một ngày thiên văn (sidereal day) ngắn hơn ngày mặt trời khoảng 4 phút.

GMST (Greenwich Mean Sidereal Time): Giờ thiên văn tại kinh tuyến gốc Greenwich.

LST (Local Sidereal Time): Giờ thiên văn địa phương = GMST + Kinh độ

LST cho biết điểm nào trên hoàng đạo đang đi qua kinh tuyến địa phương (MC) tại thời điểm đó. Đây là cơ sở để tính ASC và các nhà.`,
  },
  {
    title: 'ASC & MC - Tại sao không chia đều?',
    content: `ASC (Ascendant) là điểm hoàng đạo đang mọc ở đường chân trời phía Đông.
MC (Medium Coeli / Midheaven) là điểm hoàng đạo đang ở cao nhất trên bầu trời.

Hai điểm này không chia hoàng đạo thành 4 phần bằng nhau vì:

1. Hoàng đạo nghiêng so với xích đạo thiên cầu (góc ε ≈ 23.44°)
2. Góc nghiêng này thay đổi theo vĩ độ của người quan sát
3. Các cung hoàng đạo có tốc độ mọc khác nhau - một số cung như Song Ngư hoặc Bạch Dương mọc nhanh hơn, trong khi Xử Nữ hoặc Thiên Bình mọc chậm hơn

Điều này tạo ra sự "méo" trong bản đồ sao, phản ánh đúng thực tế thiên văn.`,
  },
  {
    title: 'Hệ thống Placidus',
    content: `Placidus là phương pháp chia nhà phổ biến nhất, phát triển bởi Placidus de Titis (thế kỷ 17). Phương pháp này chia không gian dựa trên thời gian.

Nguyên lý: Chia thời gian từ khi một điểm mọc (ASC) đến khi nó đạt đỉnh (MC) thành 3 phần bằng nhau, tương ứng với các nhà 12, 11, 10.

Công thức cho các nhà trung gian:
tan(λ) = sin(H) / (cos(H)*cos(ε) - tan(φ)*sin(ε))

Trong đó H là hour angle (30° và 60° cho các nhà trung gian).

Ưu điểm: Phản ánh đúng chuyển động biểu kiến của các ngôi sao qua bầu trời.
Nhược điểm: Gặp vấn đề ở các vĩ độ cao (gần cực) khi một số cung không bao giờ mọc.`,
  },
  {
    title: 'Mô hình địa tâm',
    content: `Bản đồ sao này sử dụng mô hình địa tâm (geocentric) - đặt Trái Đất ở trung tâm. Đây không phải vì chúng ta tin Trái Đất là trung tâm vũ trụ, mà vì:

1. Chúng ta quan sát bầu trời từ Trái Đất
2. Tất cả các vị trí hành tinh được tính theo "chúng xuất hiện ở đâu trên bầu trời" từ góc nhìn của chúng ta
3. Kinh độ hoàng đạo (ecliptic longitude) là góc đo trên đường hoàng đạo - quỹ đạo biểu kiến của Mặt Trời

Các hành tinh được hiển thị tại kinh độ hoàng đạo của chúng. Vị trí được tính bằng ephemeris đơn giản hóa, đủ chính xác cho mục đích minh họa.`,
  },
];

function ExplanationItem({ title, content, isOpen, onClick }) {
  return (
    <div className="bg-[#111010] border-2 border-white/20 overflow-hidden">
      <button
        onClick={onClick}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#0b0a0a] transition-colors"
      >
        <span className="text-white text-base sm:text-lg font-medium pr-4">{title}</span>
        <span className="text-white text-2xl flex-shrink-0">
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div className="px-6 py-4 border-t-2 border-white/20">
          <p className="text-white/80 text-sm sm:text-base leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ChartExplanation() {
  const [openIndex, setOpenIndex] = useState(null);
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl sm:text-3xl font-serif text-[#D4AF37] mb-6 text-center">
        GIẢI THÍCH KHÁI NIỆM
      </h2>
      
      {explanations.map((item, index) => (
        <ExplanationItem
          key={item.title}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
