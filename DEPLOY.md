# Hướng dẫn Deploy lên Vercel

## Cách 1: Deploy qua Vercel CLI

1. **Cài đặt Vercel CLI** (nếu chưa có):
```bash
npm i -g vercel
```

2. **Login vào Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel
```

4. **Deploy production**:
```bash
vercel --prod
```

## Cách 2: Deploy qua GitHub

1. **Push code lên GitHub repository**

2. **Vào [vercel.com](https://vercel.com) và đăng nhập**

3. **Click "New Project"**

4. **Import repository từ GitHub**

5. **Vercel sẽ tự động detect cấu hình và deploy**

## API Endpoints sau khi deploy

Sau khi deploy, bạn sẽ có các endpoints:

- `https://your-project.vercel.app/cards` - Lấy tất cả lá bài
- `https://your-project.vercel.app/cards/onecard` - Lấy một lá bài ngẫu nhiên
- `https://your-project.vercel.app/tarotdeck/[tên-file].jpeg` - Truy cập ảnh lá bài

## Lưu ý

- Vercel sẽ tự động tạo URL cho project của bạn
- Có thể set custom domain trong Vercel dashboard
- Environment variables có thể set trong Vercel dashboard nếu cần

