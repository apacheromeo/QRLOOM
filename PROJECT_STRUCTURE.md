# QRLoom - Complete Project Structure

This document provides a comprehensive overview of the QRLoom project architecture.

## 📁 Project Directory Structure

```
qrloom/
├── public/                          # Static assets
│   ├── icons/                       # App icons and favicons
│   ├── images/                      # Static images
│   └── locales/                     # Locale-specific assets
│
├── src/
│   ├── app/                         # Next.js 15 App Router
│   │   ├── [locale]/               # Internationalized routes
│   │   │   ├── (auth)/            # Auth routes group
│   │   │   │   ├── signin/        # Sign in page
│   │   │   │   ├── signup/        # Sign up page
│   │   │   │   └── forgot-password/ # Password reset
│   │   │   │
│   │   │   ├── (dashboard)/       # Dashboard routes group
│   │   │   │   ├── dashboard/     # Main dashboard
│   │   │   │   ├── qr-codes/      # QR codes management
│   │   │   │   └── settings/      # User settings
│   │   │   │
│   │   │   ├── (admin)/           # Admin routes group
│   │   │   │   └── admin/         # Admin dashboard
│   │   │   │
│   │   │   ├── pricing/           # Pricing page
│   │   │   ├── docs/              # Documentation
│   │   │   ├── blog/              # Blog
│   │   │   ├── page.tsx           # Home page
│   │   │   └── layout.tsx         # Root layout
│   │   │
│   │   ├── api/                    # API Routes
│   │   │   ├── auth/              # Authentication endpoints
│   │   │   │   ├── user/          # Get current user
│   │   │   │   ├── signin/        # Sign in
│   │   │   │   ├── signup/        # Sign up
│   │   │   │   └── signout/       # Sign out
│   │   │   │
│   │   │   ├── qr/                # QR code endpoints
│   │   │   │   ├── generate/      # Generate QR code
│   │   │   │   ├── [id]/          # Get/Update/Delete QR
│   │   │   │   └── list/          # List user's QR codes
│   │   │   │
│   │   │   ├── analytics/         # Analytics endpoints
│   │   │   │   ├── [id]/          # QR code analytics
│   │   │   │   └── dashboard/     # Dashboard stats
│   │   │   │
│   │   │   ├── payment/           # Payment endpoints
│   │   │   │   ├── checkout/      # Create checkout session
│   │   │   │   ├── portal/        # Billing portal
│   │   │   │   └── webhook/       # Stripe webhooks
│   │   │   │
│   │   │   └── admin/             # Admin endpoints
│   │   │       ├── users/         # User management
│   │   │       ├── stats/         # Admin statistics
│   │   │       └── content/       # Content management
│   │   │
│   │   ├── r/                      # Short URL redirects
│   │   │   └── [code]/            # QR redirect handler
│   │   │
│   │   └── layout.tsx              # Root layout
│   │
│   ├── components/                 # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── toast.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/                # Layout components
│   │   │   ├── header.tsx         # Main header
│   │   │   ├── footer.tsx         # Footer
│   │   │   ├── sidebar.tsx        # Dashboard sidebar
│   │   │   └── mobile-nav.tsx     # Mobile navigation
│   │   │
│   │   ├── qr/                    # QR-specific components
│   │   │   ├── qr-generator.tsx   # QR generation form
│   │   │   ├── qr-preview.tsx     # QR preview display
│   │   │   ├── qr-card.tsx        # QR code card
│   │   │   ├── qr-list.tsx        # QR codes list
│   │   │   ├── qr-customizer.tsx  # Customization panel
│   │   │   └── qr-analytics.tsx   # Analytics display
│   │   │
│   │   ├── dashboard/             # Dashboard components
│   │   │   ├── stats-card.tsx     # Statistics cards
│   │   │   ├── recent-qr.tsx      # Recent QR codes
│   │   │   ├── recent-scans.tsx   # Recent scans
│   │   │   └── charts/            # Chart components
│   │   │       ├── scans-chart.tsx
│   │   │       └── location-chart.tsx
│   │   │
│   │   ├── admin/                 # Admin components
│   │   │   ├── users-table.tsx    # Users management
│   │   │   ├── admin-stats.tsx    # Admin statistics
│   │   │   └── content-editor.tsx # Content management
│   │   │
│   │   ├── auth/                  # Auth components
│   │   │   ├── signin-form.tsx    # Sign in form
│   │   │   ├── signup-form.tsx    # Sign up form
│   │   │   └── oauth-buttons.tsx  # OAuth providers
│   │   │
│   │   ├── pricing/               # Pricing components
│   │   │   ├── pricing-card.tsx   # Plan card
│   │   │   ├── pricing-table.tsx  # Comparison table
│   │   │   └── faq.tsx            # FAQ section
│   │   │
│   │   └── shared/                # Shared components
│   │       ├── theme-toggle.tsx   # Dark/Light mode toggle
│   │       ├── locale-switcher.tsx # Language switcher
│   │       ├── loading.tsx        # Loading states
│   │       ├── error-boundary.tsx # Error handling
│   │       └── ad-banner.tsx      # Advertisement banner
│   │
│   ├── hooks/                      # Custom React hooks
│   │   ├── use-auth.ts            # Authentication hook
│   │   ├── use-qr-generator.ts    # QR generation hook
│   │   ├── use-analytics.ts       # Analytics hook
│   │   ├── use-subscription.ts    # Subscription hook
│   │   ├── use-toast.ts           # Toast notifications
│   │   └── use-debounce.ts        # Debounce utility
│   │
│   ├── stores/                     # Zustand state stores
│   │   ├── auth-store.ts          # Auth state
│   │   ├── qr-store.ts            # QR codes state
│   │   ├── theme-store.ts         # Theme state
│   │   └── ui-store.ts            # UI state
│   │
│   ├── lib/                        # Core utilities & configs
│   │   ├── supabase/              # Supabase clients
│   │   │   ├── client.ts          # Browser client
│   │   │   ├── server.ts          # Server client
│   │   │   └── middleware.ts      # Middleware client
│   │   │
│   │   ├── redis/                 # Redis utilities
│   │   │   └── index.ts           # Redis client & helpers
│   │   │
│   │   ├── stripe/                # Stripe integration
│   │   │   └── index.ts           # Stripe client & helpers
│   │   │
│   │   ├── qr-generator/          # QR generation
│   │   │   └── index.ts           # QR generator class
│   │   │
│   │   ├── analytics/             # Analytics utilities
│   │   │   └── index.ts           # Analytics helpers
│   │   │
│   │   └── utils.ts               # General utilities
│   │
│   ├── types/                      # TypeScript types
│   │   ├── index.ts               # Main types
│   │   └── supabase.ts            # Supabase generated types
│   │
│   ├── i18n/                       # Internationalization
│   │   ├── request.ts             # i18n config
│   │   └── messages/              # Translation files
│   │       ├── en.json            # English
│   │       └── th.json            # Thai
│   │
│   └── styles/                     # Global styles
│       └── globals.css            # Tailwind & custom CSS
│
├── supabase/                       # Supabase configuration
│   ├── migrations/                # Database migrations
│   │   └── 20240101000000_initial_schema.sql
│   │
│   └── config.toml                # Supabase config
│
├── tests/                          # Test files
│   ├── unit/                      # Unit tests
│   ├── integration/               # Integration tests
│   └── e2e/                       # End-to-end tests
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies & scripts
└── README.md                       # Project documentation
```

