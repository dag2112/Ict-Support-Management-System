"use client";
import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Props {
  requestId: string;
  requestNumber: string;
  onClose: () => void;
}

const roleColors: Record<string, string> = {
  REQUESTER: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  TECHNICIAN: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  MANAGER: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  ADMIN: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  APPROVER: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
};

export default function ChatPanel({ requestId, requestNumber, onClose }: Props) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const data = await api.getChatMessages(requestId);
      setMessages(data);
    } catch {}
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000); // poll every 5s
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      const msg = await api.sendChatMessage(requestId, text.trim());
      setMessages((prev) => [...prev, msg]);
      setText("");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="font-bold text-gray-800 dark:text-white">💬 Chat</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">{requestNumber}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl">✕</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-10">
              <p className="text-3xl mb-2">💬</p>
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          {messages.map((m) => {
            const isMe = m.sender.id === user?.id;
            return (
              <div key={m.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  {!isMe && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{m.sender.name}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${roleColors[m.sender.role] ?? "bg-gray-100 text-gray-600"}`}>
                        {m.sender.role.toLowerCase()}
                      </span>
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? "bg-blue-900 text-white rounded-br-sm"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                  }`}>
                    {m.message}
                  </div>
                  <p className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={send} className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
          >
            {sending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
