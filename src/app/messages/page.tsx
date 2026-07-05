"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  role: string;
}

interface Conversation {
  propertyId: number;
  propertyTitle: string;
  propertyImage: string;
  otherUserId: number;
  otherUserName: string;
  otherUserPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("apnaMakanUser");
    if (!stored) {
      router.push("/login");
      return;
    }
    try {
      const u = JSON.parse(stored);
      setUser(u);
      fetchConversations(u.id);
    } catch {
      router.push("/login");
    }
  }, [router]);

  const fetchConversations = async (userId: number) => {
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch { /* ignore */ }
    setLoading(false);
  };

  const fetchMessages = async (conv: Conversation) => {
    if (!user) return;
    setSelectedConv(conv);
    try {
      const res = await fetch(
        `/api/messages?userId=${user.id}&propertyId=${conv.propertyId}&otherUserId=${conv.otherUserId}`
      );
      const data = await res.json();
      setMessages(data.messages || []);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch { /* ignore */ }
  };

  const sendMessage = async () => {
    if (!user || !selectedConv || !newMessage.trim()) return;
    setSending(true);
    try {
      await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: selectedConv.otherUserId,
          propertyId: selectedConv.propertyId,
          message: newMessage.trim(),
        }),
      });
      setNewMessage("");
      fetchMessages(selectedConv);
      fetchConversations(user.id);
    } catch { /* ignore */ }
    setSending(false);
  };

  const getPropertyImage = (imageUrls: string) => {
    try {
      const imgs = JSON.parse(imageUrls);
      return imgs[0] || null;
    } catch {
      return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin text-4xl">💬</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            💬 Messages
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Chat with {user.role === "seller" ? "buyers" : "sellers"} about properties
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-lg border border-border overflow-hidden" style={{ minHeight: "70vh" }}>
          <div className="flex h-full" style={{ minHeight: "70vh" }}>
            {/* Conversations List */}
            <div className={`w-full md:w-1/3 border-r border-border ${selectedConv ? "hidden md:block" : ""}`}>
              <div className="p-4 border-b border-border bg-gray-50">
                <h2 className="font-bold text-text">Conversations</h2>
              </div>
              <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 60px)" }}>
                {loading ? (
                  <div className="p-8 text-center text-text-light">
                    <div className="animate-spin text-3xl mb-2">💬</div>
                    Loading...
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="text-text-light">No conversations yet</p>
                    <p className="text-sm text-text-light mt-2">
                      {user.role === "buyer" 
                        ? "Send a message to a seller to start chatting"
                        : "Buyers will message you when interested"
                      }
                    </p>
                    <Link href="/properties" className="btn-primary px-4 py-2 rounded-lg text-sm inline-block mt-4">
                      Browse Properties
                    </Link>
                  </div>
                ) : (
                  conversations.map((conv) => {
                    const img = getPropertyImage(conv.propertyImage);
                    return (
                      <button
                        key={`${conv.propertyId}-${conv.otherUserId}`}
                        onClick={() => fetchMessages(conv)}
                        className={`w-full p-4 flex gap-3 border-b border-border hover:bg-gray-50 transition-colors cursor-pointer text-left ${
                          selectedConv?.propertyId === conv.propertyId && selectedConv?.otherUserId === conv.otherUserId
                            ? "bg-primary-light"
                            : ""
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200">
                          {img ? (
                            <img src={img} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="font-semibold text-text truncate">{conv.otherUserName}</p>
                            {conv.unreadCount > 0 && (
                              <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-primary truncate">{conv.propertyTitle}</p>
                          <p className="text-sm text-text-light truncate mt-1">{conv.lastMessage}</p>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`flex-1 flex flex-col ${!selectedConv ? "hidden md:flex" : ""}`}>
              {selectedConv ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-border bg-gray-50 flex items-center gap-3">
                    <button
                      onClick={() => setSelectedConv(null)}
                      className="md:hidden p-2 hover:bg-gray-200 rounded-lg cursor-pointer"
                    >
                      ← 
                    </button>
                    <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center text-primary font-bold">
                      {selectedConv.otherUserName.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-text">{selectedConv.otherUserName}</p>
                      <p className="text-xs text-text-light">
                        📞 {selectedConv.otherUserPhone} • Re: {selectedConv.propertyTitle}
                      </p>
                    </div>
                    <Link
                      href={`/property/${selectedConv.propertyId}`}
                      className="text-primary text-sm font-medium hover:underline"
                    >
                      View Property →
                    </Link>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.map((msg) => {
                      const isMe = msg.senderId === user.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                              isMe
                                ? "bg-primary text-white rounded-br-sm"
                                : "bg-white text-text border border-border rounded-bl-sm"
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            <p className={`text-xs mt-1 ${isMe ? "text-blue-200" : "text-text-light"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-border bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={sending || !newMessage.trim()}
                        className="btn-primary px-6 py-3 rounded-xl font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {sending ? "..." : "Send"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-bold text-text mb-2">Select a Conversation</h3>
                    <p className="text-text-light">Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
