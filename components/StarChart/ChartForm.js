/**
 * ChartForm Component
 * Birth chart input form with cascading Vietnam location dropdowns
 */

import { useState, useEffect, useMemo } from 'react';
import { Input, Button, Select, SelectItem, RadioGroup, Radio } from '@heroui/react';
import { VIETNAM_PROVINCES } from '../../data/vietnamProvinces';

// Generate arrays for dropdowns
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEARS = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

// Common timezone offsets
const TIMEZONES = [
  { value: 7, label: 'GMT +7 (Việt Nam)' },
  { value: 8, label: 'GMT +8' },
  { value: 9, label: 'GMT +9' },
  { value: 0, label: 'GMT ±0' },
  { value: -5, label: 'GMT -5' },
  { value: -8, label: 'GMT -8' },
];

export default function ChartForm({ onGenerate, isLoading }) {
  // Form state
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  
  // Date state
  const now = new Date();
  const [day, setDay] = useState(now.getDate());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  
  // Time state
  const [hour, setHour] = useState(now.getHours() > 12 ? now.getHours() - 12 : now.getHours() || 12);
  const [minute, setMinute] = useState(now.getMinutes());
  const [period, setPeriod] = useState(now.getHours() >= 12 ? 'PM' : 'AM');
  const [timezone, setTimezone] = useState(7);
  
  // Location state (cascading)
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  
  // Coordinates (auto-calculated from province)
  const [latitude, setLatitude] = useState(10.8231);
  const [longitude, setLongitude] = useState(106.6297);
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/v2/p/');
        const data = await response.json();
        setProvinces(data);
        setLoadingProvinces(false);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
        setLoadingProvinces(false);
      }
    };
    fetchProvinces();
  }, []);
  
  // Fetch districts when province changes
  useEffect(() => {
    if (!selectedProvince) {
      setDistricts([]);
      setWards([]);
      return;
    }
    
    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const response = await fetch(`https://provinces.open-api.vn/api/v2/p/${selectedProvince}?depth=2`);
        const data = await response.json();
        setDistricts(data.districts || []);
        setSelectedDistrict('');
        setSelectedWard('');
        setWards([]);
        
        // Set coordinates from province
        const coords = VIETNAM_PROVINCES[parseInt(selectedProvince)];
        if (coords) {
          setLatitude(coords.lat);
          setLongitude(coords.lon);
        }
      } catch (error) {
        console.error('Failed to fetch districts:', error);
      }
      setLoadingDistricts(false);
    };
    fetchDistricts();
  }, [selectedProvince]);
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Vui lòng nhập họ tên';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Họ tên phải có ít nhất 2 ký tự';
    }
    
    // Date validation
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) {
      newErrors.date = `Tháng ${month} chỉ có ${daysInMonth} ngày`;
    }
    
    // Location validation
    if (!selectedProvince) {
      newErrors.location = 'Vui lòng chọn tỉnh/thành phố';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Clear location error when province is selected
  useEffect(() => {
    if (selectedProvince && errors.location) {
      setErrors(prev => {
        const { location, ...rest } = prev;
        return rest;
      });
    }
  }, [selectedProvince]);
  
  // Clear name error when name is valid
  useEffect(() => {
    if (name.trim().length >= 2 && errors.name) {
      setErrors(prev => {
        const { name: _, ...rest } = prev;
        return rest;
      });
    }
  }, [name]);
  
  // Get location display text
  const locationText = useMemo(() => {
    const parts = [];
    
    if (selectedWard) {
      const ward = wards.find(w => String(w.code) === selectedWard);
      if (ward) parts.push(ward.name);
    }
    
    if (selectedDistrict) {
      const district = districts.find(d => String(d.code) === selectedDistrict);
      if (district) parts.push(district.name);
    }
    
    if (selectedProvince) {
      const province = provinces.find(p => String(p.code) === selectedProvince);
      if (province) parts.push(province.name);
    }
    
    return parts.join(', ') || '';
  }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards]);
  
  // Check if form is valid for button state
  const isFormValid = useMemo(() => {
    return name.trim().length >= 2 && selectedProvince;
  }, [name, selectedProvince]);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mark all as touched
    setTouched({ name: true, location: true });
    
    // Validate
    if (!validateForm()) {
      return;
    }
    
    // Convert 12h to 24h
    let hour24 = hour;
    if (period === 'PM' && hour !== 12) hour24 = hour + 12;
    if (period === 'AM' && hour === 12) hour24 = 0;
    
    onGenerate({
      name: name.trim(),
      gender,
      year,
      month,
      day,
      hour: hour24,
      minute,
      utcOffset: timezone,
      latitude,
      longitude,
      location: locationText,
    });
  };
  
  // Handle blur for validation feedback
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };
  
  // Common select styling
  const selectClasses = {
    trigger: 'bg-[#2a2520] border-2 border-[#8b7355] hover:border-[#D4AF37] text-white rounded-lg min-h-[44px]',
    value: 'text-white',
    popoverContent: 'bg-[#2a2520] border-2 border-[#8b7355]',
  };
  
  const errorSelectClasses = {
    ...selectClasses,
    trigger: 'bg-[#2a2520] border-2 border-red-500 hover:border-red-400 text-white rounded-lg min-h-[44px]',
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Name & Gender */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
            Họ tên <span className="text-red-400">*</span>
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => handleBlur('name')}
            placeholder="Tên người xem"
            isInvalid={touched.name && errors.name}
            errorMessage={touched.name && errors.name}
            classNames={{
              inputWrapper: `bg-[#2a2520] border-2 ${touched.name && errors.name ? 'border-red-500' : 'border-[#8b7355]'} hover:border-[#D4AF37] rounded-lg`,
              input: 'text-white placeholder:text-white/50',
              errorMessage: 'text-red-400 text-xs mt-1',
            }}
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
            Giới tính
          </label>
          <RadioGroup
            orientation="horizontal"
            value={gender}
            onValueChange={setGender}
            classNames={{
              wrapper: 'gap-6',
            }}
          >
            <Radio value="male" classNames={{ label: 'text-white' }}>Nam</Radio>
            <Radio value="female" classNames={{ label: 'text-white' }}>Nữ</Radio>
          </RadioGroup>
        </div>
      </div>
      
      {/* Row 2: Birth Date */}
      <div>
        <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
          Năm sinh
        </label>
        <div className="grid grid-cols-3 gap-2">
          <Select
            placeholder="Ngày"
            selectedKeys={[String(day)]}
            onSelectionChange={(keys) => setDay(parseInt(Array.from(keys)[0]))}
            classNames={selectClasses}
          >
            {DAYS.map((d) => (
              <SelectItem key={String(d)} textValue={String(d)}>
                {d}
              </SelectItem>
            ))}
          </Select>
          
          <Select
            placeholder="Tháng"
            selectedKeys={[String(month)]}
            onSelectionChange={(keys) => setMonth(parseInt(Array.from(keys)[0]))}
            classNames={selectClasses}
          >
            {MONTHS.map((m) => (
              <SelectItem key={String(m)} textValue={`Tháng ${m}`}>
                Tháng {m}
              </SelectItem>
            ))}
          </Select>
          
          <Select
            placeholder="Năm"
            selectedKeys={[String(year)]}
            onSelectionChange={(keys) => setYear(parseInt(Array.from(keys)[0]))}
            classNames={selectClasses}
          >
            {YEARS.map((y) => (
              <SelectItem key={String(y)} textValue={String(y)}>
                {y}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      
      {/* Row 3: Birth Time */}
      <div>
        <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
          Giờ sinh
        </label>
        <div className="grid grid-cols-4 gap-3">
          <Select
            placeholder="Giờ"
            selectedKeys={[String(hour)]}
            onSelectionChange={(keys) => setHour(parseInt(Array.from(keys)[0]))}
            classNames={selectClasses}
          >
            {HOURS.map((h) => (
              <SelectItem key={String(h)} textValue={String(h)}>
                {h} giờ
              </SelectItem>
            ))}
          </Select>
          
          <Select
            placeholder="Phút"
            selectedKeys={[String(minute)]}
            onSelectionChange={(keys) => setMinute(parseInt(Array.from(keys)[0]))}
            classNames={selectClasses}
          >
            {MINUTES.map((m) => (
              <SelectItem key={String(m)} textValue={String(m).padStart(2, '0')}>
                {String(m).padStart(2, '0')} phút
              </SelectItem>
            ))}
          </Select>
          
          <Select
            placeholder="Buổi"
            selectedKeys={[period]}
            onSelectionChange={(keys) => setPeriod(Array.from(keys)[0])}
            classNames={selectClasses}
          >
            <SelectItem key="AM" textValue="Sáng">Sáng</SelectItem>
            <SelectItem key="PM" textValue="Chiều">Chiều</SelectItem>
          </Select>
          
          <Select
            selectedKeys={[String(timezone)]}
            onSelectionChange={(keys) => setTimezone(parseInt(Array.from(keys)[0]))}
            classNames={selectClasses}
          >
            {TIMEZONES.map((tz) => (
              <SelectItem key={String(tz.value)} textValue={tz.label}>
                {tz.label}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      
      {/* Row 4: Birth Place */}
      <div>
        <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
          Nơi sinh <span className="text-red-400">*</span>
        </label>
        <Select
          placeholder={loadingProvinces ? "Đang tải..." : "Chọn Tỉnh/Thành phố"}
          selectedKeys={selectedProvince ? [selectedProvince] : []}
          onSelectionChange={(keys) => {
            const provinceCode = Array.from(keys)[0] || '';
            setSelectedProvince(provinceCode);
            setTouched(prev => ({ ...prev, location: true }));
            
            // Set coordinates from province
            if (provinceCode) {
              const coords = VIETNAM_PROVINCES[parseInt(provinceCode)];
              if (coords) {
                setLatitude(coords.lat);
                setLongitude(coords.lon);
              }
            }
          }}
          isDisabled={loadingProvinces}
          classNames={touched.location && errors.location ? errorSelectClasses : selectClasses}
        >
          {provinces.map((p) => (
            <SelectItem key={String(p.code)} textValue={p.name}>
              {p.name}
            </SelectItem>
          ))}
        </Select>
        
        {/* Error message */}
        {touched.location && errors.location && (
          <p className="text-red-400 text-xs mt-2">{errors.location}</p>
        )}
        
        {/* Location preview with coordinates */}
        {selectedProvince && !errors.location && (
          <p className="text-[#D4AF37] text-sm mt-2">
            📍 {locationText} ({latitude.toFixed(2)}°N, {longitude.toFixed(2)}°E)
          </p>
        )}
      </div>
      
      {/* Date validation error */}
      {errors.date && (
        <p className="text-red-400 text-sm">⚠️ {errors.date}</p>
      )}
      
      {/* Generate Button */}
      <Button
        type="submit"
        isLoading={isLoading}
        isDisabled={!isFormValid}
        className={`w-full font-semibold text-base py-6 rounded-lg transition-all ${
          isFormValid 
            ? 'bg-[#D4AF37] text-black hover:bg-[#c9a432]' 
            : 'bg-[#8b7355] text-white/50 cursor-not-allowed'
        }`}
      >
        TẠO BẢN ĐỒ SAO
      </Button>
    </form>
  );
}

