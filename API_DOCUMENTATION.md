# 📚 Tarot Card API - Endpoints Documentation

API miễn phí để truy cập thông tin về các lá bài Tarot, bao gồm 78 lá bài chuẩn với hình ảnh và mô tả chi tiết.

## 🌐 Base URL

**Local Development:**
```
http://localhost:3000
```

**Production (Vercel):**
```
https://your-project.vercel.app
```

---

## 📋 Endpoints

### 1. Lấy tất cả lá bài

Lấy danh sách đầy đủ 78 lá bài Tarot.

**Endpoint:**
```
GET /cards
```

**Request:**
```bash
curl https://your-project.vercel.app/cards
```

**Response:**
```json
[
  {
    "name": "The Fool",
    "description": "The card suggests that your investments have the potential to yield positive results. The Fool signifies new beginnings, taking risks, and embracing unconventional approaches...",
    "image": "/tarotdeck/thefool.jpeg"
  },
  {
    "name": "The Magician",
    "description": "The card suggests that your trades have the potential to yield successful results. The Magician represents power, skill, and manifestation of goals...",
    "image": "/tarotdeck/themagician.jpeg"
  },
  ...
]
```

**Response Status:** `200 OK`

**Response Body:**
- `name` (string): Tên lá bài
- `description` (string): Mô tả chi tiết về ý nghĩa lá bài
- `image` (string): Đường dẫn đến hình ảnh lá bài

**Ví dụ với JavaScript (Fetch API):**
```javascript
fetch('https://your-project.vercel.app/cards')
  .then(response => response.json())
  .then(data => {
    console.log('Total cards:', data.length);
    console.log('First card:', data[0]);
  })
  .catch(error => console.error('Error:', error));
```

**Ví dụ với JavaScript (Async/Await):**
```javascript
async function getAllCards() {
  try {
    const response = await fetch('https://your-project.vercel.app/cards');
    const cards = await response.json();
    return cards;
  } catch (error) {
    console.error('Error fetching cards:', error);
  }
}
```

**Ví dụ với Python:**
```python
import requests

response = requests.get('https://your-project.vercel.app/cards')
cards = response.json()
print(f"Total cards: {len(cards)}")
```

---

### 2. Lấy một lá bài ngẫu nhiên

Lấy một lá bài Tarot được chọn ngẫu nhiên từ bộ 78 lá.

**Endpoint:**
```
GET /cards/onecard
```

**Request:**
```bash
curl https://your-project.vercel.app/cards/onecard
```

**Response:**
```json
{
  "name": "The Star",
  "description": "According to `The Star` tarot card, your trades may yield hope, inspiration, and positive outcomes. The Star represents a guiding light, offering a sense of optimism and renewal...",
  "image": "/tarotdeck/thestar.jpeg"
}
```

**Response Status:** `200 OK`

**Response Body:**
- `name` (string): Tên lá bài
- `description` (string): Mô tả chi tiết về ý nghĩa lá bài
- `image` (string): Đường dẫn đến hình ảnh lá bài

**Ví dụ với JavaScript (Fetch API):**
```javascript
fetch('https://your-project.vercel.app/cards/onecard')
  .then(response => response.json())
  .then(card => {
    console.log('Random card:', card.name);
    console.log('Description:', card.description);
    console.log('Image URL:', card.image);
  })
  .catch(error => console.error('Error:', error));
```

**Ví dụ với JavaScript (Async/Await):**
```javascript
async function getRandomCard() {
  try {
    const response = await fetch('https://your-project.vercel.app/cards/onecard');
    const card = await response.json();
    return card;
  } catch (error) {
    console.error('Error fetching random card:', error);
  }
}
```

**Ví dụ với Python:**
```python
import requests

response = requests.get('https://your-project.vercel.app/cards/onecard')
card = response.json()
print(f"Card: {card['name']}")
print(f"Description: {card['description']}")
```

---

### 3. Lấy ba lá bài ngẫu nhiên

Lấy ba lá bài Tarot được chọn ngẫu nhiên từ bộ 78 lá (không trùng lặp).

**Endpoint:**
```
GET /cards/threecards
```

**Request:**
```bash
curl https://your-project.vercel.app/cards/threecards
```

