export default function Loading() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-2xl">
        <div className="mx-auto mb-6 h-16 w-64 animate-pulse rounded-lg bg-surface-glass" />
        <div className="h-[60vh] min-h-[28rem] animate-pulse rounded-2xl border border-stroke bg-surface-glass" />
      </div>
    </main>
  );
}
