"use client";

import { useEffect, useState } from "react";
import { fetchTickets, createTicket } from "@/lib/api";
import TicketItem from "@/components/TicketItem";
import CreateTicket from "@/components/CreateTicket";
import { FaNodeJs, FaDatabase } from "react-icons/fa";
import { SiRedis, SiGooglegemini, SiPostgresql } from "react-icons/si";
import { MdWork, MdSmartToy } from "react-icons/md";
import { IoMdGitNetwork } from "react-icons/io";
import Image from "next/image";

type Ticket = {
  id: number;
  title: string;
  status: string;
};

export default function HomePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTickets = async () => {
    setIsLoading(true);
    const data = await fetchTickets();
    setTickets(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const handleCreate = async (title: string) => {
    await createTicket(title);
    loadTickets();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column - Project Description */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-12">
              {/* Header */}
              <div className="mb-8">
                <h1
                  className="text-5xl font-bold text-slate-900 mb-3 leading-tight"
                  style={{ letterSpacing: "-0.03em" }}
                >
                  AI Support
                  <span
                    className="block"
                    style={{
                      background: "var(--gradient-primary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    System
                  </span>
                </h1>
                <p className="text-lg text-slate-600 font-light">
                  Intelligent ticket management
                </p>
              </div>

              {/* Project Description Card */}
              <div
                className="bg-white rounded-3xl border border-indigo-100 p-8 mb-6"
                style={{ boxShadow: "var(--shadow-md)" }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900">
                    Overview
                  </h2>
                </div>
                <p className="text-slate-600 leading-relaxed mb-4">
                  An intelligent support ticket system powered by AI, designed
                  to provide instant, context-aware responses using RAG
                  technology.
                </p>
                <p className="text-slate-600 leading-relaxed">
                  Demonstrates real-world application of modern AI techniques
                  with robust backend architecture for production-grade
                  performance.
                </p>
              </div>

              {/* Architecture Diagram */}
              <div
                className="bg-white rounded-3xl border border-indigo-100 p-8 mb-6 overflow-hidden"
                style={{ boxShadow: "var(--shadow-md)" }}
              >
                <div className="flex items-start gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Architecture
                  </h3>
                </div>

                <div className="relative w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-200">
                  <Image
                    src="/architectureDiagram.png"
                    alt="System Architecture Diagram"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Tickets */}
          <div className="lg:col-span-7">
            <div className="mb-8">
              <h2
                className="text-3xl font-bold text-slate-900 mb-2"
                style={{ letterSpacing: "-0.02em" }}
              >
                Support Tickets
              </h2>
              <p className="text-base text-slate-600 font-light">
                Create and manage your support conversations
              </p>
            </div>

            {/* Create Ticket */}
            <div className="mb-8">
              <CreateTicket onCreate={handleCreate} />
            </div>

            {/* Tickets List */}
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-500 font-medium">
                    Loading tickets...
                  </p>
                </div>
              </div>
            ) : tickets.length === 0 ? (
              <div
                className="bg-white rounded-3xl border border-indigo-100 p-16 text-center"
                style={{ boxShadow: "var(--shadow-md)" }}
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-indigo-50 flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-indigo-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No tickets yet
                </h3>
                <p className="text-base text-slate-600">
                  Create your first support ticket to get started
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((t, idx) => (
                  <div
                    key={t.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <TicketItem id={t.id} title={t.title} status={t.status} />
                  </div>
                ))}
              </div>
            )}

            {/* Tech Stack Carousel */}
            <div
              className="bg-white rounded-3xl border border-indigo-100 p-8 overflow-hidden mt-8"
              style={{ boxShadow: "var(--shadow-md)" }}
            >
              <h3 className="text-base font-semibold text-slate-900 mb-6">
                Powered By
              </h3>
              <div className="relative">
                {/* Gradient overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

                {/* Scrolling container */}
                <div className="overflow-hidden">
                  <div className="flex gap-4 animate-scroll-carousel whitespace-nowrap">
                    {[
                      {
                        name: "Node.js",
                        icon: <FaNodeJs className="w-5 h-5 text-green-600" />,
                      },
                      {
                        name: "Workers",
                        icon: <MdWork className="w-5 h-5 text-blue-600" />,
                      },
                      {
                        name: "Redis",
                        icon: <SiRedis className="w-5 h-5 text-red-600" />,
                      },
                      {
                        name: "BullMQ",
                        icon: <MdWork className="w-5 h-5 text-orange-600" />,
                      },
                      {
                        name: "RAG",
                        icon: (
                          <MdSmartToy className="w-5 h-5 text-purple-600" />
                        ),
                      },
                      {
                        name: "Gemini",
                        icon: (
                          <SiGooglegemini className="w-5 h-5 text-indigo-600" />
                        ),
                      },
                      {
                        name: "LangChain",
                        icon: (
                          <IoMdGitNetwork className="w-5 h-5 text-teal-600" />
                        ),
                      },
                      {
                        name: "Postgres",
                        icon: (
                          <SiPostgresql className="w-5 h-5 text-blue-700" />
                        ),
                      },
                    ]
                      .concat([
                        {
                          name: "Node.js",
                          icon: <FaNodeJs className="w-5 h-5 text-green-600" />,
                        },
                        {
                          name: "Workers",
                          icon: <MdWork className="w-5 h-5 text-blue-600" />,
                        },
                        {
                          name: "Redis",
                          icon: <SiRedis className="w-5 h-5 text-red-600" />,
                        },
                        {
                          name: "BullMQ",
                          icon: <MdWork className="w-5 h-5 text-orange-600" />,
                        },
                        {
                          name: "RAG",
                          icon: (
                            <MdSmartToy className="w-5 h-5 text-purple-600" />
                          ),
                        },
                        {
                          name: "Gemini",
                          icon: (
                            <SiGooglegemini className="w-5 h-5 text-indigo-600" />
                          ),
                        },
                        {
                          name: "LangChain",
                          icon: (
                            <IoMdGitNetwork className="w-5 h-5 text-teal-600" />
                          ),
                        },
                        {
                          name: "Postgres",
                          icon: (
                            <SiPostgresql className="w-5 h-5 text-blue-700" />
                          ),
                        },
                      ])
                      .map((tech, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 flex-shrink-0 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200"
                        >
                          {tech.icon}
                          <span className="text-slate-700 font-medium text-sm">
                            {tech.name}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
