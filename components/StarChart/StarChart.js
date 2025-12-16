/**
 * StarChart Component
 * Beautiful natal chart with refined visuals
 */

import { useMemo, useRef, useImperativeHandle, forwardRef } from 'react';
import {
  ZODIAC_SIGNS,
  formatZodiacPosition,
  getZodiacSign,
  getSignDegree,
} from '../../utils/astronomy';

// Chart dimensions
const WIDTH = 1100;
const HEIGHT = 750;
const CHART_CENTER_X = 340;
const CHART_CENTER_Y = 375;
const OUTER_RADIUS = 280;
const ZODIAC_RING_WIDTH = 48;
const DEGREE_RING_WIDTH = 20;
const HOUSE_RING_WIDTH = 28;
const INNER_RADIUS = OUTER_RADIUS - ZODIAC_RING_WIDTH - DEGREE_RING_WIDTH - HOUSE_RING_WIDTH;
const PLANET_RADIUS = INNER_RADIUS - 45;

// Refined color palette
const COLORS = {
  background: '#fafbfc',
  accent: '#6b8cbe',
  accentLight: '#a8c4e8',
  accentDark: '#4a6a9a',
  gold: '#c9a227',
  text: '#2c3e50',
  textMuted: '#7f8c8d',
  white: '#ffffff',
  signBox: '#8b6bb5',
  signBoxLight: '#a888cf',
};

// Aspect colors
const ASPECT_COLORS = {
  conjunction: '#e74c3c',
  opposition: '#c0392b',
  trine: '#2980b9',
  square: '#8e44ad',
  sextile: '#27ae60',
};

// Element zodiac mapping
const SIGN_ELEMENTS = ['fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water'];

function calculateAspects(planets) {
  const aspects = [];
  const aspectTypes = [
    { name: 'conjunction', angle: 0, symbol: '☌', orb: 10 },
    { name: 'sextile', angle: 60, symbol: '⚹', orb: 6 },
    { name: 'square', angle: 90, symbol: '□', orb: 8 },
    { name: 'trine', angle: 120, symbol: '△', orb: 8 },
    { name: 'opposition', angle: 180, symbol: '☍', orb: 10 },
  ];
  
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = Math.abs(planets[i].longitude - planets[j].longitude);
      const normalizedDiff = diff > 180 ? 360 - diff : diff;
      
      for (const aspect of aspectTypes) {
        if (Math.abs(normalizedDiff - aspect.angle) <= aspect.orb) {
          aspects.push({
            planet1: planets[i],
            planet2: planets[j],
            type: aspect.name,
            symbol: aspect.symbol,
          });
          break;
        }
      }
    }
  }
  return aspects;
}

function radialLine(cx, cy, innerRadius, outerRadius, angle) {
  const angleRad = (angle * Math.PI) / 180;
  return {
    x1: cx + innerRadius * Math.cos(angleRad),
    y1: cy - innerRadius * Math.sin(angleRad),
    x2: cx + outerRadius * Math.cos(angleRad),
    y2: cy - outerRadius * Math.sin(angleRad),
  };
}

function getPointOnCircle(cx, cy, radius, angle) {
  const angleRad = (angle * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy - radius * Math.sin(angleRad),
  };
}

function formatDate(input) {
  const { year, month, day, hour, minute, utcOffset } = input;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[month - 1]} ${day}, ${year} • ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')} GMT${utcOffset >= 0 ? '+' : ''}${utcOffset}`;
}

