/**
 * Vietnam Provinces Coordinates
 * Geographic coordinates (latitude, longitude) for all 63 provinces/cities in Vietnam
 * Mapped by province code from the provinces.open-api.vn API
 */

const VIETNAM_PROVINCE_COORDS = {
  // Northern Region - Red River Delta
  1: { lat: 21.0285, lon: 105.8542 },   // Hà Nội
  4: { lat: 21.5938, lon: 105.8412 },   // Tuyên Quang
  8: { lat: 22.8166, lon: 104.9829 },   // Hà Giang
  11: { lat: 20.8599, lon: 106.6800 },  // Hải Phòng
  12: { lat: 21.0403, lon: 107.2929 },  // Quảng Ninh
  14: { lat: 22.4853, lon: 103.9750 },  // Lào Cai
  15: { lat: 21.3299, lon: 103.9080 },  // Yên Bái
  19: { lat: 21.5120, lon: 103.8950 },  // Phú Thọ
  20: { lat: 21.0967, lon: 105.3962 },  // Vĩnh Phúc
  22: { lat: 21.2932, lon: 106.1965 },  // Bắc Giang
  24: { lat: 21.8532, lon: 106.7623 },  // Bắc Ninh
  25: { lat: 22.8183, lon: 106.2574 },  // Cao Bằng
  
  // Northern Region - Northeast & Northwest  
  31: { lat: 20.8615, lon: 105.7532 },  // Hà Nam
  33: { lat: 20.5378, lon: 105.9112 },  // Nam Định
  37: { lat: 20.2539, lon: 105.9755 },  // Ninh Bình
  38: { lat: 20.4500, lon: 106.3362 },  // Thái Bình
  40: { lat: 20.8535, lon: 106.0136 },  // Hưng Yên
  42: { lat: 20.4464, lon: 106.1711 },  // Hải Dương
  44: { lat: 22.1363, lon: 106.4539 },  // Lạng Sơn
  46: { lat: 21.7150, lon: 105.8189 },  // Thái Nguyên
  48: { lat: 22.3380, lon: 105.8569 },  // Bắc Kạn
  51: { lat: 21.3283, lon: 105.2218 },  // Hòa Bình
  52: { lat: 21.0277, lon: 105.5186 },  // Sơn La
  56: { lat: 22.3638, lon: 103.0239 },  // Điện Biên
  66: { lat: 21.5730, lon: 103.1582 },  // Lai Châu
  
  // Central Region - North Central Coast
  68: { lat: 19.8022, lon: 105.7780 },  // Thanh Hóa
  75: { lat: 18.6706, lon: 105.6821 },  // Nghệ An
  79: { lat: 18.3411, lon: 105.9054 },  // Hà Tĩnh
  80: { lat: 17.4676, lon: 106.6224 },  // Quảng Bình
  82: { lat: 16.8169, lon: 107.1010 },  // Quảng Trị
  86: { lat: 16.4637, lon: 107.5909 },  // Thừa Thiên Huế
  
  // Central Region - South Central Coast
  91: { lat: 16.0678, lon: 108.2208 },  // Đà Nẵng
  92: { lat: 15.5393, lon: 108.0191 },  // Quảng Nam
  96: { lat: 15.1216, lon: 108.8044 },  // Quảng Ngãi
  
  // Note: Some province codes might be different, here are more
};

