"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import WorkerCard from "@/components/WorkerCard";
import { BENGALURU_AREAS } from "@/lib/mockData";

export default function WorkersPage() {
  const { users } = useApp();
  const [area, setArea] = useState("all");
  const [search, setSearch] = useState("");

  const workers = useMemo(() => {
    return users
      .filter((u) => u.role === "worker")
      .filter((u) => area === "all" || u.location === area)
      .filter(
        (u) =>
          search === "" ||
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          (u.skills || []).some((s) => s.toLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => b.rating - a.rating);
  }, [users, area, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Workers in Bengaluru</h1>
      <p className="text-gray-600 mb-6">
        Browse rated workers for daily, 2-day or weekly work.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search by name or skill..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[180px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <select
          value={area}
          onChange={(e) => setArea(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="all">All areas</option>
          {BENGALURU_AREAS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {workers.length === 0 ? (
        <div className="text-center py-16 text-gray-500">No workers found</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workers.map((w) => (
            <WorkerCard key={w.id} worker={w} />
          ))}
        </div>
      )}
    </div>
  );
}
