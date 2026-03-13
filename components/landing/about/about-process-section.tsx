"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { ArrowIcon } from "@/components/landing/shared/arrow-icon";

const processItems = [
  {
    key: "recruit",
    label: "Recruit",
    title: "Recruitment",
    image: "/process-1.webp",
    description: [
      "Arch City Tutors recruits educators that are certified with the Missouri Department of Elementary & Secondary Education who are dedicated to furthering our students' educational needs outside of normal school hours.",
      "While the Missouri Learning Standards define the knowledge and skills students need in each grade level, local districts and schools make their own decisions about curriculum, instructional strategies, materials and textbooks. Because the curriculum, instructional strategies, materials and textbooks may vary from district to district, or school to school, Arch City Tutors is committed to developing a network of tutors that will represent each district and/or school, who will be familiar with your child's curriculum.",
    ],
  },
  {
    key: "screen",
    label: "Screen",
    title: "Safety First",
    image: "/process-2.webp",
    description: [
      "Before one of our educators can offer their services to our students, we review their application, confirm their job history, verify their teaching certification with the state of Missouri, and ensure they pass our strict background check.",
      "Once a tutor has Arch City Tutors' stamp of approval, the profile becomes active, and they are ready to create their profile and set their availability for tutoring sessions.",
    ],
  },
  {
    key: "connect",
    label: "Connect",
    title: "Connecting Students and Tutors",
    image: "/process-3.webp",
    description: [
      "After a tutor becomes an approved Arch City Tutor, their tutor profile becomes active, and they set their availability, our students are able to contact the tutor and schedule tutoring sessions.",
      "We believe access to this information allows our students to choose a tutor who is compatible with their needs, and in the event they are meeting in person, the students will know who to look for.",
    ],
    bullets: [
      "name",
      "a recent photograph",
      "past employment history",
      "current employment history",
      "tutoring subject areas",
      "a few of their hobbies",
      "how they prefer to complete their tutoring sessions (i.e., in person or virtual)",
    ],
  },
];

export function AboutProcessSection() {
  const [activeKey, setActiveKey] = useState(processItems[0].key);
  const activeItem =
    processItems.find((item) => item.key === activeKey) ?? processItems[0];

  return (
    <section className="bg-white px-4 pb-24 pt-8 text-[#111111] sm:px-6 sm:pt-12 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#e3d9d6] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2d2d2d] shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df1620]" />
            Our Process
          </div>

          <h2 className="mt-8 max-w-4xl text-2xl font-bold tracking-[-0.06em] text-[#111111] sm:text-3xl lg:text-5xl lg:leading-[0.95]">
            What
            <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-[#f5e0e0] px-4 py-1 text-[#f32f35] shadow-[0_8px_30px_rgba(239,36,42,0.08)]">
              Arch City Tutors
            </span>
            Does.
          </h2>

          <p className="mt-6 max-w-2xl text-base leading-8 text-[#6d6d6d]">
            Dependable and convenient tutoring solutions, for an affordable
            price.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-5xl rounded-[1.3rem] bg-[#efe4e1] p-2">
          <div className="grid grid-cols-3 gap-2">
            {processItems.map((item) => {
              const isActive = item.key === activeItem.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveKey(item.key)}
                  className={`rounded-[1rem] border-b-2 px-4 py-4 text-center text-lg font-medium transition ${
                    isActive
                      ? "border-[#ef242a] bg-white/40 text-[#272626]"
                      : "border-transparent text-[#292727] hover:bg-white/25"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-5xl overflow-hidden">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1fr] lg:gap-12">
            <div className="relative overflow-hidden rounded-[1.6rem]">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src={activeItem.image}
                  alt={activeItem.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-3xl font-bold tracking-[-0.05em] text-[#111111] sm:text-4xl">
                {activeItem.title}
              </h3>

              <div className="mt-6 space-y-5 text-base leading-8 text-[#5e5a5a]">
                {activeItem.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}

                {activeItem.bullets ? (
                  <div className="space-y-1">
                    {activeItem.bullets.map((item, index) => (
                      <p key={item}>
                        ({String.fromCharCode(97 + index)}) {item}
                      </p>
                    ))}
                  </div>
                ) : null}
              </div>

              <Link
                href="/#create-account"
                className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#ef242a] transition hover:text-[#c8141a]"
              >
                Get started
                <ArrowIcon className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
