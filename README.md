# QRLoom 🎨

A modern, minimalist QR code generator with powerful features - inspired by imgloom.com

## 🚀 Features

### Core Features
- **Beautiful QR Generation**: Generate QR codes from any URL or text
- **Multiple Formats**: Export as PNG, SVG, or PDF
- **Customization**: Custom colors, logo upload, and branding
- **Permanent Storage**: Save and access your QR codes anytime
- **Dark/Light Mode**: Modern glassmorphism design
- **Bilingual**: Thai (ไทย) and English support

### User Tiers
- **Guest**: Unlimited temporary QR codes
- **Free Account**: Save QR codes with basic analytics
- **Pro Account**: 
  - Dynamic QR codes (editable redirect links)
  - Advanced analytics (scan tracking, geo-location)
  - Custom branding and logos
  - Ad-free experience
  - Priority support

### Admin Features
- User management dashboard
- QR creation statistics
- Content management (multilingual)
- Revenue and subscription tracking

## 🛠 Tech Stack

### Frontend
- **Next.js 15** with React 19 and TypeScript
- **TailwindCSS** + **shadcn/ui** for components
- **Framer Motion** for animations
- **next-intl** for i18n (Thai/English)
- **Zustand** for state management

### Backend
- **Next.js API Routes** (serverless)
- **Supabase** (Auth, Database, Storage)
- **Upstash Redis** (Caching, Rate Limiting)
- **qr-code-styling** for QR generation
- **Stripe** for payments

### Infrastructure
- **Vercel** for deployment
- **Supabase** for backend services
- **Upstash** for Redis
- **Google AdSense** for monetization

## 📦 Project Structure

```
qrloom/
├── src/
│   ├── app/                    # Next.js 15 app directory
│   │   ├── [locale]/          # i18n routing
│   │   ├── api/               # API routes
│   │   └── layout.tsx
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── qr/               # QR-specific components
│   │   ├── dashboard/        # Dashboard components
│   │   └── admin/            # Admin components
│   ├── lib/                   # Utilities and configs
│   │   ├── supabase/         # Supabase client
│   │   ├── redis/            # Upstash Redis
│   │   ├── stripe/           # Payment processing
│   │   └── qr-generator/     # QR generation logic
│   ├── hooks/                 # Custom React hooks
│   ├── stores/                # Zustand stores
│   ├── types/                 # TypeScript types
│   └── i18n/                  # Internationalization
├── public/                    # Static assets
├── supabase/                  # Supabase migrations
└── tests/                     # Test files
```

## 🚦 Getting Started

### Prerequisites
- Node.js 20+ and npm/pnpm
- Supabase account
- Upstash Redis account
- Stripe account (for payments)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <your-repo>
cd qrloom
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
```

Fill in your environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Upstash Redis
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Set up Supabase:**
```bash
# Run migrations
npm run db:migrate

# Generate types
npm run db:types
```

4. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🗄 Database Schema

### Tables
- `users` - User accounts with plan information
- `qrcodes` - Generated QR codes with metadata
- `scans` - Analytics data for QR scans
- `plans` - Subscription plan definitions
- `subscriptions` - User subscription records

See `supabase/migrations/` for full schema.

## 🔐 Authentication

Supabase Auth with:
- Email/Password
- Google OAuth (optional)
- Magic Link (optional)

## 💳 Payment Integration

Stripe integration with:
- Monthly/Yearly subscriptions
- One-time purchases
- Webhook handling for subscription events
- Customer portal for self-service

## 🌍 Internationalization

Supports Thai (ไทย) and English with:
- URL-based locale routing (`/en`, `/th`)
- Automatic locale detection
- Easy content management via JSON files

## 📊 Analytics

Track QR code scans with:
- Timestamp
- Geolocation (city/country)
- Device type
- Referrer

## 🎨 Theming

- Light/Dark mode toggle
- Glassmorphism design elements
- Consistent color palette
- Accessible contrast ratios

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy!

```bash
npm run build
```

### Environment Setup

Ensure all production environment variables are set:
- Supabase production credentials
- Stripe live keys
- Redis production instance
- Google AdSense (if using)

## 📝 Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
npm run test         # Run tests
npm run db:migrate   # Run Supabase migrations
npm run db:types     # Generate TypeScript types
```

## 🔒 Security

- API rate limiting via Upstash Redis
- CORS configuration
- Input validation and sanitization
- Secure file upload handling
- SQL injection prevention (via Supabase)

## 📈 Performance

- Image optimization via Next.js
- Static generation where possible
- API route caching
- Redis caching for expensive operations
- Lazy loading of components

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🙋 Support

For support, email support@qrloom.com or open an issue on GitHub.

## 🗺 Roadmap

- [ ] API endpoint for developers (Pro tier)
- [ ] Smart QR (device/region-based redirects)
- [ ] Custom short domains
- [ ] Bulk QR generation
- [ ] QR code templates library
- [ ] White-label solutions for enterprises

---

Built with ❤️ using Next.js, Supabase, and modern web technologies.
# Deployment: Thu Nov  6 09:52:04 UTC 2025
