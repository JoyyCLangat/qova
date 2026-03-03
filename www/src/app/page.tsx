export default function Home(): React.ReactElement {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Qova</h1>
        <p className="text-lg text-neutral-500 max-w-md mx-auto">
          Financial trust infrastructure for AI agents. Coming soon.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="https://app.qova.cc"
            className="rounded-full bg-foreground text-background px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Open Dashboard
          </a>
          <a
            href="https://docs.qova.cc"
            className="rounded-full border border-neutral-300 dark:border-neutral-700 px-6 py-2.5 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            Documentation
          </a>
        </div>
      </div>
    </main>
  );
}
