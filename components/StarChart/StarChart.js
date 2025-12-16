/**
 * StarChart Component
 * SVG-based star chart renderer with zodiac wheel, house cusps, and planets
 * White background version with birth info
 */

import { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  ZODIAC_SIGNS,
  normalizeAngle,
  formatZodiacPosition,
} from '../../utils/astronomy';

// Chart dimensions
const SIZE = 700;
const CENTER = SIZE / 2;
const OUTER_RADIUS = 280;
const ZODIAC_RING_WIDTH = 40;
const HOUSE_RING_WIDTH = 30;
const INNER_RADIUS = OUTER_RADIUS - ZODIAC_RING_WIDTH - HOUSE_RING_WIDTH;
const PLANET_RADIUS = INNER_RADIUS - 35;
const INFO_AREA_TOP = 30;

// Colors - Light theme for better print/download
const COLORS = {
  background: '#ffffff',
  zodiacRing: '#f5f5f0',
  zodiacBorder: '#8b7355',
  houseRing: '#fafafa',
  houseBorder: '#c4a87c',
  text: '#333333',
  textLight: '#666666',
  gold: '#8b6914',
  goldDark: '#6b5210',
  ascMc: '#8b6914',
  cusps: 'rgba(100, 80, 60, 0.4)',
  centerFill: '#8b6914',
};

// Zodiac sign colors (fire, earth, air, water) - adjusted for white bg
const ELEMENT_COLORS = {
  fire: '#c0392b',    // Aries, Leo, Sagittarius
  earth: '#1e8449',   // Taurus, Virgo, Capricorn
  air: '#2471a3',     // Gemini, Libra, Aquarius
  water: '#7d3c98',   // Cancer, Scorpio, Pisces
};

const SIGN_ELEMENTS = [
  'fire', 'earth', 'air', 'water',
  'fire', 'earth', 'air', 'water',
  'fire', 'earth', 'air', 'water',
];

/**
 * Draw a line from center outward at given angle
 */
function radialLine(cx, cy, innerRadius, outerRadius, angle) {
  const angleRad = (angle * Math.PI) / 180;
  return {
    x1: cx + innerRadius * Math.cos(angleRad),
    y1: cy - innerRadius * Math.sin(angleRad),
    x2: cx + outerRadius * Math.cos(angleRad),
    y2: cy - outerRadius * Math.sin(angleRad),
  };
}

/**
 * Get position for text along the zodiac ring
 */
function getZodiacTextPosition(signIndex, asc) {
  const signMiddle = signIndex * 30 + 15;
  const angle = signMiddle - asc + 180;
  const radius = OUTER_RADIUS - ZODIAC_RING_WIDTH / 2;
  const angleRad = (angle * Math.PI) / 180;
  
  return {
    x: CENTER + radius * Math.cos(angleRad),
    y: CENTER - radius * Math.sin(angleRad),
    rotation: -angle + 90,
  };
}

/**
 * Format date for display
 */
function formatDateTime(input) {
  const { year, month, day, hour, minute, utcOffset } = input;
  const dateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
  const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  const tzStr = `UTC${utcOffset >= 0 ? '+' : ''}${utcOffset}`;
  return { dateStr, timeStr, tzStr };
}

/**
 * Format coordinates for display
 */
function formatCoords(input) {
  const { latitude, longitude } = input;
  const latDir = latitude >= 0 ? 'N' : 'S';
  const lonDir = longitude >= 0 ? 'E' : 'W';
  return `${Math.abs(latitude).toFixed(4)}°${latDir}, ${Math.abs(longitude).toFixed(4)}°${lonDir}`;
}

