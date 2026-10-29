"use client";

import Link from "next/link";
import { User } from "@/types";

export default function WorkerCard({ worker }: { worker: User }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg">
          {worker.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{worker.name}</h3>
          <p className="text-sm text-gray-500">📍 {worker.location}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm font-medium">{worker.rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({worker.jobsCompleted} jobs)</span>
          </div>
        </div>
      </div>

      {worker.skills && worker.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {worker.skills.map((skill) => (
            <span
              key={skill}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Link
          href={`/messages?to=${worker.id}`}
          className="flex-1 text-center text-sm py-2 rounded-lg border border-orange-500 text-orange-600 hover:bg-orange-50 font-medium"
        >
          Contact
        </Link>
        <a
          href={`tel:${worker.phone}`}
          className="flex-1 text-center text-sm py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 font-medium"
        >
          Call
        </a>
      </div>
    </div>
  );
}
