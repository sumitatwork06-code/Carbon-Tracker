# Carbon Footprint Tracker

## Challenge Details
*   **Chosen Vertical**: Environmental Sustainability (Carbon Footprint Tracking & AI-powered Reduction Planning).
*   **How the Solution Works**:
    1. **Logging**: Users input daily transportation distance, transport mode, dietary preference, and electricity usage via a keyboard-accessible, validation-gated form.
    2. **Calculations**: A pure calculation engine applies standard carbon conversion metrics to find the daily output (e.g., 0.21 kg/km for car, 7.19 kg/day for omnivore diet, 0.233 kg/kWh for electricity).
    3. **Dashboard & Visualization**: Renders daily scores on a responsive Area Chart, indicating performance compared to a customizable target goal (default 50kg CO2e).
    4. **AI Insights**: Gathers weekly activity and calls `gemini-2.5-flash` using the official `@google/genai` SDK to generate exactly three personalized, actionable, structured reduction tips.
*   **Assumptions Made**:
    - **Target Budget**: A baseline target limit of 50 kg CO2e per day is assumed as a default green benchmark.
    - **Conversion Coefficients**: Calculations assume standard global averages for carbon emissions (such as EPA or carbon offset averages).
    - **Database Environment**: SQLite (`carbon.db`) is assumed to be running in a persistent disk state (or fallback JSON mock if native bindings fail to load).

## Problem Statement Alignment
The application enables users to track their daily carbon emissions across primary emission categories: transportation, diet, and electricity usage. By logging these activities, the system calculates individual emissions in real-time. It integrates the Gemini Pro API to generate three personalized, actionable insights structured to help users lower their carbon footprint.

## Code Quality
The project enforces a strict separation of concerns:
- `/lib` contains pure computational logic, validators, and database connection setup.
- `/app/api` hosts the Next.js API endpoints handling request parsing, database updates, and routing.
- `/components` manages modular, reusable, and accessible React UI elements.

## Security
Security is established at three main levels:
- Input validation in `validators.js` ensures only correctly formatted numbers, ranges, and enum values enter the application layer.
- All database operations in `db.js` use SQLite prepared statements with parameter binding to prevent SQL injection. String interpolation is never used in database queries.
- Environment variables securely handle the `GEMINI_API_KEY` key on the server-side, preventing exposure to the client.

## Efficiency
Efficiency is optimized throughout the system:
- Server-side aggregation in `/api/history` groups data before transmission to minimize payload size.
- The weekly aggregate calculations run in O(n) time complexity by executing single-pass iterations over the logged data.
- API responses transfer lightweight JSON payloads containing only raw values and formatted aggregates.

## Testing
Comprehensive Jest unit tests in `carbonEngine.test.js` and `validators.test.js` assert:
- Correct factor multiplication for transport, diet, and electricity.
- Validation bounds (maximum inputs, invalid modes, invalid diets, negative values).
- Formatting and return structure calculations.
- Input sanitization (HTML stripping and whitespace trimming).
- Mocking of database dependencies to run isolated unit tests.

## Accessibility
Accessibility has been integrated as a core feature:
- ARIA labels and roles map input descriptions and buttons to screen readers.
- Semantic HTML tags (main, section, article) build a clear document structure.
- Keyboard navigation is supported throughout, including focus management on the custom progress bar using role="progressbar" with aria-valuenow, aria-valuemin, and aria-valuemax.

## Tech Stack
Next.js 14 | Tailwind CSS | SQLite | Gemini Pro API | Jest | Vercel

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy .env.local.example to .env.local:
   ```bash
   cp .env.local.example .env.local
   ```
3. Define your GEMINI_API_KEY inside .env.local.
4. Start the development server:
   ```bash
   npm run dev
   ```
