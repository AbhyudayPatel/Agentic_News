'use client';

import { useState, useEffect } from 'react';
import NewsCard from './NewsCard';

interface NewsItem {
  _id: string;
  date: string;
  heading: string;
  article_summary: string[];
  image_url: string;
}

export default function NewsContainer({ initialNews }: { initialNews: NewsItem[] }) {
  const [news, setNews] = useState(initialNews);
  const [lastChecked, setLastChecked] = useState(new Date());

  useEffect(() => {
    // Check for new articles every 30 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/news/latest?since=' + lastChecked.toISOString());
        const newArticles = await response.json();
        
        if (newArticles.length > 0) {
          // Prevent duplicates by checking _id
          setNews(prev => {
            const existingIds = new Set(prev.map(item => item._id));
            const uniqueNewArticles = newArticles.filter((article: NewsItem) => !existingIds.has(article._id));
            return uniqueNewArticles.length > 0 ? [...uniqueNewArticles, ...prev] : prev;
          });
          setLastChecked(new Date());
        }
      } catch (error) {
        console.error('Error fetching new articles:', error);
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [lastChecked]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item: NewsItem) => (
        <NewsCard
          key={item._id}
          date={new Date(item.date)}
          heading={item.heading}
          article_summary={item.article_summary}
          image_url={item.image_url}
        />
      ))}
    </div>
  );
} 