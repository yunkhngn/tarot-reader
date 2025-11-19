import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  // Set content type to JSON
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question, cards } = req.body;

    if (!question || !cards || !Array.isArray(cards) || cards.length !== 3) {
      return res.status(400).json({ error: 'Invalid request. Question and 3 cards are required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key not configured' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-1.5-flash (faster) or gemini-1.5-pro (more capable)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const cardDescriptions = cards.map((card, index) => {
      const positions = ['Quá khứ', 'Hiện tại', 'Tương lai'];
      return `Thẻ ${positions[index]} - ${card.name}: ${card.description}`;
    }).join('\n\n');

    const prompt = `Bạn là một thầy bói Tarot chuyên nghiệp. Hãy phân tích câu hỏi của người dùng dựa trên 3 lá bài Tarot được rút ra.

Câu hỏi của người dùng: "${question}"

Ba lá bài Tarot:
${cardDescriptions}

Hãy đưa ra một phân tích chi tiết, sâu sắc và có ý nghĩa về câu hỏi này dựa trên ý nghĩa của 3 lá bài. Phân tích nên bao gồm:
1. Ý nghĩa tổng quan của từng lá bài trong bối cảnh câu hỏi
2. Mối liên hệ giữa 3 lá bài (quá khứ, hiện tại, tương lai)
3. Lời khuyên và hướng dẫn cụ thể dựa trên kết quả
4. Kết luận và triển vọng

Hãy viết bằng tiếng Việt, giọng điệu ấm áp, chân thành và mang tính hướng dẫn.`;

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

