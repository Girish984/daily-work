"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { BENGALURU_AREAS, CATEGORIES } from "@/lib/mockData";
import { JobDuration } from "@/types";

export default function PostJobPage() {
  const { currentUser, postJob } = useApp();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState<JobDuration>("1-day");
  const [wage, setWage] = useState(700);
  const [location, setLocation] = useState(BENGALURU_AREAS[0]);
  const [startDate, setStartDate] = useState("");
  const [slots, setSlots] = useState(1);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [error, setError] = useState("");

  if (!currentUser) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">Please login as an employer to post a job.</p>
        <a href="/login" className="mt-4 inline-block text-orange-600 font-medium">
          Go to Login →
        </a>
      </div>
    );
  }

  if (currentUser.role !== "employer") {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">Only employers can post jobs.</p>
        <p className="text-sm text-gray-500 mt-1">You are logged in as a worker.</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !startDate) {
      setError("Please fill all required fields.");
      return;
    }
    postJob({
      title: title.trim(),
      description: description.trim(),
      duration,
      wage: Number(wage),
      location,
      startDate,
      slots: Number(slots),
      category,
    });
    router.push("/");
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Post a Job</h1>

      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm px-3 py-2 rounded-lg">{error}</div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Mason needed for house construction"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Describe the work, requirements, what is provided..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value as JobDuration)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="1-day">1 Day</option>
              <option value="2-day">2 Days</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wage (₹/day) *</label>
            <input
              type="number"
              value={wage}
              onChange={(e) => setWage(Number(e.target.value))}
              min={300}
              max={5000}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area *</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {BENGALURU_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Workers needed *</label>
            <input
              type="number"
              value={slots}
              onChange={(e) => setSlots(Number(e.target.value))}
              min={1}
              max={20}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white font-medium py-3 rounded-lg hover:bg-orange-600 transition"
        >
          Post Job
        </button>
      </form>
    </div>
  );
}
