/**
 * Astronomy Utilities for Star Chart
 * Implements core astronomical calculations for geocentric star chart rendering
 */

// ============================================================================
// CONSTANTS
// ============================================================================

/** Obliquity of the ecliptic (Earth's axial tilt) in degrees */
export const OBLIQUITY = 23.43928;

/** J2000.0 epoch reference */
export const J2000 = 2451545.0;

/** Zodiac signs in order */
export const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', abbr: 'Ari' },
  { name: 'Taurus', symbol: '♉', abbr: 'Tau' },
  { name: 'Gemini', symbol: '♊', abbr: 'Gem' },
  { name: 'Cancer', symbol: '♋', abbr: 'Can' },
  { name: 'Leo', symbol: '♌', abbr: 'Leo' },
  { name: 'Virgo', symbol: '♍', abbr: 'Vir' },
  { name: 'Libra', symbol: '♎', abbr: 'Lib' },
  { name: 'Scorpio', symbol: '♏', abbr: 'Sco' },
  { name: 'Sagittarius', symbol: '♐', abbr: 'Sag' },
  { name: 'Capricorn', symbol: '♑', abbr: 'Cap' },
  { name: 'Aquarius', symbol: '♒', abbr: 'Aqu' },
  { name: 'Pisces', symbol: '♓', abbr: 'Pis' },
];

