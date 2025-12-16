/**
 * Astro Analysis - Rule-based personality and career analysis
 * Pure JavaScript, no AI, deterministic output
 */

import { getZodiacSign } from './astronomy';

// ============================================================================
// CONSTANTS
// ============================================================================

/**
 * Zodiac signs grouped by element
 */
const ELEMENT_SIGNS = {
  fire: ['Aries', 'Leo', 'Sagittarius'],
  earth: ['Taurus', 'Virgo', 'Capricorn'],
  air: ['Gemini', 'Libra', 'Aquarius'],
  water: ['Cancer', 'Scorpio', 'Pisces'],
};

/**
 * Planet weights for element scoring
 */
const PLANET_WEIGHTS = {
  Sun: 3,
  Moon: 2,
  Ascendant: 2,
  Mercury: 1,
  Venus: 1,
  Mars: 1,
  Jupiter: 1,
  Saturn: 1,
};

/**
 * Trait descriptions by element (Vietnamese)
 */
const ELEMENT_TRAITS = {
  fire: {
    name: 'Hỏa',
    traits: ['chủ động', 'nhiệt huyết', 'tự tin', 'năng động'],
    description: 'năng lượng mạnh mẽ và tinh thần lãnh đạo',
  },
  earth: {
    name: 'Thổ',
    traits: ['thực tế', 'ổn định', 'kiên nhẫn', 'đáng tin cậy'],
    description: 'sự vững chãi và tư duy thực tiễn',
  },
  air: {
    name: 'Khí',
    traits: ['tư duy', 'giao tiếp', 'linh hoạt', 'sáng tạo'],
    description: 'khả năng giao tiếp và tư duy logic',
  },
  water: {
    name: 'Thủy',
    traits: ['cảm xúc', 'trực giác', 'đồng cảm', 'nhạy bén'],
    description: 'trực giác sâu sắc và sự thấu hiểu',
  },
};

/**
 * Career fields by MC element (Vietnamese)
 */
const CAREER_BY_ELEMENT = {
  fire: ['lãnh đạo', 'kinh doanh', 'thể thao', 'giải trí', 'khởi nghiệp'],
  earth: ['kỹ thuật', 'tài chính', 'quản lý', 'bất động sản', 'nông nghiệp'],
  air: ['công nghệ', 'giáo dục', 'truyền thông', 'marketing', 'ngoại giao'],
  water: ['y tế', 'tâm lý', 'nghệ thuật', 'chăm sóc', 'nghiên cứu'],
};

/**
 * Career emphasis by strong planets
 */
