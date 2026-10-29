"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

const durationLabel: Record<string, string> = {
  "1-day": "1 Day",
  "2-day": "2 Days",
  weekly: "Weekly",
};

export default function JobDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { jobs, currentUser, applyToJob, applications, getApplicationsForJob, updateApplicationStatus, users } =
    useApp();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [applied, setApplied] = useState(false);

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">Job not found</p>
        <Link href="/" className="text-orange-600 mt-2 inline-block">
          ← Back to jobs
        </Link>
      </div>
    );
  }

  const alreadyApplied = applications.some(
    (a) => a.jobId === job.id && a.workerId === currentUser?.id
  );
  const jobApps = getApplicationsForJob(job.id);
  const isOwner = currentUser?.id === job.employerId;

  const handleApply = () => {
    if (!currentUser || currentUser.role !== "worker") {
      router.push("/login");
      return;
    }
    applyToJob(job.id, message || undefined);
    setApplied(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/" className="text-sm text-orange-600 hover:underline mb-4 inline-block">
        ← Back to jobs
      </Link>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-500 mt-1">{job.employerName}</p>
          </div>
          <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
            {durationLabel[job.duration]}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Wage</p>
            <p className="font-bold text-orange-600 text-lg">₹{job.wage}/day</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium">📍 {job.location}</p>
          </div>
          <div>
            <p className="text-gray-500">Start Date</p>
            <p className="font-medium">{job.startDate}</p>
          </div>
          <div>
            <p className="text-gray-500">Slots left</p>
            <p className="font-medium">
              {job.slots - job.applicants.length} / {job.slots}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-gray-500">Category</p>
          <p className="font-medium">{job.category}</p>
        </div>

        <div className="mt-5">
          <p className="text-sm text-gray-500 mb-1">Description</p>
          <p className="text-gray-800 whitespace-pre-wrap">{job.description}</p>
        </div>

        {currentUser?.role === "worker" && !isOwner && (
          <div className="mt-8 border-t pt-6">
            {alreadyApplied || applied ? (
              <div className="bg-green-50 text-green-800 px-4 py-3 rounded-lg text-sm font-medium">
                ✓ You have applied for this job. The employer will contact you.
              </div>
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Message to employer (optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  placeholder="Tell them about your experience or availability..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
                <button
                  onClick={handleApply}
                  className="w-full bg-orange-500 text-white font-medium py-3 rounded-lg hover:bg-orange-600"
                >
                  Apply for this job
                </button>
              </div>
            )}
          </div>
        )}

        {!currentUser && (
          <div className="mt-8 border-t pt-6">
            <Link
              href="/login"
              className="block w-full text-center bg-orange-500 text-white font-medium py-3 rounded-lg hover:bg-orange-600"
            >
              Login to apply
            </Link>
          </div>
        )}

        {isOwner && (
          <div className="mt-8 border-t pt-6">
            <h2 className="font-semibold text-gray-900 mb-3">
              Applicants ({jobApps.length})
            </h2>
            {jobApps.length === 0 ? (
              <p className="text-sm text-gray-500">No applications yet.</p>
            ) : (
              <div className="space-y-3">
                {jobApps.map((app) => {
                  const worker = users.find((u) => u.id === app.workerId);
                  return (
                    <div
                      key={app.id}
                      className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-medium">{app.workerName}</p>
                        {worker && (
                          <p className="text-sm text-gray-500">
                            ★ {worker.rating} · {worker.jobsCompleted} jobs · {worker.location}
                          </p>
                        )}
                        {app.message && (
                          <p className="text-sm text-gray-600 mt-1 italic">"{app.message}"</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Status: <span className="capitalize">{app.status}</span>
                        </p>
                      </div>
                      {app.status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateApplicationStatus(app.id, "accepted")}
                            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, "rejected")}
                            className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                          >
                            Reject
                          </button>
                          <Link
                            href={`/messages?to=${app.workerId}`}
                            className="px-3 py-1.5 border border-orange-500 text-orange-600 text-sm rounded-lg hover:bg-orange-50"
                          >
                            Message
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