## 🏗 Architecture Overview

### Frontend Architecture
- **Framework**: Next.js 15 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand
- **Animation**: Framer Motion
- **i18n**: next-intl

### Backend Architecture
- **API**: Next.js API Routes (Serverless)
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Auth**: Supabase Auth
- **Cache**: Upstash Redis
- **Payments**: Stripe

### Key Features Implementation

#### 1. Authentication Flow
```
User → Sign Up/In → Supabase Auth → Profile Creation → Dashboard
```

#### 2. QR Code Generation Flow
```
User Input → Customization → QR Generation (Client/Server) → 
Storage (Supabase) → Short URL Creation → Analytics Setup
```

#### 3. Payment Flow
```
User → Pricing Page → Stripe Checkout → Webhook → 
Database Update → Plan Activation
```

#### 4. Analytics Flow
```
QR Scan → Redirect API → Analytics Collection → 
Redis Cache → Database Storage → Dashboard Display
```

## 🔑 Key Components to Implement

### Priority 1 (Core Functionality)
1. **QR Generator Component** (`src/components/qr/qr-generator.tsx`)
   - URL input
   - Format selection (PNG/SVG/PDF)
   - Color customization
   - Logo upload
   - Real-time preview

2. **Authentication Pages** (`src/app/[locale]/(auth)/`)
   - Sign in
   - Sign up
   - Password reset
   - OAuth integration