**Response:**
```json
[
  {
    "name": "The Star",
    "description": "According to `The Star` tarot card, your trades may yield hope, inspiration, and positive outcomes. The Star represents a guiding light, offering a sense of optimism and renewal...",
    "image": "/tarotdeck/thestar.jpeg"
  },
  {
    "name": "Ace of Cups",
    "description": "The `Ace of Cups` tarot card suggests that your trades may yield new opportunities and emotional fulfillment. This card represents the potential for new beginnings, abundance, and positive energy...",
    "image": "/tarotdeck/aceofcups.jpeg"
  },
  {
    "name": "King of Swords",
    "description": "The `King of Swords` card suggest that your trades would likely be that you will experience a period of strategic decision-making, rationality, and intellectual prowess...",
    "image": "/tarotdeck/kingofswords.jpeg"
  }
]
```

**Response Status:** `200 OK`

**Response Body:**
- Array chứa 3 objects, mỗi object có:
  - `name` (string): Tên lá bài
  - `description` (string): Mô tả chi tiết về ý nghĩa lá bài
  - `image` (string): Đường dẫn đến hình ảnh lá bài

**Lưu ý:** Ba lá bài được chọn ngẫu nhiên và không trùng lặp.

**Ví dụ với JavaScript (Fetch API):**
```javascript
fetch('https://your-project.vercel.app/cards/threecards')
  .then(response => response.json())
  .then(cards => {
    console.log('Three random cards:');
    cards.forEach((card, index) => {
      console.log(`${index + 1}. ${card.name}`);
    });
  })
  .catch(error => console.error('Error:', error));
```

**Ví dụ với JavaScript (Async/Await):**
```javascript
async function getThreeCards() {
  try {
    const response = await fetch('https://your-project.vercel.app/cards/threecards');
    const cards = await response.json();
    return cards;
  } catch (error) {
    console.error('Error fetching three cards:', error);
  }
}

// Sử dụng
getThreeCards().then(cards => {
  cards.forEach(card => {
    console.log(card.name, card.description);
  });
});
```

**Ví dụ với Python:**
```python
import requests

response = requests.get('https://your-project.vercel.app/cards/threecards')
cards = response.json()
for i, card in enumerate(cards, 1):
    print(f"{i}. {card['name']}")
    print(f"   {card['description'][:100]}...")
```

