# IAB Use Case Analytics

IAB Use Case Analytics is a Next.js web application for exploring and analyzing use cases within your organization. It provides a categorized, interactive dashboard to help teams understand contributions, customer engagement, and documentation coverage.

---

## Functionality Overview

- **Categorized Exploration:**  
  Browse use cases grouped by Author, Customer, or Confluence Space. This helps you analyze contributions, customer focus, and documentation activity.

- **Interactive Data Visualization:**  
  Each analytics page displays a horizontal bar chart (powered by [Nivo](https://nivo.rocks/)) summarizing the number of use cases in each category, broken down by status (Accepted, Included in PRD, In Review, Rejected, Unprocessed). You can sort the data by category name or count.

- **Detailed Listings:**  
  Below each chart, you’ll find a detailed list of use cases for each category, including their titles and metadata.

- **Modern UI:**  
  The app uses React, Tailwind CSS, and Next.js’s app directory for a fast, responsive, and accessible experience.

---

## Route Functionality

- **/**  
  The home page introduces the app and provides navigation to analytics sections.

- **/analytics/authors**  
  Shows use cases grouped by author. Analyze which team members are contributing the most and see their individual use cases.

- **/analytics/customers**  
  Displays use cases grouped by customer. This helps you understand which customers have the most or least use cases and view their details.

- **/analytics/spaces**  
  Presents use cases grouped by Confluence Space, helping you see which documentation spaces are most active.

Each analytics route fetches and processes data dynamically, displaying both a summary chart and a detailed breakdown.

---

## How It Works

- **Data Fetching:**  
  The app fetches use case data from a Confluence API, filtering out irrelevant spaces and IDs.  
  - See [`lib/confluence.ts`](lib/confluence.ts) for fetching and parsing logic.
  - Use cases are parsed from Confluence pages, extracting author, customer, date, and status checkboxes.

- **API Routes:**  
  The backend API (see [`app/api/[facet]/all/route.ts`](app/api/[facet]/all/route.ts)) groups and analyzes use cases by the selected facet (author, customer, or space) and returns summary statistics.

- **Frontend Rendering:**  
  The analytics pages (see [`app/analytics/[folder]/page.tsx`](app/analytics/[folder]/page.tsx)) use React hooks to fetch, process, and display the data.  
  - The bar chart visualizes the breakdown by status.
  - Sorting controls allow users to reorder the data by name or count.
  - A detailed list shows all use cases for each category.

- **Header Navigation:**  
  The header (see [`components/header.tsx`](components/header.tsx)) provides quick links to each analytics view.

---

## Getting Started

1. **Install dependencies:**
   `bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   # or
   bun install`

2. **Run the development server:**
    `pnpm dev
    # or
    npm run dev
    # or
    yarn dev
    # or
    bun dev`

3. **Open your browser:**
Visit http://localhost:3000 to view the app.

## Project Structure
    `app/` — Next.js app directory (routing, pages, layouts, API routes)
    `components/` — Reusable UI components (e.g., Header)
    `lib/` — Utility functions and data fetching logic
    `public/` — Static assets
    `types/` — TypeScript type definitions