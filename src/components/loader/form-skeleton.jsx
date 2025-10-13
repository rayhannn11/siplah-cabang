// src/components/skeletons/FormSkeleton.jsx
export default function FormSkeleton({ fields = 6 }) {
  return (
    <div className="p-6 lg:p-8 xl:p-10 animate-pulse p-4 space-y-4">
      {[...Array(fields)].map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-slate-300 rounded w-full"></div>
        </div>
      ))}
      <div className="h-10 bg-slate-400 rounded w-32 mt-4"></div>
    </div>
  );
}
