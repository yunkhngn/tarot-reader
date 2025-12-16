/**
 * ChartForm Component
 * Input form for star chart generation with Vietnam provinces from API
 */

import { useState, useEffect, useMemo } from 'react';
import { Input, Button, Select, SelectItem, Autocomplete, AutocompleteItem } from '@heroui/react';
import { VIETNAM_PROVINCES } from '../../data/vietnamProvinces';

// Common timezone offsets
const TIMEZONES = [
  { value: -12, label: 'UTC-12:00' },
  { value: -11, label: 'UTC-11:00' },
  { value: -10, label: 'UTC-10:00 (Hawaii)' },
  { value: -9, label: 'UTC-09:00 (Alaska)' },
  { value: -8, label: 'UTC-08:00 (Pacific)' },
  { value: -7, label: 'UTC-07:00 (Mountain)' },
  { value: -6, label: 'UTC-06:00 (Central)' },
  { value: -5, label: 'UTC-05:00 (Eastern)' },
  { value: -4, label: 'UTC-04:00' },
  { value: -3, label: 'UTC-03:00' },
  { value: -2, label: 'UTC-02:00' },
  { value: -1, label: 'UTC-01:00' },
  { value: 0, label: 'UTC±00:00 (London)' },
  { value: 1, label: 'UTC+01:00 (Paris)' },
  { value: 2, label: 'UTC+02:00 (Cairo)' },
  { value: 3, label: 'UTC+03:00 (Moscow)' },
  { value: 4, label: 'UTC+04:00 (Dubai)' },
  { value: 5, label: 'UTC+05:00' },
  { value: 5.5, label: 'UTC+05:30 (India)' },
  { value: 6, label: 'UTC+06:00' },
  { value: 7, label: 'UTC+07:00 (Việt Nam)' },
  { value: 8, label: 'UTC+08:00 (China)' },
  { value: 9, label: 'UTC+09:00 (Japan)' },
  { value: 10, label: 'UTC+10:00 (Sydney)' },
  { value: 11, label: 'UTC+11:00' },
  { value: 12, label: 'UTC+12:00 (Auckland)' },
];

// International presets (for non-Vietnam locations)
const INTERNATIONAL_PRESETS = [
  { name: 'Tokyo, Japan', lat: 35.6762, lon: 139.6503, tz: 9 },
  { name: 'New York, USA', lat: 40.7128, lon: -74.006, tz: -5 },
  { name: 'London, UK', lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: 'Sydney, Australia', lat: -33.8688, lon: 151.2093, tz: 10 },
  { name: 'Paris, France', lat: 48.8566, lon: 2.3522, tz: 1 },
  { name: 'Dubai, UAE', lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 8 },
  { name: 'Seoul, South Korea', lat: 37.5665, lon: 126.9780, tz: 9 },
  { name: 'Bangkok, Thailand', lat: 13.7563, lon: 100.5018, tz: 7 },
];

