"use client";

import Link from "next/link";
import { Job } from "@/types";

const durationLabel: Record<string, string> = {
  "1-day": "1 Day",
  "2-day": "2 Days",
  weekly: "Weekly",
};

const durationColor: Record<string, string> = {
  "1-day": "bg-blue-100 text-blue-800",
  "2-day": "bg-purple-100 text-purple-800",
  weekly: "bg-green-100 text-green-800",
};

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-orange-200 transition"
    >
      <div className="flex justify-between items-start gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{job.title}</h3>
          <p className="text-sm text-gray-500 mt-0.5">{job.employerName}</p>
        </div>
        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${durationColor[job.duration]}`}
        >
          {durationLabel[job.duration]}
        </span>
      </div>

      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{job.description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-bold text-orange-600">₹{job.wage}/day</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600">📍 {job.location}</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-600">{job.category}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          {job.slots - job.applicants.length} slot{job.slots - job.applicants.length !== 1 ? "s" : ""} left
        </span>
        <span>Starts {job.startDate}</span>
      </div>
    </Link>
  );
}
