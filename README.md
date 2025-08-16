# 🎴 Zumenzu - Interactive Python Learning with Anime Cards

**Learn Python programming while collecting anime cards, earning badges, and completing daily quests!**

![Next.js](https://img.shields.io/badge/Next.js-15.4.5-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC)

## ✨ Features

### 🎯 Gamified Learning

- **Interactive Python Lessons** - Learn through hands-on coding
- **Anime Card Collection** - Collect cards by completing lessons
- **Badge System** - Earn achievements for your progress
- **Daily Quests** - Complete daily challenges for rewards
- **XP & Leveling** - Progress through levels as you learn

### 💎 Virtual Economy

- **Diamond Currency** - Earn and spend virtual diamonds
- **Card Packs** - Open mystery card packs
- **Shop System** - Buy cards and upgrades
- **Payment Integration** - Stripe & Shopier support

### 🏆 Learning Features

- **Code Arena** - Interactive coding challenges
- **Mini Quizzes** - Test your knowledge
- **Progress Tracking** - Monitor your learning journey
- **Streak System** - Maintain learning streaks
- **Adaptive Learning** - Personalized learning paths

### 🎨 Modern UI/UX

- **Responsive Design** - Works on all devices
- **Dark/Light Mode** - User preference support
- **Animations** - Smooth Framer Motion animations
- **Card Effects** - Beautiful card designs with rarity effects

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd anime-card-manager
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. **Set up the database**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed the database
npm run db:seed
```

5. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application!

## 🏗️ Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **TailwindCSS 4** - Utility-first CSS framework
- **Framer Motion** - Animation library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication (planned)

### Payment & Services

- **Stripe** - International payments
- **Shopier** - Turkish payment gateway
- **Sharp** - Image processing

### Development

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework
- **TypeScript** - Static type checking

## 📁 Project Structure

```
anime-card-manager/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Authentication pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # User dashboard
│   │   └── shop/              # Card shop
│   ├── components/            # React components
│   │   ├── admin/             # Admin components
│   │   ├── cards/             # Card-related components
│   │   ├── navigation/        # Navigation components
│   │   └── ui/                # Reusable UI components
│   ├── contexts/              # React contexts
│   ├── lib/                   # Utility libraries
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
├── public/                    # Static assets
└── scripts/                   # Utility scripts
```

## 🧹 Root Cleanup and Scripts Layout

The root directory has been cleaned up to reduce clutter. Operational scripts, guides, exports, and SQL files have been grouped into dedicated folders. NPM script paths were updated accordingly in [`package.json`](package.json).

- Maintenance scripts moved to: `scripts/maintenance/`
  - [`scripts/maintenance/fix-next-assets.js`](scripts/maintenance/fix-next-assets.js)
  - [`scripts/maintenance/enhanced-asset-fix.js`](scripts/maintenance/enhanced-asset-fix.js)
  - [`scripts/maintenance/ultimate-fix.js`](scripts/maintenance/ultimate-fix.js)
  - [`scripts/maintenance/cache-fix-script.js`](scripts/maintenance/cache-fix-script.js)
  - [`scripts/maintenance/check_recovery.js`](scripts/maintenance/check_recovery.js)

- Checks moved to: `scripts/checks/`
  - [`scripts/checks/check-activities.ts`](scripts/checks/check-activities.ts)
  - [`scripts/checks/check-blog-content.js`](scripts/checks/check-blog-content.js)
  - [`scripts/checks/check-categories.js`](scripts/checks/check-categories.js)
  - [`scripts/checks/check-duplicate-tips.js`](scripts/checks/check-duplicate-tips.js)
  - [`scripts/checks/check-python-tips.js`](scripts/checks/check-python-tips.js)

- Fix utilities moved to: `scripts/fixes/`
  - [`scripts/fixes/clean-duplicate-tips.js`](scripts/fixes/clean-duplicate-tips.js)
  - [`scripts/fixes/cleanup-duplicates.ts`](scripts/fixes/cleanup-duplicates.ts)
  - [`scripts/fixes/cleanup-bad-cards.js`](scripts/fixes/cleanup-bad-cards.js)
  - [`scripts/fixes/fix-activity-types.js`](scripts/fixes/fix-activity-types.js)
  - [`scripts/fixes/fix-categories.ts`](scripts/fixes/fix-categories.ts)
  - [`scripts/fixes/fix-content-structure.js`](scripts/fixes/fix-content-structure.js)
  - [`scripts/fixes/fix-python-tips-tags.js`](scripts/fixes/fix-python-tips-tags.js)

- Exports moved to: `scripts/exports/`
  - [`scripts/exports/export-blogs.js`](scripts/exports/export-blogs.js)
  - [`scripts/exports/export-clean-python-tips.js`](scripts/exports/export-clean-python-tips.js)
  - [`scripts/exports/export-code-arena.js`](scripts/exports/export-code-arena.js)
  - [`scripts/exports/export-comprehensive-system-data.js`](scripts/exports/export-comprehensive-system-data.js)
  - [`scripts/exports/export-quiz-arena.js`](scripts/exports/export-quiz-arena.js)
  - [`scripts/exports/get-all-blogs.js`](scripts/exports/get-all-blogs.js)

- Debug moved to: `scripts/debug/`
  - [`scripts/debug/debug-db.js`](scripts/debug/debug-db.js)
  - [`scripts/debug/debug-categories.ts`](scripts/debug/debug-categories.ts)

- Docker helpers moved to: `scripts/docker/`
  - [`scripts/docker/docker-build.bat`](scripts/docker/docker-build.bat)
  - [`scripts/docker/docker-build.sh`](scripts/docker/docker-build.sh)

- Tests moved to: `scripts/tests/`
  - [`scripts/tests/test_algorithm_urls.js`](scripts/tests/test_algorithm_urls.js)
  - [`scripts/tests/test-cleanup.js`](scripts/tests/test-cleanup.js)

- SQL moved to: `scripts/sql/`
  - [`scripts/sql/check_db.sql`](scripts/sql/check_db.sql)
  - [`scripts/sql/normalize_categories.sql`](scripts/sql/normalize_categories.sql)
  - [`scripts/sql/delete_placeholder_cards.sql`](scripts/sql/delete_placeholder_cards.sql)

- Data exports moved to: `data/exports/`
  - [`data/exports/blog-data-export.json`](data/exports/blog-data-export.json)
  - [`data/exports/clean-python-tips-export.json`](data/exports/clean-python-tips-export.json)
  - [`data/exports/lesson-update-payload.json`](data/exports/lesson-update-payload.json)
  - [`data/exports/python-beginner-content.json`](data/exports/python-beginner-content.json)

- Backups grouped under: `backups/`
  - [`backups/code-arena-backup-2025-08-11T22-15-18-686Z.json`](backups/code-arena-backup-2025-08-11T22-15-18-686Z.json)
  - [`backups/comprehensive-system-backup-2025-08-11.json`](backups/comprehensive-system-backup-2025-08-11.json)
  - [`backups/quiz-arena-backup-2025-08-11T22-15-11-853Z.json`](backups/quiz-arena-backup-2025-08-11T22-15-11-853Z.json)

- Next config backups moved to: `docs/backups/`
  - [`docs/backups/next.config.backup.js`](docs/backups/next.config.backup.js)
  - [`docs/backups/next.config.minimal.backup.js`](docs/backups/next.config.minimal.backup.js)

- Guides moved to: `docs/guides/`
  - [`docs/guides/COOLIFY-DEBUG-GUIDE.md`](docs/guides/COOLIFY-DEBUG-GUIDE.md)
  - [`docs/guides/COOLIFY-PROXY-FIX.md`](docs/guides/COOLIFY-PROXY-FIX.md)
  - [`docs/guides/CSS_CACHE_FIX_GUIDE.md`](docs/guides/CSS_CACHE_FIX_GUIDE.md)
  - [`docs/guides/NEXT_ASSET_FIX_GUIDE.md`](docs/guides/NEXT_ASSET_FIX_GUIDE.md)
  - [`docs/guides/FINAL_STATIC_ASSET_FIX.md`](docs/guides/FINAL_STATIC_ASSET_FIX.md)
  - [`docs/guides/VPS-FIX-GUIDE.md`](docs/guides/VPS-FIX-GUIDE.md)
  - [`docs/guides/SYSTEM_RECOVERY.md`](docs/guides/SYSTEM_RECOVERY.md)
  - [`docs/guides/deploy-instructions.md`](docs/guides/deploy-instructions.md)
  - [`docs/guides/CHALLENGE_TYPES_DOCUMENTATION.md`](docs/guides/CHALLENGE_TYPES_DOCUMENTATION.md)

- Migrations utilities grouped to: `scripts/migrations/`
  - (e.g.) [`scripts/migrations/migrate-code-arena-to-learning-activities.js`](scripts/migrations/migrate-code-arena-to-learning-activities.js)

Updated NPM scripts in [`package.json`](package.json):

- dev:fix → `node scripts/maintenance/fix-next-assets.js && npm run dev`
- dev:fresh → `node scripts/maintenance/ultimate-fix.js && npm run dev`
- dev:assets → `node scripts/maintenance/enhanced-asset-fix.js && npm run dev`
- cache:clear → `node scripts/maintenance/cache-fix-script.js`
- fix:assets → `node scripts/maintenance/fix-next-assets.js`
- ultimate:fix → `node scripts/maintenance/ultimate-fix.js`

Root remains with only essential configs (Next.js, Tailwind, ESLint, Jest, tsconfig, env files).

## 🔧 Environment Variables

Key environment variables you need to set:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/anime_cards_db"

# Application
NEXT_PUBLIC_BASE_URL="https://zumenzu.com"
NEXTAUTH_SECRET="your-nextauth-secret"

# Payments (Optional)
STRIPE_SECRET_KEY="your-stripe-secret-key"
SHOPIER_API_KEY="your-shopier-api-key"

# Admin
ADMIN_SECRET_KEY="your-admin-secret-key"
```

## 🚀 Deployment

### Coolify Deployment

1. **Build the application**

```bash
npm run build
```

2. **Deploy to Coolify**
   - Set environment variables in Coolify dashboard
   - Configure PostgreSQL database
   - Deploy using Git integration

### Manual Deployment

1. **Build and start**

```bash
npm run build
npm start
```

## 📊 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run db:seed` - Seed database with sample data
- `npm run test` - Run tests

## 🔒 Security Features

- **Security Headers** - XSS, CSRF protection
- **Input Validation** - Zod schema validation
- **SQL Injection Protection** - Prisma ORM
- **Rate Limiting** - API endpoint protection
- **Environment Security** - Sensitive data protection

## 🎮 Game Mechanics

### Card Rarity System

- **Common** (75%) - Basic cards
- **Uncommon** (20%) - Slightly rare cards
- **Rare** (4%) - Valuable cards
- **Epic** (0.9%) - Very rare cards
- **Legendary** (0.1%) - Ultra rare cards

### Diamond Economy

- Earn diamonds through learning activities
- Purchase card packs with diamonds
- Buy premium features and upgrades

### Progress System

- XP system with level progression
- Daily login bonuses
- Streak rewards for consistent learning

## 📈 Analytics & Monitoring

- Health check endpoint: `/api/health`
- User progress tracking
- Learning analytics
- Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is proprietary software. All rights reserved.

## 🌟 Support

For support and questions:

- Email: support@zumenzu.com
- Documentation: [docs.zumenzu.com](https://docs.zumenzu.com)

---

**Made with ❤️ for Python learners and anime fans!**