3. **Dashboard** (`src/app/[locale]/(dashboard)/dashboard/`)
   - Statistics cards
   - Recent QR codes
   - Quick actions

4. **QR Management** (`src/app/[locale]/(dashboard)/qr-codes/`)
   - List view
   - Detail view
   - Edit/Delete actions
   - Analytics view

### Priority 2 (Enhanced Features)
5. **Payment Integration** (`src/app/api/payment/`)
   - Stripe checkout
   - Webhook handling
   - Subscription management

6. **Analytics Dashboard** (`src/components/qr/qr-analytics.tsx`)
   - Scan statistics
   - Geographic data
   - Device breakdown
   - Charts and graphs

7. **Admin Panel** (`src/app/[locale]/(admin)/admin/`)
   - User management
   - System statistics
   - Content management

### Priority 3 (Polish)
8. **Settings Page** (`src/app/[locale]/(dashboard)/settings/`)
   - Profile management
   - Account settings
   - Preferences

9. **Public Pages**
   - Pricing page
   - Documentation
   - Blog (optional)

10. **Mobile Optimization**
    - Responsive layouts
    - Mobile navigation
    - Touch-friendly interactions

## 🔐 Security Considerations

1. **Authentication**
   - JWT tokens via Supabase
   - Secure cookie handling
   - CSRF protection

2. **Authorization**
   - Row Level Security (RLS) in Supabase
   - API route protection
   - Role-based access control

3. **Data Protection**
   - Input validation (Zod)
   - SQL injection prevention
   - XSS protection

4. **Rate Limiting**
   - Redis-based rate limiting
   - Per-user and per-IP limits
   - API endpoint protection

## 📊 Database Schema Overview

### Core Tables
- **profiles**: User profiles and plan information
- **qrcodes**: QR code data and metadata
- **scans**: Analytics and scan data
- **plans**: Subscription plan definitions
- **subscriptions**: User subscription records

### Storage Buckets
- **qr-codes**: Generated QR code files
- **logos**: User-uploaded logos

## 🎨 Design System

### Colors
- Primary: Modern blue/purple gradient
- Secondary: Complementary accent
- Success: Green
- Warning: Orange
- Error: Red
- Neutral: Grayscale

### Typography
- Headings: Inter/Geist Sans
- Body: Inter/Geist Sans
- Mono: Geist Mono

### Components
- All components use shadcn/ui base
- Consistent spacing (Tailwind scale)
- Smooth transitions and animations
- Accessibility-first approach

## 🚀 Deployment Strategy

### Vercel (Frontend + API)
- Automatic deployments from Git
- Environment variables configuration
- Edge functions for API routes

### Supabase (Backend)
- Production database
- File storage
- Authentication services

### Upstash (Redis)
- Global edge caching
- Rate limiting
- Session storage

## 📝 Next Steps for Development

1. **Setup Environment**
   ```bash
   npm install
   cp .env.example .env.local
   # Fill in environment variables
   ```

2. **Initialize Database**
   ```bash
   npm run db:migrate
   npm run db:types
   ```

3. **Start Development**
   ```bash
   npm run dev
   ```

4. **Build Core Components**
   - Start with QR generator
   - Add authentication
   - Build dashboard
   - Implement analytics

5. **Integrate Payments**
   - Setup Stripe
   - Create checkout flow
   - Handle webhooks

6. **Polish & Deploy**
   - Add error handling
   - Optimize performance
   - Deploy to Vercel

## 🔧 Development Tools

- **VS Code Extensions**:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - TypeScript + Next.js

- **Testing**:
  - Jest for unit tests
  - React Testing Library
  - Playwright for E2E

- **Monitoring**:
  - Vercel Analytics
  - Sentry (optional)
  - Plausible Analytics

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

---

This structure provides a solid foundation for building QRLoom. All core functionality is modular and can be extended as needed. The architecture supports both rapid development and long-term maintainability.
