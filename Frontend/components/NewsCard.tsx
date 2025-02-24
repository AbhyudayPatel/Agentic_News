import Image from 'next/image';
import { format } from 'date-fns';

interface NewsCardProps {
  date: Date;
  heading: string;
  article_summary: string[];
  image_url: string | null;
}

const DEFAULT_IMAGE = '/placeholder-news.jpg';

const NewsCard = ({ date, heading, article_summary, image_url }: NewsCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-[600px] group">
      <div className="relative h-56 w-full">
        <Image
          src={typeof image_url === 'string' && image_url !== '' ? image_url : DEFAULT_IMAGE}
          alt={heading}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-6 flex flex-col h-[calc(600px-14rem)]">
        <div className="flex items-center mb-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {format(new Date(date), 'MMM dd, yyyy')}
          </span>
        </div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
          {heading}
        </h2>
        <div className="overflow-y-auto scrollbar-hide">
          <ul className="space-y-2 text-gray-600">
            {article_summary?.slice(0, 3).map((point, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2 flex-shrink-0">•</span>
                <span className="line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewsCard; 