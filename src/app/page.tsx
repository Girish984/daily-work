"use client";

import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import JobCard from "@/components/JobCard";
import { BENGALURU_AREAS, CATEGORIES } from "@/lib/mockData";
import { JobDuration } from "@/types";

export default function HomePage() {
  const { jobs, currentUser } = useApp();
  const [duration, setDuration] = useState<JobDuration | "all">("all");
  const [area, setArea] = useState("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return jobs
      .filter((j) => j.status === "open")
      .filter((j) => duration === "all" || j.duration === duration)
      .filter((j) => area === "all" || j.location === area)
      .filter((j) => category === "all" || j.category === category)
      .filter(
        (j) =>
          search === "" ||
          j.title.toLowerCase().includes(search.toLowerCase()) ||
          j.description.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime());
  }, [jobs, duration, area, category, search]);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 md:p-8 text-white mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">
          Find short-term work in Bengaluru
        </h1>
        <p className="mt-2 text-orange-100 max-w-xl">
          1-day, 2-day or weekly jobs. Construction, cleaning, delivery, events & more.
          {currentUser?.role === "worker"
            ? " Apply in one tap."
            : currentUser?.role === "employer"
            ? " Post a job and get workers fast."
            : " Login to apply or post jobs."}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 space-y-3">
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <div className="flex flex-wrap gap-2">
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value as JobDuration | "all")}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All durations</option>
            <option value="1-day">1 Day</option>
            <option value="2-day">2 Days</option>
            <option value="weekly">Weekly</option>
          </select>
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
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">
          {filtered.length} job{filtered.length !== 1 ? "s" : ""} available
        </h2>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No jobs match your filters</p>
          <p className="text-sm mt-1">Try changing duration, area or category</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
