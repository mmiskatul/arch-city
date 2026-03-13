import Link from "next/link";

import { MarketingHeroFrame } from "@/components/landing/shared/marketing-hero-frame";

export function ContactHeroSection({
  thresholdId,
}: {
  thresholdId: string;
}) {
  return (
    <MarketingHeroFrame
      id="contact"
      thresholdId={thresholdId}
      badge="Contact"
      title={
        <h1 className="mt-8 max-w-4xl text-4xl font-black tracking-[-0.06em] text-white sm:text-5xl lg:text-[5.2rem] lg:leading-[0.94]">
          Feel Free to
          <span className="mx-3 inline-block rotate-[-2deg] rounded-[1rem] bg-white px-4 py-1 text-[#ef242a] shadow-[0_12px_60px_rgba(255,255,255,0.1)]">
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

            <form className="mt-8 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Full name"
                  className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                className="h-14 rounded-xl border border-[#ece6e4] px-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
              />

              <textarea
                rows={6}
                placeholder="Your message.."
                className="rounded-xl border border-[#ece6e4] px-4 py-4 text-base text-[#111111] outline-none transition placeholder:text-[#b4b4b4] focus:border-[#ef242a]"
              />

              <button
                type="button"
                className="mt-2 inline-flex h-14 items-center justify-center rounded-full bg-[#df1620] px-8 text-lg font-bold text-white transition hover:bg-[#f02029]"
              >
                Send message
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
