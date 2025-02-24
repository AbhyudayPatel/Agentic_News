export default function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-56 bg-gray-200 rounded-t-xl"></div>
      <div className="p-6 bg-white rounded-b-xl">
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
} 