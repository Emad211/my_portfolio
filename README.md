# Vibe Prompt Studio

Vibe Prompt Studio یک وب‌اپلیکیشن RTL است که برای تولید «Prompt Pack»های فصل-محور از روی دانش‌نامه کتاب وایب‌کدینگ و ورودی‌های دقیق کاربر طراحی شده است. این پروژه با استفاده از یک پایپ‌لاین RAG (Retrieval-Augmented Generation) عامل-محور، پرامپت‌های استاندارد و باکیفیت تولید می‌کند.

## پشته فنی (Tech Stack)

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, RTL
- **Backend**: Next.js Route Handlers (Node.js & Edge Runtimes)
- **AI**: Vercel AI SDK, OpenAI (`gpt-4o-mini`, `text-embedding-3-small`)
- **Vector DB**: Qdrant Cloud
- **Database**: Vercel Postgres (Neon) with Drizzle ORM
- **Authentication**: NextAuth.js (Email Provider)
- **Deployment**: Vercel

## راه‌اندازی و استقرار

### ۱. پیش‌نیازها

- Node.js (نسخه 18 یا بالاتر)
- یک حساب کاربری در Vercel
- یک پایگاه داده Vercel Postgres
- یک پایگاه داده Vercel KV (برای Rate Limiting در آینده)
- یک حساب کاربری Qdrant Cloud
- یک کلید API از OpenAI

### ۲. تنظیم متغیرهای محیطی

یک فایل `.env.local` در ریشه پروژه ایجاد کرده و متغیرهای زیر را در آن قرار دهید:

```env
# OpenAI API Key
OPENAI_API_KEY="sk-..."

# Qdrant Cloud Credentials
QDRANT_URL="https://your-cluster-url.cloud.qdrant.io"
QDRANT_API_KEY="..."

# Vercel Postgres Connection String
POSTGRES_URL="postgres://..."

# NextAuth.js Configuration
# A secret used to sign cookies and tokens
NEXTAUTH_SECRET="your-super-secret-string"
# The canonical URL of your production site
NEXTAUTH_URL="http://localhost:3000" # For local dev, change for production

# NextAuth.js Email Provider (optional, for production)
# You need a configured SMTP server for the Email provider to work.
# Vercel handles this automatically for domains you own.
# EMAIL_SERVER="smtp://user:pass@smtp.example.com:587"
# EMAIL_FROM="noreply@example.com"
```

**نکته**: برای استقرار روی Vercel، این متغیرها را در بخش **Settings > Environment Variables** پروژه خود وارد کنید.

### ۳. نصب وابستگی‌ها

```bash
npm install
```

### ۴. اجرای پایگاه داده (Migrations)

برای اعمال اسکیمای پایگاه داده، ابتدا باید یک migration تولید کرده و سپس آن را اجرا کنید. (این دستورات نیاز به `drizzle-kit` دارند که به عنوان dev dependency نصب شده است).

```bash
# این دستور یک فایل SQL در پوشه /drizzle تولید می‌کند
npm run db:generate

# برای اعمال migration به پایگاه داده Vercel Postgres خود، باید به صورت دستی آن را اجرا کنید.
# Vercel Data -> انتخاب دیتابیس -> Query
```
*توجه: در یک محیط CI/CD کامل، این فرآیند می‌تواند خودکار شود.*

### ۵. اجرای سرور توسعه

```bash
npm run dev
```

برنامه شما اکنون روی آدرس `http://localhost:3000` در دسترس است.

### ۶. بیلد و استقرار

برای ساخت نسخه بهینه‌سازی شده برای پروداکشن، دستور زیر را اجرا کنید:

```bash
npm run build
```

برای استقرار، پروژه خود را به یک ریپازیتوری گیت (مانند GitHub) پوش کرده و آن را به Vercel متصل کنید. Vercel به صورت خودکار با هر `push` به برنچ اصلی، یک بیلد جدید را مستقر خواهد کرد.
