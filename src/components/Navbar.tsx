"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const { currentUser, logout } = useApp();
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      pathname === path
        ? "bg-orange-500 text-white"
        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
            DW
          </div>
          <div>
            <span className="font-bold text-lg text-gray-900">DailyWork</span>
            <span className="hidden sm:inline text-xs text-gray-500 ml-1">Bengaluru</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className={linkClass("/")}>
            Browse Jobs
          </Link>
          {currentUser?.role === "employer" && (
            <Link href="/post-job" className={linkClass("/post-job")}>
              Post Job
            </Link>
          )}
          <Link href="/workers" className={linkClass("/workers")}>
            Workers
          </Link>
          {currentUser && (
            <Link href="/messages" className={linkClass("/messages")}>
              Messages
            </Link>
          )}
          {currentUser && (
            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {currentUser ? (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser.role}</p>
              </div>
              <button
                onClick={logout}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto">
        <Link href="/" className={linkClass("/")}>
          Jobs
        </Link>
        {currentUser?.role === "employer" && (
          <Link href="/post-job" className={linkClass("/post-job")}>
            Post
          </Link>
        )}
        <Link href="/workers" className={linkClass("/workers")}>
          Workers
        </Link>
        {currentUser && (
          <>
            <Link href="/messages" className={linkClass("/messages")}>
              Chat
            </Link>
            <Link href="/profile" className={linkClass("/profile")}>
              Profile
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
