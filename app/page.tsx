export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4 text-center">
          AI Gateway Chat
        </h1>
        <p className="text-center text-lg">
          Vercel AI Gateway multi-provider chat application
        </p>
        <div className="mt-8 p-6 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Status</h2>
          <p className="text-green-600">✓ Next.js 14+ initialized</p>
          <p className="text-green-600">✓ TypeScript configured</p>
          <p className="text-green-600">✓ Tailwind CSS ready</p>
          <p className="text-green-600">✓ AI SDK packages installed</p>
        </div>
      </div>
    </main>
  )
}
