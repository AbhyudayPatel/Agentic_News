import { Suspense } from 'react';
import { getNewsData } from '@/lib/mongodb';
import NewsContainer from '@/components/NewsContainer';
import LoadingSkeleton from '@/components/LoadingSkeleton';

export default async function Home() {
  const initialNews = await getNewsData();

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Latest News
        </h1>

        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
          <select className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Select City</option>
            <option value="delhi">Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="bangalore">Bangalore</option>
          </select>
          
          <select className="px-4 py-2 rounded-lg border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option value="">Select State</option>
            <option value="delhi">Delhi</option>
            <option value="maharashtra">Maharashtra</option>
            <option value="karnataka">Karnataka</option>
          </select>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        }>
          {initialNews.length > 0 ? (
            <NewsContainer initialNews={initialNews} />
          ) : (
            <div className="col-span-full text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-600">
                No news articles found
              </h2>
            </div>
          )}
        </Suspense>
      </div>
    </main>
  );
}
