'use client'
import { useState, useEffect } from 'react';

interface NewsItem {
  _id: string;
  date: Date;
  image_url: string;
  heading: string;
  article_summary: string[];
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 font-playfair tracking-tight mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Agentic News
          </h1>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="inline-block relative">
            <select 
              className="block appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:border-blue-500 cursor-pointer"
              disabled
            >
              <option>Ranchi</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          <button 
            onClick={fetchNews}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 md:px-4 md:py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-5 md:w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Refresh News
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div 
                key={item._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group h-[600px] flex flex-col"
              >
                {item.image_url && (
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image_url} 
                      alt={item.heading} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col h-full">
                  <time 
                    dateTime={new Date(item.date).toISOString()}
                    className="text-sm text-gray-500 mb-4"
                  >
                    {new Date(item.date).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </time>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6 line-clamp-2">
                    {item.heading}
                  </h2>
                  <div className="h-[calc(100%-160px)] overflow-y-auto scrollbar-hide">
                    <ul className="space-y-4 text-gray-600 pr-2">
                      {Array.isArray(item.article_summary) ? 
                        item.article_summary.map((point, index) => (
                          <li 
                            key={index} 
                            className="flex items-start hover:bg-gray-50 p-3 rounded transition-colors duration-300"
                          >
                            <span className="text-blue-500 mr-3 flex-shrink-0">•</span>
                            <span>{point}</span>
                          </li>
                        )) : 
                        <li className="flex items-start p-3">
                          <span className="text-blue-500 mr-3">•</span>
                          <span>{item.article_summary}</span>
                        </li>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
