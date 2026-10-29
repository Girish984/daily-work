"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, Job, Application, Message, JobDuration } from "@/types";
import {
  initialUsers,
  initialJobs,
  initialApplications,
  initialMessages,
} from "@/lib/mockData";

interface AppContextType {
  currentUser: User | null;
  users: User[];
  jobs: Job[];
  applications: Application[];
  messages: Message[];
  login: (userId: string) => void;
  logout: () => void;
  postJob: (job: Omit<Job, "id" | "datePosted" | "applicants" | "status" | "employerId" | "employerName">) => void;
  applyToJob: (jobId: string, message?: string) => void;
  updateApplicationStatus: (appId: string, status: "accepted" | "rejected") => void;
  sendMessage: (toId: string, text: string, jobId?: string) => void;
  getJobsForUser: () => Job[];
  getApplicationsForJob: (jobId: string) => Application[];
  getMessagesWith: (userId: string) => Message[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [applications, setApplications] = useState<Application[]>(initialApplications);
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("dw_currentUser");
      const savedJobs = localStorage.getItem("dw_jobs");
      const savedApps = localStorage.getItem("dw_applications");
      const savedMsgs = localStorage.getItem("dw_messages");
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedJobs) setJobs(JSON.parse(savedJobs));
      if (savedApps) setApplications(JSON.parse(savedApps));
      if (savedMsgs) setMessages(JSON.parse(savedMsgs));
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }
  }, []);

  // Persist
  useEffect(() => {
    if (currentUser) localStorage.setItem("dw_currentUser", JSON.stringify(currentUser));
    else localStorage.removeItem("dw_currentUser");
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("dw_jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("dw_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("dw_messages", JSON.stringify(messages));
  }, [messages]);

  const login = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const postJob = (
    jobData: Omit<Job, "id" | "datePosted" | "applicants" | "status" | "employerId" | "employerName">
  ) => {
    if (!currentUser || currentUser.role !== "employer") return;
    const newJob: Job = {
      ...jobData,
      id: `j${Date.now()}`,
      employerId: currentUser.id,
      employerName: currentUser.name,
      datePosted: new Date().toISOString().split("T")[0],
      applicants: [],
      status: "open",
    };
    setJobs((prev) => [newJob, ...prev]);
  };

  const applyToJob = (jobId: string, message?: string) => {
    if (!currentUser || currentUser.role !== "worker") return;
    const alreadyApplied = applications.some(
      (a) => a.jobId === jobId && a.workerId === currentUser.id
    );
    if (alreadyApplied) return;

    const newApp: Application = {
      id: `a${Date.now()}`,
      jobId,
      workerId: currentUser.id,
      workerName: currentUser.name,
      status: "pending",
      appliedAt: new Date().toISOString(),
      message,
    };
    setApplications((prev) => [...prev, newApp]);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, applicants: [...j.applicants, currentUser.id] } : j
      )
    );
  };

  const updateApplicationStatus = (appId: string, status: "accepted" | "rejected") => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status } : a))
    );
  };

  const sendMessage = (toId: string, text: string, jobId?: string) => {
    if (!currentUser) return;
    const newMsg: Message = {
      id: `m${Date.now()}`,
      fromId: currentUser.id,
      toId,
      text,
      timestamp: new Date().toISOString(),
      jobId,
    };
    setMessages((prev) => [...prev, newMsg]);
  };

  const getJobsForUser = () => {
    if (!currentUser) return jobs;
    if (currentUser.role === "employer") {
      return jobs.filter((j) => j.employerId === currentUser.id);
    }
    return jobs.filter((j) => j.status === "open");
  };

  const getApplicationsForJob = (jobId: string) =>
    applications.filter((a) => a.jobId === jobId);

  const getMessagesWith = (userId: string) => {
    if (!currentUser) return [];
    return messages
      .filter(
        (m) =>
          (m.fromId === currentUser.id && m.toId === userId) ||
          (m.fromId === userId && m.toId === currentUser.id)
      )
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        jobs,
        applications,
        messages,
        login,
        logout,
        postJob,
        applyToJob,
        updateApplicationStatus,
        sendMessage,
        getJobsForUser,
        getApplicationsForJob,
        getMessagesWith,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
