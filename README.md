# Tarot Reader

A modern web application for Tarot card readings built with Next.js. Explore the mystical world of Tarot with beautiful card readings, AI-powered interpretations, and interactive spreads. Get personalized readings, daily quotes, and access to all 78 Tarot cards with detailed meanings and symbolism.

## Features

- **Interactive Tarot Readings**: Manually select 3 cards from a spread and receive AI-powered analysis using Google Gemini
- **Complete Tarot Library**: Browse all 78 Tarot cards with detailed descriptions and high-quality images
- **Quote of the Day**: Get daily inspirational quotes with consistent daily selection
- **Beautiful UI**: Modern, responsive dark-themed interface with glassy effects built with HeroUI and Tailwind CSS
- **RESTful API**: Comprehensive API endpoints for developers to integrate Tarot functionality
- **Rate Limiting**: Production-ready rate limiting (5 minutes per reading in production)
- **Bot Protection**: hCaptcha integration for production environment
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key (for AI-powered readings)
- hCaptcha site key and secret (optional, for production)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/yunkhngn/tarot-reader.git
cd tarot-reader
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables:**
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here
HCAPTCHA_SECRET=your_hcaptcha_secret_here
```

4. **Run the development server:**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
tarot-reader/
├── pages/
│   ├── api/
│   │   ├── cards/
│   │   │   ├── index.js          # GET /api/cards - All cards
│   │   │   ├── onecard.js        # GET /api/cards/onecard - Random card
│   │   │   └── threecards.js      # GET /api/cards/threecards - Three random cards
│   │   ├── quotes/
│   │   │   ├── index.js          # GET /api/quotes - All quotes
│   │   │   └── daily.js          # GET /api/quotes/daily - Quote of the day
│   │   ├── gemini/
│   │   │   └── analyze.js        # POST /api/gemini/analyze - AI analysis
│   │   └── hcaptcha-sitekey.js   # GET /api/hcaptcha-sitekey - Get site key
│   ├── _app.js                    # Next.js app wrapper
│   ├── index.js                   # Homepage
│   ├── reading.js                 # Interactive Tarot reading page
│   ├── library.js                 # Tarot card library
│   ├── quotes.js                  # Quote of the day page
│   ├── api-docs.js                # API documentation page
│   └── about.js                   # About page
├── components/
│   ├── Navbar.js                  # Navigation component
│   ├── Footer.js                  # Footer component
│   ├── Metadata.js                # SEO metadata component
│   └── ScrollToTop.js             # Scroll to top button
├── data/
│   ├── tarotCards.js              # Tarot cards data (78 cards)
│   └── quoteOfTheDay.js           # Daily quotes data
├── utils/
│   └── rateLimiter.js             # Rate limiting utility
├── public/
│   ├── tarotdeck/                 # Tarot card images
│   └── image/                     # Other images
├── styles/
│   └── globals.css                 # Global styles
└── package.json
```

## API Endpoints

### Card Endpoints

#### Get All Cards
```
GET /api/cards
```

Returns all 78 Tarot cards with name, description, and image path.

**Response:**
```json
[
  {
    "name": "The Fool",
    "description": "The Fool represents new beginnings...",
    "image": "/tarotdeck/thefool.jpeg"
  },
  ...
]
```

#### Get One Random Card
```
GET /api/cards/onecard
```

Returns a single random Tarot card from the deck.

**Response:**
```json
{
  "name": "The Magician",
  "description": "The Magician represents manifestation...",
  "image": "/tarotdeck/themagician.jpeg"
}
```

#### Get Three Random Cards
```
GET /api/cards/threecards
```

Returns three random, non-duplicate Tarot cards, perfect for three-card spreads.

**Response:**
```json
[
  {
    "name": "The Fool",
    "description": "...",
    "image": "/tarotdeck/thefool.jpeg"
  },
  {
    "name": "The Magician",
    "description": "...",
    "image": "/tarotdeck/themagician.jpeg"
  },
  {
    "name": "The High Priestess",
    "description": "...",
    "image": "/tarotdeck/thehighpriestess.jpeg"
  }
]
```

### Quote Endpoints

#### Get All Quotes
```
GET /api/quotes
```

Returns all available inspirational quotes.

