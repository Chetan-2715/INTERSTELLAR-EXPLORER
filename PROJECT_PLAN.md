# AI Interstellar Explorer - Part 1 Plan

## 1. Full UI Architecture
- **Framework**: Next.js 14+ (App Router)
- **Styling**: CSS Modules with Global Variables (Theming)
- **Animations**: Framer Motion + CSS Keyframes
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Orbitron for headers, Inter/Rajdhani for body)

### Layout Strategy
- **Root Layout**: Global styles, font injection, starfield background context.
- **Landing Page**: Full-screen hero section, parallax layers, looping video/animation.
- **Dashboard Layout**: Sidebar navigation (collapsible), top bar (user status), main content area with glassmorphism cards.

## 2. Folder Structure
```
/app
  /api
    /gemini
      /chat
      /quiz
      /vision
    /weather
      route.ts
  /dashboard
    /astronaut
      page.tsx
    /quiz
      page.tsx
    /vision
      page.tsx
    /weather
      page.tsx
    layout.tsx
    page.tsx (Main Dashboard Overview)
  /login
    page.tsx
  /register
    page.tsx
  layout.tsx
  page.tsx (Landing)
  globals.css
/components
  /ui
    Button.tsx
    Card.tsx
    Input.tsx
    Loader.tsx
    Modal.tsx
  /layout
    Sidebar.tsx
    Navbar.tsx
  /features
    AstronautChat.tsx
    QuizGame.tsx
    SpaceWeatherDashboard.tsx
    VisionAnalyzer.tsx
  /effects
    StarField.tsx
    Nebula.tsx
    ShootingStars.tsx
/lib
  gemini.ts
  weather-api.ts
  utils.ts
/public
  /assets
    space-bg.mp4 (or similar)
```

## 3. Component Breakdown
- **StarField**: Canvas or CSS based animated background.
- **VisionAnalyzer**: File input -> Preview -> API Call -> Result Card.
- **SpaceWeatherDashboard**: Fetches data -> Displays in Gauges/Cards.
- **AstronautChat**: Chat interface with "bubble" messages.
- **QuizGame**: State machine (Setup -> Question -> Result).

## 4. API Integration Plan
- **Gemini API**:
  - Use `google-generative-ai` SDK.
  - Server-side calls to protect API keys.
- **Space Weather API**:
  - NASA Open APIs (DONKI, EONET) or NOAA SWPC.
  - Endpoints: Solar Flare (FLR), Geomagnetic Storm (GST).

## 5. Interaction Flow
1.  **Landing**: User arrives -> Sees animations -> Clicks "Enter Hyperdrive" (Login).
2.  **Login**: Simple form -> Redirect to Dashboard.
3.  **Dashboard**:
    -   **Overview**: Welcome message, quick stats.
    -   **Nav**: User clicks "Vision" -> Vision Page.
    -   **Vision**: Uploads image -> Sees "Analyzing..." -> Result.
    -   **Weather**: Auto-refreshes every 10s.

## 6. Setup Instructions
1.  `npm install`
2.  Set `GEMINI_API_KEY` in `.env.local`
3.  `npm run dev`
