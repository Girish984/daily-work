export type JobDuration = "1-day" | "2-day" | "weekly";

export type UserRole = "worker" | "employer";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  location: string; // area in Bengaluru
  skills?: string[];
  rating: number;
  jobsCompleted: number;
  avatar?: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  duration: JobDuration;
  wage: number; // per day in INR
  location: string; // area in Bengaluru
  employerId: string;
  employerName: string;
  datePosted: string;
  startDate: string;
  slots: number; // how many workers needed
  applicants: string[]; // worker ids
  status: "open" | "filled" | "closed";
  category: string; // e.g. Construction, Cleaning, Delivery, Event Staff
}

export interface Application {
  id: string;
  jobId: string;
  workerId: string;
  workerName: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: string;
  message?: string;
}

export interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  timestamp: string;
  jobId?: string;
}
