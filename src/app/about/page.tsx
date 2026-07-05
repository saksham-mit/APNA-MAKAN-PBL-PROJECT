"use client";

import { useState } from "react";
import Link from "next/link";

const teamMembers = [
  {
    name: "Saksham Mishra",
    rollNo: "0905CS241232",
    role: "Project Lead & Tech Member",
    description: "Full-stack development and project architecture",
    color: "from-blue-500 to-indigo-600",
    icon: "👨‍💻",
    image: "",
  },
  {
    name: "Sahiba Khan",
    rollNo: "0905CS241231",
    role: "UI/UX Designer",
    description: "User interface design and user experience",
    color: "from-pink-500 to-rose-600",
    icon: "🎨",
    image: "",
  },
  {
    name: "Saniya Khan",
    rollNo: "0905CS241238",
    role: "Project Report - 1",
    description: "Documentation and project report preparation",
    color: "from-purple-500 to-violet-600",
    icon: "📝",
    image: "",
  },
  {
    name: "Rohit Garg",
    rollNo: "0905CS241225",
    role: "Project Report - 2",
    description: "Documentation and report compilation",
    color: "from-green-500 to-emerald-600",
    icon: "📊",
    image: "",
  },
  {
    name: "Tamannha Yadav",
    rollNo: "0905CS241275",
    role: "Tech Member & SRS Report",
    description: "Software requirements specification and development",
    color: "from-orange-500 to-amber-600",
    icon: "⚙️",
    image: "",
  },
];

export default function AboutPage() {
  const [teamImages, setTeamImages] = useState<{ [key: number]: string }>({});

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTeamImages((prev) => ({
        ...prev,
        [index]: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px]"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Our Project
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Apna Makan</span>
          </h1>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed">
            A Project Based Learning (PBL) initiative by B.Tech students to create 
            Gwalior&apos;s most trusted real estate platform
          </p>
        </div>
      </section>

      {/* About Project */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light rounded-full text-primary text-sm font-semibold mb-4">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Our Story
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-6">
                Making Property Search <span className="gradient-text">Simple</span> in Gwalior
              </h2>
              <p className="text-text-light leading-relaxed mb-4">
                Apna Makan was created as a Project Based Learning (PBL) initiative by 
                2nd year B.Tech Computer Science students. We noticed the lack of a reliable, 
                easy-to-use real estate platform specifically for Gwalior city.
              </p>
              <p className="text-text-light leading-relaxed mb-4">
                Our platform connects genuine property sellers directly with buyers, 
                eliminating middlemen and making the property search process transparent 
                and hassle-free.
              </p>
              <p className="text-text-light leading-relaxed">
                Whether you&apos;re looking for a flat in DD Nagar, a house in City Centre, 
                or a plot in Thatipur — Apna Makan helps you find it with real photos, 
                verified details, and direct seller contact.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-primary-light to-blue-100 rounded-3xl p-8">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/30">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-primary">Apna Makan</h3>
                <p className="text-text-light text-sm">अपना मकान — Your Own Home</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-primary">30+</p>
                  <p className="text-xs text-text-light">Locations</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-primary">8+</p>
                  <p className="text-xs text-text-light">Property Types</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-primary">100%</p>
                  <p className="text-xs text-text-light">Free to Use</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold text-primary">24/7</p>
                  <p className="text-xs text-text-light">Available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-light rounded-full text-accent text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Meet Our Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">The Minds Behind Apna Makan</h2>
            <p className="text-text-light max-w-2xl mx-auto">
              A dedicated team of B.Tech Computer Science students working together to build Gwalior&apos;s best real estate platform
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                {/* Profile Image */}
                <div className="relative w-28 h-28 mx-auto mb-4">
                  <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center overflow-hidden shadow-lg`}>
                    {teamImages[index] ? (
                      <img
                        src={teamImages[index]}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">{member.icon}</span>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors border border-gray-200">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e)}
                      className="hidden"
                    />
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </label>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="font-bold text-text text-lg mb-1">{member.name}</h3>
                  <p className="text-xs text-text-light font-mono bg-gray-100 inline-block px-3 py-1 rounded-full mb-2">
                    {member.rollNo}
                  </p>
                  <p className={`text-sm font-semibold bg-gradient-to-r ${member.color} bg-clip-text text-transparent mb-2`}>
                    {member.role}
                  </p>
                  <p className="text-sm text-text-light">{member.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* College Info */}
          <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-lg text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-primary text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              B.Tech PBL Project
            </div>
            <h3 className="text-2xl font-bold text-text mb-2">Project Based Learning</h3>
            <p className="text-text-light max-w-2xl mx-auto">
              This project was developed as part of our 2nd year B.Tech Computer Science curriculum, 
              demonstrating full-stack web development skills with real-world application in the real estate domain.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-semibold mb-4">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Technology Stack
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Built with Modern Tech</h2>
            <p className="text-text-light">Technologies used to build this platform</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: "Next.js 16", icon: "⚡", desc: "React Framework", color: "from-gray-800 to-gray-900" },
              { name: "PostgreSQL", icon: "🐘", desc: "Database", color: "from-blue-600 to-blue-700" },
              { name: "Tailwind CSS", icon: "🎨", desc: "Styling", color: "from-cyan-500 to-teal-600" },
              { name: "TypeScript", icon: "📘", desc: "Type Safety", color: "from-blue-500 to-indigo-600" },
            ].map((tech) => (
              <div
                key={tech.name}
                className="bg-white rounded-2xl p-6 text-center border border-gray-100 hover:border-primary/30 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className={`w-14 h-14 mx-auto mb-4 bg-gradient-to-br ${tech.color} rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                  {tech.icon}
                </div>
                <h4 className="font-bold text-text">{tech.name}</h4>
                <p className="text-xs text-text-light mt-1">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Start your property search journey with Apna Makan today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/properties"
              className="px-8 py-4 rounded-xl font-bold bg-white text-primary hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Browse Properties
            </Link>
            <Link
              href="/register"
              className="px-8 py-4 rounded-xl font-bold bg-white/10 border-2 border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Join Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
