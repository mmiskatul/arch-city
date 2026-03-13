"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { useState } from "react";

import { MarketingHeroFrame } from "@/components/landing/shared/marketing-hero-frame";
import { FormStatusMessage } from "@/components/shared/form-status-message";
import { submitPublicApi } from "@/lib/api/public-api";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitMessage, setSubmitMessage] = useState("");

  const canSubmit =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    subject.trim().length > 0 &&
    message.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      setSubmitState("error");
      setSubmitMessage("Please complete all contact form fields.");
      return;
    }

    setSubmitState("submitting");
    setSubmitMessage("");

    const response = await submitPublicApi({
      endpoint: "contact",
      payload: {
        fullName: fullName.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    if (!response.ok) {
      setSubmitState("error");
      setSubmitMessage(response.error);
      return;
    }

    setSubmitState("success");
    setSubmitMessage("Your message has been sent successfully.");
    setFullName("");
    setEmail("");
    setSubject("");
    setMessage("");
  }

  return (
    <MarketingHeroFrame
      id="contact"
      thresholdId={thresholdId}
      badge="Contact"
      title={
        <h1 className="mt-8 max-w-4xl text-2xl font-black tracking-[-0.06em] text-white sm:text-3xl lg:text-5xl lg:leading-[0.94]">
          Feel Free to
          <span className="mx-3 inline-block rotate-[-2deg] rounded-lg bg-[#f3d6d6e7] px-4 py-1 text-[#e0383d] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
            Reach
          </span>
          Us.
        </h1>
      }
      description="Using the options below, and our dedicated team will respond to your inquiries promptly."
      media={
        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="rounded-[1.75rem] bg-white px-6 py-8 text-left text-[#111111] shadow-[0_28px_80px_rgba(0,0,0,0.32)] sm:px-8 sm:py-10">
            <p className="max-w-2xl text-lg leading-8 text-[#7a7a7a]">
              Have a question or feedback? Fill out the form below, and
              we&apos;ll get back to you as soon as possible.
            </p>

            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <FormStatusMessage
                type={
                  submitState === "success"
                    ? "success"
                    : submitState === "error"
                      ? "error"
                      : "idle"
                }
                message={submitMessage}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Full name"
                  className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email"
                  className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
                />
              </div>

              <input
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Subject"
                className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
              />

              <textarea
                rows={6}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Your message.."
                className="rounded-xl border border-[#ece6e4] px-4 py-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
              />

              <button
                type="submit"
                disabled={!canSubmit || submitState === "submitting"}
                className={`mt-2 inline-flex h-14 items-center justify-center rounded-full px-8 text-lg font-bold text-white transition ${
                  canSubmit && submitState !== "submitting"
                    ? "bg-[#df1620] hover:bg-[#f02029]"
                    : "bg-[#d8dde6]"
                }`}
              >
                {submitState === "submitting" ? "Sending..." : "Send message"}
              </button>
            </form>

            <p className="mt-5 text-center text-lg text-[#6b6b6b]">
              Or drop us a message via{" "}
              <Link
                href="mailto:info@archcitytutors.com"
                className="font-semibold text-[#df1620]"
              >
                email
              </Link>
            </p>
          </div>
        </div>
      }
    />
  );
}