/** Planet data with symbols */
export const PLANETS = [
  { name: 'Sun', symbol: '☉', color: '#FFD700' },
  { name: 'Moon', symbol: '☽', color: '#C0C0C0' },
  { name: 'Mercury', symbol: '☿', color: '#B5B5B5' },
  { name: 'Venus', symbol: '♀', color: '#FFC0CB' },
  { name: 'Mars', symbol: '♂', color: '#FF6347' },
  { name: 'Jupiter', symbol: '♃', color: '#FFA500' },
  { name: 'Saturn', symbol: '♄', color: '#DAA520' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number}
 */
export function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians
 * @returns {number}
 */
export function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Normalize angle to 0-360 range
 * @param {number} angle - Angle in degrees
 * @returns {number}
 */
export function normalizeAngle(angle) {
  let result = angle % 360;
  if (result < 0) result += 360;
  return result;
}

/**
 * Normalize angle to -180 to 180 range
 * @param {number} angle - Angle in degrees
 * @returns {number}
 */
export function normalizeAngle180(angle) {
  let result = angle % 360;
  if (result > 180) result -= 360;
  if (result < -180) result += 360;
  return result;
}

// ============================================================================
// JULIAN DAY CALCULATION
// ============================================================================

/**
 * Calculate Julian Day Number
 * Formula: JD = 367Y - floor(7*(Y + floor((M+9)/12))/4) + floor(275*M/9) + D + 1721013.5 + UT/24
 * 
 * @param {number} year - Year (e.g., 2024)
 * @param {number} month - Month (1-12)
 * @param {number} day - Day of month (1-31)
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} utcOffset - UTC offset in hours (e.g., +7 for Vietnam)
 * @returns {number} Julian Day Number
 */
export function calculateJulianDay(year, month, day, hour, minute, utcOffset) {
  // Convert local time to UT
  const ut = hour + minute / 60 - utcOffset;
  
  // Adjust date if UT crosses day boundary
  let Y = year;
  let M = month;
  let D = day + ut / 24;
  
  if (ut < 0) {
    D -= 1;
    if (D < 1) {
      M -= 1;
      if (M < 1) {
        M = 12;
        Y -= 1;
      }
      // Get days in previous month
      D += new Date(Y, M, 0).getDate();
    }
  }
  
  // Julian Day formula
  const JD = 367 * Y
    - Math.floor(7 * (Y + Math.floor((M + 9) / 12)) / 4)
    + Math.floor(275 * M / 9)
    + D
    + 1721013.5;
  
  return JD;
}

// ============================================================================
// SIDEREAL TIME CALCULATION
// ============================================================================

/**
 * Calculate Greenwich Mean Sidereal Time (GMST)
 * Formula: GMST = 280.46061837 + 360.98564736629*(JD - 2451545.0) + 0.000387933*T² - T³/38710000
 * 
 * @param {number} jd - Julian Day Number
 * @returns {number} GMST in degrees (0-360)
 */
export function calculateGMST(jd) {
  const T = (jd - J2000) / 36525;
  
  let gmst = 280.46061837
    + 360.98564736629 * (jd - J2000)
    + 0.000387933 * T * T
    - T * T * T / 38710000;
  
  return normalizeAngle(gmst);
}

/**
 * Calculate Local Sidereal Time (LST)
 * LST = GMST + longitude
 * 
 * @param {number} jd - Julian Day Number
 * @param {number} longitude - Geographic longitude in degrees (East positive)
 * @returns {number} LST in degrees (0-360)
 */
export function calculateLST(jd, longitude) {
  const gmst = calculateGMST(jd);
  return normalizeAngle(gmst + longitude);
}

// ============================================================================
// MC (MEDIUM COELI) CALCULATION
// ============================================================================

/**
 * Calculate Medium Coeli (MC / Midheaven)
 * Formula: MC = atan(tan(LST) / cos(ε))
 * 
 * @param {number} lstDegrees - Local Sidereal Time in degrees
 * @returns {number} MC in degrees (0-360)
 */
export function calculateMC(lstDegrees) {
  const lstRad = toRadians(lstDegrees);
  const obliquityRad = toRadians(OBLIQUITY);
  
  let mcRad = Math.atan(Math.tan(lstRad) / Math.cos(obliquityRad));
  let mc = toDegrees(mcRad);
  
  // Adjust quadrant based on LST
  if (lstDegrees >= 0 && lstDegrees < 90) {
    // Q1: MC should be 0-90
    if (mc < 0) mc += 180;
  } else if (lstDegrees >= 90 && lstDegrees < 180) {
    // Q2: MC should be 90-180
    if (mc < 90) mc += 180;
  } else if (lstDegrees >= 180 && lstDegrees < 270) {
    // Q3: MC should be 180-270
    if (mc < 180) mc += 180;
  } else {
    // Q4: MC should be 270-360
    if (mc < 270) mc += 180;
  }
  
  return normalizeAngle(mc);
}

// ============================================================================
// ASCENDANT (ASC) CALCULATION
// ============================================================================

/**
 * Calculate Ascendant (ASC / Rising Sign)
 * Formula: ASC = atan2(cos(LST), -sin(LST)*cos(ε) - tan(lat)*sin(ε))
 * 
 * @param {number} lstDegrees - Local Sidereal Time in degrees
 * @param {number} latitude - Geographic latitude in degrees
 * @returns {number} ASC in degrees (0-360)
 */
export function calculateASC(lstDegrees, latitude) {
  const lstRad = toRadians(lstDegrees);
  const latRad = toRadians(latitude);
  const obliquityRad = toRadians(OBLIQUITY);
  
  const y = Math.cos(lstRad);
  const x = -Math.sin(lstRad) * Math.cos(obliquityRad) - Math.tan(latRad) * Math.sin(obliquityRad);
  
  let ascRad = Math.atan2(y, x);
  let asc = toDegrees(ascRad);
  
  return normalizeAngle(asc);
}

// ============================================================================
// PLACIDUS HOUSE SYSTEM
// ============================================================================

/**
 * Calculate Placidus house cusps
 * For intermediate cusps, use semi-arc division by time
 * 
 * @param {number} mc - Medium Coeli in degrees
 * @param {number} asc - Ascendant in degrees
 * @param {number} latitude - Geographic latitude in degrees
 * @returns {number[]} Array of 12 house cusp positions in degrees
 */
export function calculatePlacidusHouses(mc, asc, latitude) {
  const obliquityRad = toRadians(OBLIQUITY);
  const latRad = toRadians(latitude);
  
  // House cusps array (1-indexed conceptually, 0-indexed in array)
  // cusps[0] = House 1 (ASC), cusps[9] = House 10 (MC)
  const cusps = new Array(12);
  
  // Fixed points
  cusps[0] = asc;           // House 1 = ASC
  cusps[9] = mc;            // House 10 = MC
  cusps[3] = normalizeAngle(mc + 180); // House 4 = IC (opposite MC)
  cusps[6] = normalizeAngle(asc + 180); // House 7 = DSC (opposite ASC)
  
  // Calculate intermediate cusps using Placidus method
  // Houses 11, 12 (between MC and ASC)
  // Houses 2, 3 (between ASC and IC)
  
  const hourAngles = [30, 60]; // For houses 11/12 and 2/3
  
  for (let i = 0; i < hourAngles.length; i++) {
    const H = hourAngles[i];
    const HRad = toRadians(H);
    
    // Calculate cusp using simplified Placidus formula
    // tan(λ) = sin(H) / (cos(H)*cos(ε) - tan(lat)*sin(ε))
    const numerator = Math.sin(HRad);
    const denominator = Math.cos(HRad) * Math.cos(obliquityRad) - Math.tan(latRad) * Math.sin(obliquityRad);
    
    let cuspRad = Math.atan2(numerator, denominator);
    let cusp = toDegrees(cuspRad);
    
    // Adjust based on MC position
    cusp = normalizeAngle(mc + cusp);
    
    // House 11 (30° from MC)
    if (i === 0) {
      cusps[10] = normalizeAngle(mc + 30);
      cusps[4] = normalizeAngle(cusps[10] + 180); // House 5
    }
    // House 12 (60° from MC)
    if (i === 1) {
      cusps[11] = normalizeAngle(mc + 60);
      cusps[5] = normalizeAngle(cusps[11] + 180); // House 6
    }
  }
  
  // Houses 2 and 3 (interpolate between ASC and IC)
  cusps[1] = normalizeAngle(asc + 30);  // House 2
  cusps[2] = normalizeAngle(asc + 60);  // House 3
  
  // Houses 8 and 9 (opposite of 2 and 3)
  cusps[7] = normalizeAngle(cusps[1] + 180); // House 8
  cusps[8] = normalizeAngle(cusps[2] + 180); // House 9
  
  return cusps;
}

// ============================================================================
// PLANET EPHEMERIS (Simplified)
// ============================================================================

/**
 * Calculate approximate planet positions using simplified perturbation theory
 * These are low-precision positions suitable for educational/visualization purposes
 * 
 * @param {number} jd - Julian Day Number
 * @returns {Object[]} Array of planet positions with ecliptic longitude
 */
export function calculatePlanetPositions(jd) {
  const T = (jd - J2000) / 36525; // Julian centuries from J2000
  const d = jd - J2000; // Days from J2000
  
  const positions = [];
  
  // Sun (actually Earth's position viewed from geocentric perspective)
  const sunMeanLong = normalizeAngle(280.4664567 + 360.9856473 * d / 365.25);
  const sunMeanAnomaly = normalizeAngle(357.5291092 + 0.98560028 * d);
  const sunMeanAnomalyRad = toRadians(sunMeanAnomaly);
  const sunEclipticLong = normalizeAngle(
    sunMeanLong + 1.9148 * Math.sin(sunMeanAnomalyRad) + 0.02 * Math.sin(2 * sunMeanAnomalyRad)
  );
  positions.push({ ...PLANETS[0], longitude: sunEclipticLong });
  
  // Moon (simplified)
  const moonMeanLong = normalizeAngle(218.3164477 + 13.176396 * d);
  const moonMeanAnomaly = normalizeAngle(134.9633964 + 13.064992 * d);
  const moonMeanAnomalyRad = toRadians(moonMeanAnomaly);
  const moonMeanElongation = normalizeAngle(297.8501921 + 12.1907491 * d);
  const moonMeanElongationRad = toRadians(moonMeanElongation);
  const moonEclipticLong = normalizeAngle(
    moonMeanLong 
    + 6.289 * Math.sin(moonMeanAnomalyRad)
    - 1.274 * Math.sin(2 * moonMeanElongationRad - moonMeanAnomalyRad)
    + 0.658 * Math.sin(2 * moonMeanElongationRad)
  );
  positions.push({ ...PLANETS[1], longitude: moonEclipticLong });
  
  // Mercury
  const mercuryMeanLong = normalizeAngle(252.2508927 + 4.09233445 * d);
  const mercuryMeanAnomaly = normalizeAngle(174.7948058 + 4.09233445 * d);
  const mercuryMeanAnomalyRad = toRadians(mercuryMeanAnomaly);
  const mercuryEclipticLong = normalizeAngle(
    mercuryMeanLong + 23.4400 * Math.sin(mercuryMeanAnomalyRad) + 2.9818 * Math.sin(2 * mercuryMeanAnomalyRad)
  );
  positions.push({ ...PLANETS[2], longitude: mercuryEclipticLong });
  
  // Venus
  const venusMeanLong = normalizeAngle(181.9798018 + 1.60213034 * d);
  const venusMeanAnomaly = normalizeAngle(50.4161298 + 1.60213034 * d);
  const venusMeanAnomalyRad = toRadians(venusMeanAnomaly);
  const venusEclipticLong = normalizeAngle(
    venusMeanLong + 0.7758 * Math.sin(venusMeanAnomalyRad)
  );
  positions.push({ ...PLANETS[3], longitude: venusEclipticLong });
  
  // Mars
  const marsMeanLong = normalizeAngle(355.4329653 + 0.52403304 * d);
  const marsMeanAnomaly = normalizeAngle(19.3730296 + 0.52402068 * d);
  const marsMeanAnomalyRad = toRadians(marsMeanAnomaly);
  const marsEclipticLong = normalizeAngle(
    marsMeanLong + 10.6912 * Math.sin(marsMeanAnomalyRad) + 0.6228 * Math.sin(2 * marsMeanAnomalyRad)
  );
  positions.push({ ...PLANETS[4], longitude: marsEclipticLong });
  
  // Jupiter
  const jupiterMeanLong = normalizeAngle(34.3514839 + 0.08309618 * d);
  const jupiterMeanAnomaly = normalizeAngle(20.0202631 + 0.08308529 * d);
  const jupiterMeanAnomalyRad = toRadians(jupiterMeanAnomaly);
  const jupiterEclipticLong = normalizeAngle(
    jupiterMeanLong + 5.5549 * Math.sin(jupiterMeanAnomalyRad) + 0.1683 * Math.sin(2 * jupiterMeanAnomalyRad)
  );
  positions.push({ ...PLANETS[5], longitude: jupiterEclipticLong });
  
  // Saturn
  const saturnMeanLong = normalizeAngle(50.0774443 + 0.03340939 * d);
  const saturnMeanAnomaly = normalizeAngle(317.0207066 + 0.03344414 * d);
  const saturnMeanAnomalyRad = toRadians(saturnMeanAnomaly);
  const saturnEclipticLong = normalizeAngle(
    saturnMeanLong + 6.3585 * Math.sin(saturnMeanAnomalyRad) + 0.2204 * Math.sin(2 * saturnMeanAnomalyRad)
  );
  positions.push({ ...PLANETS[6], longitude: saturnEclipticLong });
  
  return positions;
}

// ============================================================================
// 2D COORDINATE CONVERSION
// ============================================================================

/**
 * Convert ecliptic longitude to 2D chart coordinates
 * Chart is rotated so ASC is at the left (9 o'clock position)
 * 
 * @param {number} longitude - Ecliptic longitude in degrees
 * @param {number} asc - Ascendant in degrees
 * @param {number} radius - Radius from center
 * @returns {{x: number, y: number}} Cartesian coordinates
 */
export function eclipticToCartesian(longitude, asc, radius) {
  // Rotate so ASC is at left (180° in standard math coordinates)
  const angle = longitude - asc + 180;
  const angleRad = toRadians(angle);
  
  return {
    x: radius * Math.cos(angleRad),
    y: -radius * Math.sin(angleRad), // Negate Y for SVG coordinate system
  };
}

/**
 * Get zodiac sign for a given longitude
 * @param {number} longitude - Ecliptic longitude in degrees
 * @returns {Object} Zodiac sign object
 */
export function getZodiacSign(longitude) {
  const signIndex = Math.floor(normalizeAngle(longitude) / 30);
  return ZODIAC_SIGNS[signIndex];
}

/**
 * Get degree within zodiac sign
 * @param {number} longitude - Ecliptic longitude in degrees
 * @returns {number} Degrees within the sign (0-30)
 */
export function getSignDegree(longitude) {
  return normalizeAngle(longitude) % 30;
}

/**
 * Format longitude as zodiac position (e.g., "15° Ari")
 * @param {number} longitude - Ecliptic longitude in degrees
 * @returns {string} Formatted position
 */
export function formatZodiacPosition(longitude) {
  const sign = getZodiacSign(longitude);
  const degree = Math.floor(getSignDegree(longitude));
  return `${degree}° ${sign.abbr}`;
}

// ============================================================================
// MAIN CHART CALCULATION
// ============================================================================

/**
 * Calculate all chart data for a given time and location
 * 
 * @param {Object} params - Input parameters
 * @param {number} params.year - Year
 * @param {number} params.month - Month (1-12)
 * @param {number} params.day - Day
 * @param {number} params.hour - Hour (0-23)
 * @param {number} params.minute - Minute (0-59)
 * @param {number} params.utcOffset - UTC offset in hours
 * @param {number} params.latitude - Geographic latitude
 * @param {number} params.longitude - Geographic longitude
 * @returns {Object} Complete chart data
 */
export function calculateChart(params) {
  const { year, month, day, hour, minute, utcOffset, latitude, longitude } = params;
  
  // Calculate Julian Day
  const jd = calculateJulianDay(year, month, day, hour, minute, utcOffset);
  
  // Calculate sidereal time
  const gmst = calculateGMST(jd);
  const lst = calculateLST(jd, longitude);
  
  // Calculate angles
  const mc = calculateMC(lst);
  const asc = calculateASC(lst, latitude);
  
  // Calculate house cusps
  const houses = calculatePlacidusHouses(mc, asc, latitude);
  
  // Calculate planet positions
  const planets = calculatePlanetPositions(jd);
  
  return {
    input: { year, month, day, hour, minute, utcOffset, latitude, longitude },
    julianDay: jd,
    gmst,
    lst,
    mc,
    asc,
    houses,
    planets,
  };
}
