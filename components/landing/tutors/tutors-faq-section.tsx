"use client";

import Link from "next/link";
import { useState } from "react";

const faqs = [
  {
    question: "Why join Arch City Tutors?",
    answer:
      "We handle the scheduling of tutoring sessions so that it is as simple as setting your availability, accepting a tutoring request, completing the tutoring session and accepting the agreed-upon payment from the student.",
  },
  {
    question: "Does it cost anything for me to join?",
    answer:
      "No. There is no cost to create a tutor profile and apply to join Arch City Tutors.",
  },
  {
    question: "Can I set my own hourly rates?",
    answer:
      "Yes. Tutors set their own rates, and students pay the agreed amount directly to the tutor after the session is completed.",
  },
  {
    question: "How will I be paid?",
    answer:
      "Tutors are paid directly by students at the conclusion of the tutoring session using the payment method agreed upon by both parties.",
  },
  {
    question: "What happens if my availability changes?",
    answer:
      "You can update your profile and available tutoring times whenever your schedule changes so students only book time slots that still work for you.",
  },
  {
    question: "What if I am no longer able to commit to tutoring with Arch City?",
    answer:
      "If you are no longer able to tutor, you can contact the Arch City Tutors team and we will help deactivate your profile or pause your availability.",
  },
];

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function TutorsFAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faqs"
      className="px-4 pb-28 pt-12 text-[#111111] sm:px-6 sm:pt-16 lg:px-8"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
        <div className="max-w-xl lg:sticky lg:top-28 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#dfdfdf] bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#2e2e2e] shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#df1620]" />
            FAQs
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-[-0.06em] text-[#111111] sm:text-5xl lg:text-[4.2rem] lg:leading-[0.92]">
            Frequently Asked Questions
          </h2>

          <p className="mt-6 max-w-lg text-lg leading-9 text-[#494949]">
            At Arch City Tutors, we&apos;re seeking those who share our vision
            of personalized learning. We offer flexible tutoring to fit busy
            schedules, helping both students and educators thrive.
          </p>

          <Link
            href="#contact"
            className="mt-10 inline-flex items-center rounded-full bg-[#df1620] px-7 py-4 text-xl font-bold text-white transition hover:bg-[#f02029]"
          >
            Still have a question?
            <span className="ml-3" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <div className="space-y-4">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={item.question}
                className="rounded-[1.3rem] border border-[#dddddd] bg-white px-7 py-6 shadow-[0_10px_30px_rgba(15,23,42,0.03)]"
              >
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <span className="text-2xl font-bold leading-[1.22] tracking-[-0.04em] text-[#1a1a1a]">
                    {item.question}
                  </span>
                  <span
                    className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-[#454545] transition-transform duration-300 ease-out ${
                      isOpen ? "rotate-90" : "rotate-0"
                    }`}
                  >
                    {isOpen ? <CloseIcon /> : <PlusIcon />}
                  </span>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out ${
                    isOpen
                      ? "mt-5 grid-rows-[1fr] opacity-100"
                      : "mt-0 grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="pr-12 text-lg leading-8 text-[#4a4a4a]">
                      {item.answer}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
