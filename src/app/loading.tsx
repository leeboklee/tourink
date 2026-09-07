export default function Loading() {
  return (
    <div className="space-y-4 px-4 py-8 lg:px-0" aria-busy="true" aria-label="Loading">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="h-4 w-72 animate-pulse rounded bg-white/5" />
      <div className="mt-6 aspect-[4/5] animate-pulse rounded-2xl bg-white/5" />
      <div className="h-4 w-full animate-pulse rounded bg-white/5" />
      <div className="h-4 w-2/3 animate-pulse rounded bg-white/5" />
    </div>
  );
}
