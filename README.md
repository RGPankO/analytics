# @21digital/analytics

Privacy-first, self-hosted analytics for Next.js applications. Track pageviews, custom events, and user behavior without compromising privacy.

## Features

✅ **Privacy-first** - No cookies, IP addresses discarded, GDPR compliant  
✅ **Self-hosted** - Your data stays on your infrastructure  
✅ **Zero config tracker** - Automatic pageview and session tracking  
✅ **Custom events** - Track any user action with simple API  
✅ **Beautiful dashboard** - Pre-built React components with charts  
✅ **Dependency injection** - Bring your own Prisma instance  
✅ **Themeable** - Full customization via CSS custom properties  
✅ **TypeScript** - Full type safety  

## Installation

### 1. Install as Git Dependency

```json
{
  "dependencies": {
    "@21digital/analytics": "github:RGPankO/analytics"
  }
}
```

```bash
npm install
```

### 2. Add Prisma Models

Copy models from `src/schema/schema.prisma` to your `schema.prisma`, or run the migration:

```bash
psql -U youruser -d yourdb -f node_modules/@21digital/analytics/src/schema/migration.sql
```

If you use Prisma schemas, add `@@schema("your_schema_name")` to each model.

Then generate Prisma client:

```bash
npx prisma generate
```

### 3. Wire API Routes

Create these route handlers in your Next.js app:

**`app/api/analytics/pageviews/route.ts`**
```ts
import { createPageviewsHandler } from '@21digital/analytics';
import { prisma } from '@/lib/db/prisma';

export const GET = createPageviewsHandler({ prisma });
```

**`app/api/analytics/top-pages/route.ts`**
```ts
import { createTopPagesHandler } from '@21digital/analytics';
import { prisma } from '@/lib/db/prisma';

export const GET = createTopPagesHandler({ prisma });
```

**`app/api/analytics/sessions/stats/route.ts`**
```ts
import { createSessionsStatsHandler } from '@21digital/analytics';
import { prisma } from '@/lib/db/prisma';

export const GET = createSessionsStatsHandler({ prisma });
```

**`app/api/analytics/collect/route.ts`**
```ts
import { createCollectHandler, createCollectOptionsHandler } from '@21digital/analytics';
import { prisma } from '@/lib/db/prisma';

export const POST = createCollectHandler({ prisma });
export const OPTIONS = createCollectOptionsHandler();
```

### 4. Add Tracker Script

Copy `src/tracker/tracker.js` to `public/analytics/tracker.js`, then add to your layout:

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <script 
          src="/analytics/tracker.js" 
          data-website-id="my-site" 
          async 
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 5. Add Dashboard

```tsx
// app/analytics/page.tsx
import { AnalyticsDashboard } from '@21digital/analytics';
import '@21digital/analytics/dist/styles/analytics.css';

export default function AnalyticsPage() {
  return (
    <div className="container">
      <h1>Analytics</h1>
      <AnalyticsDashboard />
    </div>
  );
}
```

## Usage

### Automatic Tracking

The tracker script automatically records:
- Every pageview (with referrer, duration)
- Every visitor session (device, browser, OS, country)
- SPA navigation (works with Next.js App Router)

### Custom Event Tracking

Track any user action with the global `analytics` object:

```tsx
// Button click
<button onClick={() => {
  analytics.trackEvent('button_clicked', { 
    button: 'signup',
    location: 'hero' 
  });
}}>
  Sign Up
</button>

// Quiz completion
analytics.trackEvent('quiz_completed', {
  score: 8,
  difficulty: 'senior',
  quizId: quiz.id
});

// Premium signup
analytics.trackEvent('premium_signup', {
  plan: 'monthly',
  price: 5
});

// Chat interaction
analytics.trackEvent('chat_message_sent', {
  messageLength: message.length
});
```

### Data Attributes (Declarative Tracking)

```tsx
<button 
  data-analytics-event="cta_clicked"
  data-analytics-location="hero"
  data-analytics-variant="primary"
>
  Get Started
</button>
```

## Customization

### Theming

Override CSS custom properties to match your design:

```css
.analytics-dashboard {
  --analytics-bg: #1a1a2e;
  --analytics-accent: #0f766e;
  --analytics-card-bg: rgba(255,255,255,0.05);
  --analytics-card-border: rgba(255,255,255,0.1);
  --analytics-text: #e2e8f0;
  --analytics-text-muted: #94a3b8;
  --analytics-border-radius: 16px;
}
```

### Component Props

```tsx
<AnalyticsDashboard
  apiBasePath="/api/analytics"
  periods={[
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
    { value: '90d', label: 'Last 90 days' },
  ]}
  defaultPeriod="30d"
  className="my-custom-class"
/>
```

### Tracker Configuration

```html
<script 
  src="/analytics/tracker.js"
  data-website-id="my-site"          <!-- Required: unique site identifier -->
  data-host-url="https://api.example.com"  <!-- Optional: custom API endpoint -->
  data-auto-track="false"            <!-- Optional: disable automatic tracking -->
  async
/>
```

## Architecture

- **Tracker**: Vanilla JS (~5KB), no dependencies, privacy-focused
- **Backend**: Next.js API routes with Prisma ORM
- **Database**: PostgreSQL (via Prisma)
- **Dashboard**: React + Recharts for visualization
- **Styling**: CSS custom properties for full theming control

## Privacy

- ✅ **No cookies** - Session tracking via client-generated fingerprints
- ✅ **IP discarded** - Only used for country-level GeoIP, then discarded
- ✅ **No PII** - Never links analytics to user accounts
- ✅ **90-day retention** - Old data automatically pruned (optional)
- ✅ **GDPR compliant** - Privacy by design

## Development

```bash
# Clone repo
git clone https://github.com/RGPankO/analytics.git
cd analytics

# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## Updates

To get the latest version:

```bash
npm update @21digital/analytics
```

All bugfixes and improvements propagate automatically to all consumers.

## License

MIT

## Credits

Tracker adapted from [Umami](https://umami.is) (MIT license).  
Built with ❤️ by [21digital](https://github.com/RGPankO).