**Response:**
```json
{
  "quotes": [
    {
      "id": 1,
      "text": "Không ai sống hộ cuộc đời mình...",
      "category": "life"
    },
    ...
  ],
  "total": 503
}
```

#### Get Quote of the Day
```
GET /api/quotes/daily
```

Returns the quote of the day. Each day will have the same quote based on the day of the year.

**Response:**
```json
{
  "quote": "Không ai sống hộ cuộc đời mình...",
  "category": "life",
  "id": 1,
  "date": "2025-01-21"
}
```

### Analysis Endpoint

#### Analyze Tarot Cards
```
POST /api/gemini/analyze
```

Analyzes three selected Tarot cards using Google Gemini AI based on a user's question.

**Request Body:**
```json
{
  "question": "Will I find love this year?",
  "cards": [
    {
      "name": "The Fool",
      "description": "...",
      "image": "/tarotdeck/thefool.jpeg"
    },
    ...
  ],
  "hCaptchaToken": "token_here" // Required in production only
}
```

**Response:**
```json
{
  "analysis": "Based on the three cards you've selected..."
}
```

**Rate Limiting:**
- Production: 1 request per 5 minutes per IP address
- Development: Unlimited

**Error Responses:**
- `429 Too Many Requests`: Rate limit exceeded
- `400 Bad Request`: Invalid request or missing hCaptcha token (production)
- `500 Internal Server Error`: Server error or Gemini API error
- `503 Service Unavailable`: Gemini API is overloaded

### hCaptcha Endpoint

#### Get hCaptcha Site Key
```
GET /api/hcaptcha-sitekey
```

Returns the hCaptcha site key for client-side integration (production only).

**Response:**
```json
{
  "siteKey": "your_site_key_here"
}
```

## Web Pages

- **Homepage** (`/`): Welcome page with hero section, features, and call-to-action
- **Tarot Reading** (`/reading`): Interactive page where users select 3 cards and receive AI-powered analysis
- **Tarot Library** (`/library`): Browse all 78 Tarot cards with search and pagination
- **Quote of the Day** (`/quotes`): Daily inspirational quote display
- **API Documentation** (`/api-docs`): Complete API endpoint documentation
- **About** (`/about`): Information about the developer

## Tech Stack

- **Next.js 14**: React framework with API routes and server-side rendering
- **React 18**: UI library
- **HeroUI**: Modern UI component library
- **Tailwind CSS v4**: Utility-first CSS framework
- **Google Gemini API**: AI-powered Tarot card analysis
- **hCaptcha**: Bot protection for production
- **next/image**: Optimized image loading
- **react-markdown**: Markdown rendering for AI responses

## Environment Variables

Required environment variables:

- `GEMINI_API_KEY`: Your Google Gemini API key
- `HCAPTCHA_SITE_KEY`: Your hCaptcha site key (production only)
- `HCAPTCHA_SECRET`: Your hCaptcha secret key (production only)

## Build & Deploy

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

Make sure to add all required environment variables in your Vercel project settings.

## Rate Limiting

The application implements rate limiting for the Gemini API analysis endpoint:

- **Production**: 1 request per 5 minutes per IP address
- **Development**: Unlimited requests

Rate limit information is returned in error responses:
```json
{
  "error": "Rate limit exceeded",
  "message": "Please wait X minutes Y seconds before trying again",
  "remainingTime": 300000,
  "remainingMinutes": 5,
  "remainingSeconds": 0
}
```

## Security

- **hCaptcha**: Integrated for bot protection in production environment only
- **Rate Limiting**: Prevents API abuse and excessive usage
- **Environment Variables**: Sensitive keys stored securely
- **Input Validation**: All API endpoints validate request data

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Suggestions, improvements, and pull requests are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Author

**Khoa Nguyễn (yunkhngn)**

- Website: [https://yunkhngn.dev](https://yunkhngn.dev)
- GitHub: [https://github.com/yunkhngn](https://github.com/yunkhngn)
- Repository: [https://github.com/yunkhngn/tarot-reader](https://github.com/yunkhngn/tarot-reader)

## Acknowledgments

- All Tarot card descriptions and meanings
- Card images included in the project
- Google Gemini API for AI-powered analysis
- HeroUI for beautiful UI components

---

**Embrace the mystical and discover your path with Tarot Reader!**
