/**
 * Star Chart Page
 * Mechanistic star chart generator using computational astronomy
 */

import { useState, useRef, useCallback } from 'react';
import { Button } from '@heroui/react';
import AppNavbar from '../components/Navbar';
import Metadata from '../components/Metadata';
import Footer from '../components/Footer';
import { StarChart, ChartForm, ChartInfo, ChartExplanation } from '../components/StarChart';
import { calculateChart } from '../utils/astronomy';

export default function StarChartPage() {
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const chartRef = useRef(null);
  
  // Generate chart from form data
  const handleGenerate = useCallback((params) => {
    setIsLoading(true);
    
    // Use setTimeout to allow UI to update
    setTimeout(() => {
      try {
        const data = calculateChart(params);
        setChartData(data);
      } catch (error) {
        console.error('Error calculating chart:', error);
        alert('Có lỗi xảy ra khi tính toán. Vui lòng kiểm tra dữ liệu đầu vào.');
      } finally {
        setIsLoading(false);
      }
    }, 100);
  }, []);
  
  // Download as SVG
  const handleDownloadSVG = useCallback(() => {
    if (!chartRef.current || !chartData) return;
    
    const svg = chartRef.current.getSVG();
    if (!svg) return;
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const { input } = chartData;
    const filename = `starchart_${input.year}${String(input.month).padStart(2, '0')}${String(input.day).padStart(2, '0')}_${String(input.hour).padStart(2, '0')}${String(input.minute).padStart(2, '0')}_${input.latitude.toFixed(2)}_${input.longitude.toFixed(2)}.svg`;
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [chartData]);
  
  // Download as PNG
  const handleDownloadPNG = useCallback(() => {
    if (!chartRef.current || !chartData) return;
    
    const svg = chartRef.current.getSVG();
    if (!svg) return;
    
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = 2; // Higher resolution
      canvas.width = svg.width.baseVal.value * scale;
      canvas.height = svg.height.baseVal.value * scale;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        const pngUrl = URL.createObjectURL(blob);
        
        const { input } = chartData;
        const filename = `starchart_${input.year}${String(input.month).padStart(2, '0')}${String(input.day).padStart(2, '0')}_${String(input.hour).padStart(2, '0')}${String(input.minute).padStart(2, '0')}_${input.latitude.toFixed(2)}_${input.longitude.toFixed(2)}.png`;
        
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
      }, 'image/png');
    };
    img.src = url;
  }, [chartData]);
  
  return (
    <>
      <Metadata 
        title="Star Chart - Bản đồ sao cơ học"
        description="Tạo bản đồ sao cơ học dựa trên tính toán thiên văn học. Tính Julian Day, Sidereal Time, ASC, MC và hệ thống nhà Placidus."
        image="/tarot.jpeg"
      />
      <div className="min-h-screen bg-[#0b0a0a] flex flex-col">
        <AppNavbar />
        
        {/* Header */}
        <div className="w-full border-b border-white/10 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-8">
              <p className="tracking-[0.5em] text-xs sm:text-sm text-[#d5a052] uppercase mb-4">
                Computational Astronomy
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">
                BẢN ĐỒ SAO CƠ HỌC
              </h1>
              <p className="text-white/70 text-base sm:text-lg max-w-2xl mx-auto">
                Tạo bản đồ sao dựa trên các công thức thiên văn học. 
                Hiển thị vòng hoàng đạo, hệ thống nhà Placidus, và vị trí các hành tinh 
                tại thời điểm và địa điểm bạn chọn.
              </p>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="w-full py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Form Section */}
              <div className="bg-[#111010] border-2 border-white/20 rounded-lg p-6 sm:p-8">
                <h2 className="text-2xl font-serif text-[#D4AF37] mb-6">
                  THÔNG TIN ĐẦU VÀO
                </h2>
                <ChartForm onGenerate={handleGenerate} isLoading={isLoading} />
              </div>
              
              {/* Chart Section */}
              <div className="flex flex-col items-center">
                {chartData ? (
                  <>
                    <div className="bg-[#111010] border-2 border-white/20 rounded-lg p-4 sm:p-6 w-full">
                      <StarChart ref={chartRef} chartData={chartData} />
                    </div>
                    
                    {/* Download Buttons */}
                    <div className="flex gap-4 mt-6 w-full">
                      <Button
                        onClick={handleDownloadPNG}
                        className="flex-1 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold rounded-none"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        TẢI PNG
                      </Button>
                      <Button
                        onClick={handleDownloadSVG}
                        className="flex-1 bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold rounded-none"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        TẢI SVG
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#111010] border-2 border-dashed border-white/20 rounded-lg p-8 sm:p-12 w-full flex flex-col items-center justify-center min-h-[400px]">
                    <div className="text-6xl mb-4 opacity-50">✦</div>
                    <p className="text-white/50 text-center">
                      Nhập thông tin và nhấn &quot;Tạo bản đồ sao&quot; để xem kết quả
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Chart Info */}
            {chartData && (
              <div className="mt-12">
                <ChartInfo chartData={chartData} />
              </div>
            )}
          </div>
        </div>
        
        {/* Explanation Section */}
        <div className="w-full border-t border-white/10 py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <ChartExplanation />
          </div>
        </div>
        
        <Footer />
      </div>
    </>
  );
}
