export default function SkeletonCard() {
  return (
    <div className="p-4 border rounded-xl shadow-sm w-full max-w-2xl mx-auto animate-pulse bg-white">
      <div className="flex space-x-4">
        <div className="rounded-full bg-slate-200 h-12 w-12"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    </div>
  );
}