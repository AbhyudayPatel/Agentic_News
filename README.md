# Agentic_News - https://agenticnews.vercel.app/

## Overview
This project is an AI agentic news gather,summarisation and publishing website that scrapes news articles, summarizes them using Facebook's BART model, and displays them in a user-friendly UI built with Next.js. The backend scrapes data from news websites and stores it in MongoDB, ensuring continuous updates with automated scraping cycles.

Video - (https://youtu.be/xuS2gxCtG6g?si=S-9smPQcXEXMMQ6N)

## Features
- **AI-powered Summarization**: Uses the BART model to generate concise news summaries.
- **MongoDB Integration**: Stores news data, ensuring no duplicates.
- **Automated Scraping**: Fetches news at regular intervals.
- **Next.js Frontend**: Optimized for SEO with real-time updates.
- **City-based Filtering (Upcoming Feature)**: Users can filter news by city.

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/PratikChrs/Agentic_News.git
cd frontend
```

### 2. Install Dependencies
```sh
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the frontend directory and add:
```env
MONGO_URI=your_mongodb_connection_string
```

### 4. Run the Development Server
```sh
npm run dev
```

![Alt text](https://github.com/PratikChrs/Agentic_News/blob/c3c2d889e96065b60a7c170f3bcbe8f90f235f9f/Frontend/Screenshot%202025-02-24%20224655.png)

## Backend (Agent)

### A. Initialization & Model Setup
- Uses Facebook's **BART model** for summarizing news articles.
- The model is **downloaded once and stored locally** to avoid redundant downloads.

### B. Database (MongoDB) Setup
The database stores news data with these fields:
- **id** (Unique identifier)
- **date** (Publication date)
- **heading** (News headline)
- **image URL** (Thumbnail image)
- **article URL** (Source link)
- **summary** (BART-generated summary in an array format)
it prevents duplication by checking existing articles before storing new ones.

![Alt text](https://github.com/PratikChrs/Agentic_News/blob/c3c2d889e96065b60a7c170f3bcbe8f90f235f9f/Frontend/Screenshot%202025-02-24%20224458.png)

### C. Web Scraping Process
- Scrapes news from **Times of India** (expandable to other sources).
- Uses **BeautifulSoup** to extract relevant data from HTML.
- Filters news based on date to fetch only the latest articles.
- **Location-based filtering** is hardcoded to Ranchi but can be expanded.
- Extracts **date, key points,images and links** from articles.

### D. News Summarization
- The **BART model** condenses each article into **4-5 key lines**.
- The summarized content is stored in **MongoDB**.

![Alt text](https://github.com/PratikChrs/Agentic_News/blob/c3c2d889e96065b60a7c170f3bcbe8f90f235f9f/Frontend/Screenshot%20(28).png)

### E. Scraper Execution & Database Update
When executed, the scraper:
1. Connects to **Hugging Face** to load the BART model.
2. Connects to **MongoDB** to check for existing articles.
3. Fetches only **new articles** (skipping stored ones).
4. Stores **newly found** articles in MongoDB.
5. Automatically Runs at **fixed intervals** to keep data fresh.

## Frontend (Next.js-based UI)

### A. News Display
- Dynamically **fetches** news articles from MongoDB.
- Displays articles **in descending order** (latest first).
- Each news card contains:
  - **Headline**
  - **Summarized content**
  - **Date and Image**

### B. Real-time Data Updates
- **Auto-refreshes every 30 seconds** to fetch new articles.
- UI updates **automatically** when new data enters MongoDB.
- If an article is **deleted**, it disappears on the next refresh.


### SEO Optimization
- **SEO Score: 98 on https://pagespeed.web.dev/** (optimized for search engines).
- **Next.js improves performance** for better rankings.

## Automated Scraping Cycles
- The scraper **runs automatically** 
- If an article is **deleted**, the scraper **re-fetches** it in the next cycle.
- Ensures the **database and frontend stay updated**.


