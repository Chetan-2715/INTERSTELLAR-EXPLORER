# AI Interstellar Explorer 🌌

A futuristic, space-themed AI dashboard powered by Google Gemini and real-time Space Weather APIs.

## 🚀 Features (Part 1)

1.  **Immersive Landing Page**: 3D Starfield animation, parallax effects, and neon aesthetics.
2.  **Vision Analysis**: Upload space imagery and get instant scientific identification using Gemini Vision.
3.  **Real-Time Space Weather**: Live telemetry from NOAA satellites (Geomagnetic Storms, Solar Wind, Flares).
4.  **AI Co-Pilot**: Holographic chat interface with an AI Astronaut Assistant.
5.  **Cosmic Quiz**: Dynamically generated quizzes based on difficulty levels.

## 🛠️ Tech Stack

-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS + CSS Modules
-   **Animations**: Framer Motion + Canvas API
-   **AI**: Google Gemini API (`@google/generative-ai`)
-   **Icons**: Lucide React

## 🛸 Setup Instructions

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add your Gemini API key:
    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

3.  **Launch Mission**:
    ```bash
    npm run dev
    ```

4.  **Access Control**:
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
/app
  /api          # Server-side API routes (Gemini, Weather)
  /dashboard    # Protected application routes
  /login        # Authentication
  page.tsx      # Landing page
/components
  /effects      # Visual effects (StarField, etc.)
  /ui           # Reusable UI components (Buttons, Cards)
  /layout       # Sidebar, Navbar
/lib            # Utilities and API clients
```

---
*Part 1 of the AI Interstellar Explorer Project.*
