export function SkeletonCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#121215] border border-white/5 animate-pulse space-y-3 p-3">
      <div className="aspect-[16/9] w-full rounded-xl bg-zinc-800" />
      <div className="h-4 w-3/4 rounded bg-zinc-800" />
      <div className="flex justify-between items-center">
        <div className="h-3 w-12 rounded bg-zinc-800" />
        <div className="h-3 w-16 rounded bg-zinc-800" />
      </div>
    </div>
  );
}
