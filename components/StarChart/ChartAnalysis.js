/**
 * ChartAnalysis Component
 * Displays rule-based personality and career analysis
 * All text in Vietnamese
 */

import { useMemo } from 'react';
import { analyzeChart, getDisclaimer } from '../../utils/astroAnalysis';

// Element colors for visual bars
const ELEMENT_COLORS = {
  fire: { bg: 'bg-red-500', text: 'text-red-400', label: 'Hỏa 🔥' },
  earth: { bg: 'bg-green-600', text: 'text-green-400', label: 'Thổ 🌍' },
  air: { bg: 'bg-yellow-500', text: 'text-yellow-400', label: 'Khí 💨' },
  water: { bg: 'bg-blue-500', text: 'text-blue-400', label: 'Thủy 💧' },
};

/**
 * Element bar component
 */
function ElementBar({ element, score, maxScore }) {
  const percentage = Math.min((score / maxScore) * 100, 100);
  const colors = ELEMENT_COLORS[element];
  
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className={`w-16 text-sm font-medium ${colors.text}`}>
        {colors.label}
      </span>
      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-sm text-white/60 text-right">{score}</span>
    </div>
  );
}

/**
 * Trait tag component
 */
function TraitTag({ trait }) {
  return (
    <span className="inline-block px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] text-sm rounded-full border border-[#D4AF37]/30">
      {trait}
    </span>
  );
}

/**
 * Career field tag component
 */
function CareerTag({ field, score }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
      <span className="text-white text-sm">{field}</span>
      {score && (
        <span className="text-xs text-[#D4AF37] bg-[#D4AF37]/20 px-1.5 py-0.5 rounded">
          +{score}
        </span>
      )}
    </div>
  );
}

/**
 * Section header component
 */
function SectionHeader({ title, icon }) {
  return (
    <h3 className="text-xl font-serif text-[#D4AF37] mb-4 flex items-center gap-2">
      <span>{icon}</span>
      <span>{title}</span>
    </h3>
  );
}

/**
 * Main ChartAnalysis component
 */
export default function ChartAnalysis({ chartData }) {
  // Analyze chart data
  const analysis = useMemo(() => {
    if (!chartData) return null;
    return analyzeChart(chartData);
  }, [chartData]);
  
  if (!analysis) return null;
  
  const { personality, career } = analysis;
  
  // Calculate max score for element bars
  const maxElementScore = Math.max(
    personality.elements.fire,
    personality.elements.earth,
    personality.elements.air,
    personality.elements.water
  );
  
  return (
    <div className="mt-12 space-y-8">
      {/* Section Title */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#D4AF37] mb-2">
          PHÂN TÍCH BẢN ĐỒ SAO
        </h2>
        <p className="text-white/50 text-sm">
          Dựa trên hệ thống quy tắc thiên văn
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality Section */}
        <div className="bg-[#111010] border-2 border-white/20 rounded-lg p-6">
          <SectionHeader title="Tính cách" icon="✨" />
          
          {/* Element Distribution */}
          <div className="mb-6">
            <p className="text-white/70 text-sm mb-4 uppercase tracking-wider">
              Phân bố nguyên tố
            </p>
            <ElementBar element="fire" score={personality.elements.fire} maxScore={maxElementScore} />
            <ElementBar element="earth" score={personality.elements.earth} maxScore={maxElementScore} />
            <ElementBar element="air" score={personality.elements.air} maxScore={maxElementScore} />
            <ElementBar element="water" score={personality.elements.water} maxScore={maxElementScore} />
          </div>
          
          {/* Dominant Elements */}
          <div className="mb-6">
            <p className="text-white/70 text-sm mb-3 uppercase tracking-wider">
              Nguyên tố nổi bật
            </p>
            <div className="flex gap-4">
              <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${ELEMENT_COLORS[personality.dominantElement.name].text}`}>
                  {personality.dominantElement.label}
                </p>
                <p className="text-white/50 text-xs">Chủ đạo</p>
              </div>
              <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${ELEMENT_COLORS[personality.secondaryElement.name].text}`}>
                  {personality.secondaryElement.label}
                </p>
                <p className="text-white/50 text-xs">Phụ trợ</p>
              </div>
            </div>
          </div>
          
          {/* Trait Tags */}
          <div className="mb-6">
            <p className="text-white/70 text-sm mb-3 uppercase tracking-wider">
              Đặc điểm tính cách
            </p>
            <div className="flex flex-wrap gap-2">
              {personality.traits.map((trait, i) => (
                <TraitTag key={i} trait={trait} />
              ))}
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/80 text-sm leading-relaxed">
              {personality.summary}
            </p>
          </div>
        </div>
        
        {/* Career Section */}
        <div className="bg-[#111010] border-2 border-white/20 rounded-lg p-6">
          <SectionHeader title="Nghề nghiệp" icon="💼" />
          
          {/* MC Element */}
          <div className="mb-6">
            <p className="text-white/70 text-sm mb-3 uppercase tracking-wider">
              Thiên Đỉnh (MC)
            </p>
            <div className="bg-white/5 rounded-lg p-3">
              <p className="text-white">
                Cung <span className={`font-bold ${ELEMENT_COLORS[career.mcElement.name].text}`}>
                  {career.mcElement.label}
                </span>
              </p>
              <p className="text-white/50 text-xs mt-1">
                Ảnh hưởng đến định hướng sự nghiệp
              </p>
            </div>
          </div>
          
          {/* Career Fields */}
          <div className="mb-6">
            <p className="text-white/70 text-sm mb-3 uppercase tracking-wider">
              Lĩnh vực phù hợp
            </p>
            <div className="flex flex-wrap gap-2">
              {career.fields.map((field, i) => (
                <CareerTag key={i} field={field} score={career.scores[field]} />
              ))}
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-white/80 text-sm leading-relaxed">
              {career.summary}
            </p>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="bg-[#1a1512] border border-[#8b7355]/30 rounded-lg p-4">
        <p className="text-white/50 text-xs text-center italic">
          ⚠️ {getDisclaimer()}
        </p>
      </div>
    </div>
  );
}