// Extended coordinates for remaining provinces
const EXTENDED_COORDS = {
  // South Central Coast continued
  34: { lat: 20.4211, lon: 106.1684 },  // Thái Bình (alt)
  
  // Central Highlands
  62: { lat: 13.9825, lon: 107.9914 },  // Kon Tum
  64: { lat: 13.9830, lon: 108.0000 },  // Gia Lai
  66: { lat: 12.6678, lon: 108.0377 },  // Đắk Lắk
  67: { lat: 12.0072, lon: 107.6876 },  // Đắk Nông
  68: { lat: 11.9404, lon: 108.4583 },  // Lâm Đồng
  
  // Southeast Region
  70: { lat: 11.5452, lon: 107.2424 },  // Bình Phước
  72: { lat: 11.3254, lon: 106.4770 },  // Tây Ninh
  74: { lat: 11.0036, lon: 106.6519 },  // Bình Dương
  75: { lat: 10.9574, lon: 106.8426 },  // Đồng Nai
  77: { lat: 10.3460, lon: 107.0843 },  // Bà Rịa - Vũng Tàu
  79: { lat: 10.8231, lon: 106.6297 },  // Hồ Chí Minh
  
  // Mekong Delta
  80: { lat: 10.5215, lon: 106.4135 },  // Long An
  82: { lat: 10.2542, lon: 106.3750 },  // Tiền Giang
  83: { lat: 10.3530, lon: 106.7630 },  // Bến Tre
  84: { lat: 10.0341, lon: 105.7889 },  // Trà Vinh
  86: { lat: 10.0452, lon: 105.7469 },  // Vĩnh Long
  87: { lat: 10.2899, lon: 105.7563 },  // Đồng Tháp
  89: { lat: 10.0072, lon: 105.0878 },  // An Giang
  91: { lat: 10.0378, lon: 105.0842 },  // Kiên Giang
  92: { lat: 10.0452, lon: 105.7469 },  // Cần Thơ
  93: { lat: 9.7850, lon: 105.4670 },   // Hậu Giang
  94: { lat: 9.6028, lon: 105.9739 },   // Sóc Trăng
  95: { lat: 9.2882, lon: 105.7242 },   // Bạc Liêu
  96: { lat: 9.1800, lon: 105.1500 },   // Cà Mau
};

/**
 * Complete Vietnam Province Coordinates by Province Code
 * Merged from official geographic data
 */
