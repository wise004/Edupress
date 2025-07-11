# Payme Integration for EduPress

Ushbu loyihada Payme (Paycom) to'lov tizimi to'liq integratsiya qilingan. Barcha kerakli Merchant API methodlari va frontend komponentlari yaratilgan.

## Backend Components

### 1. PaymeTransaction Entity
- `src/main/java/com/edupress/model/PaymeTransaction.java`
- Payme tranzaksiyalarini saqlash uchun JPA entity
- Barcha kerakli fieldlar: transactionId, state, amount, times, va boshqalar
- Tax detail uchun soliq ma'lumotlari

### 2. PaymeRequest/PaymeResponse DTOs
- `src/main/java/com/edupress/dto/request/PaymeRequest.java`
- `src/main/java/com/edupress/dto/response/PaymeResponse.java`
- JSON-RPC 2.0 protokoli bo'yicha so'rovlar va javoblar
- Tax detail fieldlari: title, price, count, code, package_code, vat_percent

### 3. PaymeTransactionRepository
- `src/main/java/com/edupress/repository/PaymeTransactionRepository.java`
- Barcha kerakli queries: findByPaymeTransactionId, countByState, va boshqalar

### 4. PaymeService
- `src/main/java/com/edupress/service/PaymeService.java`
- Barcha Merchant API methodlari:
  - `CheckPerformTransaction` - to'lov imkoniyatini tekshirish
  - `CreateTransaction` - tranzaksiya yaratish
  - `PerformTransaction` - to'lovni amalga oshirish
  - `CancelTransaction` - to'lovni bekor qilish
  - `CheckTransaction` - tranzaksiya holatini tekshirish
  - `GetStatement` - davr bo'yicha hisobot
- Real-time notification va email integratsiyasi

### 5. PaymeController
- `src/main/java/com/edupress/controller/PaymeController.java`
- `/api/payme/endpoint` - asosiy Payme endpoint
- IP whitelist va authentication tekshiruvi
- Frontend uchun yordamchi endpointlar

## Frontend Components

### 1. PaymePayment Component
- `src/components/PaymePayment.tsx`
- Payme to'lov interfeysi
- To'lov URL yaratish va redirect
- Real-time status polling
- Uzbek tilida UI

### 2. PaymeTransactionList Component
- `src/components/PaymeTransactionList.tsx`
- Foydalanuvchi tranzaksiyalari ro'yxati
- Har bir tranzaksiya uchun batafsil ma'lumot
- Status filterlash va yangilash

### 3. Payment Integration
- `CoursePage.tsx` - Payme/Stripe tanlov modali
- `DashboardPage.tsx` - to'lov tarixi tab
- `PaymentAPI` - frontend API client
- Real-time notifications

## Configuration

### application.properties
```properties
# Payme Configuration
payme.merchant.id=your_merchant_id_here
payme.merchant.key=your_merchant_key_here  
payme.test.key=your_test_key_here
payme.checkout.url=https://checkout.paycom.uz
payme.allowed.ips=185.8.212.184,185.8.212.185,217.29.66.102,217.29.66.103
```

## Security Features

1. **IP Whitelist** - Faqat Payme serverlaridan so'rovlarni qabul qilish
2. **Basic Authentication** - Merchant key bilan autentifikatsiya
3. **Transaction Validation** - Har bir tranzaksiya to'g'riligini tekshirish
4. **Idempotency** - Bir xil so'rovlarni qayta ishlamaslik

## Tax Integration

Barcha to'lovlar uchun soliq ma'lumotlari:
- **MXIK kodi**: 62020900 (onlayn ta'lim xizmatlari)
- **Package kodi**: 796
- **QQS**: 12%

## Testing

1. Backend serverni ishga tushiring: `mvn spring-boot:run`
2. Payme test environmentdan so'rov yuboring
3. Frontend'da to'lov oqimini test qiling

## Production Deployment

1. Merchant ID va kalitlarni real qiymatlar bilan almashtiring
2. IP whitelistni production serverlar bilan yangilang
3. SSL sertifikatlarini sozlang
4. Log monitoring qo'shing

## API Endpoints

### Payme Merchant API
- `POST /api/payme/endpoint` - Asosiy Payme endpoint

### Frontend API
- `POST /api/payme/payment-url` - To'lov URL yaratish
- `GET /api/payme/transaction/{id}/status` - Tranzaksiya holati
- `GET /api/payme/my-transactions` - Foydalanuvchi tranzaksiyalari
- `GET /api/payme/stats` - To'lov statistikasi (admin)

## Real-time Features

1. **WebSocket Notifications** - To'lov holati o'zgarishi haqida real-time xabarlar
2. **Email Notifications** - Muvaffaqiyatli/bekor qilingan to'lovlar haqida email
3. **Status Polling** - Frontend'da avtomatik status tekshiruvi

Bu integratsiya Payme Merchant API protokolining barcha talablariga javob beradi va production muhitida ishlatishga tayyor.