**Use Case: Tạo một trải bài Tarot 3 lá (Past, Present, Future):**
```javascript
async function threeCardSpread() {
  const cards = await fetch('https://your-project.vercel.app/cards/threecards')
    .then(res => res.json());
  
  return {
    past: {
      name: cards[0].name,
      description: cards[0].description,
      image: `https://your-project.vercel.app${cards[0].image}`
    },
    present: {
      name: cards[1].name,
      description: cards[1].description,
      image: `https://your-project.vercel.app${cards[1].image}`
    },
    future: {
      name: cards[2].name,
      description: cards[2].description,
      image: `https://your-project.vercel.app${cards[2].image}`
    }
  };
}
```

---

### 4. Truy cập hình ảnh lá bài

Truy cập trực tiếp hình ảnh của các lá bài Tarot.

**Endpoint:**
```
GET /tarotdeck/{filename}
```

**Các file ảnh có sẵn:**
- `thefool.jpeg`
- `themagician.jpeg`
- `thehighpriestess.jpeg`
- `theempress.jpeg`
- `theemperor.jpeg`
- `thehierophant.jpeg`
- `TheLovers.jpg`
- `thechariot.jpeg`
- `thestrength.jpeg`
- `thehermit.jpeg`
- `wheeloffortune.jpeg`
- `justice.jpeg`
- `thehangedman.jpeg`
- `death.jpeg`
- `temperance.jpeg`
- `thedevil.jpeg`
- `thetower.jpeg`
- `thestar.jpeg`
- `themoon.jpeg`
- `thesun.jpeg`
- `judgement.jpeg`
- `theworld.jpeg`
- `aceofcups.jpeg`, `twoofcups.jpeg`, ... `kingofcups.jpeg`
- `aceofpentacles.jpeg`, `twoofpentacles.jpeg`, ... `kingofpentacles.jpeg`
- `aceofswords.jpeg`, `twoofswords.jpeg`, ... `kingofswords.jpeg`
- `aceofwands.jpeg`, `twoofwands.jpeg`, ... `kingofwands.jpeg`

**Request:**
```bash
curl https://your-project.vercel.app/tarotdeck/thefool.jpeg
```

**Response:** 
- Content-Type: `image/jpeg`
- Status: `200 OK`

**Ví dụ sử dụng trong HTML:**
```html
<img src="https://your-project.vercel.app/tarotdeck/thefool.jpeg" alt="The Fool" />
```

**Ví dụ với JavaScript:**
```javascript
const cardImageUrl = 'https://your-project.vercel.app/tarotdeck/thestar.jpeg';
const img = document.createElement('img');
img.src = cardImageUrl;
img.alt = 'Tarot Card';
document.body.appendChild(img);
```

**Ví dụ lấy ảnh từ card object:**
```javascript
async function displayCard() {
  const response = await fetch('https://your-project.vercel.app/cards/onecard');
  const card = await response.json();
  
  // Tạo full URL cho ảnh
  const baseUrl = 'https://your-project.vercel.app';
  const imageUrl = baseUrl + card.image;
  
  console.log('Card:', card.name);
  console.log('Image URL:', imageUrl);
  
  // Hiển thị ảnh
  const img = document.createElement('img');
  img.src = imageUrl;
  img.alt = card.name;
  document.body.appendChild(img);
}
```

---

## 📊 Cấu trúc dữ liệu

### Card Object

```typescript
interface TarotCard {
  name: string;        // Tên lá bài (ví dụ: "The Fool", "Ace of Cups")
  description: string; // Mô tả chi tiết về ý nghĩa lá bài
  image: string;       // Đường dẫn tương đối đến hình ảnh (ví dụ: "/tarotdeck/thefool.jpeg")
}
```

---

## 🎯 Use Cases

### 1. Tạo ứng dụng Tarot Reading
```javascript
async function dailyTarotReading() {
  const card = await fetch('https://your-project.vercel.app/cards/onecard')
    .then(res => res.json());
  
  return {
    cardName: card.name,
    meaning: card.description,
    imageUrl: `https://your-project.vercel.app${card.image}`
  };
}
```

### 2. Hiển thị danh sách tất cả lá bài
```javascript
async function displayAllCards() {
  const cards = await fetch('https://your-project.vercel.app/cards')
    .then(res => res.json());
  
  cards.forEach(card => {
    console.log(`${card.name}: ${card.description.substring(0, 50)}...`);
  });
}
```

### 3. Tạo bộ bài Tarot tùy chỉnh
```javascript
async function createCustomDeck() {
  const allCards = await fetch('https://your-project.vercel.app/cards')
    .then(res => res.json());
  
  // Lọc chỉ Major Arcana (22 lá đầu)
  const majorArcana = allCards.filter((card, index) => index < 22);
  
  // Hoặc lọc theo tên
  const cupsCards = allCards.filter(card => 
    card.name.toLowerCase().includes('cups')
  );
  
  return { majorArcana, cupsCards };
}
```

---

## ⚠️ Error Handling

### Error Response Format

```json
{
  "error": "Internal Server Error"
}
```

**Status Codes:**
- `200 OK` - Request thành công
- `500 Internal Server Error` - Lỗi server

**Ví dụ xử lý lỗi:**
```javascript
async function fetchCard() {
  try {
    const response = await fetch('https://your-project.vercel.app/cards/onecard');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const card = await response.json();
    return card;
  } catch (error) {
    console.error('Error fetching card:', error);
    return null;
  }
}
```

---

## 🔗 Quick Links

- **Get All Cards:** `GET /cards`
- **Get Random Card:** `GET /cards/onecard`
- **Get Three Random Cards:** `GET /cards/threecards`
- **Get Card Image:** `GET /tarotdeck/{filename}`

---

## 📝 Notes

- API không yêu cầu authentication
- API không có rate limiting (có thể thay đổi trong tương lai)
- Tất cả responses đều là JSON, trừ khi truy cập trực tiếp hình ảnh
- Hình ảnh được serve dưới dạng static files
- API hỗ trợ CORS (nếu được cấu hình)

---

## 🚀 Examples

### React Component Example

```jsx
import React, { useState, useEffect } from 'react';

function TarotCard() {
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://your-project.vercel.app/cards/onecard')
      .then(res => res.json())
      .then(data => {
        setCard(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!card) return <div>Error loading card</div>;

  return (
    <div>
      <h2>{card.name}</h2>
      <img 
        src={`https://your-project.vercel.app${card.image}`} 
        alt={card.name} 
      />
      <p>{card.description}</p>
    </div>
  );
}
```

### Node.js Example

```javascript
const axios = require('axios');

async function getRandomTarotCard() {
  try {
    const response = await axios.get('https://your-project.vercel.app/cards/onecard');
    console.log('Card:', response.data.name);
    console.log('Description:', response.data.description);
    return response.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}
```

---

**Happy Coding! 🔮✨**

