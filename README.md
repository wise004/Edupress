# EduPress - Learning Management System

🎓 **Ko'p tilli zamonaviy LMS platform**

## Loyiha haqida

EduPress - bu zamonaviy Learning Management System (LMS) bo'lib, ta'lim jarayonini raqamlashtirish va samaradorligini oshirish uchun yaratilgan. Platform 3 tilda (O'zbek, Rus, Ingliz) ishlaydi va dark/light mode'ni qo'llab-quvvatlaydi.

## 🚀 Asosiy xususiyatlar

### 📚 Kurslar va Ta'lim
- **Interaktiv video darslar** - HD video content bilan
- **Quiz va testlar** - real-time natijalar bilan
- **Vazifalar (Assignments)** - fayl yuklash va baholash tizimi
- **Sertifikatlar** - kursni tugatgach avtomatik sertifikat
- **Progress tracking** - o'qish jarayonini kuzatish

### 👥 Foydalanuvchilar
- **3 xil rol**: Student, Instructor, Admin
- **Shaxsiy dashboard** - har bir rol uchun maxsus
- **Profil boshqaruvi** - to'liq ma'lumotlar
- **Real-time bildirishnomalar**

### 💰 To'lov tizimi
- **PayMe integratsiya** - O'zbekiston uchun
- **Stripe** - xalqaro to'lovlar
- **Kurs xaridlari** - xavfsiz to'lov
- **To'lov tarixi** - batafsil hisobotlar

### 🌍 Ko'p tillilik
- **3 til**: O'zbek, Rus, Ingliz tillar
- **Real-time til almashtirish**
- **To'liq tarjima** - barcha sahifalar va komponentlar

### 🎨 Zamonaviy dizayn
- **Dark/Light mode** - foydalanuvchi tanloviga ko'ra
- **Responsive design** - barcha qurilmalarda
- **Modern UI/UX** - TailwindCSS bilan
- **Smooth animations** - professional ko'rinish

## 🛠 Texnologiyalar

### Frontend
- **React 18** + **TypeScript**
- **Vite** - tez build tool
- **TailwindCSS** - zamonaviy styling
- **React Router** - sahifa navigatsiya
- **React i18next** - ko'p tillilik
- **Lucide React** - modern iconlar

### Backend
- **Java Spring Boot 3**
- **Spring Security** - JWT authentication
- **Spring Data JPA** - database boshqaruvi
- **H2/MySQL** - database
- **Maven** - dependency management
- **RESTful API** - frontend bilan aloqa

## 📁 Loyiha strukturasi

```
LMS/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # UI komponentlar
│   │   ├── pages/         # Sahifalar
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   ├── i18n/          # Tillar konfiguratsiyasi
│   │   └── types/         # TypeScript types
│   └── public/
├── backend/           # Spring Boot backend
│   └── src/
│       ├── main/java/com/edupress/
│       │   ├── controller/    # REST controllers
│       │   ├── service/       # Business logic
│       │   ├── model/         # Entity models
│       │   ├── repository/    # Data access
│       │   ├── security/      # Authentication
│       │   └── config/        # Konfiguratsiya
│       └── resources/
└── .gitignore
```

## 🚀 Ishga tushirish

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Server: http://localhost:5173

### Backend
```bash
cd backend
mvn spring-boot:run
```
API Server: http://localhost:8080

## 📱 Asosiy sahifalar

### Public sahifalar
- **/** - Bosh sahifa
- **/courses** - Barcha kurslar
- **/about** - Biz haqimizda
- **/contact** - Aloqa
- **/login** - Kirish
- **/signup** - Ro'yxatdan o'tish

### Legal sahifalar
- **/terms** - Foydalanish shartlari
- **/privacy** - Maxfiylik siyosati
- **/cookies** - Cookie siyosati

### Dashboard sahifalar
- **/dashboard** - Student dashboard
- **/instructor** - Instructor dashboard
- **/admin** - Admin dashboard

## 🔐 Authentication

JWT (JSON Web Token) orqali xavfsiz authentication tizimi:
- Login/Signup
- Role-based access control
- Secure password hashing
- Token refresh mechanism

## 💳 To'lov tizimi

### PayMe (O'zbekiston)
- UzCard/Humo kartalar
- Real-time to'lov tasdiqlash
- To'lov tarixi

### Stripe (Xalqaro)
- Visa/MasterCard
- Xavfsiz to'lov processing
- Subscription model

## 🌐 Ko'p tillilik

`react-i18next` yordamida to'liq ko'p tillilik:
- **O'zbek tili** - asosiy til
- **Rus tili** - to'liq tarjima
- **Ingliz tili** - xalqaro foydalanuvchilar

## 🎨 Theme System

TailwindCSS dark mode bilan:
- Light mode - kunduzgi tema
- Dark mode - tungi tema
- Foydalanuvchi tanlovini saqlash
- Barcha komponentlar uchun mos

## 📊 Admin Panel

To'liq boshqaruv paneli:
- Foydalanuvchilar boshqaruvi
- Kurslar boshqaruvi
- To'lovlar monitoringi
- Analytics va hisobotlar
- PayMe tranzaksiyalar

## 🔧 Development

### Yangi komponent qo'shish
```bash
# Frontend
cd frontend/src/components
# Yangi komponent yaratish

# Backend
cd backend/src/main/java/com/edupress
# Yangi service/controller yaratish
```

### Database
H2 in-memory database development uchun, MySQL production uchun.

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# dist/ papkasini deploy qiling
```

### Backend (Heroku/AWS)
```bash
mvn clean package
# JAR faylni server'ga deploy qiling
```

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating
3. Commit qiling
4. Push qiling
5. Pull Request yarating

## 📄 License

MIT License - batafsil ma'lumot uchun LICENSE faylini ko'ring.

## 📞 Aloqa

- **Email**: support@edupress.com
- **GitHub**: https://github.com/wise004/Edupress
- **Website**: https://edupress.uz

---

🎓 **EduPress** - Ta'limda yangi davr!