export default function ChartForm({ onGenerate, isLoading }) {
  // Get current date/time
  const now = new Date();
  const defaultDate = now.toISOString().split('T')[0];
  const defaultTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [timezone, setTimezone] = useState(7); // Default to Vietnam
  const [latitude, setLatitude] = useState('10.8231'); // Ho Chi Minh City
  const [longitude, setLongitude] = useState('106.6297');
  
  // Vietnam provinces from API
  const [provinces, setProvinces] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [showInternational, setShowInternational] = useState(false);
  
  // Fetch Vietnam provinces from API
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await fetch('https://provinces.open-api.vn/api/v2/p/');
        const data = await response.json();
        
        // Map provinces with coordinates
        const provincesWithCoords = data.map((p) => ({
          code: p.code,
          name: p.name,
          codename: p.codename,
          divisionType: p.division_type,
          coords: VIETNAM_PROVINCES[p.code] || null,
        })).filter(p => p.coords); // Only include provinces with known coordinates
        
        setProvinces(provincesWithCoords);
        setLoadingProvinces(false);
      } catch (error) {
        console.error('Failed to fetch provinces:', error);
        setLoadingProvinces(false);
      }
    };
    
    fetchProvinces();
  }, []);
  
  // Handle province selection
  const handleProvinceSelect = (key) => {
    if (!key) return;
    
    const province = provinces.find(p => String(p.code) === String(key));
    if (province && province.coords) {
      setSelectedProvince(String(key));
      setLatitude(String(province.coords.lat));
      setLongitude(String(province.coords.lon));
      setTimezone(7); // Vietnam timezone
    }
  };
  
  // Handle international preset selection  
  const handleInternationalSelect = (key) => {
    if (!key) return;
    
    const preset = INTERNATIONAL_PRESETS.find(p => p.name === key);
    if (preset) {
      setLatitude(String(preset.lat));
      setLongitude(String(preset.lon));
      setTimezone(preset.tz);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);
    
    onGenerate({
      year,
      month,
      day,
      hour,
      minute,
      utcOffset: timezone,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location Selection Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          type="button"
          size="sm"
          className={`flex-1 rounded-none ${!showInternational 
            ? 'bg-[#D4AF37] text-black' 
            : 'bg-transparent border-2 border-white/30 text-white'}`}
          onClick={() => setShowInternational(false)}
        >
          Việt Nam
        </Button>
        <Button
          type="button"
          size="sm"
          className={`flex-1 rounded-none ${showInternational 
            ? 'bg-[#D4AF37] text-black' 
            : 'bg-transparent border-2 border-white/30 text-white'}`}
          onClick={() => setShowInternational(true)}
        >
          Quốc tế
        </Button>
      </div>
      
      {/* Vietnam Province Selector */}
      {!showInternational && (
        <div>
          <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
            Tỉnh / Thành phố
          </label>
          {loadingProvinces ? (
            <div className="bg-[#1a1512] border-2 border-white/20 p-4 text-white/50 text-center">
              Đang tải danh sách tỉnh thành...
            </div>
          ) : (
            <Autocomplete
              placeholder="Tìm tỉnh thành..."
              selectedKey={selectedProvince}
              onSelectionChange={handleProvinceSelect}
              classNames={{
                base: 'w-full',
                listboxWrapper: 'bg-[#1a1512] border-2 border-white/20',
                popoverContent: 'bg-[#1a1512]',
              }}
              inputProps={{
                classNames: {
                  inputWrapper: 'bg-[#1a1512] border-2 border-white/20 hover:border-white/40',
                  input: 'text-white placeholder:text-white/40',
                },
              }}
              listboxProps={{
                itemClasses: {
                  base: 'text-white data-[hover=true]:bg-white/10',
                },
              }}
            >
              {provinces.map((province) => (
                <AutocompleteItem key={String(province.code)} textValue={province.name}>
                  <div className="flex flex-col">
                    <span className="text-white">{province.name}</span>
                    <span className="text-white/50 text-xs">
                      {province.coords.lat.toFixed(4)}°, {province.coords.lon.toFixed(4)}°
                    </span>
                  </div>
                </AutocompleteItem>
              ))}
            </Autocomplete>
          )}
        </div>
      )}
      
      {/* International Preset Selector */}
      {showInternational && (
        <div>
          <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
            Thành phố quốc tế
          </label>
          <Select
            placeholder="Chọn thành phố..."
            onSelectionChange={(keys) => handleInternationalSelect(Array.from(keys)[0])}
            classNames={{
              trigger: 'bg-[#1a1512] border-2 border-white/20 hover:border-white/40 text-white',
              value: 'text-white',
              popoverContent: 'bg-[#1a1512] border-2 border-white/20',
            }}
          >
            {INTERNATIONAL_PRESETS.map((preset) => (
              <SelectItem key={preset.name} textValue={preset.name}>
                <div className="flex flex-col">
                  <span className="text-white">{preset.name}</span>
                  <span className="text-white/50 text-xs">
                    {preset.lat.toFixed(4)}°, {preset.lon.toFixed(4)}°
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
      
      {/* Date and Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
            Ngày (YYYY-MM-DD)
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            classNames={{
              inputWrapper: 'bg-[#1a1512] border-2 border-white/20 hover:border-white/40',
              input: 'text-white',
            }}
            required
          />
        </div>
        <div>
          <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
            Giờ (HH:MM, 24h)
          </label>
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            classNames={{
              inputWrapper: 'bg-[#1a1512] border-2 border-white/20 hover:border-white/40',
              input: 'text-white',
            }}
            required
          />
        </div>
      </div>
      
      {/* Timezone */}
      <div>
        <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
          Múi giờ (UTC Offset)
        </label>
        <Select
          selectedKeys={[String(timezone)]}
          onSelectionChange={(keys) => setTimezone(parseFloat(Array.from(keys)[0]))}
          classNames={{
            trigger: 'bg-[#1a1512] border-2 border-white/20 hover:border-white/40 text-white',
            value: 'text-white',
            popoverContent: 'bg-[#1a1512] border-2 border-white/20',
          }}
        >
          {TIMEZONES.map((tz) => (
            <SelectItem key={String(tz.value)} textValue={tz.label}>
              {tz.label}
            </SelectItem>
          ))}
        </Select>
      </div>
      
      {/* Coordinates (editable) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
            Vĩ độ φ (độ)
          </label>
          <Input
            type="number"
            step="0.0001"
            min="-90"
            max="90"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="VD: 10.8231"
            classNames={{
              inputWrapper: 'bg-[#1a1512] border-2 border-white/20 hover:border-white/40',
              input: 'text-white placeholder:text-white/30',
            }}
            required
          />
          <p className="text-white/40 text-xs mt-1">Bắc dương (+), Nam âm (-)</p>
        </div>
        <div>
          <label className="block text-white/70 text-sm uppercase tracking-wider mb-2">
            Kinh độ λ₀ (độ)
          </label>
          <Input
            type="number"
            step="0.0001"
            min="-180"
            max="180"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="VD: 106.6297"
            classNames={{
              inputWrapper: 'bg-[#1a1512] border-2 border-white/20 hover:border-white/40',
              input: 'text-white placeholder:text-white/30',
            }}
            required
          />
          <p className="text-white/40 text-xs mt-1">Đông dương (+), Tây âm (-)</p>
        </div>
      </div>
      
      {/* Generate Button */}
      <Button
        type="submit"
        isLoading={isLoading}
        className="w-full bg-white text-black hover:bg-gray-200 font-semibold text-base py-6 rounded-none border-2 border-black"
      >
        <span className="nav-star mr-2">✦</span>
        TẠO BẢN ĐỒ SAO
      </Button>
    </form>
  );
}
