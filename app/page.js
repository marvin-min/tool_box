import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-2xl">
          A collection of Utilities
        </h1>
        <a href="/tools/strava" className="mt-4 text-blue-500 hover:text-blue-700">Strava Webhook Tool</a>
      </main>
    </div>
  );
}
