import Link from "next/link";

const sections = [
  {
    title: "SDK Reference",
    description: "TypeScript SDK for querying agent scores and submitting feedback.",
    href: "/sdk",
  },
  {
    title: "API Reference",
    description: "REST API endpoints for programmatic access to Qova data.",
    href: "/api",
  },
  {
    title: "Smart Contracts",
    description: "On-chain contract documentation for Base L2 deployment.",
    href: "/contracts",
  },
  {
    title: "Integrations",
    description: "Connect Qova with LangChain, OpenAI Agents SDK, Vercel AI SDK, and more.",
    href: "/integrations",
  },
];

export default function DocsHome(): React.ReactElement {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Qova Docs</h1>
      <p className="text-neutral-500 mb-10">
        Documentation for the Qova trust infrastructure platform.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block rounded-lg border border-neutral-200 dark:border-neutral-800 p-5 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
          >
            <h2 className="text-sm font-semibold mb-1">{s.title}</h2>
            <p className="text-xs text-neutral-500">{s.description}</p>
          </Link>
        ))}
      </div>

      <p className="text-xs text-neutral-400 mt-16 text-center">
        Full documentation coming soon. Visit{" "}
        <a href="https://app.qova.cc" className="underline">app.qova.cc</a>{" "}
        to get started.
      </p>
    </main>
  );
}