const CAREER_BY_PLANET = {
  Mercury: {
    fields: ['lập trình', 'phân tích', 'viết', 'dịch thuật'],
    weight: 2,
  },
  Saturn: {
    fields: ['quản lý', 'kỹ thuật', 'luật', 'hành chính'],
    weight: 2,
  },
  Mars: {
    fields: ['kỹ thuật', 'thể thao', 'quân sự', 'cơ khí'],
    weight: 2,
  },
  Jupiter: {
    fields: ['giáo dục', 'tư vấn', 'tôn giáo', 'xuất bản'],
    weight: 2,
  },
  Venus: {
    fields: ['nghệ thuật', 'thời trang', 'thiết kế', 'ngoại giao'],
    weight: 1,
  },
  Sun: {
    fields: ['lãnh đạo', 'giải trí', 'chính trị'],
    weight: 1,
  },
  Moon: {
    fields: ['chăm sóc', 'ẩm thực', 'bán lẻ'],
    weight: 1,
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get element for a zodiac sign
 * @param {string} signName - Name of the zodiac sign
 * @returns {string} Element name (fire, earth, air, water)
 */
function getElement(signName) {
  for (const [element, signs] of Object.entries(ELEMENT_SIGNS)) {
    if (signs.includes(signName)) {
      return element;
    }
  }
  return 'fire'; // Default fallback
}

/**
 * Get element from longitude
 * @param {number} longitude - Ecliptic longitude in degrees
 * @returns {string} Element name
 */
function getElementFromLongitude(longitude) {
  const sign = getZodiacSign(longitude);
  return getElement(sign.name);
}

/**
 * Determine which house a planet is in based on house cusps
 * @param {number} planetLong - Planet longitude
 * @param {number[]} houses - Array of 12 house cusp longitudes
 * @returns {number} House number (1-12)
 */
function getHouseForPlanet(planetLong, houses) {
  for (let i = 0; i < 12; i++) {
    const nextHouse = (i + 1) % 12;
    let start = houses[i];
    let end = houses[nextHouse];
    
    // Handle wrap-around at 360°
    if (end < start) {
      if (planetLong >= start || planetLong < end) {
        return i + 1;
      }
    } else {
      if (planetLong >= start && planetLong < end) {
        return i + 1;
      }
    }
  }
  return 1; // Default to 1st house
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

/**
 * Analyze chart data and return personality and career insights
 * @param {Object} chart - Chart data from calculateChart()
 * @returns {Object} Analysis results
 */
export function analyzeChart(chart) {
  const { asc, mc, houses, planets } = chart;
  
  // ========== PERSONALITY ANALYSIS ==========
  
  // Calculate element scores
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  
  // Score Ascendant
  const ascElement = getElementFromLongitude(asc);
  elements[ascElement] += PLANET_WEIGHTS.Ascendant;
  
  // Score planets
  for (const planet of planets) {
    const element = getElementFromLongitude(planet.longitude);
    const weight = PLANET_WEIGHTS[planet.name] || 1;
    elements[element] += weight;
  }
  
  // Sort elements by score
  const sortedElements = Object.entries(elements)
    .sort((a, b) => b[1] - a[1]);
  
  // Get top 2 elements
  const topElements = sortedElements.slice(0, 2);
  const dominantElement = topElements[0][0];
  const secondaryElement = topElements[1][0];
  
  // Collect traits from top elements
  const traits = [
    ...ELEMENT_TRAITS[dominantElement].traits.slice(0, 2),
    ...ELEMENT_TRAITS[secondaryElement].traits.slice(0, 2),
  ];
  
  // Generate personality summary
  const personalitySummary = `Bản đồ sao cho thấy bạn nổi bật về ${ELEMENT_TRAITS[dominantElement].description} và ${ELEMENT_TRAITS[secondaryElement].description}. Nguyên tố ${ELEMENT_TRAITS[dominantElement].name} chiếm ưu thế, thể hiện xu hướng ${ELEMENT_TRAITS[dominantElement].traits.slice(0, 2).join(' và ')} trong tính cách của bạn.`;
  
  // ========== CAREER ANALYSIS ==========
  
  // Career scoring map
  const careerScores = {};
  
  // Score from MC element (+3)
  const mcElement = getElementFromLongitude(mc);
  for (const field of CAREER_BY_ELEMENT[mcElement]) {
    careerScores[field] = (careerScores[field] || 0) + 3;
  }
  
  // Score from planets in 10th house (+2)
  for (const planet of planets) {
    const house = getHouseForPlanet(planet.longitude, houses);
    if (house === 10) {
      const planetCareer = CAREER_BY_PLANET[planet.name];
      if (planetCareer) {
        for (const field of planetCareer.fields) {
          careerScores[field] = (careerScores[field] || 0) + 2;
        }
      }
    }
  }
  
  // Score from strong planets (Mercury, Saturn, Mars, Jupiter) in angular houses
  const angularHouses = [1, 4, 7, 10];
  for (const planet of planets) {
    const house = getHouseForPlanet(planet.longitude, houses);
    if (angularHouses.includes(house) && CAREER_BY_PLANET[planet.name]) {
      const planetCareer = CAREER_BY_PLANET[planet.name];
      for (const field of planetCareer.fields) {
        careerScores[field] = (careerScores[field] || 0) + planetCareer.weight;
      }
    }
  }
  
  // Sort and get top career fields
  const sortedCareers = Object.entries(careerScores)
    .sort((a, b) => b[1] - a[1]);
  
  const topCareers = sortedCareers.slice(0, 5).map(([field]) => field);
  
  // Generate career summary
  const careerSummary = `Biểu đồ cho thấy xu hướng nghề nghiệp phù hợp với các lĩnh vực như ${topCareers.slice(0, 3).join(', ')}. Với MC ở cung ${ELEMENT_TRAITS[mcElement].name}, bạn có thể phát triển tốt trong các công việc đòi hỏi ${ELEMENT_TRAITS[mcElement].traits.slice(0, 2).join(' và ')}.`;
  
  // ========== RETURN RESULT ==========
  
  return {
    personality: {
      elements: {
        fire: elements.fire,
        earth: elements.earth,
        air: elements.air,
        water: elements.water,
      },
      dominantElement: {
        name: dominantElement,
        label: ELEMENT_TRAITS[dominantElement].name,
        score: elements[dominantElement],
      },
      secondaryElement: {
        name: secondaryElement,
        label: ELEMENT_TRAITS[secondaryElement].name,
        score: elements[secondaryElement],
      },
      traits,
      summary: personalitySummary,
    },
    career: {
      mcElement: {
        name: mcElement,
        label: ELEMENT_TRAITS[mcElement].name,
      },
      fields: topCareers,
      scores: Object.fromEntries(sortedCareers.slice(0, 5)),
      summary: careerSummary,
    },
  };
}

/**
 * Get disclaimer text (Vietnamese)
 * @returns {string} Disclaimer content
 */
export function getDisclaimer() {
  return 'Phân tích này được xây dựng từ hệ thống quy tắc dựa trên dữ liệu hình học của bản đồ sao. Không sử dụng AI và không mang tính dự đoán. Kết quả chỉ mang tính tham khảo.';
}
