"use client";

import { useApp } from "@/context/AppContext";
import Link from "next/link";
import JobCard from "@/components/JobCard";

export default function ProfilePage() {
  const { currentUser, jobs, applications, getJobsForUser } = useApp();

  if (!currentUser) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">Please login to view your profile.</p>
        <Link href="/login" className="mt-4 inline-block text-orange-600 font-medium">
          Go to Login →
        </Link>
      </div>
    );
  }

  const myJobs = getJobsForUser();
  const myApplications = applications.filter((a) => a.workerId === currentUser.id);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-2xl">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentUser.name}</h1>
            <p className="text-gray-500 capitalize">{currentUser.role}</p>
            <p className="text-sm text-gray-500 mt-0.5">📍 {currentUser.location}</p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg py-3">
            <p className="text-lg font-bold text-gray-900">★ {currentUser.rating.toFixed(1)}</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
          <div className="bg-gray-50 rounded-lg py-3">
            <p className="text-lg font-bold text-gray-900">{currentUser.jobsCompleted}</p>
            <p className="text-xs text-gray-500">Jobs done</p>
          </div>
          <div className="bg-gray-50 rounded-lg py-3">
            <p className="text-lg font-bold text-gray-900">{currentUser.phone.slice(-4)}</p>
            <p className="text-xs text-gray-500">Phone ends</p>
          </div>
        </div>

        {currentUser.skills && currentUser.skills.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {currentUser.skills.map((s) => (
                <span
                  key={s}
                  className="text-sm bg-orange-50 text-orange-700 px-3 py-1 rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {currentUser.role === "employer" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Your posted jobs</h2>
            <Link href="/post-job" className="text-sm text-orange-600 font-medium">
              + Post new
            </Link>
          </div>
          {myJobs.length === 0 ? (
            <p className="text-sm text-gray-500">You haven&apos;t posted any jobs yet.</p>
          ) : (
            <div className="grid gap-3">
              {myJobs.map((j) => (
                <JobCard key={j.id} job={j} />
              ))}
            </div>
          )}
        </div>
      )}

      {currentUser.role === "worker" && (
        <div>
          <h2 className="font-semibold text-gray-900 mb-3">Your applications</h2>
          {myApplications.length === 0 ? (
            <p className="text-sm text-gray-500">You haven&apos;t applied to any jobs yet.</p>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app) => {
                const job = jobs.find((j) => j.id === app.jobId);
                return (
                  <div
                    key={app.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{job?.title || "Job"}</p>
                      <p className="text-sm text-gray-500">
                        {job?.location} · ₹{job?.wage}/day
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Applied {new Date(app.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                        app.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