export const VIETNAM_PROVINCES = {
  1:  { lat: 21.0285, lon: 105.8542 },  // Thành phố Hà Nội
  2:  { lat: 21.5938, lon: 105.8412 },  // Tỉnh Hà Giang (old code)
  4:  { lat: 22.8166, lon: 104.9829 },  // Tỉnh Cao Bằng
  6:  { lat: 22.4038, lon: 103.4680 },  // Tỉnh Bắc Kạn
  8:  { lat: 21.8532, lon: 105.7140 },  // Tỉnh Tuyên Quang
  10: { lat: 22.1363, lon: 103.9750 },  // Tỉnh Lào Cai
  11: { lat: 21.3299, lon: 103.9080 },  // Tỉnh Điện Biên
  12: { lat: 21.5730, lon: 103.1582 },  // Tỉnh Lai Châu
  14: { lat: 21.7054, lon: 104.8977 },  // Tỉnh Sơn La
  15: { lat: 21.7167, lon: 104.8986 },  // Tỉnh Yên Bái
  17: { lat: 21.3283, lon: 105.2218 },  // Tỉnh Hoà Bình
  19: { lat: 21.7150, lon: 105.8189 },  // Tỉnh Thái Nguyên
  20: { lat: 22.1363, lon: 106.4539 },  // Tỉnh Lạng Sơn
  22: { lat: 21.0403, lon: 107.2929 },  // Tỉnh Quảng Ninh
  24: { lat: 21.2932, lon: 106.1965 },  // Tỉnh Bắc Giang
  25: { lat: 21.4583, lon: 105.9960 },  // Tỉnh Phú Thọ
  26: { lat: 21.0967, lon: 105.3962 },  // Tỉnh Vĩnh Phúc
  27: { lat: 21.1212, lon: 105.9550 },  // Tỉnh Bắc Ninh
  30: { lat: 20.4464, lon: 106.3362 },  // Tỉnh Hải Dương
  31: { lat: 20.8599, lon: 106.6800 },  // Thành phố Hải Phòng
  33: { lat: 20.8535, lon: 106.0136 },  // Tỉnh Hưng Yên
  34: { lat: 20.4500, lon: 106.3421 },  // Tỉnh Thái Bình
  35: { lat: 20.8615, lon: 105.7532 },  // Tỉnh Hà Nam
  36: { lat: 20.4342, lon: 106.1621 },  // Tỉnh Nam Định
  37: { lat: 20.2539, lon: 105.9755 },  // Tỉnh Ninh Bình
  38: { lat: 19.8075, lon: 105.7765 },  // Tỉnh Thanh Hóa
  40: { lat: 18.6706, lon: 105.6821 },  // Tỉnh Nghệ An
  42: { lat: 18.3411, lon: 105.9054 },  // Tỉnh Hà Tĩnh
  44: { lat: 17.4676, lon: 106.6224 },  // Tỉnh Quảng Bình
  45: { lat: 16.8169, lon: 107.1010 },  // Tỉnh Quảng Trị
  46: { lat: 16.4637, lon: 107.5909 },  // Tỉnh Thừa Thiên Huế
  48: { lat: 16.0678, lon: 108.2208 },  // Thành phố Đà Nẵng
  49: { lat: 15.5393, lon: 108.0191 },  // Tỉnh Quảng Nam
  51: { lat: 15.1216, lon: 108.8044 },  // Tỉnh Quảng Ngãi
  52: { lat: 13.7765, lon: 109.2237 },  // Tỉnh Bình Định
  54: { lat: 13.0881, lon: 109.2924 },  // Tỉnh Phú Yên
  56: { lat: 12.2585, lon: 109.0526 },  // Tỉnh Khánh Hòa
  58: { lat: 11.5644, lon: 108.9880 },  // Tỉnh Ninh Thuận
  60: { lat: 10.9289, lon: 108.1000 },  // Tỉnh Bình Thuận
  62: { lat: 14.3533, lon: 107.9905 },  // Tỉnh Kon Tum
  64: { lat: 13.9830, lon: 108.0000 },  // Tỉnh Gia Lai
  66: { lat: 12.6678, lon: 108.0377 },  // Tỉnh Đắk Lắk
  67: { lat: 12.0072, lon: 107.6876 },  // Tỉnh Đắk Nông
  68: { lat: 11.9404, lon: 108.4583 },  // Tỉnh Lâm Đồng
  70: { lat: 11.6697, lon: 106.6206 },  // Tỉnh Bình Phước
  72: { lat: 11.3254, lon: 106.1148 },  // Tỉnh Tây Ninh
  74: { lat: 11.1271, lon: 106.4467 },  // Tỉnh Bình Dương
  75: { lat: 10.9451, lon: 106.8240 },  // Tỉnh Đồng Nai
  77: { lat: 10.4114, lon: 107.1362 },  // Tỉnh Bà Rịa - Vũng Tàu
  79: { lat: 10.8231, lon: 106.6297 },  // Thành phố Hồ Chí Minh
  80: { lat: 10.5489, lon: 106.4031 },  // Tỉnh Long An
  82: { lat: 10.4493, lon: 106.3351 },  // Tỉnh Tiền Giang
  83: { lat: 10.2433, lon: 106.3756 },  // Tỉnh Bến Tre
  84: { lat: 9.9477, lon: 106.3420 },   // Tỉnh Trà Vinh
  86: { lat: 10.2388, lon: 105.9548 },  // Tỉnh Vĩnh Long
  87: { lat: 10.5326, lon: 105.6886 },  // Tỉnh Đồng Tháp
  89: { lat: 10.5215, lon: 105.1258 },  // Tỉnh An Giang
  91: { lat: 10.0125, lon: 105.0809 },  // Tỉnh Kiên Giang
  92: { lat: 10.0452, lon: 105.7469 },  // Thành phố Cần Thơ
  93: { lat: 9.7766, lon: 105.6405 },   // Tỉnh Hậu Giang
  94: { lat: 9.6028, lon: 105.9740 },   // Tỉnh Sóc Trăng
  95: { lat: 9.2940, lon: 105.7216 },   // Tỉnh Bạc Liêu
  96: { lat: 9.1800, lon: 105.1500 },   // Tỉnh Cà Mau
};

export default VIETNAM_PROVINCES;
