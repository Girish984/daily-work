"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function LoginPage() {
  const { users, login, currentUser } = useApp();
  const router = useRouter();

  if (currentUser) {
    router.push("/");
    return null;
  }

  const workers = users.filter((u) => u.role === "worker");
  const employers = users.filter((u) => u.role === "employer");

  const handleLogin = (id: string) => {
    login(id);
    router.push("/");
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Login to DailyWork</h1>
      <p className="text-gray-600 mb-8">
        This is a demo. Pick a sample account to explore the app.
      </p>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Login as Worker
          </h2>
          <div className="space-y-2">
            {workers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleLogin(u.id)}
                className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">
                      {u.location} · ★ {u.rating} · {u.jobsCompleted} jobs
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Login as Employer
          </h2>
          <div className="space-y-2">
            {employers.map((u) => (
              <button
                key={u.id}
                onClick={() => handleLogin(u.id)}
                className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-orange-300 hover:shadow-sm transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{u.name}</p>
                    <p className="text-sm text-gray-500">{u.location}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