const StarChart = forwardRef(function StarChart({ chartData }, ref) {
  const svgRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    getSVG: () => svgRef.current,
  }));
  
  const { asc, mc, houses, planets, input, latitude, longitude } = chartData;
  
  const aspects = useMemo(() => calculateAspects(planets), [planets]);
  
  const zodiacSegments = useMemo(() => {
    return ZODIAC_SIGNS.map((sign, i) => ({
      ...sign,
      startAngle: -(i * 30 - asc + 180),
      midAngle: -((i * 30 + 15) - asc + 180),
      element: SIGN_ELEMENTS[i],
    }));
  }, [asc]);
  
  const houseCuspLines = useMemo(() => {
    return houses.map((cusp, i) => ({
      houseNum: i + 1,
      cusp,
      angle: -(cusp - asc + 180),
    }));
  }, [houses, asc]);
  
  const planetPositions = useMemo(() => {
    return planets.map((planet) => {
      const angle = -(planet.longitude - asc + 180);
      const angleRad = (angle * Math.PI) / 180;
      
      return {
        ...planet,
        x: CHART_CENTER_X + PLANET_RADIUS * Math.cos(angleRad),
        y: CHART_CENTER_Y - PLANET_RADIUS * Math.sin(angleRad),
        angle,
        sign: getZodiacSign(planet.longitude),
        degree: Math.floor(getSignDegree(planet.longitude)),
        arcMinute: Math.floor((getSignDegree(planet.longitude) % 1) * 60),
      };
    });
  }, [planets, asc]);
  
  const mcAngle = -(mc - asc + 180);
  
  // Generate degree tick marks
  const degreeMarks = useMemo(() => {
    const marks = [];
    for (let i = 0; i < 360; i += 5) {
      const angle = -(i - asc + 180);
      const isMajor = i % 10 === 0;
      const innerR = OUTER_RADIUS - ZODIAC_RING_WIDTH - (isMajor ? DEGREE_RING_WIDTH : DEGREE_RING_WIDTH * 0.5);
      const outerR = OUTER_RADIUS - ZODIAC_RING_WIDTH;
      marks.push({ angle, isMajor, ...radialLine(CHART_CENTER_X, CHART_CENTER_Y, innerR, outerR, angle) });
    }
    return marks;
  }, [asc]);
  
  return (
    <svg
      ref={svgRef}
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        {/* Main gradient for zodiac ring */}
        <radialGradient id="zodiacRingGradient" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor={COLORS.accent} />
          <stop offset="100%" stopColor={COLORS.accentDark} />
        </radialGradient>
        
        {/* Inner ring gradient */}
        <radialGradient id="innerRingGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={COLORS.accentLight} />
          <stop offset="100%" stopColor={COLORS.accent} />
        </radialGradient>
        
        {/* Center gradient */}
        <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f8fafd" />
          <stop offset="100%" stopColor="#e8f0f8" />
        </radialGradient>
        
        {/* Sign box gradient */}
        <linearGradient id="signBoxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={COLORS.signBoxLight} />
          <stop offset="100%" stopColor={COLORS.signBox} />
        </linearGradient>
        
        {/* Drop shadow */}
        <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.15"/>
        </filter>
        
        {/* Glow effect for planets */}
        <filter id="planetGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width={WIDTH} height={HEIGHT} fill={COLORS.background} />
      
      {/* Decorative corner elements */}
      <g opacity="0.1">
        <circle cx="50" cy="50" r="30" fill="none" stroke={COLORS.accent} strokeWidth="1"/>
        <circle cx={WIDTH - 50} cy="50" r="30" fill="none" stroke={COLORS.accent} strokeWidth="1"/>
        <circle cx="50" cy={HEIGHT - 50} r="30" fill="none" stroke={COLORS.accent} strokeWidth="1"/>
        <circle cx={WIDTH - 50} cy={HEIGHT - 50} r="30" fill="none" stroke={COLORS.accent} strokeWidth="1"/>
      </g>
      
      {/* Header */}
      <g>
        <text x="40" y="45" fill={COLORS.text} fontSize="22" fontWeight="600" fontFamily="Georgia, serif">
          Natal Chart
        </text>
        <text x="40" y="70" fill={COLORS.textMuted} fontSize="13" fontFamily="Arial, sans-serif">
          {input.name || 'Birth Chart'} • Placidus House System
        </text>
        <text x="40" y="90" fill={COLORS.textMuted} fontSize="12" fontFamily="Arial, sans-serif">
          {formatDate(input)}
        </text>
        <text x="40" y="110" fill={COLORS.textMuted} fontSize="12" fontFamily="Arial, sans-serif">
          {input.location || `${Math.abs(input.latitude || latitude).toFixed(2)}°${(input.latitude || latitude) >= 0 ? 'N' : 'S'}, ${Math.abs(input.longitude || longitude).toFixed(2)}°${(input.longitude || longitude) >= 0 ? 'E' : 'W'}`}
        </text>
      </g>
      
      {/* Main Chart Circle */}
      <g filter="url(#dropShadow)">
        {/* Outer zodiac ring */}
        <circle
          cx={CHART_CENTER_X}
          cy={CHART_CENTER_Y}
          r={OUTER_RADIUS}
          fill="url(#zodiacRingGradient)"
          stroke={COLORS.accentDark}
          strokeWidth="2"
        />
        
        {/* Degree ring */}
        <circle
          cx={CHART_CENTER_X}
          cy={CHART_CENTER_Y}
          r={OUTER_RADIUS - ZODIAC_RING_WIDTH}
          fill={COLORS.accentLight}
          stroke={COLORS.accent}
          strokeWidth="1"
        />
        
        {/* House ring */}
        <circle
          cx={CHART_CENTER_X}
          cy={CHART_CENTER_Y}
          r={OUTER_RADIUS - ZODIAC_RING_WIDTH - DEGREE_RING_WIDTH}
          fill="url(#innerRingGradient)"
          stroke={COLORS.accent}
          strokeWidth="1"
        />
        
        {/* Inner house area */}
        <circle
          cx={CHART_CENTER_X}
          cy={CHART_CENTER_Y}
          r={INNER_RADIUS}
          fill="url(#centerGradient)"
          stroke={COLORS.accentLight}
          strokeWidth="1"
        />
      </g>
      
      {/* Degree tick marks */}
      {degreeMarks.map((mark, i) => (
        <line
          key={`tick-${i}`}
          x1={mark.x1} y1={mark.y1}
          x2={mark.x2} y2={mark.y2}
          stroke={mark.isMajor ? 'rgba(74, 106, 154, 0.6)' : 'rgba(74, 106, 154, 0.3)'}
          strokeWidth={mark.isMajor ? 1 : 0.5}
        />
      ))}
      
      {/* Zodiac signs - symbols with text presentation */}
      {zodiacSegments.map((sign, i) => {
        const pos = getPointOnCircle(CHART_CENTER_X, CHART_CENTER_Y, OUTER_RADIUS - ZODIAC_RING_WIDTH / 2, sign.midAngle);
        
        // Add variation selector U+FE0E to force text presentation
        const textSymbol = sign.symbol + '\uFE0E';
        
        return (
          <g key={sign.name}>
            {/* Sign divider line */}
            {(() => {
              const line = radialLine(
                CHART_CENTER_X, CHART_CENTER_Y,
                OUTER_RADIUS - ZODIAC_RING_WIDTH,
                OUTER_RADIUS,
                sign.startAngle
              );
              return (
                <line
                  x1={line.x1} y1={line.y1}
                  x2={line.x2} y2={line.y2}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                />
              );
            })()}
            
            {/* Sign symbol as text (not emoji) */}
            <text
              x={pos.x}
              y={pos.y + 1}
              fill={COLORS.white}
              fontSize="22"
              fontWeight="normal"
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="'Segoe UI Symbol', 'DejaVu Sans', Arial, sans-serif"
            >
              {textSymbol}
            </text>
          </g>
        );
      })}
      
      {/* House cusp lines */}
      {houseCuspLines.map((house) => {
        const isAngular = [1, 4, 7, 10].includes(house.houseNum);
        const line = radialLine(
          CHART_CENTER_X, CHART_CENTER_Y,
          isAngular ? 35 : INNER_RADIUS,
          OUTER_RADIUS - ZODIAC_RING_WIDTH - DEGREE_RING_WIDTH,
          house.angle
        );
        
        return (
          <line
            key={`house-${house.houseNum}`}
            x1={line.x1} y1={line.y1}
            x2={line.x2} y2={line.y2}
            stroke={isAngular ? COLORS.text : 'rgba(168, 196, 232, 0.6)'}
            strokeWidth={isAngular ? 1.5 : 0.75}
          />
        );
      })}
      
      {/* Aspect lines with better curves */}
      {aspects.map((aspect, i) => {
        const p1 = planetPositions.find(p => p.name === aspect.planet1.name);
        const p2 = planetPositions.find(p => p.name === aspect.planet2.name);
        if (!p1 || !p2) return null;
        
        return (
          <line
            key={`aspect-${i}`}
            x1={p1.x} y1={p1.y}
            x2={p2.x} y2={p2.y}
            stroke={ASPECT_COLORS[aspect.type]}
            strokeWidth="1.5"
            opacity="0.65"
            strokeLinecap="round"
          />
        );
      })}
      
      {/* Planets with glow effect */}
      {planetPositions.map((planet) => (
        <g key={planet.name} filter="url(#planetGlow)">
          <circle
            cx={planet.x}
            cy={planet.y}
            r="16"
            fill={COLORS.white}
            stroke={planet.color}
            strokeWidth="2.5"
          />
          <text
            x={planet.x}
            y={planet.y + 1}
            fill={planet.color}
            fontSize="16"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            fontFamily="Georgia, serif"
          >
            {planet.symbol}
          </text>
        </g>
      ))}
      
      {/* ASC label with decorative line */}
      <g>
        <line 
          x1={CHART_CENTER_X - OUTER_RADIUS - 5} 
          y1={CHART_CENTER_Y} 
          x2={CHART_CENTER_X - OUTER_RADIUS - 25} 
          y2={CHART_CENTER_Y}
          stroke={COLORS.text}
          strokeWidth="1"
        />
        <text
          x={CHART_CENTER_X - OUTER_RADIUS - 35}
          y={CHART_CENTER_Y + 5}
          fill={COLORS.text}
          fontSize="14"
          fontWeight="bold"
          textAnchor="end"
          fontFamily="Arial, sans-serif"
        >
          ASC
        </text>
      </g>
      
      {/* MC label with decorative line */}
      <g>
        {(() => {
          const mcPos = getPointOnCircle(CHART_CENTER_X, CHART_CENTER_Y, OUTER_RADIUS + 5, mcAngle);
          const mcLabelPos = getPointOnCircle(CHART_CENTER_X, CHART_CENTER_Y, OUTER_RADIUS + 35, mcAngle);
          return (
            <>
              <line 
                x1={mcPos.x} y1={mcPos.y}
                x2={mcLabelPos.x} y2={mcLabelPos.y}
                stroke={COLORS.text}
                strokeWidth="1"
              />
              <text
                x={mcLabelPos.x}
                y={mcLabelPos.y + 20}
                fill={COLORS.text}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                fontFamily="Arial, sans-serif"
              >
                MC
              </text>
            </>
          );
        })()}
      </g>
      
      {/* Right Panel - Planet Positions */}
      <g transform="translate(680, 60)">
        <text fill={COLORS.text} fontSize="16" fontWeight="600" fontFamily="Georgia, serif">
          Planet Positions
        </text>
        <line x1="0" y1="24" x2="180" y2="24" stroke={COLORS.accentLight} strokeWidth="2" />
        
        {planetPositions.map((planet, i) => (
          <g key={planet.name} transform={`translate(0, ${48 + i * 34})`}>
            <circle cx="12" cy="0" r="12" fill={COLORS.white} stroke={planet.color} strokeWidth="2" />
            <text x="12" y="1" fill={planet.color} fontSize="13" fontWeight="bold" textAnchor="middle" dominantBaseline="middle" fontFamily="Georgia, serif">
              {planet.symbol}
            </text>
            <text x="34" fill={COLORS.text} fontSize="13" fontFamily="Arial, sans-serif" dominantBaseline="middle">
              {planet.name}
            </text>
            <text x="110" fill={COLORS.text} fontSize="13" fontWeight="500" fontFamily="Arial, sans-serif" dominantBaseline="middle">
              {planet.degree}° {planet.sign.abbr} {String(planet.arcMinute).padStart(2, '0')}'
            </text>
          </g>
        ))}
        
        {/* ASC/MC */}
        <g transform={`translate(0, ${48 + planetPositions.length * 34 + 25})`}>
          <line x1="0" y1="-18" x2="200" y2="-18" stroke={COLORS.accentLight} strokeWidth="1" />
          <text fill={COLORS.gold} fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif">ASC</text>
          <text x="55" fill={COLORS.textMuted} fontSize="12" fontFamily="Arial, sans-serif">Ascendant</text>
          <text x="150" fill={COLORS.text} fontSize="13" fontFamily="Arial, sans-serif">{formatZodiacPosition(asc)}</text>
        </g>
        
        <g transform={`translate(0, ${48 + planetPositions.length * 34 + 55})`}>
          <text fill={COLORS.gold} fontSize="13" fontWeight="bold" fontFamily="Arial, sans-serif">MC</text>
          <text x="55" fill={COLORS.textMuted} fontSize="12" fontFamily="Arial, sans-serif">Midheaven</text>
          <text x="150" fill={COLORS.text} fontSize="13" fontFamily="Arial, sans-serif">{formatZodiacPosition(mc)}</text>
        </g>
      </g>
      
      {/* Aspect Legend */}
      <g transform="translate(900, 60)">
        <text fill={COLORS.text} fontSize="16" fontWeight="600" fontFamily="Georgia, serif">
          Aspects
        </text>
        <line x1="0" y1="24" x2="130" y2="24" stroke={COLORS.accentLight} strokeWidth="2" />
        
        {[
          { name: 'Conjunction', symbol: '☌', type: 'conjunction' },
          { name: 'Opposition', symbol: '☍', type: 'opposition' },
          { name: 'Trine', symbol: '△', type: 'trine' },
          { name: 'Square', symbol: '□', type: 'square' },
          { name: 'Sextile', symbol: '⚹', type: 'sextile' },
        ].map((asp, i) => (
          <g key={asp.type} transform={`translate(0, ${48 + i * 30})`}>
            <circle cx="10" cy="0" r="10" fill={COLORS.white} stroke={ASPECT_COLORS[asp.type]} strokeWidth="2" />
            <text x="10" y="1" fill={ASPECT_COLORS[asp.type]} fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
              {asp.symbol}
            </text>
            <text x="30" fill={COLORS.text} fontSize="12" fontFamily="Arial, sans-serif" dominantBaseline="middle">
              {asp.name}
            </text>
          </g>
        ))}
      </g>
      
      {/* Footer */}
      <g>
        <line x1="40" y1={HEIGHT - 35} x2={WIDTH - 40} y2={HEIGHT - 35} stroke={COLORS.accentLight} strokeWidth="1" opacity="0.5" />
        <text
          x={WIDTH / 2}
          y={HEIGHT - 15}
          fill={COLORS.textMuted}
          fontSize="11"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
        >
          Generated by tarot.yunkhngn.dev • Placidus House System
        </text>
      </g>
    </svg>
  );
});

export default StarChart;
