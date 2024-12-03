import Link from 'next/link';
import React from 'react';

export default function Footer() {
  return (
    <footer className="mx-auto fixed bottom-0 inset-x-0 bg-[#fffae9] w-full max-w-container px-4 sm:px-6 lg:px-8">
      <div className="border-t border-slate-900/5 py-10">
        <div className="flex text-slate-900 items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-4 lucide text-red-600 lucide-youtube"
          >
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <path d="m10 15 5-3-5-3z" />
          </svg>

          <h1 className="font-bold ml-2">
            Built by{' '}
            <Link
              href="https://www.youtube.com/@codewithmoses"
              className="underline"
            >
              @codewithmoses{' '}
            </Link>
          </h1>
        </div>
        <p className="mt-5 text-center text-sm leading-6 text-slate-500">
          © 2024 <Link href="/https://mosespace.com">@mosespace.</Link> All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
