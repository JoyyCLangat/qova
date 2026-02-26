export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">Qova</h1>
        <p className="text-lg text-zinc-400 max-w-md">
          Financial trust infrastructure for AI agents.
          The credit bureau for autonomous economies.
        </p>
        <div className="flex gap-4 justify-center">
          <div className="px-4 py-2 border border-zinc-800 rounded-lg">
            <span className="text-zinc-500 text-sm">Status</span>
            <p className="font-mono text-yellow-400 font-bold">BUILDING</p>
          </div>
          <div className="px-4 py-2 border border-zinc-800 rounded-lg">
            <span className="text-zinc-500 text-sm">Network</span>
            <p className="font-mono text-white font-bold">Base Sepolia</p>
          </div>
        </div>
      </div>
    </main>
  );
}
