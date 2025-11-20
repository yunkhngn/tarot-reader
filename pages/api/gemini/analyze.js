import { GoogleGenerativeAI } from '@google/generative-ai';
import { checkRateLimit } from '../../../utils/rateLimiter';

export default async function handler(req, res) {
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Rate limiting check
    const clientIp = req.headers['x-forwarded-for']?.split(',')[0] || 
                     req.headers['x-real-ip'] || 
                     req.socket.remoteAddress || 
                     'unknown';
    
    const rateLimitResult = checkRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: rateLimitResult.message,
        remainingTime: rateLimitResult.remainingTime,
        remainingMinutes: rateLimitResult.remainingMinutes,
        remainingSeconds: rateLimitResult.remainingSeconds
      });
    }

    const { question, cards, hCaptchaToken } = req.body;

    // Verify hCaptcha only in production
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      if (!hCaptchaToken) {
        return res.status(400).json({ error: 'hCaptcha verification required' });
      }

      const hCaptchaSecret = process.env.HCAPTCHA_SECRET;
      if (!hCaptchaSecret) {
        return res.status(500).json({ error: 'hCaptcha secret not configured' });
      }

      try {
        const verifyResponse = await fetch('https://hcaptcha.com/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${hCaptchaSecret}&response=${hCaptchaToken}`,
        });

        const verifyData = await verifyResponse.json();
        
        if (!verifyData.success) {
          return res.status(400).json({ 
            error: 'hCaptcha verification failed',
            details: verifyData['error-codes'] || 'Invalid token'
          });
        }
      } catch (error) {
        console.error('hCaptcha verification error:', error);
        return res.status(500).json({ error: 'Failed to verify hCaptcha' });
      }
    }

    if (!question || !cards || !Array.isArray(cards) || cards.length !== 3) {
      return res.status(400).json({ error: 'Invalid request. Question and 3 cards are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const cardDescriptions = cards.map((card, index) => {
      const positions = ['Quá khứ', 'Hiện tại', 'Tương lai'];
      return `Thẻ ${positions[index]} - ${card.name}: ${card.description}`;
    }).join('\n\n');

    const prompt = `Bạn là một thầy bói Tarot chuyên nghiệp. Hãy phân tích câu hỏi của người dùng dựa trên 3 lá bài Tarot được rút ra.

Câu hỏi của người dùng: "${question}"

Ba lá bài Tarot:
${cardDescriptions}

YÊU CẦU FORMAT MARKDOWN:
- Viết bằng tiếng Việt, giọng điệu ấm áp, chân thành
- Sử dụng markdown: **in đậm** cho tiêu đề quan trọng, *in nghiêng* cho nhấn mạnh, - gạch đầu dòng cho danh sách
- Chỉ viết ĐÚNG 4 đoạn, mỗi đoạn khoảng 3-4 dòng
- Format rõ ràng, dễ đọc với markdown

CẤU TRÚC:
**1. Ý nghĩa tổng quan:**
- Phân tích ngắn gọn về 3 lá bài trong bối cảnh câu hỏi
- Sử dụng **in đậm** cho tên lá bài quan trọng
- Khoảng 3-4 dòng

**2. Mối liên hệ:**
- Giải thích mối liên hệ giữa quá khứ, hiện tại và tương lai
- Sử dụng *in nghiêng* để nhấn mạnh điểm quan trọng
- Khoảng 3-4 dòng

**3.: Lời khuyên:**
- Đưa ra lời khuyên cụ thể dựa trên kết quả
- Sử dụng gạch đầu dòng (-) cho các lời khuyên
- Khoảng 3-4 dòng

**Kết luận:**
- Tóm tắt và triển vọng
- Khoảng 3-4 dòng

**Bói toán bởi**
_Hệ thống AI tiên tri Tarot của yunkhngn_
Hãy viết ngắn gọn, súc tích, có xuống dòng ở các đầu mục, sử dụng markdown để làm nổi bật các phần quan trọng.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      return res.status(500).json({ 
        error: 'Failed to generate analysis', 
        details: 'Empty response from Gemini API' 
      });
    }

    return res.status(200).json({ analysis: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    console.error('Error stack:', error.stack);
    
    // Extract more detailed error information
    let errorMessage = 'Failed to generate analysis';
    let errorDetails = error.message || 'Unknown error';
    
    if (error.message) {
      errorDetails = error.message;
    }
    if (error.cause) {
      errorDetails += ` - Cause: ${error.cause}`;
    }
    
    return res.status(500).json({ 
      error: errorMessage, 
      details: errorDetails,
      type: error.name || 'Error'
    });
  }
}

