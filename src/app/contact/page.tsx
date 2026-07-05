"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-blue-100 text-lg">
            Have a question? Want to list your property? Get in touch with us!
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-text mb-6">Get in Touch</h2>
            <p className="text-text-light mb-8 leading-relaxed">
              We&apos;re here to help you with any queries about buying or selling properties
              in Gwalior. Reach out to us through any of the channels below.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📍
                </div>
                <div>
                  <h3 className="font-semibold text-text">Office Address</h3>
                  <p className="text-sm text-text-light">City Centre, Gwalior, Madhya Pradesh 474011</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  📞
                </div>
                <div>
                  <h3 className="font-semibold text-text">Phone</h3>
                  <p className="text-sm text-text-light">+91 98765 43210</p>
                  <p className="text-xs text-text-light">Mon-Sat, 9 AM - 7 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  ✉️
                </div>
                <div>
                  <h3 className="font-semibold text-text">Email</h3>
                  <p className="text-sm text-text-light">info@apnamakan.in</p>
                  <p className="text-xs text-text-light">We reply within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                  ⏰
                </div>
                <div>
                  <h3 className="font-semibold text-text">Business Hours</h3>
                  <p className="text-sm text-text-light">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                  <p className="text-sm text-text-light">Sunday: 10:00 AM - 4:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl border border-border p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-text mb-6">Send us a Message</h2>

            {status === "sent" ? (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-text mb-2">Message Sent!</h3>
                <p className="text-text-light mb-6">
                  Thank you for contacting us. We&apos;ll get back to you soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="btn-primary px-6 py-2 rounded-lg font-medium cursor-pointer"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-text block mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text block mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text block mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-text block mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="w-full px-4 py-3 rounded-lg border border-border text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                {status === "error" && (
                  <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>
                )}
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="btn-primary w-full py-3 rounded-lg font-semibold cursor-pointer disabled:opacity-50"
                >
                  {status === "sending" ? "Sending..." : "📩 Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
