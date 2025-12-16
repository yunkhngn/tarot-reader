/**
 * ChartInfo Component
 * Displays calculated chart data (JD, LST, MC, ASC, house cusps, planets)
 */

import { formatZodiacPosition } from '../../utils/astronomy';

export default function ChartInfo({ chartData }) {
  const { julianDay, gmst, lst, mc, asc, houses, planets, input } = chartData;
  
  return (
    <div className="bg-[#111010] border-2 border-white/20 rounded-lg p-6 space-y-6">
      <h3 className="text-xl font-serif text-[#D4AF37] mb-4">
        DỮ LIỆU TÍNH TOÁN
      </h3>
      
      {/* Input Data */}
      <div>
        <h4 className="text-white/60 text-sm uppercase tracking-wider mb-2">Thông tin đầu vào</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-white/70">Ngày giờ:</div>
          <div className="text-white">
            {input.year}-{String(input.month).padStart(2, '0')}-{String(input.day).padStart(2, '0')}{' '}
            {String(input.hour).padStart(2, '0')}:{String(input.minute).padStart(2, '0')}{' '}
            UTC{input.utcOffset >= 0 ? '+' : ''}{input.utcOffset}
          </div>
          <div className="text-white/70">Vĩ độ:</div>
          <div className="text-white">{input.latitude.toFixed(4)}°</div>
          <div className="text-white/70">Kinh độ:</div>
          <div className="text-white">{input.longitude.toFixed(4)}°</div>
        </div>
      </div>
      
      {/* Time Data */}
      <div>
        <h4 className="text-white/60 text-sm uppercase tracking-wider mb-2">Thời gian thiên văn</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-white/70">Julian Day:</div>
          <div className="text-white font-mono">{julianDay.toFixed(5)}</div>
          <div className="text-white/70">GMST:</div>
          <div className="text-white">{gmst.toFixed(4)}°</div>
          <div className="text-white/70">LST:</div>
          <div className="text-white">{lst.toFixed(4)}°</div>
        </div>
      </div>
      
      {/* Angles */}
      <div>
        <h4 className="text-white/60 text-sm uppercase tracking-wider mb-2">Góc chính</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-[#D4AF37]">ASC:</div>
          <div className="text-white">{asc.toFixed(2)}° ({formatZodiacPosition(asc)})</div>
          <div className="text-[#D4AF37]">MC:</div>
          <div className="text-white">{mc.toFixed(2)}° ({formatZodiacPosition(mc)})</div>
        </div>
      </div>
      
      {/* Houses */}
      <div>
        <h4 className="text-white/60 text-sm uppercase tracking-wider mb-2">Cusps các nhà (Placidus)</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm">
          {houses.map((cusp, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-white/70">Nhà {i + 1}:</span>
              <span className="text-white">{formatZodiacPosition(cusp)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Planets */}
      <div>
        <h4 className="text-white/60 text-sm uppercase tracking-wider mb-2">Vị trí hành tinh</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
          {planets.map((planet) => (
            <div key={planet.name} className="flex items-center gap-2">
              <span style={{ color: planet.color }} className="text-lg">{planet.symbol}</span>
              <span className="text-white/70">{planet.name}:</span>
              <span className="text-white">{formatZodiacPosition(planet.longitude)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
