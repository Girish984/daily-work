"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Link from "next/link";

function MessagesContent() {
  const { currentUser, users, messages, sendMessage, getMessagesWith } = useApp();
  const searchParams = useSearchParams();
  const toParam = searchParams.get("to");

  const [selectedId, setSelectedId] = useState<string | null>(toParam);
  const [text, setText] = useState("");

  useEffect(() => {
    if (toParam) setSelectedId(toParam);
  }, [toParam]);

  const partners = useMemo(() => {
    if (!currentUser) return [];
    const ids = new Set<string>();
    messages.forEach((m) => {
      if (m.fromId === currentUser.id) ids.add(m.toId);
      if (m.toId === currentUser.id) ids.add(m.fromId);
    });
    if (selectedId) ids.add(selectedId);
    return Array.from(ids)
      .map((id) => users.find((u) => u.id === id))
      .filter(Boolean) as typeof users;
  }, [messages, currentUser, users, selectedId]);

  const conversation = selectedId ? getMessagesWith(selectedId) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selectedId) return;
    sendMessage(selectedId, text.trim());
    setText("");
  };

  if (!currentUser) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-gray-600">Please login to view messages.</p>
        <Link href="/login" className="mt-4 inline-block text-orange-600 font-medium">
          Go to Login →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Messages</h1>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col md:flex-row h-[500px]">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto">
          {partners.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">
              No conversations yet. Contact a worker or employer.
            </p>
          ) : (
            partners.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-orange-50 transition ${
                  selectedId === p.id ? "bg-orange-50" : ""
                }`}
              >
                <p className="font-medium text-gray-900 truncate">{p.name}</p>
                <p className="text-xs text-gray-500 capitalize">{p.role}</p>
              </button>
            ))
          )}
        </div>

        <div className="flex-1 flex flex-col">
          {selectedId ? (
            <>
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                <p className="font-medium">
                  {users.find((u) => u.id === selectedId)?.name || "User"}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {conversation.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center mt-8">
                    No messages yet. Say hello!
                  </p>
                ) : (
                  conversation.map((m) => {
                    const isMe = m.fromId === currentUser.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                            isMe
                              ? "bg-orange-500 text-white rounded-br-md"
                              : "bg-gray-100 text-gray-900 rounded-bl-md"
                          }`}
                        >
                          {m.text}
                          <p
                            className={`text-[10px] mt-1 ${
                              isMe ? "text-orange-100" : "text-gray-400"
                            }`}
                          >
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              <form onSubmit={handleSend} className="p-3 border-t border-gray-200 flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
                <button
                  type="submit"
                  className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-600"
                >
                  Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
              Select a conversation or contact someone from Workers page
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">Loading messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