const StarChart = forwardRef(function StarChart({ chartData }, ref) {
  const svgRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    getSVG: () => svgRef.current,
  }));
  
  const { asc, mc, houses, planets, input } = chartData;
  const { dateStr, timeStr, tzStr } = formatDateTime(input);
  const coordsStr = formatCoords(input);
  
  // Calculate zodiac sign positions (accounting for ASC rotation)
  const zodiacSegments = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, i) => {
      const startLong = i * 30;
      const endLong = (i + 1) * 30;
      const startAngle = -(startLong - asc + 180);
      const endAngle = -(endLong - asc + 180);
      
      return {
        ...sign,
        startAngle,
        endAngle,
        element: SIGN_ELEMENTS[i],
      };
    });
  }, [asc]);
  
  // Calculate house cusp lines
  const houseCuspLines = useMemo(() => {
    return houses.map((cusp, i) => {
      const angle = -(cusp - asc + 180);
      return {
        houseNum: i + 1,
        cusp,
        angle,
        ...radialLine(CENTER, CENTER, INNER_RADIUS - 10, OUTER_RADIUS - ZODIAC_RING_WIDTH, angle),
      };
    });
  }, [houses, asc]);
  
  const mcAngle = -(mc - asc + 180);
  
  // Calculate planet positions
  const planetPositions = useMemo(() => {
    return planets.map((planet) => {
      const angle = -(planet.longitude - asc + 180);
      const angleRad = (angle * Math.PI) / 180;
      
      return {
        ...planet,
        x: CENTER + PLANET_RADIUS * Math.cos(angleRad),
        y: CENTER - PLANET_RADIUS * Math.sin(angleRad),
        angle,
      };
    });
  }, [planets, asc]);
  
  return (
    <svg
      ref={svgRef}
      width={SIZE}
      height={SIZE}
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      {/* White Background */}
      <rect x="0" y="0" width={SIZE} height={SIZE} fill={COLORS.background} />
      
      {/* Title & Birth Info at top */}
      <text
        x={CENTER}
        y={INFO_AREA_TOP}
        fill={COLORS.gold}
        fontSize="18"
        fontWeight="bold"
        textAnchor="middle"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        NATAL CHART
      </text>
      <text
        x={CENTER}
        y={INFO_AREA_TOP + 22}
        fill={COLORS.text}
        fontSize="13"
        textAnchor="middle"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {dateStr} - {timeStr} ({tzStr})
      </text>
      <text
        x={CENTER}
        y={INFO_AREA_TOP + 40}
        fill={COLORS.textLight}
        fontSize="11"
        textAnchor="middle"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        {coordsStr}
      </text>
      
      {/* Outer circle border */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={OUTER_RADIUS}
        fill="none"
        stroke={COLORS.zodiacBorder}
        strokeWidth="2"
      />
      
      {/* Zodiac ring background */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={OUTER_RADIUS}
        fill={COLORS.zodiacRing}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r={OUTER_RADIUS - ZODIAC_RING_WIDTH}
        fill={COLORS.houseRing}
      />
      
      {/* Zodiac sign divisions */}
      {zodiacSegments.map((sign, i) => {
        const line = radialLine(
          CENTER,
          CENTER,
          OUTER_RADIUS - ZODIAC_RING_WIDTH,
          OUTER_RADIUS,
          sign.startAngle
        );
        
        const textPos = getZodiacTextPosition(i, asc);
        
        return (
          <g key={sign.name}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={COLORS.zodiacBorder}
              strokeWidth="1"
            />
            <text
              x={textPos.x}
              y={textPos.y}
              fill={ELEMENT_COLORS[sign.element]}
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {sign.symbol}
            </text>
          </g>
        );
      })}
      
      {/* House ring inner border */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r={INNER_RADIUS}
        fill={COLORS.background}
        stroke={COLORS.houseBorder}
        strokeWidth="1"
      />
      
      {/* House cusp lines */}
      {houseCuspLines.map((house) => {
        const isCardinal = [1, 4, 7, 10].includes(house.houseNum);
        const innerR = isCardinal ? INNER_RADIUS - 20 : INNER_RADIUS;
        const line = radialLine(
          CENTER,
          CENTER,
          innerR,
          OUTER_RADIUS - ZODIAC_RING_WIDTH,
          house.angle
        );
        
        const numAngleRad = (house.angle * Math.PI) / 180;
        const numRadius = INNER_RADIUS + (OUTER_RADIUS - ZODIAC_RING_WIDTH - INNER_RADIUS) / 2;
        
        const nextHouse = houseCuspLines[(house.houseNum) % 12];
        const midAngle = (house.angle + nextHouse.angle) / 2;
        const midAngleRad = (midAngle * Math.PI) / 180;
        
        return (
          <g key={`house-${house.houseNum}`}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={isCardinal ? COLORS.gold : COLORS.cusps}
              strokeWidth={isCardinal ? 2 : 1}
            />
            <text
              x={CENTER + numRadius * Math.cos(midAngleRad)}
              y={CENTER - numRadius * Math.sin(midAngleRad)}
              fill={COLORS.textLight}
              fontSize="11"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {house.houseNum}
            </text>
          </g>
        );
      })}
      
      {/* ASC marker */}
      <g>
        <line
          x1={CENTER - OUTER_RADIUS + 10}
          y1={CENTER}
          x2={CENTER - INNER_RADIUS + 20}
          y2={CENTER}
          stroke={COLORS.ascMc}
          strokeWidth="3"
        />
        <text
          x={CENTER - OUTER_RADIUS - 8}
          y={CENTER - 8}
          fill={COLORS.gold}
          fontSize="12"
          fontWeight="bold"
          textAnchor="end"
          dominantBaseline="middle"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ASC
        </text>
        <text
          x={CENTER - OUTER_RADIUS - 8}
          y={CENTER + 8}
          fill={COLORS.textLight}
          fontSize="10"
          textAnchor="end"
          dominantBaseline="middle"
        >
          {formatZodiacPosition(asc)}
        </text>
      </g>
      
      {/* MC marker */}
      <g>
        {(() => {
          const mcLine = radialLine(CENTER, CENTER, INNER_RADIUS - 20, OUTER_RADIUS + 10, mcAngle);
          const mcLabelAngleRad = (mcAngle * Math.PI) / 180;
          const mcLabelRadius = OUTER_RADIUS + 25;
          
          return (
            <>
              <line
                x1={mcLine.x1}
                y1={mcLine.y1}
                x2={mcLine.x2}
                y2={mcLine.y2}
                stroke={COLORS.ascMc}
                strokeWidth="3"
              />
              <text
                x={CENTER + mcLabelRadius * Math.cos(mcLabelAngleRad)}
                y={CENTER - mcLabelRadius * Math.sin(mcLabelAngleRad)}
                fill={COLORS.gold}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                MC
              </text>
              <text
                x={CENTER + (mcLabelRadius + 14) * Math.cos(mcLabelAngleRad)}
                y={CENTER - (mcLabelRadius + 14) * Math.sin(mcLabelAngleRad)}
                fill={COLORS.textLight}
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {formatZodiacPosition(mc)}
              </text>
            </>
          );
        })()}
      </g>
      
      {/* Planets */}
      {planetPositions.map((planet) => (
        <g key={planet.name}>
          <circle
            cx={planet.x}
            cy={planet.y}
            r="15"
            fill={COLORS.background}
            stroke={planet.color}
            strokeWidth="1.5"
          />
          <text
            x={planet.x}
            y={planet.y}
            fill={planet.color}
            fontSize="16"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {planet.symbol}
          </text>
          
          {(() => {
            const angleRad = (planet.angle * Math.PI) / 180;
            const edgeRadius = OUTER_RADIUS - ZODIAC_RING_WIDTH - 2;
            return (
              <line
                x1={planet.x + 15 * Math.cos(angleRad)}
                y1={planet.y - 15 * Math.sin(angleRad)}
                x2={CENTER + edgeRadius * Math.cos(angleRad)}
                y2={CENTER - edgeRadius * Math.sin(angleRad)}
                stroke={planet.color}
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
            );
          })()}
        </g>
      ))}
      
      {/* Center point (Earth) */}
      <circle
        cx={CENTER}
        cy={CENTER}
        r="8"
        fill={COLORS.centerFill}
      />
      <circle
        cx={CENTER}
        cy={CENTER}
        r="3"
        fill={COLORS.background}
      />
      
      {/* Bottom info - ASC/MC summary */}
      <text
        x={CENTER}
        y={SIZE - 35}
        fill={COLORS.textLight}
        fontSize="10"
        textAnchor="middle"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        ASC: {formatZodiacPosition(asc)} | MC: {formatZodiacPosition(mc)}
      </text>
      <text
        x={CENTER}
        y={SIZE - 18}
        fill={COLORS.textLight}
        fontSize="9"
        textAnchor="middle"
        opacity="0.7"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        Placidus House System | tarot.yunkhngn.dev
      </text>
    </svg>
  );
});

export default StarChart;
